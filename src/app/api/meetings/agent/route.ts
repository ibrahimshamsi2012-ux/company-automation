export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1. Check for keys before ANY parsing to prevent build crash
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret || apiKey.includes('YOUR_') || apiSecret.includes('YOUR_')) {
      return new Response(JSON.stringify({ error: "LiveKit API keys are not configured." }), { 
        status: 200, // Return 200 so build doesn't crash on error
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await req.json().catch(() => ({}));
    const { roomName } = body;

    if (!roomName) {
      return new Response(JSON.stringify({ error: "Room name is required" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Move Clerk inside for build safety
    const { auth } = await import("@clerk/nextjs");
    const { userId } = auth();

    if (!userId) {
      return new Response(JSON.stringify({ error: "You must be signed in to invite the AI Robot" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Dynamically import to prevent build-time crashes
    const { AccessToken } = await import("livekit-server-sdk");

    // Create a token for the AI Robot
    const at = new AccessToken(
      apiKey,
      apiSecret,
      {
        identity: "AI_ROBOT_AGENT",
        name: "AI Robot Assistant",
      }
    );

    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[AI_AGENT_TOKEN_ERROR]", error);
    return new Response(JSON.stringify({ error: "Internal Error" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
