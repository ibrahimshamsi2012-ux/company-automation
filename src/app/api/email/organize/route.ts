import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { emails } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an AI Email Organizer. Your job is to classify emails into 'Real', 'Spam', or 'Review Required'. For 'Real' emails, provide a category (e.g., Billing, Team, Client). For all emails, provide a 1-sentence summary.",
        },
        {
          role: "user",
          content: `Classify and summarize these emails: ${JSON.stringify(emails)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content!));
  } catch (error) {
    console.log("[EMAIL_ORG_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
