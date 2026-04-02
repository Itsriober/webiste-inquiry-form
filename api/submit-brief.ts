import { VercelRequest, VercelResponse } from '@vercel/node';
import { briefFormSchema, type BriefFormSchema } from '../src/lib/formSchema';
import crypto from 'crypto';

// Try to import blob, but fallback if not available
let blobModule: any = null;
try {
  // This will work if token is configured
  blobModule = require('@vercel/blob');
} catch (e) {
  // Fallback for when blob isn't configured
}

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

async function getStats(): Promise<FormStats> {
  // If Blob module is available, use it
  if (blobModule?.get) {
    try {
      const response = await blobModule.get('stats.json', { access: 'public' });
      if (response) {
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
      }
    } catch (error) {
      console.warn('Blob storage error, using fallback:', error);
    }
  }
  // Fallback
  return { started: 0, submitted: 0, abandoned: 0 };
}

async function saveStats(stats: FormStats): Promise<void> {
  if (blobModule?.put) {
    try {
      await blobModule.put('stats.json', JSON.stringify(stats), {
        contentType: 'application/json',
        access: 'public',
      });
    } catch (error) {
      console.warn('Blob storage error saving stats:', error);
    }
  }
}

async function saveBrief(brief: StoredBrief): Promise<void> {
  if (blobModule?.put) {
    try {
      await blobModule.put(`briefs/${brief.id}.json`, JSON.stringify(brief), {
        contentType: 'application/json',
        access: 'public',
      });
    } catch (error) {
      console.warn('Blob storage error saving brief:', error);
    }
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const data = req.body;

    // Validate data against schema
    const validatedData = briefFormSchema.parse(data);

    // Create brief object
    const briefId = crypto.randomUUID();
    const brief: StoredBrief = {
      id: briefId,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      data: validatedData,
    };

    // Save brief
    const briefKey = `briefs/${briefId}.json`;
    await saveBrief(brief);

    // Update stats
    const stats = await getStats();
    stats.submitted += 1;
    await saveStats(stats);

    res.status(200).json({
      success: true,
      briefId,
      message: 'Brief submitted successfully',
    });
    return;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error submitting brief:', errorMessage, error);

    // Zod validation errors
    if (errorMessage.includes('Parse error') || errorMessage.includes('Invalid')) {
      res.status(400).json({
        success: false,
        error: 'Invalid form data. Please check all required fields.',
        details: errorMessage,
      });
      return;
    }

    // Blob Storage errors
    if (errorMessage.includes('BLOB') || errorMessage.includes('blob')) {
      console.error('Blob Storage error - token might be missing:', errorMessage);
    }

    res.status(500).json({
      success: false,
      error: 'Failed to submit brief. Please try again later.',
      debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
}
