/**
 * Netlify Function: proxy para Groq API (IA gratuita).
 * Recebe apiKey do usuário + prompt e retorna o texto gerado.
 * Evita CORS e não expõe chave no frontend de terceiros.
 */

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.1-8b-instant'; // rápido e no free tier

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  const { apiKey, prompt } = body;
  if (!apiKey || typeof apiKey !== 'string' || !prompt || typeof prompt !== 'string') {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing apiKey or prompt. Get a free key at https://console.groq.com',
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: body.model || DEFAULT_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const message =
        data?.error?.message || data?.error?.code || res.statusText || 'Groq API error';
      return {
        statusCode: res.status,
        body: JSON.stringify({
          error: message,
          details: data?.error,
        }),
        headers: { 'Content-Type': 'application/json' },
      };
    }

    const text =
      data?.choices?.[0]?.message?.content?.trim() ||
      data?.choices?.[0]?.text?.trim() ||
      '';

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, text }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message || 'Failed to call Groq API',
      }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
