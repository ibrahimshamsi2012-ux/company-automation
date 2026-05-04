"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { 
  useRoomContext,
  useTranscription,
} from "@livekit/components-react";
import { Room, RoomEvent } from "livekit-client";
import { Bot, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MeetingAgentProps {
  roomName: string;
  agentToken?: string;
}

export function MeetingAgent({ roomName, agentToken }: MeetingAgentProps) {
  const mainRoom = useRoomContext();
  const [agentStatus, setAgentStatus] = useState<"connecting" | "online" | "speaking" | "error">("connecting");
  const [lastMessage, setLastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const agentRoomRef = useRef<Room | null>(null);
  const transcription = useTranscription();

  const handleAiResponse = useCallback(async (query: string) => {
    if (agentStatus === "speaking" || !query.trim()) return;
    
    try {
      setAgentStatus("speaking");
      
      // 1. STT is handled by LiveKit transcription hook or data events
      // 2. AI Chat Completion
      const chatRes = await fetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ 
          query,
          context: `Meeting: ${roomName}`
        }),
        headers: { "Content-Type": "application/json" }
      });
      
      const chatData = await chatRes.json();
      if (!chatRes.ok) throw new Error(chatData.error || "AI Synthesis failed");
      
      const responseText = chatData.text || "Neural connection active.";
      setLastMessage(responseText);

      // 3. TTS (Text to Speech)
      const voiceRes = await fetch("/api/ai/voice", {
        method: "POST",
        body: JSON.stringify({ text: responseText }),
        headers: { "Content-Type": "application/json" }
      });
      
      if (!voiceRes.ok) throw new Error("Vocal synthesis failed");

      const audioBlob = await voiceRes.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }

      // 4. Broadcast response to meeting
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify({
        type: "ai_response",
        text: responseText,
        sender: "NEURAL_AI"
      }));
      
      if (agentRoomRef.current) {
        await agentRoomRef.current.localParticipant.publishData(data, { reliable: true });
      }

      setAgentStatus("online");
    } catch (error: any) {
      console.error("Agent Pipeline Error:", error);
      setAgentStatus("online");
    }
  }, [agentStatus, roomName]);

  // Listen for transcriptions
  useEffect(() => {
    if (!transcription || transcription.segments.length === 0) return;
    
    const lastSegment = transcription.segments[transcription.segments.length - 1];
    if (lastSegment.final && lastSegment.text) {
      const text = lastSegment.text.toLowerCase();
      if (text.includes("robot") || text.includes("assistant") || text.includes("ai")) {
        handleAiResponse(lastSegment.text);
      }
    }
  }, [transcription, handleAiResponse]);

  useEffect(() => {
    let isMounted = true;

    const setupAgent = async () => {
      try {
        setAgentStatus("connecting");
        
        let token = agentToken;
        if (!token) {
          const res = await fetch("/api/meetings/agent", {
            method: "POST",
            body: JSON.stringify({ roomName }),
            headers: { "Content-Type": "application/json" }
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Agent token failure");
          token = data.token;
        }

        if (!token || !isMounted) return;

        const agentRoom = new Room();
        agentRoomRef.current = agentRoom;

        const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://company-automation-dnyrj2vt.livekit.cloud";
        await agentRoom.connect(livekitUrl, token);
        
        if (isMounted) setAgentStatus("online");

        agentRoom.on(RoomEvent.DataReceived, (payload) => {
          const str = new TextDecoder().decode(payload);
          try {
            const data = JSON.parse(str);
            if (data.type === "trigger_ai") {
              handleAiResponse(data.text);
            }
          } catch (e) {
            // Not JSON
          }
        });

      } catch (error: any) {
        console.error("Agent Init Error:", error);
        if (isMounted) {
          setAgentStatus("error");
          setErrorMessage(error.message || "Neural Link Failed");
        }
      }
    };

    setupAgent();

    return () => {
      isMounted = false;
      if (agentRoomRef.current) {
        agentRoomRef.current.disconnect();
      }
    };
  }, [roomName, agentToken, handleAiResponse]);

  return (
    <div className="absolute bottom-24 right-8 z-50">
      <audio ref={audioRef} hidden />
      <AnimatePresence mode="wait">
        <motion.div
          key={agentStatus}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={cn(
            "glass-card rounded-[32px] p-6 border backdrop-blur-2xl shadow-2xl w-80 overflow-hidden relative",
            agentStatus === "error" ? "border-red-500/30 bg-red-500/5" : "border-blue-500/30 bg-blue-600/10"
          )}
        >
          <div className={cn(
            "absolute top-0 left-0 w-full h-1 bg-gradient-to-r",
            agentStatus === "error" ? "from-red-500 to-orange-500" : "from-blue-500 via-indigo-500 to-purple-500"
          )} />
          
          <div className="flex items-center space-x-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center relative",
              agentStatus === "speaking" ? "bg-blue-600 animate-pulse shadow-lg shadow-blue-500/50" : "bg-white/5"
            )}>
              {agentStatus === "connecting" ? (
                <Loader2 className="text-blue-400 animate-spin" size={24} />
              ) : agentStatus === "error" ? (
                <AlertCircle className="text-red-500" size={24} />
              ) : (
                <Bot className={cn("text-white", agentStatus === "speaking" ? "scale-110" : "opacity-80")} size={24} />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm">Neural Assistant</h3>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black">
                {agentStatus === "speaking" ? "Processing..." : agentStatus}
              </p>
            </div>
          </div>

          {lastMessage && agentStatus !== "error" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 pt-4 border-t border-white/5"
            >
              <p className="text-xs text-gray-300 leading-relaxed italic">
                "{lastMessage}"
              </p>
            </motion.div>
          )}

          {agentStatus === "error" && (
            <div className="mt-4 p-3 bg-red-500/10 rounded-xl">
              <p className="text-[10px] text-red-400 font-bold">{errorMessage}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
