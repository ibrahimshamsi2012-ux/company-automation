import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
import { logger } from "./logger";

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'API6wom28Fob9ba';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'ozQJys6BeGvsmhMyLu3zsVDkPaWAUT6JsQtzVvW2vcY';
const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://company-automation-dnyrj2vt.livekit.cloud';

export class MeetingOrchestrator {
  private static roomService = new RoomServiceClient(
    LIVEKIT_URL.replace('wss://', 'https://'),
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET
  );

  static async createMeeting(roomName: string, userId: string, userName: string) {
    try {
      logger.info(`Orchestrating meeting: ${roomName} for user: ${userId}`);

      // 1. Ensure room exists (LiveKit creates on join, but we can manage it)
      await this.roomService.listRooms([roomName]).catch(e => {
        logger.warn(`Room listing error: ${e.message}`);
        return [];
      });

      // 2. Generate Host Token
      const hostToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: userId,
        name: userName,
      });

      hostToken.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

      // 3. Generate Agent Token
      const agentToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
        identity: `AGENT_${roomName}`,
        name: "AI Assistant",
      });

      agentToken.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

      return {
        roomName,
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
