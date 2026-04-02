import { VercelRequest, VercelResponse } from '@vercel/node';
import { del, get, put } from '@vercel/blob';

async function getStats() {
  try {
    const response = await get('stats.json', { access: 'public' });
    if (!response) {
      return { started: 0, submitted: 0, abandoned: 0 };
    }
    // Read from the ReadableStream correctly
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

async function saveStats(stats: any) {
  await put('stats.json', JSON.stringify(stats), {
    contentType: 'application/json',
    access: 'public',
  });
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

  if (req.method !== 'DELETE') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const pin = (req.query.pin as string) || req.headers['x-dashboard-pin'];
    const correctPin = process.env.DASHBOARD_PIN_SECRET || process.env.VITE_DASHBOARD_PIN;

    if (!correctPin) {
      console.error('DASHBOARD_PIN_SECRET not configured');
      res.status(500).json({ error: 'Server configuration error' });
      return;
    }

    if (!pin || pin !== correctPin) {
      res.status(401).json({ error: 'Unauthorized: Invalid PIN' });
      return;
    }

    const { briefId } = req.query;

    if (!briefId || typeof briefId !== 'string') {
      res.status(400).json({ error: 'briefId is required' });
      return;
    }

    // Delete the brief file
    await del(`briefs/${briefId}.json`);

    res.status(200).json({
      success: true,
      message: 'Brief deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting brief:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete brief',
    });
  }
}
