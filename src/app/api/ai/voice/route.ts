export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Check for OpenAI key before anything else to prevent build crash
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('YOUR_')) {
      return new Response("API Key not configured", { status: 200 });
    }

    // Move Clerk inside to prevent build-time crashes
    const { auth } = await import("@clerk/nextjs");
    const { userId } = auth();
    
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { text } = await req.json();

    // Dynamically import openai to prevent module-level crashes during build
    const { openai } = await import("@/lib/openai");

    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.log("[AI_VOICE_ERROR]", error);
    return new Response("Internal Error", { status: 500 });
  }
}
