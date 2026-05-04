import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;

export const getOpenAI = () => {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_')) {
      throw new Error("OpenAI API Key not configured");
    }
    openaiInstance = new OpenAI({
      apiKey,
    });
  }
  return openaiInstance;
};

// Deprecated: use getOpenAI() instead for build safety
export const openai = {
  get chat() { return getOpenAI().chat; },
  get audio() { return getOpenAI().audio; },
};
