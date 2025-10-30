export async function chatGemini(prompt: string, context?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

  const payload: any = {
    contents: [
      { role: "user", parts: [{ text: context ? `${context}\n\nUser: ${prompt}` : prompt }] },
    ],
    system_instruction: {
      role: "system",
      parts: [
        {
          text:
            "You are KSG Assistant. Answer concisely. Handle inquiries and feedback about trainings (upcoming, ongoing, completed). If urgent, suggest escalation.",
        },
      ],
    },
  };

  // Prefer v1 endpoint and latest model aliases; fall back to commonly available names
  const modelCandidates = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro-latest",
    "gemini-1.5-pro",
  ];
  let lastErrText = "";
  for (const model of modelCandidates) {
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }
    try { lastErrText = await res.text(); } catch {}
    // try next model
  }
  throw new Error(`Gemini error: all model candidates failed${lastErrText ? ": "+lastErrText : ""}`);
}


