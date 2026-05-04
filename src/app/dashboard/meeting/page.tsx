"use client";

import { useState, useCallback } from "react";
import { 
  LiveKitRoom, 
  VideoConference, 
  RoomAudioRenderer,
  ControlBar,
} from "@livekit/components-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  LogOut, 
  Loader2,
  Bot,
  AlertCircle,
  Play,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import "@livekit/components-styles";
import { MeetingAgent } from "@/components/meeting-agent";
import { logger } from "@/lib/logger";

export default function MeetingPage() {
  const [meetingData, setMeetingData] = useState<{
    hostToken: string;
    agentToken: string;
    roomName: string;
    url: string;
  } | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startMeeting = useCallback(async () => {
    setIsStarting(true);
    setError(null);
    try {
      const response = await fetch("/api/meeting/start", {
        method: "POST",
        body: JSON.stringify({ roomName: `Alpha-${Math.random().toString(36).substring(7)}` }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to start meeting");
      
      setMeetingData(data);
      logger.info(`Meeting started: ${data.roomName}`);
    } catch (err: any) {
      setError(err.message);
      logger.error(`Meeting start error: ${err.message}`);
    } finally {
      setIsStarting(false);
    }
  }, []);

  if (meetingData) {
    return (
      <div className="h-screen bg-black text-white flex flex-col">
        <header className="h-20 border-b border-white/5 px-8 flex justify-between items-center bg-[#030712]">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Video size={16} />
            </div>
            <h1 className="font-bold font-jakarta">{meetingData.roomName}</h1>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck size={14} />
              <span>Secure Session</span>
            </div>
          </div>
          <button 
            onClick={() => setMeetingData(null)}
            className="flex items-center space-x-2 bg-red-600/10 text-red-500 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut size={16} />
            <span>End Session</span>
          </button>
        </header>
        
        <LiveKitRoom
          token={meetingData.hostToken}
          serverUrl={meetingData.url}
          connect={true}
          audio={true}
          video={false}
          onDisconnected={() => setMeetingData(null)}
          className="flex-1 flex flex-col relative"
        >
          <MeetingAgent roomName={meetingData.roomName} agentToken={meetingData.agentToken} />
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 rounded-[40px] border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
          
          <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-blue-500">
            <Bot size={40} className="animate-pulse" />
          </div>

          <h2 className="text-3xl font-bold mb-4 font-jakarta">AI Boardroom</h2>
          <p className="text-gray-400 mb-10 text-sm leading-relaxed">
            Initialize a high-intelligence meeting space. Our neural assistant will automatically join to provide real-time insights and automation.
          </p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-400 text-sm"
              >
                <AlertCircle size={18} />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={startMeeting}
            disabled={isStarting}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-white/5 disabled:opacity-50"
          >
            {isStarting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Orchestrating...</span>
              </>
            ) : (
              <>
                <Play size={20} className="fill-current" />
                <span>Launch Meeting</span>
              </>
            )}
          </button>
        </motion.div>

        <Link href="/dashboard" className="mt-8 flex items-center justify-center space-x-2 text-gray-500 hover:text-white transition-colors group">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest">Back to Hub</span>
        </Link>
      </div>
    </div>
  );
}
