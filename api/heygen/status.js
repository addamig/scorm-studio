// GET /api/heygen/status?video_id=xxx — Poll video generation status

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'HEYGEN_API_KEY not configured.' });

  const { video_id } = req.query;
  if (!video_id) return res.status(400).json({ error: 'Missing video_id.' });

  try {
    const response = await fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${video_id}`,
      { headers: { 'X-Api-Key': apiKey } }
    );
    if (!response.ok) throw new Error(`HeyGen error ${response.status}`);

    const d = (await response.json()).data;

    return res.status(200).json({
      status: d.status,       // "pending" | "processing" | "completed" | "failed"
      video_url: d.video_url, // MP4 URL when completed
      duration: d.duration,
      thumbnail_url: d.thumbnail_url,
      error: d.error
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
