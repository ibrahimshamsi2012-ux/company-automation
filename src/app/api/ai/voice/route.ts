import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Check for OpenAI key before anything else to prevent build crash
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('YOUR_')) {
      return new NextResponse("API Key not configured", { status: 200 });
    }

    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.log("[AI_VOICE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
