import { getOpenAI } from "./openai";

type AiResponse = { text: string };

async function callOpenAI(query: string, context?: string): Promise<AiResponse> {
  const openai = getOpenAI();

  const resp = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: "You are a highly intelligent AI Meeting Assistant. Keep answers concise and professional." },
      { role: "user", content: `Question: ${query}\nMeeting Context: ${context || "Standard business meeting"}` },
    ],
    temperature: 0.7,
    max_tokens: 150,
  });

  const text = resp.choices?.[0]?.message?.content || "";
  return { text };
}

async function callGoogleGemini(query: string, context?: string): Promise<AiResponse> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return { text: "" };

  const model = process.env.GOOGLE_GEMINI_MODEL || "models/text-bison-001";

  const body = {
    prompt: `Question: ${query}\nMeeting Context: ${context || "Standard business meeting"}`,
    temperature: 0.7,
    maxOutputTokens: 150,
  };

  try {
    const res = await fetch(`https://generativeai.googleapis.com/v1/${model}:generateText?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) return { text: "" };

    const json = await res.json();
    const text = json?.candidates?.[0]?.output || json?.output || "";
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
