export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Build-time safety check
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('YOUR_')) {
      return new Response(JSON.stringify({ text: "AI is in maintenance mode. Please check your API keys." }), { status: 200 });
    }

    // Move Clerk inside to prevent build-time crashes
    const { auth } = await import("@clerk/nextjs");
    const { userId } = auth();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { query, context } = await req.json();

    // Dynamic import to prevent build-time crashes
    const { openai } = await import("@/lib/openai");

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a highly intelligent AI Meeting Assistant, similar to Gemini or ChatGPT. Your goal is to provide concise, professional, and helpful responses to users during a live meeting. Keep your answers brief (under 3 sentences) since they will be spoken out loud. Be polite and proactive.",
        },
        {
          role: "user",
          content: `Question: ${query}\nMeeting Context: ${context || "Standard business meeting"}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const responseText = response.choices[0].message.content || "I'm sorry, I couldn't process that.";

    return new Response(JSON.stringify({ text: responseText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.log("[AI_CHAT_ERROR]", error);
    return new Response(JSON.stringify({ error: "Internal Error" }), { status: 500 });
  }
}
