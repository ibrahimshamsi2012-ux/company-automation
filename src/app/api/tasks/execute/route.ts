export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Build-time safety check
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('YOUR_')) {
      return new Response(JSON.stringify({ skip: true }), { status: 200 });
    }

    // Move Clerk inside to prevent build-time crashes
    const { auth } = await import("@clerk/nextjs");
    const { userId } = auth();
    
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { taskDescription, context } = await req.json();

    // Dynamic import to prevent build-time crashes
    const { openai } = await import("@/lib/openai");

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an AI Task Automator. Your job is to take a high-level task description and break it down into actionable steps, then perform the work based on the provided context. Provide the output in a structured format including: 1. Actionable Steps 2. Completed Work 3. Time Saved Estimate.",
        },
        {
          role: "user",
          content: `Task: ${taskDescription}\nContext: ${JSON.stringify(context)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    return NextResponse.json(JSON.parse(response.choices[0].message.content!));
  } catch (error) {
    console.log("[TASK_EXEC_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
