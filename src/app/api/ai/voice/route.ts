import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { text } = await req.json();

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
