import { AccessToken } from "livekit-server-sdk";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const room = searchParams.get("room") || "meeting-room";

    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: user.id,
        name: user.firstName + " " + user.lastName,
      }
    );

    at.addGrant({ roomJoin: true, room: room, canPublish: true, canSubscribe: true });

    return NextResponse.json({ token: await at.toJwt() });
  } catch (error) {
    console.log("[MEETING_TOKEN_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
