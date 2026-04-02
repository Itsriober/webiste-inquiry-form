import { VercelRequest, VercelResponse } from '@vercel/node';
import { list, get } from '@vercel/blob';
import type { BriefFormSchema } from '../src/lib/formSchema.js';
import crypto from 'crypto';

export interface StoredBrief {
  id: string;
  submittedAt: string;
  status: 'submitted';
  data: BriefFormSchema;
}

export interface FormStats {
  started: number;
  submitted: number;
  abandoned: number;
}

export interface DashboardResponse {
  briefs: StoredBrief[];
  stats: FormStats;
}

async function getStats(): Promise<FormStats> {
  try {
    const response = await get('stats.json', { access: 'public' });
    if (!response) {
      return { started: 0, submitted: 0, abandoned: 0 };
    }
    // Read from the ReadableStream
    const reader = response.stream!.getReader();
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    const buffer = Buffer.concat(chunks);
    const text = buffer.toString('utf-8');
    return JSON.parse(text);
  } catch {
    return { started: 0, submitted: 0, abandoned: 0 };
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Check environment
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN not configured');
    res.status(503).json({
      success: false,
      error: 'Service temporarily unavailable. Storage not configured.',
    });
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get PIN from query parameter or header
    const pinParam = (req.query.pin as string) || req.headers['x-dashboard-pin'];
    const correctPin = process.env.DASHBOARD_PIN_SECRET || process.env.VITE_DASHBOARD_PIN;

    // Validate PIN
    if (!correctPin) {
      console.error('DASHBOARD_PIN_SECRET not configured');
      res.status(500).json({
        success: false,
        error: 'Server configuration error',
      });
      return;
    }

    if (!pinParam || pinParam !== correctPin) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid PIN',
      });
      return;
    }

    // Get stats
    const stats = await getStats();

    // List all brief files from Blob Storage
    const { blobs } = await list({
      prefix: 'briefs/',
    });

    // Fetch all brief files
    const briefs: StoredBrief[] = [];
    for (const blob of blobs) {
      try {
        const blobData = await get(blob.pathname, { access: 'public' });
        if (blobData && blobData.stream) {
          // Read from the ReadableStream
          const reader = blobData.stream.getReader();
          const chunks: Uint8Array[] = [];
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }
          const buffer = Buffer.concat(chunks);
          const text = buffer.toString('utf-8');
          const brief = JSON.parse(text) as StoredBrief;
          briefs.push(brief);
        }
      } catch (error) {
        console.error(`Error reading brief ${blob.pathname}:`, error);
        // Skip corrupted briefs
      }
    }

    // Sort by submittedAt (newest first)
    briefs.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    // Calculate abandoned count
    stats.abandoned = Math.max(0, stats.started - stats.submitted);

    res.status(200).json({
      success: true,
      briefs,
      stats,
    } as DashboardResponse & { success: boolean });
  } catch (error) {
    console.error('Error fetching briefs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch briefs',
    });
  }
}
