export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { roomName } = await req.json();

    if (!roomName) {
      return new Response("Room name is required", { status: 400 });
    }

    // Move Clerk inside for build safety
    const { auth } = await import("@clerk/nextjs");
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Check for LiveKit keys
    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      return new Response("LiveKit keys not configured", { status: 500 });
    }

    // Dynamically import to prevent build-time crashes
    const { AccessToken } = await import("livekit-server-sdk");

    // Create a token for the AI Robot
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
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
