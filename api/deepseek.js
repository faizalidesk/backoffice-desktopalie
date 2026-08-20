export default async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Retrieve DeepSeek API Key from Server Environment Variables
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY || req.body?.apiKey;

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'DEEPSEEK_API_KEY is not configured on the server environment.' 
    });
  }

  const { prompt, messages = [], systemInstruction, model = 'deepseek-chat' } = req.body || {};

  if (!prompt && (!messages || messages.length === 0)) {
    return res.status(400).json({ error: 'Prompt or messages history is required.' });
  }

  // DeepSeek models: 'deepseek-chat' (DeepSeek-V3) or 'deepseek-reasoner' (DeepSeek-R1)
  const targetModel = model || 'deepseek-chat';
  const url = 'https://api.deepseek.com/chat/completions';

  // Build OpenAI-compatible messages array
  const formattedMessages = [];
  
  if (systemInstruction) {
    formattedMessages.push({
      role: 'system',
      content: systemInstruction
    });
  }

  if (messages && messages.length > 0) {
    messages.forEach(m => {
      formattedMessages.push({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      });
    });
    if (prompt) {
      formattedMessages.push({
        role: 'user',
        content: prompt
      });
    }
  } else {
    formattedMessages.push({
      role: 'user',
      content: prompt
    });
  }

  const requestBody = {
    model: targetModel,
    messages: formattedMessages,
    stream: false,
    max_tokens: targetModel === 'deepseek-reasoner' ? 4096 : 2048
  };

  if (targetModel !== 'deepseek-reasoner') {
    requestBody.temperature = 0.6;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ 
        error: errData.error?.message || `DeepSeek API error: ${response.status}` 
      });
    }

    const data = await response.json();
    const choice = data.choices?.[0];
    const text = choice?.message?.content || '';
    const reasoning = choice?.message?.reasoning_content || null;

    return res.status(200).json({ 
      text,
      reasoning,
      model: targetModel,
      usage: data.usage || null
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
