export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Securely retrieve Gemini API Key from Server Environment Variables
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'GEMINI_API_KEY is not configured on the server environment.' 
    });
  }

  const { prompt, messages = [], systemInstruction, model = 'gemini-2.0-flash' } = req.body || {};

  if (!prompt && (!messages || messages.length === 0)) {
    return res.status(400).json({ error: 'Prompt or messages history is required.' });
  }

  // Primary model endpoint (Gemini 2.0 Flash - latest Google GenAI model)
  const targetModel = model || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;

  // Build contents array supporting multi-turn conversation or single prompt
  let contents = [];
  if (messages && messages.length > 0) {
    contents = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));
    if (prompt) {
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });
    }
  } else {
    contents = [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ];
  }

  const requestBody = {
    contents,
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 1500,
      topP: 0.95
    }
  };

  if (systemInstruction) {
    requestBody.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // Fallback to gemini-1.5-flash if 2.0 encounters regional or specific quota issue
    if (!response.ok && targetModel !== 'gemini-1.5-flash') {
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      response = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
    }

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: errData.error?.message || `Google Gemini API error: ${response.status}` 
      });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || '';

    return res.status(200).json({ 
      text,
      model: targetModel,
      usage: data.usageMetadata || null
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

