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
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt.' });
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
        model: 'google/gemini-2.5-flash-image',
        modalities: ['image', 'text'],
        max_tokens: 2048,
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
        error: errData?.error?.message || `Image API error (${response.status})`
      });
    }

    const data = await response.json();

    // Extract image from response
    let imageBase64 = null;

    const message = data.choices?.[0]?.message;

    // OpenRouter can return images in multiple formats:

    // 1. images array with objects: { type: "image_url", image_url: { url: "data:..." } }
    if (message?.images && message.images.length > 0) {
      const img = message.images[0];
      if (typeof img === 'string') {
        imageBase64 = img;
      } else if (img?.image_url?.url) {
        imageBase64 = img.image_url.url;
      } else if (img?.url) {
        imageBase64 = img.url;
      }
    }

    // 2. content array with image_url parts
    if (!imageBase64 && message?.content) {
      if (Array.isArray(message.content)) {
        for (const part of message.content) {
          if (part.type === 'image_url' && part.image_url?.url) {
            imageBase64 = part.image_url.url;
            break;
          }
        }
      }
    }

    if (!imageBase64) {
      return res.status(500).json({ error: 'No image in response.' });
    }

    return res.status(200).json({ image: imageBase64 });

  } catch (err) {
    console.error('Image proxy error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
