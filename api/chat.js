import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import { join } from 'path';

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
      console.error('GEMINI_API_KEY belum terpasang di Vercel Settings');
      return res.status(500).json({ success: false, error: 'API Key belum dikonfigurasi.' });
    }

    // 1. Baca file knowledge.json langsung dari filesystem (Tanpa HTTP fetch)
    let knowledgeBase = '';
    try {
      const filePath = join(process.cwd(), 'assets', 'data', 'knowledge.json');
      knowledgeBase = readFileSync(filePath, 'utf8');
    } catch (fileErr) {
      console.error('Gagal membaca knowledge.json secara lokal:', fileErr.message);
      knowledgeBase = '[]'; // Fallback jika file tidak ditemukan
    }

    // 2. Inisialisasi Model Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    // 3. Susun Prompt Context
    const fullPrompt = `
Anda adalah "Rifqi AI", asisten akademis interaktif untuk portofolio web Rifqi Abdillah (Lecturer, Researcher, Developer, AIoT Enthusiast).

Jawab pertanyaan pengunjung dengan ringkas, sopan, ramah, dan profesional berdasarkan Data Knowledge Base berikut.

DATA KNOWLEDGE BASE:
${knowledgeBase}

PERTANYAAN PENGUNJUNG:
${prompt}
    `;

    // 4. Minta Gemini Menjawab
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    return res.status(200).json({
      success: true,
      result: responseText
    });

  } catch (error) {
    console.error('Error di Vercel API Chat:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Terjadi kesalahan pada server AI.',
      details: error.message
    });
  }
}