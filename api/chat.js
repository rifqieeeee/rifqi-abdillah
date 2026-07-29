import { GoogleGenAI } from "@google/genai";
import { readFileSync } from "fs";
import { join } from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed"
    });
  }

  try {
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        error: "Prompt wajib diisi."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error(
        "GEMINI_API_KEY belum dipasang di Vercel."
      );

      return res.status(500).json({
        success: false,
        error: "API key belum dikonfigurasi."
      });
    }

    let knowledgeBase = "[]";

    try {
      const filePath = join(
        process.cwd(),
        "assets",
        "data",
        "knowledge.json"
      );

      knowledgeBase = readFileSync(filePath, "utf8");
    } catch (fileError) {
      console.error(
        "Gagal membaca knowledge.json:",
        fileError.message
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const fullPrompt = `
Anda adalah "Rifqi AI", asisten akademis interaktif untuk
portofolio web Rifqi Abdillah.

Profil Rifqi Abdillah:
- Lecturer
- Researcher
- Developer
- AIoT Enthusiast

Jawablah pertanyaan pengunjung secara ringkas, ramah,
profesional, dan hanya berdasarkan knowledge base yang
diberikan.

Jika informasi tidak tersedia di knowledge base, sampaikan
bahwa informasi tersebut belum tersedia. Jangan mengarang
informasi.

DATA KNOWLEDGE BASE:
${knowledgeBase}

PERTANYAAN PENGUNJUNG:
${prompt}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt
    });

    const responseText =
      response.text ||
      "Maaf, Rifqi AI belum dapat memberikan jawaban.";

    return res.status(200).json({
      success: true,
      result: responseText
    });

  } catch (error) {
    console.error(
      "Error di Vercel API Chat:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server AI.",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined
    });
  }
}