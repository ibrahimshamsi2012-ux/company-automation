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

    // Use the ai-providers orchestrator which can call OpenAI and Google Gemini
    const { getBestAiResponse } = await import("@/lib/ai-providers");
    const responseText = await getBestAiResponse(query, context);

    const finalText = responseText || "I'm sorry, I couldn't process that.";

    return new Response(JSON.stringify({ text: finalText }), {
      status: 200,
        // Quick dev bypass: if called with ?dev_bypass=1 return a canned response
        try {
          const url = new URL(req.url);
          if (url.searchParams.get("dev_bypass") === "1") {
            return new Response(JSON.stringify({ text: "This is a dev bypass response. Replace with real keys to enable full AI." }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }
        } catch (e) {
          // ignore URL parsing errors
        }
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.log("[AI_CHAT_ERROR]", error);
    return new Response(JSON.stringify({ error: "Internal Error" }), { status: 500 });
  }
}
