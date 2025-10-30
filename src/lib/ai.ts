export async function chatGemini(prompt: string, context?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const payload: any = {
    contents: [
      { role: "user", parts: [{ text: context ? `${context}\n\nUser: ${prompt}` : prompt }] },
    ],
    systemInstruction:
      "You are KSG Assistant. Answer concisely. Handle inquiries and feedback about trainings (upcoming, ongoing, completed). If urgent, suggest escalation.",
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
  );
  if (!res.ok) throw new Error(`Gemini error ${res.status}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}


