import { VercelRequest, VercelResponse } from '@vercel/node';
import { get, put } from '@vercel/blob';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get current stats
    let stats = { started: 0, submitted: 0, abandoned: 0 };
    try {
      const blob = await get('stats.json');
      if (blob) {
        stats = JSON.parse(await blob.text());
      }
    } catch {
      // Stats file doesn't exist yet, use default
    }

    // Increment started count
    stats.started += 1;

    // Save updated stats
    await put('stats.json', JSON.stringify(stats), {
      contentType: 'application/json',
      access: 'public',
    });

    return res.status(200).json({
      success: true,
      stats,
      message: 'Form start recorded',
    });
  } catch (error) {
    console.error('Error recording form start:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to record form start',
    });
  }
}
