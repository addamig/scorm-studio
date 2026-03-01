// GET /api/heygen/voices — List available HeyGen voices

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'HEYGEN_API_KEY not configured.' });

  try {
    const response = await fetch('https://api.heygen.com/v2/voices', {
      headers: { 'X-Api-Key': apiKey }
    });
    if (!response.ok) throw new Error(`HeyGen error ${response.status}`);
    const data = await response.json();

    const voices = (data.data?.voices || []).map(v => ({
      voice_id: v.voice_id,
      name: v.name || v.display_name,
      language: v.language,
      gender: v.gender,
      preview_audio: v.preview_audio
    }));

    return res.status(200).json({ voices });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
