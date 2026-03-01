// GET /api/heygen/avatars — List available HeyGen avatars

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'HEYGEN_API_KEY not configured.' });

  try {
    const response = await fetch('https://api.heygen.com/v2/avatars', {
      headers: { 'X-Api-Key': apiKey }
    });
    if (!response.ok) throw new Error(`HeyGen error ${response.status}`);
    const data = await response.json();

    const avatars = (data.data?.avatars || []).map(a => ({
      avatar_id: a.avatar_id,
      name: a.avatar_name,
      gender: a.gender,
      preview: a.preview_image_url
    }));

    return res.status(200).json({ avatars });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
