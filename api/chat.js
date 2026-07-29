import { GoogleGenAI } from "@google/genai";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync
} from "fs";
import { join, relative } from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

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
        error: "Prompt is required."
      });
    }

    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt cannot be empty."
      });
    }

    if (cleanPrompt.length > 1500) {
      return res.status(400).json({
        success: false,
        error: "The prompt is too long. Maximum 1500 characters."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error(
        "GEMINI_API_KEY is not configured in Vercel."
      );

      return res.status(500).json({
        success: false,
        error: "API key is not configured."
      });
    }

    const databasePath = join(
      process.cwd(),
      "database"
    );

    const knowledgeData =
      loadAllJsonFiles(databasePath);

    const knowledgeBase = JSON.stringify(
      knowledgeData,
      null,
      2
    );

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const fullPrompt = `
You are "Rifqi AI", an interactive academic assistant for the portfolio website of Rifqi Abdillah.

Use only the information contained in the knowledge base below.

LANGUAGE RULES:

1. Detect the language of the visitor's question.

2. If the visitor asks in Indonesian, answer entirely in Indonesian.

3. If the visitor asks in English, answer entirely in English.

4. Do not mix Indonesian and English unnecessarily.

5. Technical terms such as Artificial Intelligence, Machine Learning, Computer Vision, Edge Computing, AIoT, Internet of Things, and Biomedical Informatics may remain in English.

6. For short phrases, infer the language from the phrase:
   "Research interests" means answer in English.
   "Minat penelitian" means answer in Indonesian.

OUTPUT RULES:

1. Use plain text only.

2. Do not use Markdown.

3. Do not use asterisks, hashtags, backticks, Markdown headings, Markdown tables, or Markdown bullet points.

4. If a list is required, use simple numbering:

1. First item
2. Second item
3. Third item

5. Do not use an asterisk character anywhere in the answer.

6. Insert one line break before the first numbered item.

7. Never place multiple numbered items in the same paragraph.

8. When writing a numbered list, always use newline characters between items.

ANSWERING STYLE:

1. Answer directly.

2. Do not repeatedly introduce yourself.

3. Do not begin every answer with "Hello", "Halo", or "I am Rifqi AI".

4. Use a friendly, professional, polite, and natural tone.

5. For simple profile questions, answer in one or two complete sentences.

6. Keep most answers below 150 words unless the visitor asks for more detail.

7. Always complete the final sentence.

8. Never stop in the middle of a word or sentence.

9. Do not add unnecessary introductory or closing sentences.

10. Do not invent information.

11. Do not present assumptions as facts.

12. If information is not available in the knowledge base, say so clearly.

12. Always complete the final sentence.

13. Never stop in the middle of a word or sentence.

14. For simple profile questions, answer in one or two complete sentences.

15. Do not add unnecessary introductory or closing sentences.

16. In Indonesian, refer to Rifqi Abdillah as "Rifqi Abdillah" or "beliau".

17. In English, refer to Rifqi Abdillah as "Rifqi Abdillah" or "he".

KNOWLEDGE BASE:

${knowledgeBase}

VISITOR QUESTION:

${cleanPrompt}

Return only the final answer.
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: fullPrompt,
        config: {
          temperature: 0.3,
          maxOutputTokens: 2048
        }
      });

    const finishReason =
      response?.candidates?.[0]?.finishReason;

    console.log(
      "Gemini finish reason:",
      finishReason
    );

    console.log(
      "Gemini usage:",
      response?.usageMetadata
    );

    let responseText =
      response?.text ||
      "Sorry, Rifqi AI cannot provide an answer yet.";

    responseText =
      cleanAIResponse(responseText);

    return res.status(200).json({
      success: true,
      result: responseText
    });

  } catch (error) {
    // Error lengkap hanya masuk ke Vercel Logs
    console.error("Error on Vercel API Chat:", error);

    const errorMessage = String(
      error?.message ||
      error?.toString?.() ||
      ""
    );

    const normalizedError =
      errorMessage.toLowerCase();

    const isIndonesian =
      detectIndonesianLanguage(cleanPrompt);

    const statusCode =
      extractErrorCode(errorMessage);

    // Kuota atau rate limit
    if (
      statusCode === 429 ||
      normalizedError.includes("resource_exhausted") ||
      normalizedError.includes("quota exceeded") ||
      normalizedError.includes("rate limit") ||
      normalizedError.includes("too many requests")
    ) {
      return res.status(429).json({
        success: false,
        error: isIndonesian
          ? "Rifqi AI sedang mencapai batas penggunaan. Silakan coba kembali nanti."
          : "Rifqi AI has reached its usage limit. Please try again later."
      });
    }

    // API key bermasalah
    if (
      statusCode === 401 ||
      statusCode === 403 ||
      normalizedError.includes("api key not valid") ||
      normalizedError.includes("invalid api key") ||
      normalizedError.includes("permission_denied") ||
      normalizedError.includes("unauthenticated")
    ) {
      return res.status(503).json({
        success: false,
        error: isIndonesian
          ? "Rifqi AI sedang mengalami kendala akses. Silakan coba kembali nanti."
          : "Rifqi AI is currently experiencing an access issue. Please try again later."
      });
    }

    // Model tidak tersedia
    if (
      statusCode === 404 ||
      normalizedError.includes("model") &&
      normalizedError.includes("not found") ||
      normalizedError.includes("no longer available")
    ) {
      return res.status(503).json({
        success: false,
        error: isIndonesian
          ? "Model Rifqi AI sedang diperbarui. Silakan coba kembali nanti."
          : "The Rifqi AI model is currently being updated. Please try again later."
      });
    }

    // Gangguan koneksi atau layanan
    if (
      statusCode === 502 ||
      statusCode === 503 ||
      statusCode === 504 ||
      normalizedError.includes("fetch failed") ||
      normalizedError.includes("network") ||
      normalizedError.includes("timeout") ||
      normalizedError.includes("timed out") ||
      normalizedError.includes("overloaded") ||
      normalizedError.includes("service unavailable")
    ) {
      return res.status(503).json({
        success: false,
        error: isIndonesian
          ? "Rifqi AI sedang mengalami gangguan koneksi. Silakan coba kembali beberapa saat lagi."
          : "Rifqi AI is currently experiencing a connection issue. Please try again shortly."
      });
    }

    // Error umum, tanpa details teknis
    return res.status(500).json({
      success: false,
      error: isIndonesian
        ? "Maaf, Rifqi AI sedang mengalami kendala. Silakan coba kembali nanti."
        : "Sorry, Rifqi AI is currently experiencing an issue. Please try again later."
    });
  }
}

function extractErrorCode(message) {
  if (!message || typeof message !== "string") {
    return 0;
  }

  const jsonCode =
    message.match(/"code"\s*:\s*(\d{3})/);

  if (jsonCode) {
    return Number(jsonCode[1]);
  }

  const genericCode =
    message.match(
      /\b(400|401|403|404|429|500|502|503|504)\b/
    );

  return genericCode
    ? Number(genericCode[1])
    : 0;
}

function detectIndonesianLanguage(text) {
  if (!text || typeof text !== "string") {
    return false;
  }

  const normalized = text.toLowerCase();

  const indonesianWords = [
    "apa",
    "apakah",
    "siapa",
    "dimana",
    "di mana",
    "kapan",
    "mengapa",
    "kenapa",
    "bagaimana",
    "tentang",
    "jelaskan",
    "rifqi ada",
    "lokasi",
    "mengajar",
    "penelitian",
    "publikasi",
    "proyek",
    "keahlian",
    "kolaborasi"
  ];

  return indonesianWords.some(
    word => normalized.includes(word)
  );
}

/**
 * Membaca seluruh file JSON di dalam folder database
 * beserta seluruh subfoldernya.
 */
function loadAllJsonFiles(directoryPath) {
  const results = [];

  if (!existsSync(directoryPath)) {
    console.error(
      `Database folder not found: ${directoryPath}`
    );

    return results;
  }

  const items = readdirSync(directoryPath);

  for (const item of items) {
    const fullPath = join(
      directoryPath,
      item
    );

    const fileInfo = statSync(fullPath);

    if (fileInfo.isDirectory()) {
      const nestedData =
        loadAllJsonFiles(fullPath);

      results.push(...nestedData);
      continue;
    }

    if (
      fileInfo.isFile() &&
      item.toLowerCase().endsWith(".json")
    ) {
      try {
        const rawData = readFileSync(
          fullPath,
          "utf8"
        );

        const parsedData =
          JSON.parse(rawData);

        results.push({
          source: relative(
            process.cwd(),
            fullPath
          ).replace(/\\/g, "/"),
          data: parsedData
        });

      } catch (error) {
        console.error(
          `Failed to read ${fullPath}:`,
          error.message
        );
      }
    }
  }

  return results;
}

/**
 * Membersihkan karakter Markdown.
 */
function cleanAIResponse(text) {
  if (!text || typeof text !== "string") {
    return "";
  }

  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-+]\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/`/g, "")
    .replace(/\|/g, "")

    // Tambahkan enter sebelum penomoran
    .replace(/\s+(\d+\.\s+)/g, "\n$1")

    // Rapikan baris kosong
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}