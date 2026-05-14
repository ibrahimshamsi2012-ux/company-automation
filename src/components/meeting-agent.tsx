"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { 
  useRoomContext,
  useTranscriptions, // Neural Update: Plural hook
} from "@livekit/components-react";
import { ConnectionState, LocalAudioTrack, RoomEvent, Track } from "livekit-client";
import { Bot, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MeetingAgentProps {
  roomName: string;
  agentToken?: string;
}

const AGENT_TTS_TRACK_NAME = "neural-assistant-tts";

export function MeetingAgent({ roomName, agentToken }: MeetingAgentProps) {
  const mainRoom = useRoomContext();
  const [agentStatus, setAgentStatus] = useState<"connecting" | "online" | "speaking" | "error">("connecting");
  const [lastMessage, setLastMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const destinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const publishedTrackRef = useRef<LocalAudioTrack | null>(null);
  const effectGenerationRef = useRef(0);
  const segments = useTranscriptions();

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

      if (!chatRes.ok) {
        const bodyText = await chatRes.text().catch(() => "");
        console.error("Chat API returned non-OK:", chatRes.status, bodyText);
        setLastMessage("Sorry, the AI service is unavailable right now.");
        setAgentStatus("online");
        return;
      }

      const chatData = await chatRes.json().catch(() => ({}));
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
        audioRef.current.play().catch((e) => {
          console.warn("Audio play failed:", e);
        });
      }

      // 4. Broadcast response to meeting
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify({
        type: "ai_response",
        text: responseText,
        sender: "NEURAL_AI"
      }));
      
      // Publish data to main room with retries and guards
      try {
        const lp = mainRoom?.localParticipant;
        if (!lp) throw new Error("localParticipant not available");

        let attempts = 0;
        let published = false;
        while (attempts < 3 && !published) {
          try {
            await lp.publishData(data, { reliable: true });
            published = true;
          } catch (pubErr) {
            attempts++;
            console.warn("publishData attempt failed", attempts, pubErr);
            await new Promise((r) => setTimeout(r, 300 * attempts));
          }
        }
        if (!published) {
          console.warn("publishData failed after retries; skipping broadcast");
        }
      } catch (err) {
        console.warn("Skipping broadcast; publish error:", err);
      }

      setAgentStatus("online");
    } catch (error: any) {
      console.error("Agent Pipeline Error:", error);
      setAgentStatus("online");
    }
  }, [agentStatus, roomName]);

  // Listen for transcriptions
  useEffect(() => {
    const transcriptionSegments = Array.isArray(segments) ? segments : [];
    if (transcriptionSegments.length === 0) return;
    
    const lastSegment = transcriptionSegments[transcriptionSegments.length - 1];
    if (lastSegment && lastSegment.final && lastSegment.text) {
      const text = lastSegment.text.toLowerCase();
      if (text.includes("robot") || text.includes("assistant") || text.includes("ai")) {
        handleAiResponse(lastSegment.text);
      }
    }
  }, [segments, handleAiResponse]);

  useEffect(() => {
    let isMounted = true;
    const generation = ++effectGenerationRef.current;

    const unpublishAgentTrack = async () => {
      const lp = mainRoom.localParticipant;
      const t = publishedTrackRef.current;
      if (t) {
        try {
          await lp.unpublishTrack(t);
        } catch {
          /* already gone */
        }
        t.stop();
        publishedTrackRef.current = null;
      }
      const namedPub = lp.getTrackPublicationByName(AGENT_TTS_TRACK_NAME);
      if (namedPub?.track) {
        try {
          await lp.unpublishTrack(namedPub.track);
        } catch {
          /* ignore */
        }
      }
    };

    const setupInCurrentRoom = async () => {
      try {
        setAgentStatus("connecting");
        if (mainRoom.state !== ConnectionState.Connected) {
          return;
        }

        await unpublishAgentTrack();

        // Publish synthesized speech into the existing meeting room.
        // Use Track.Source.Unknown (not Microphone): LiveKitRoom already publishes the user's mic;
        // a second microphone track triggers "a track with the same ID has already been published".
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        if (!destinationRef.current) {
          destinationRef.current = audioContextRef.current.createMediaStreamDestination();
        }
        if (!mediaNodeRef.current) {
          mediaNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
          mediaNodeRef.current.connect(destinationRef.current);
          mediaNodeRef.current.connect(audioContextRef.current.destination);
        }
        const sourceTrack = destinationRef.current.stream.getAudioTracks()[0];
        if (sourceTrack) {
          const localTrack = new LocalAudioTrack(sourceTrack, undefined, true);
          try {
            // attempt publish with simple retry
            let pubAttempts = 0;
            let pubOk = false;
            while (pubAttempts < 3 && !pubOk) {
              try {
                await mainRoom.localParticipant.publishTrack(localTrack, {
                  source: Track.Source.Unknown,
                  name: AGENT_TTS_TRACK_NAME,
                });
                pubOk = true;
              } catch (pErr) {
                pubAttempts++;
                console.warn("publishTrack attempt failed", pubAttempts, pErr);
                await new Promise((r) => setTimeout(r, 300 * pubAttempts));
              }
            }
            if (!pubOk) {
              console.warn("publishTrack failed after retries; stopping local track");
              localTrack.stop();
            } else {
              publishedTrackRef.current = localTrack;
            }
          } catch (err) {
            console.error("Failed to publish TTS track:", err);
            localTrack.stop();
          }
        }

        if (isMounted && generation === effectGenerationRef.current) {
          setAgentStatus("online");
        }
      } catch (error: any) {
        console.error("Agent Init Error:", error);
        const msg = String(error?.message || "");
        if (
          msg.includes("same ID") ||
          msg.includes("already been published")
        ) {
          if (isMounted && generation === effectGenerationRef.current) {
            setAgentStatus("online");
          }
          return;
        }
        if (isMounted && generation === effectGenerationRef.current) {
          setAgentStatus("error");
          setErrorMessage(error.message || "Neural Link Failed");
        }
      }
    };

    const onConnected = () => {
      void setupInCurrentRoom();
    };
    const onData = (payload: Uint8Array) => {
      const str = new TextDecoder().decode(payload);
      try {
        const data = JSON.parse(str);
        if (data.type === "trigger_ai") {
          void handleAiResponse(data.text);
        }
      } catch (_e) {
        // Ignore non-JSON payloads.
      }
    };

    void setupInCurrentRoom();
    mainRoom.on(RoomEvent.Connected, onConnected);
    mainRoom.on(RoomEvent.DataReceived, onData);

    return () => {
      isMounted = false;
      mainRoom.off(RoomEvent.Connected, onConnected);
      mainRoom.off(RoomEvent.DataReceived, onData);
      void (async () => {
        const lp = mainRoom.localParticipant;
        const t = publishedTrackRef.current;
        if (t) {
          try {
            await lp.unpublishTrack(t);
          } catch {
            /* ignore */
          }
          t.stop();
          publishedTrackRef.current = null;
        }
      })();
      mediaNodeRef.current = null;
      destinationRef.current = null;
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [mainRoom, handleAiResponse, roomName, agentToken]);

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
