// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - types provided at runtime in the SDK
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function chatGemini(prompt: string, context?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  // Use the official SDK exclusively; try preferred model first, then sensible fallbacks
  const genAI = new GoogleGenerativeAI(apiKey);
  const preferredModel = (process.env.GEMINI_MODEL || "gemini-1.5-flash-latest").trim();
  const systemText = (
    "You are KSG Assistant for Kenya School of Government (KSG). Answer concisely. " +
    "Follow these strict rules: \n" +
    "- When the user greets with 'hi' or 'hello', respond EXACTLY: \n" +
    "  welcome I am ksg assistnt and i am ready to listen how may i make of help today ?\n" +
    "- If the user's input includes the keyword 'feedback', ask them to add the feedback and whether they want to submit anonymously or as a user. Keep it brief.\n" +
    "- Options meaning and sources (when answering information requests): \n" +
    "  • Inquiry => Use ONLY the 'KSG DOCS CONTEXT' and 'CALENDAR CONTEXT' sections.\n" +
    "  • General information => Use ONLY the 'WEBSITE CONTEXT' section (ksg.ac.ke).\n" +
    "- The provided context is labeled. Cite which section you used (WEBSITE CONTEXT, CALENDAR CONTEXT, or KSG DOCS CONTEXT) in your reasoning implicitly and base answers strictly on that.\n" +
    "- Use ONLY the supplied context and Mode; do not fabricate sources or details. If information isn't in context, say you don't have it and suggest the closest option. " +
    "- If urgent keywords appear, suggest escalating."
  ) + (context ? `\n\nContext:\n${context}` : "");

  const candidates = [
    preferredModel,
    /^gemini/i.test(preferredModel) ? preferredModel : "gemini-1.5-flash-latest",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
  ];

  const modelsToTry = Array.from(new Set(candidates.filter(Boolean)));

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: { role: "system", parts: [{ text: systemText }] } as any,
      });
      const result = await model.generateContent({
        contents: [
          { role: "user", parts: [{ text: prompt }] },
        ],
        generationConfig: { maxOutputTokens: 512, temperature: 0.4, topP: 0.9, topK: 40 } as any,
      });
      const text = result.response.text() || "";
      if (text) return text;
    } catch {
      // try next candidate
    }
  }

  return "";
}


