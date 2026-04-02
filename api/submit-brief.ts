import { VercelRequest, VercelResponse } from '@vercel/node';
import { put, get } from '@vercel/blob';
import { briefFormSchema, type BriefFormSchema } from '../src/lib/formSchema';
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

const STATS_BLOB_KEY = 'stats.json';

async function getStats(): Promise<FormStats> {
  try {
    const response = await get(STATS_BLOB_KEY, { access: 'public' });
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

async function saveStats(stats: FormStats): Promise<void> {
  await put(STATS_BLOB_KEY, JSON.stringify(stats), {
    contentType: 'application/json',
    access: 'public',
  });
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

    // Save brief to blob storage
    const briefKey = `briefs/${briefId}.json`;
    await put(briefKey, JSON.stringify(brief), {
      contentType: 'application/json',
      access: 'public',
    });

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
    console.error('Error submitting brief:', error);

    if (error instanceof Error) {
      // Zod validation errors
      if (error.message.includes('Parse error') || error.message.includes('Invalid')) {
        res.status(400).json({
          success: false,
          error: 'Invalid form data. Please check all required fields.',
          details: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to submit brief. Please try again later.',
    });
  }
}
