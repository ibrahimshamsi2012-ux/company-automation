"use client";

import { useEffect, useRef, useState } from "react";
import { 
  useRoomContext,
} from "@livekit/components-react";
import { Room, RoomEvent, DataPacket_Kind, RemoteParticipant } from "livekit-client";
import { Bot, Sparkles, Mic2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function MeetingAgent({ roomName }: { roomName: string }) {
  const mainRoom = useRoomContext();
  const [agentStatus, setAgentStatus] = useState<"connecting" | "online" | "speaking" | "error">("connecting");
  const [lastMessage, setLastMessage] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const agentRoomRef = useRef<Room | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setupAgent = async () => {
      try {
        // 1. Get Agent Token
        const res = await fetch("/api/meetings/agent", {
          method: "POST",
          body: JSON.stringify({ roomName })
        });
        const { token } = await res.json();

        if (!isMounted) return;

        // 2. Create and Connect Agent Room
        const agentRoom = new Room();
        agentRoomRef.current = agentRoom;

        await agentRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);
        setAgentStatus("online");

        // 3. Listen for data in the MAIN room (from users)
        mainRoom.on(RoomEvent.DataReceived, async (payload, participant) => {
          const decoder = new TextDecoder();
          const str = decoder.decode(payload);
          
          try {
            const data = JSON.parse(str);
            if (data.type === "transcription" || str.toLowerCase().includes("robot") || str.endsWith("?")) {
              await handleAiResponse(data.text || str);
            }
          } catch (e) {
            if (str.toLowerCase().includes("robot") || str.endsWith("?")) {
              await handleAiResponse(str);
            }
          }
        });

      } catch (error) {
        console.error("Agent Setup Error:", error);
        setAgentStatus("error");
      }
    };

    const handleAiResponse = async (query: string) => {
      if (agentStatus === "speaking") return;
      
      try {
        setAgentStatus("speaking");
        
        // Get AI Response
        const chatRes = await fetch("/api/email/organize", {
          method: "POST",
          body: JSON.stringify({ 
            emails: [{ subject: "Meeting Query", body: query }] 
          })
        });
        const chatData = await chatRes.json();
        const responseText = chatData.summary || "I am here to help.";
        setLastMessage(responseText);

        // Convert to Voice
        const voiceRes = await fetch("/api/ai/voice", {
          method: "POST",
          body: JSON.stringify({ text: responseText })
        });
        const audioBlob = await voiceRes.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          await audioRef.current.play();
        }

        // Broadcast text response to everyone
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify({
          type: "ai_response",
          text: responseText
        }));
        
        if (agentRoomRef.current) {
          await agentRoomRef.current.localParticipant.publishData(data, { reliable: true });
        }

        setAgentStatus("online");
      } catch (error) {
        console.error("AI Response Error:", error);
        setAgentStatus("online");
      }
    };

    setupAgent();

    return () => {
      isMounted = false;
      if (agentRoomRef.current) {
        agentRoomRef.current.disconnect();
      }
    };
  }, [roomName, mainRoom]);

  return (
    <div className="absolute bottom-24 right-8 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass-card rounded-[32px] p-6 border-blue-500/30 bg-blue-600/10 backdrop-blur-2xl shadow-2xl w-80 overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                agentStatus === "speaking" ? "bg-blue-500 shadow-lg shadow-blue-500/50 scale-110" : "bg-white/5"
              )}>
                <Bot className={cn(
                  "text-white transition-all",
                  agentStatus === "speaking" ? "animate-bounce" : ""
                )} size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI Assistant</h3>
                <div className="flex items-center space-x-1.5">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    agentStatus === "error" ? "bg-red-500" : "bg-emerald-500"
                  )} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    {agentStatus}
                  </span>
                </div>
              </div>
            </div>
            {agentStatus === "speaking" && (
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-1 bg-blue-400 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {lastMessage ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/5"
              >
                <p className="text-xs text-gray-300 leading-relaxed italic">
                  "{lastMessage}"
                </p>
              </motion.div>
            ) : (
              <p className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-tighter">
                Ask me anything to begin...
              </p>
            )}
          </div>

          <audio ref={audioRef} className="hidden" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
