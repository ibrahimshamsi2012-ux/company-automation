"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { 
  LiveKitRoom, 
  VideoConference, 
  GridLayout,
  ParticipantTile,
  ControlBar,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { motion } from "framer-motion";
import { 
  Video, 
  Users, 
  Settings, 
  LogOut, 
  Loader2,
  ChevronLeft,
  Monitor,
  Mic,
  ShieldCheck,
  Globe,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import "@livekit/components-styles";
import { MeetingAgent } from "@/components/meeting-agent";

export default function MeetingPage() {
  const [token, setToken] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("Boardroom-Alpha");
  const [isJoining, setIsJoining] = useState(false);
  const [isAiEnabled, setIsAiEnabled] = useState(false);

  const joinMeeting = async () => {
    setIsJoining(true);
    try {
      const response = await fetch(`/api/meetings/token?room=${roomName}`);
      const data = await response.json();
      setToken(data.token);
      // enable AI assistant by default after joining
      setIsAiEnabled(true);
    } catch (error) {
      console.error("Error joining meeting", error);
    } finally {
      setIsJoining(false);
    }
  };

  if (token) {
    return (
      <div className="h-screen bg-black text-white flex flex-col">
        <header className="h-20 border-b border-white/5 px-8 flex justify-between items-center bg-[#030712]">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Video size={16} />
            </div>
            <h1 className="font-bold font-jakarta">{roomName}</h1>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <button 
              onClick={() => setIsAiEnabled(!isAiEnabled)}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                isAiEnabled ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-gray-400 hover:text-white"
              )}
            >
              <Bot size={14} className={isAiEnabled ? "animate-pulse" : ""} />
              <span>{isAiEnabled ? "AI Robot Active" : "Enable AI Robot"}</span>
            </button>
          </div>
          <button 
            onClick={() => setToken(null)}
            className="flex items-center space-x-2 bg-red-600/10 text-red-500 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all"
          >
            <LogOut size={16} />
            <span>End Session</span>
          </button>
        </header>
        
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          className="flex-1 flex flex-col"
        >
          {isAiEnabled && <MeetingAgent roomName={roomName} />}
          <VideoConference />
        </LiveKitRoom>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#030712] text-white overflow-hidden">
      {/* Sidebar Controls */}
      <aside className="w-80 border-r border-white/5 bg-[#030712] flex flex-col">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-10 group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-widest">Back to Hub</span>
          </Link>

          <h1 className="text-3xl font-bold font-jakarta mb-8">Virtual Suite</h1>

          <div className="space-y-2">
            {[
              { label: 'Neural Meetings', icon: Video, active: true },
              { label: 'Room Analytics', icon: Monitor, active: false },
              { label: 'Device Setup', icon: Settings, active: false },
            ].map((tab) => (
              <button
                key={tab.label}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
                  tab.active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-gray-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8">
          <div className="glass-card rounded-2xl p-6 border-indigo-500/20 bg-indigo-500/5 text-center">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mx-auto mb-3">
              <Globe size={20} />
            </div>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Global Network</p>
            <p className="text-[10px] text-gray-500">Connected to 12 Edge Regions</p>
          </div>
        </div>
      </aside>

      {/* Join Room Section */}
      <main className="flex-1 flex items-center justify-center p-12 bg-[#030712]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full glass-card rounded-[48px] p-12 md:p-16 border-white/5 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          <div className="w-20 h-20 bg-indigo-600/10 text-indigo-500 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/10">
            <Video size={40} />
          </div>

          <h2 className="text-4xl font-bold font-jakarta mb-4">Neural Meetings</h2>
          <p className="text-gray-500 mb-12 leading-relaxed">
            Host encrypted enterprise livestreams with real-time AI transcription and biometric verification.
          </p>

          <div className="space-y-6">
            <div className="text-left space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 ml-4">Identifier</label>
              <input 
                type="text" 
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-[24px] py-5 px-8 outline-none focus:border-indigo-500/50 transition-all font-bold text-lg"
              />
            </div>

            <button 
              onClick={joinMeeting}
              disabled={isJoining}
              className="w-full py-6 bg-white text-black rounded-[24px] font-bold text-xl hover:bg-gray-200 transition-all flex items-center justify-center space-x-3 disabled:opacity-50 shadow-2xl shadow-white/5"
            >
              {isJoining ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Synchronizing...</span>
                </>
              ) : (
                <>
                  <Play className="fill-current" size={20} />
                  <span>Initiate Meeting</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-center space-x-12 opacity-30 grayscale hover:grayscale-0 transition-all">
            <div className="flex flex-col items-center space-y-2">
              <ShieldCheck size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Users size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">HD Video</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Mic size={20} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Spatial Audio</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function Play({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M5 3L19 12L5 21V3Z" fill="currentColor" />
    </svg>
  );
}
