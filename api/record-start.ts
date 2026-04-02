import { VercelRequest, VercelResponse } from '@vercel/node';
import { get, put } from '@vercel/blob';
import crypto from 'crypto';

async function getStats() {
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

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get current stats
    const stats = await getStats();

    // Increment started count
    stats.started += 1;

    // Save updated stats
    await put('stats.json', JSON.stringify(stats), {
      contentType: 'application/json',
      access: 'public',
    });

    res.status(200).json({
      success: true,
      stats,
      message: 'Form start recorded',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error recording form start:', errorMessage);
    res.status(500).json({
      success: false,
      error: 'Failed to record form start',
      debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
}
}
