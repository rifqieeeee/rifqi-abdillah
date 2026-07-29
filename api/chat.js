import { GoogleGenAI } from "@google/genai";
import { readFileSync } from "fs";
import { join } from "path";

export default async function handler(req, res) {
  // Hanya menerima request POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res.status(405).json({
      success: false,
      error: "Method Not Allowed"
    });
  }

  try {
    const { prompt } = req.body || {};

    // Validasi prompt
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        error: "Prompt wajib diisi."
      });
    }

    const cleanPrompt = prompt.trim();

    if (cleanPrompt.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Prompt tidak boleh kosong."
      });
    }

    if (cleanPrompt.length > 1500) {
      return res.status(400).json({
        success: false,
        error: "Prompt terlalu panjang. Maksimal 1500 karakter."
      });
    }

    // Pastikan API key tersedia
    if (!process.env.GEMINI_API_KEY) {
      console.error(
        "GEMINI_API_KEY belum dikonfigurasi di Vercel."
      );

      return res.status(500).json({
        success: false,
        error: "API key belum dikonfigurasi."
      });
    }

    // Membaca knowledge base
    let knowledgeBase = "[]";

    try {
      const knowledgePath = join(
        process.cwd(),
        "assets",
        "data",
        "knowledge.json"
      );

      knowledgeBase = readFileSync(
        knowledgePath,
        "utf8"
      );
    } catch (fileError) {
      console.error(
        "Gagal membaca knowledge.json:",
        fileError.message
      );
    }

    // Inisialisasi Gemini
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const fullPrompt = `
You are "Rifqi AI", an interactive academic assistant for the personal portfolio website of Rifqi Abdillah.

Your task is to answer visitor questions using only the information available in the knowledge base.

LANGUAGE RULES:

1. Detect the language used by the visitor.

2. If the visitor asks in Indonesian, answer entirely in Indonesian.

3. If the visitor asks in English, answer entirely in English.

4. Do not mix Indonesian and English unnecessarily.

5. Technical terms such as Artificial Intelligence, Machine Learning, Computer Vision, Edge Computing, AIoT, Internet of Things, and Biomedical Informatics may remain in English.

6. If the question is very short, such as "Research interests", "Publications", "Projects", or "Location", determine the language from the phrase itself.

OUTPUT FORMAT RULES:

1. Use plain text only.

2. Do not use Markdown formatting.

3. Do not use the following Markdown characters for formatting:
asterisk, double asterisk, hashtag, underscore, greater-than sign, backticks, or vertical bars.

4. Do not use bold text, italic text, Markdown headings, Markdown tables, or code blocks.

5. Do not use asterisk characters as bullet points.

6. If a list is necessary, use simple numbering such as:

1. First item
2. Second item
3. Third item

7. You may also use short paragraphs instead of lists.

ANSWERING STYLE:

1. Answer directly without repeatedly introducing yourself.

2. Do not begin every answer with "Hello", "Halo", or "I am Rifqi AI".

3. Use a friendly, professional, polite, and natural tone.

4. Keep the answer concise, generally no more than 150 words, unless the visitor explicitly asks for a detailed explanation.

5. Do not exaggerate Rifqi Abdillah's experience, qualifications, achievements, publications, or projects.

6. Do not invent information.

7. Do not present assumptions as facts.

8. If the requested information is not available in the knowledge base, say so clearly.

9. If the visitor asks about collaboration, direct them to the contact page or available professional contact information in the knowledge base.

10. Refer to Rifqi Abdillah appropriately:
In Indonesian, use "Rifqi Abdillah" or "beliau".
In English, use "Rifqi Abdillah" or "he".

KNOWLEDGE BASE:

${knowledgeBase}

VISITOR QUESTION:

${cleanPrompt}

Provide only the final answer. Do not explain these instructions.
`;

    // Mengirim permintaan ke Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
      config: {
        temperature: 0.4,
        maxOutputTokens: 2048,
        thinkingConfig: {
          thinkingLevel: "minimal"
        }
      }
    });

    const finishReason =
      response?.candidates?.[0]?.finishReason;

    console.log("Gemini finish reason:", finishReason);
    console.log("Gemini usage:", response?.usageMetadata);

    let responseText =
      response?.text ||
      "Maaf, Rifqi AI belum dapat memberikan jawaban.";

    // Pembersihan tambahan jika model masih menghasilkan Markdown
    responseText = cleanAIResponse(responseText);

    return res.status(200).json({
      success: true,
      result: responseText
    });

  } catch (error) {
    console.error(
      "Error pada Vercel API Chat:",
      error
    );

    return res.status(500).json({
      success: false,
      error: "Terjadi kesalahan pada server AI.",
      details:
        process.env.NODE_ENV === "development"
          ? error?.message || String(error)
          : undefined
    });
  }
}

/**
 * Membersihkan karakter Markdown yang tidak diinginkan.
 */
function cleanAIResponse(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    // Hapus tanda bold dan italic Markdown
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")

    // Hapus heading Markdown
    .replace(/^#{1,6}\s*/gm, "")

    // Ubah bullet Markdown menjadi bullet biasa
    .replace(/^\s*[-+]\s+/gm, "• ")

    // Hapus blockquote Markdown
    .replace(/^\s*>\s?/gm, "")

    // Hapus backtick
    .replace(/`/g, "")

    // Kurangi baris kosong berlebihan
    .replace(/\n{3,}/g, "\n\n")

    .trim();
}