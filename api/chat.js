import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt wajib diisi!' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not defined in Environment Variables!');
      return res.status(500).json({ success: false, error: 'API Key belum dikonfigurasi di Vercel.' });
    }

    // Inisialisasi Model Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Ambil data knowledge.json
    const host = req.headers.host || 'rifqi-abdillah.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const knowledgeUrl = `${protocol}://${host}/assets/data/knowledge.json`;

    let knowledgeBase = '';
    try {
      const knowledgeRes = await fetch(knowledgeUrl);
      if (knowledgeRes.ok) {
        knowledgeBase = await knowledgeRes.text();
      }
    } catch (e) {
      console.error('Gagal mengambil knowledge.json:', e);
    }

    const fullPrompt = `
Anda adalah "Rifqi AI", asisten akademis interaktif untuk portofolio web Rifqi Abdillah (Lecturer, Researcher, Developer, AIoT Enthusiast).

Jawab pertanyaan pengunjung dengan ringkas, sopan, ramah, dan profesional.

DATA KNOWLEDGE BASE:
${knowledgeBase}

PERTANYAAN PENGUNJUNG:
${prompt}
    `;

    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    return res.status(200).json({
      success: true,
      result: responseText
    });

  } catch (error) {
    console.error('Error in Vercel API:', error);
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server AI.',
      details: error.message
    });
  }
}