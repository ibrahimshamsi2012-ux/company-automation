export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // Ensure auth
    const { auth } = await import("@clerk/nextjs");
    const { userId, user } = auth();

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const body = await req.json().catch(() => ({}));
    const { email, projectUrl, description, metadata } = body;

    // Basic validation
    if (!projectUrl && !description && !metadata) {
      return new Response(JSON.stringify({ error: "Provide a projectUrl, description, or metadata." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Build a prompt for the AI assessor
    const promptParts: string[] = [];
    promptParts.push("You are an expert technical and business evaluator. Given the project information, provide a concise score (0-100), a short summary, and specific risks and strengths. Return a JSON object with keys: score, summary, strengths[], risks[] and recommendation.");
    if (email) promptParts.push(`Submitting user email: ${email}.`);
    if (projectUrl) promptParts.push(`Project repo or URL: ${projectUrl}.`);
    if (description) promptParts.push(`Description: ${description}`);
    if (metadata) promptParts.push(`Metadata: ${JSON.stringify(metadata)}`);

    const prompt = promptParts.join("\n\n");

    // Use orchestrator to get a textual assessment
    const { getBestAiResponse } = await import("@/lib/ai-providers");
    const aiText = await getBestAiResponse(prompt, `Assess the project and return JSON as described.`);

    // Try to parse JSON out of AI response; if not JSON, wrap as summary
    let result: any = { score: null, summary: aiText, strengths: [], risks: [], recommendation: "" };
    try {
      const maybeJson = aiText.trim();
      // attempt to find first JSON block
      const start = maybeJson.indexOf("{");
      const end = maybeJson.lastIndexOf("}");
      if (start !== -1 && end !== -1) {
        const jsonStr = maybeJson.slice(start, end + 1);
        result = JSON.parse(jsonStr);
      } else {
        result.summary = aiText;
      }
    } catch (e) {
      result.summary = aiText;
    }

    return new Response(JSON.stringify({ ok: true, result }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("[AI_ASSESS_ERROR]", error);
    return new Response(JSON.stringify({ error: "Internal Error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
