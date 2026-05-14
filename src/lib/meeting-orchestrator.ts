import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { logger } from "./logger";
import { getLivekitApiKey, getLivekitApiSecret, getLivekitUrl } from "./livekit-config";

const LIVEKIT_API_KEY = getLivekitApiKey();
const LIVEKIT_API_SECRET = getLivekitApiSecret();
const LIVEKIT_URL = getLivekitUrl();

function sanitizeIdentity(input: string): string {
  const safe = (input || "").replace(/[^a-zA-Z0-9_.-]/g, "_").slice(0, 120);
  return safe || `guest_${Math.random().toString(36).slice(2, 10)}`;
}

export class MeetingOrchestrator {
  private static roomService = new RoomServiceClient(
    LIVEKIT_URL.replace('wss://', 'https://'),
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET
  );

  static async createMeeting(roomName: string, userId: string, userName: string) {
    try {
      logger.info(`Orchestrating meeting: ${roomName} for user: ${userId}`);
      const safeUserId = sanitizeIdentity(userId);
      const safeRoom = roomName.replace(/[^a-zA-Z0-9_-]/g, "") || `Meeting-${Math.random().toString(36).slice(2, 9)}`;
      const safeUserName = (userName || "Guest").trim().slice(0, 80);

      // 1. Ensure room exists (LiveKit creates on join, but we can manage it)
      await this.roomService.listRooms([safeRoom]).catch(e => {
        logger.warn(`Room listing error: ${e.message}`);
        return [];
      });

      // 2. Generate Host Token
      const hostToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: safeUserId,
        name: safeUserName,
      });

      hostToken.addGrant({
        roomJoin: true,
        room: safeRoom,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

      // 3. Generate Agent Token
      const agentToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: sanitizeIdentity(`AGENT_${safeRoom}`),
        name: "AI Assistant",
      });

      agentToken.addGrant({
        roomJoin: true,
        room: safeRoom,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

      return {
        roomName: safeRoom,
        hostToken: await hostToken.toJwt(),
        agentToken: await agentToken.toJwt(),
        url: LIVEKIT_URL,
      };
    } catch (error: any) {
      logger.error(`Meeting orchestration failed: ${error.message}`);
      throw error;
    }
  }

  static async endMeeting(roomName: string) {
    try {
      await this.roomService.deleteRoom(roomName);
      logger.info(`Meeting ended: ${roomName}`);
    } catch (error: any) {
      logger.error(`Failed to end meeting: ${error.message}`);
    }
  }
}
