// Vercel Serverless Function — proxies AI requests to OpenRouter
// The OPENROUTER_API_KEY env var stays server-side, never exposed to browser

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured on server.' });
  }

  try {
    const { system, message, model } = req.body;

    if (!system || !message) {
      return res.status(400).json({ error: 'Missing system or message in request body.' });
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
        model: model || 'anthropic/claude-sonnet-4',
        max_tokens: 16000,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errData?.error?.message || `OpenRouter error (${response.status})`
      });
    }

    const data = await response.json();

    // Return in a normalized format
    const text = data.choices?.[0]?.message?.content || '';
    const stopReason = data.choices?.[0]?.finish_reason === 'length' ? 'max_tokens' : 'end_turn';

    return res.status(200).json({
      content: [{ type: 'text', text }],
      stop_reason: stopReason
    });

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
