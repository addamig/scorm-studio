// POST /api/heygen/generate — Start video generation for a module script
// Returns video_id for polling

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'HEYGEN_API_KEY not configured.' });

  try {
    const { script, avatar_id, voice_id } = req.body;

    if (!script || !avatar_id || !voice_id) {
      return res.status(400).json({ error: 'Missing script, avatar_id, or voice_id.' });
    }

    const response = await fetch('https://api.heygen.com/v2/video/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify({
        video_inputs: [{
          character: {
            type: 'avatar',
            avatar_id: avatar_id,
            avatar_style: 'normal'
          },
          voice: {
            type: 'text',
            input_text: script,
            voice_id: voice_id,
            speed: 1.0
          },
          background: {
            type: 'color',
            value: '#f8fafc'
          }
        }],
        dimension: { width: 1920, height: 1080 }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`HeyGen error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return res.status(200).json({ video_id: data.data.video_id });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
