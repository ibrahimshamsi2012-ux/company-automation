"use client";

import { useEffect, useRef } from "react";
import { 
  useRoomContext,
  useLocalParticipant,
} from "@livekit/components-react";
import { RoomEvent, DataPacket_Kind } from "livekit-client";

export function MeetingAgent() {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!room) return;

    const handleDataReceived = async (payload: Uint8Array, participant: any) => {
      const decoder = new TextDecoder();
      const str = decoder.decode(payload);
      
      try {
        const data = JSON.parse(str);
        
        // Listen for transcriptions or direct questions
        if (data.type === "transcription" && data.text) {
          const text = data.text.toLowerCase();
          
          // Trigger AI if mentioned or asked a question
          if (text.includes("robot") || text.includes("ai assistant") || text.endsWith("?")) {
            await handleAiResponse(data.text);
          }
        }
      } catch (e) {
        // Not JSON, might be raw text
        if (str.includes("robot") || str.endsWith("?")) {
          await handleAiResponse(str);
        }
      }
    };

    const handleAiResponse = async (query: string) => {
      if (!localParticipant) return;
      
      try {
        // 1. Get AI Text Response
        const chatRes = await fetch("/api/email/organize", { // Fixed URL
          method: "POST",
          body: JSON.stringify({ 
            emails: [{ subject: "Meeting Query", body: query }] 
          })
        });
        
        const chatData = await chatRes.json();
        const responseText = chatData.summary || "I am processing your request.";

        // 2. Convert to Voice
        const voiceRes = await fetch("/api/ai/voice", {
          method: "POST",
          body: JSON.stringify({ text: responseText })
        });

        const audioBlob = await voiceRes.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
        }

        // 3. Broadcast response text to room
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify({
          type: "ai_response",
          text: responseText
        }));
        
        await localParticipant.publishData(data, DataPacket_Kind.RELIABLE);

      } catch (error) {
        console.error("AI Agent Error:", error);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room, localParticipant]);

  return (
    <audio ref={audioRef} className="hidden" />
  );
}
