// Vercel Serverless Function — generates images via OpenRouter (Nano Banana)
// OPENROUTER_API_KEY stays server-side

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured.' });
  }

  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body.' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.referer || req.headers.origin || 'https://scorm-studio.vercel.app',
        'X-Title': 'SCORM Studio'
      },
      body: JSON.stringify({
        model: model || 'google/gemini-2.5-flash-image',
        modalities: ['image', 'text'],
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errData?.error?.message || `OpenRouter image error (${response.status})`
      });
    }

    const data = await response.json();

    // Extract image from response
    // OpenRouter returns images in the content as base64 data URLs
    const message = data.choices?.[0]?.message;
    let imageUrl = null;

    // Check for images array (OpenRouter image generation format)
    if (message?.images && message.images.length > 0) {
      imageUrl = message.images[0];
    }

    // Also check content for inline base64 images
    if (!imageUrl && message?.content) {
      // Sometimes returned as markdown with data URL
      const match = message.content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/);
      if (match) {
        imageUrl = match[0];
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'No image returned from model.' });
    }

    return res.status(200).json({ image: imageUrl });

  } catch (err) {
    console.error('Image proxy error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
