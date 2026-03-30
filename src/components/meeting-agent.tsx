"use client";

import { useEffect, useRef, useState } from "react";
import { 
  useRoomContext,
} from "@livekit/components-react";
import { Room, RoomEvent, DataPacket_Kind } from "livekit-client";
import { Bot, Sparkles, Mic2, AlertCircle, Loader2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function MeetingAgent({ roomName }: { roomName: string }) {
  const mainRoom = useRoomContext();
  const [agentStatus, setAgentStatus] = useState<"connecting" | "online" | "speaking" | "error">("connecting");
  const [lastMessage, setLastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const agentRoomRef = useRef<Room | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setupAgent = async () => {
      try {
        setAgentStatus("connecting");
        
        // 1. Get Agent Token
        const res = await fetch("/api/meetings/agent", {
          method: "POST",
          body: JSON.stringify({ roomName }),
          headers: { "Content-Type": "application/json" }
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Neural Internal Error");
        }
        const { token } = data;

        if (!isMounted) return;

        // 2. Create and Connect Agent Room
        const agentRoom = new Room();
        agentRoomRef.current = agentRoom;

        await agentRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);
        setAgentStatus("online");

        // 3. Listen for data in the MAIN room (from users)
        const handleData = async (payload: Uint8Array) => {
          const decoder = new TextDecoder();
          const str = decoder.decode(payload);
          
          try {
            const data = JSON.parse(str);
            // Listen for specific trigger words or questions
            if (data.type === "transcription" || str.toLowerCase().includes("robot") || str.toLowerCase().includes("hey ai") || str.endsWith("?")) {
              await handleAiResponse(data.text || str);
            }
          } catch (e) {
            if (str.toLowerCase().includes("robot") || str.toLowerCase().includes("hey ai") || str.endsWith("?")) {
              await handleAiResponse(str);
            }
          }
        };

        mainRoom.on(RoomEvent.DataReceived, handleData);

      } catch (error: any) {
        console.error("Agent Setup Error:", error);
        if (isMounted) {
          setAgentStatus("error");
          setErrorMessage(error.message || "Connection failed");
        }
      }
    };

    const handleAiResponse = async (query: string) => {
      if (agentStatus === "speaking") return;
      
      try {
        setAgentStatus("speaking");
        
        // 1. Get High-Intelligence Response
        const chatRes = await fetch("/api/ai/chat", {
          method: "POST",
          body: JSON.stringify({ 
            query,
            context: `Room: ${roomName}`
          }),
          headers: { "Content-Type": "application/json" }
        });
        
        const chatData = await chatRes.json();
        const responseText = chatData.text || "I am processing your request.";
        setLastMessage(responseText);

        // 2. Convert to Premium Voice
        const voiceRes = await fetch("/api/ai/voice", {
          method: "POST",
          body: JSON.stringify({ text: responseText }),
          headers: { "Content-Type": "application/json" }
        });
        
        if (!voiceRes.ok) throw new Error("Voice synthesis failed");

        const audioBlob = await voiceRes.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          await audioRef.current.play();
        }

        // 3. Broadcast response text to everyone in the room
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify({
          type: "ai_response",
          text: responseText,
          sender: "AI_ROBOT"
        }));
        
        if (agentRoomRef.current) {
          await agentRoomRef.current.localParticipant.publishData(data, { reliable: true });
        }

        setAgentStatus("online");
      } catch (error) {
        console.error("AI Response Error:", error);
        if (isMounted) setAgentStatus("online");
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
      <AnimatePresence mode="wait">
        <motion.div
          key={agentStatus}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={cn(
            "glass-card rounded-[32px] p-6 border backdrop-blur-2xl shadow-2xl w-80 overflow-hidden relative transition-all duration-500",
            agentStatus === "error" ? "border-red-500/30 bg-red-500/5" : "border-blue-500/30 bg-blue-600/10"
          )}
        >
          {/* Top Gradient Bar */}
          <div className={cn(
            "absolute top-0 left-0 w-full h-1 bg-gradient-to-r",
            agentStatus === "error" ? "from-red-500 to-orange-500" : "from-blue-500 via-indigo-500 to-purple-500"
          )} />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                agentStatus === "speaking" ? "bg-blue-500 shadow-lg shadow-blue-500/50 scale-110" : 
                agentStatus === "error" ? "bg-red-500/20" : "bg-white/5"
              )}>
                {agentStatus === "connecting" ? (
                  <Loader2 className="text-blue-400 animate-spin" size={24} />
                ) : agentStatus === "error" ? (
                  <AlertCircle className="text-red-500" size={24} />
                ) : (
                  <Bot className={cn(
                    "text-white transition-all",
                    agentStatus === "speaking" ? "animate-pulse" : ""
                  )} size={24} />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm">Neural Assistant</h3>
                  <Zap size={12} className="text-yellow-400 fill-current" />
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    agentStatus === "error" ? "bg-red-500" : 
                    agentStatus === "connecting" ? "bg-blue-400 animate-pulse" : "bg-emerald-500 animate-pulse"
                  )} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    {agentStatus}
                  </span>
                </div>
              </div>
            </div>
            
            {agentStatus === "speaking" && (
              <div className="flex items-end space-x-1 h-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 16, 4] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-1 bg-blue-400 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {agentStatus === "error" ? (
              <div className="bg-red-500/10 rounded-2xl p-4 border border-red-500/20">
                <p className="text-xs text-red-400 leading-relaxed font-medium">
                  {errorMessage || "An unexpected error occurred. Please try again."}
                </p>
              </div>
            ) : lastMessage ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 rounded-2xl p-4 border border-white/5 group hover:border-white/10 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles size={12} className="text-purple-400" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">AI Intelligence</span>
                </div>
                <p className="text-xs text-gray-200 leading-relaxed italic">
                  "{lastMessage}"
                </p>
              </motion.div>
            ) : (
              <div className="text-center py-4">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-2">
                  Neural Link Active
                </p>
                <p className="text-[11px] text-gray-400">
                  Ask a question or mention "Robot" to begin.
                </p>
              </div>
            )}
          </div>

          {/* Background Decorative Element */}
          <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <audio ref={audioRef} className="hidden" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
