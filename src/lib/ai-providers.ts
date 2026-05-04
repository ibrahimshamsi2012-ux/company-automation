import { getOpenAI } from "./openai";

type AiResponse = { text: string };

async function callOpenAI(query: string, context?: string): Promise<AiResponse> {
  const openai = getOpenAI();

  const resp = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { 
        role: "system", 
        content: `You are a high-fidelity Neural Humanoid Assistant in a professional meeting. 
        Your goal is 100% accuracy and extreme human-like naturalness. 
        Rules:
        1. Be precise: If you don't know a fact, say so naturally. 
        2. Tone: Professional but warm. Use natural transitions like 'Well,' 'Actually,' or 'I see.' 
        3. Accuracy: Triple-check your logic. Think step-by-step before responding.
        4. Context: You are in a live meeting. Keep responses under 3 sentences for natural flow.
        5. Persona: You are an advanced AI, not a robot. Speak like a senior consultant.` 
      },
      { role: "user", content: `Query: ${query}\nMeeting Context: ${context || "Standard business meeting"}` },
    ],
    temperature: 0.6, // Lower temperature for higher accuracy
    max_tokens: 200,
  });

  const text = resp.choices?.[0]?.message?.content || "";
  return { text };
}

async function callGoogleGemini(query: string, context?: string): Promise<AiResponse> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return { text: "" };

  // Use the latest Gemini models for higher accuracy
  const model = process.env.GOOGLE_GEMINI_MODEL || "gemini-1.5-flash";

  const body = {
    contents: [{
      parts: [{
        text: `You are a high-fidelity Neural Humanoid Assistant. 
        Query: ${query}
        Context: ${context || "Standard business meeting"}
        
        Provide a 100% accurate, human-like response. Be concise and professional.`
      }]
    }],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 200,
    }
  };

  try {
    const res = await fetch(`https://generativeai.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Gemini Error:", error);
      return { text: "" };
    }

    const json = await res.json();
    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return { text };
  } catch (e) {
    console.warn("Google Gemini call failed", e);
    return { text: "" };
  }
}

export async function getBestAiResponse(query: string, context?: string) {
  // Preference: 'openai' | 'google' | 'auto'
  const pref = (process.env.PREFERRED_AI_PROVIDER || "auto").toLowerCase();

  if (pref === "openai") {
    const resp = await callOpenAI(query, context);
    return resp.text || "";
  }

  if (pref === "google") {
    const googleResp = await callGoogleGemini(query, context);
    if (googleResp.text) return googleResp.text;
    // fallback to OpenAI
    const oa = await callOpenAI(query, context);
    return oa.text || "";
  }

  // auto: if Google key present, run both and pick, otherwise OpenAI only
  const hasGoogle = Boolean(process.env.GOOGLE_API_KEY);

  if (hasGoogle) {
    const [openResp, googleResp] = await Promise.allSettled([
      callOpenAI(query, context),
      callGoogleGemini(query, context),
    ]);

    const openText = openResp.status === "fulfilled" ? openResp.value.text : "";
    const googleText = googleResp.status === "fulfilled" ? googleResp.value.text : "";

    // Simple heuristic: prefer the longer non-empty answer
    const pick = (a: string, b: string) => {
      if (!a && !b) return "";
      if (a && !b) return a;
      if (!a && b) return b;
      return a.split(" ").length >= b.split(" ").length ? a : b;
    };

    return pick(openText.trim(), googleText.trim());
  }

  const openOnly = await callOpenAI(query, context);
  return openOnly.text || "";
}

export default { getBestAiResponse };
