"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Mic, 
  Send, 
  Volume2, 
  User, 
  Bot, 
  Loader2,
  ChevronLeft,
  Sparkles,
  Headphones,
  History,
  ShieldCheck,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  isVoice?: boolean;
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "bot", content: "System initialized. I am your Neural Support Interface. How can I assist your enterprise operations today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "bot", 
        content: `Analysis complete for request: "${input}". Our neural networks suggest optimizing your workflow by 15% through the Task Engine. Would you like me to initiate a deployment?` 
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-[#030712] text-white overflow-hidden">
      {/* Sidebar Controls */}
      <aside className="w-80 border-r border-white/5 bg-[#030712] flex flex-col">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-10 group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-widest">Back to Hub</span>
          </Link>

          <h1 className="text-3xl font-bold font-jakarta mb-8">AI Support</h1>

          <div className="space-y-2">
            {[
              { label: 'Neural Chat', icon: MessageSquare, active: true },
              { label: 'Voice Interface', icon: Headphones, active: false },
              { label: 'Support History', icon: History, active: false },
              { label: 'Assistant Config', icon: Settings, active: false },
            ].map((tab) => (
              <button
                key={tab.label}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
                  tab.active ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-gray-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8">
          <div className="glass-card rounded-2xl p-6 border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Secure Link</span>
            </div>
            <p className="text-[10px] text-gray-400">All neural communications are encrypted with AES-256.</p>
          </div>
        </div>
      </aside>

      {/* Main Chat View */}
      <main className="flex-1 flex flex-col bg-[#030712]">
        <header className="h-24 border-b border-white/5 px-10 flex items-center justify-between backdrop-blur-xl z-10">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/5">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-bold font-jakarta">Neural Assistant</h2>
              <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsSpeaking(!isSpeaking)}
            className={cn(
              "flex items-center space-x-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all",
              isSpeaking ? "bg-red-500 text-white animate-pulse" : "glass-card hover:bg-white/10"
            )}
          >
            {isSpeaking ? <Volume2 size={18} /> : <Mic size={18} />}
            <span>{isSpeaking ? "Voice Active" : "Talk to AI"}</span>
          </button>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-start space-x-4",
                  msg.role === 'user' ? "flex-row-reverse space-x-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0",
                  msg.role === 'user' ? "bg-blue-600 text-white" : "glass-card text-emerald-500"
                )}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div className={cn(
                  "max-w-[70%] p-6 rounded-3xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-blue-600 text-white rounded-tr-none shadow-xl shadow-blue-600/10" 
                    : "glass-card text-gray-100 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-emerald-500">
                <Bot size={20} />
              </div>
              <div className="glass-card p-6 rounded-3xl rounded-tl-none flex items-center space-x-3">
                <Loader2 className="animate-spin text-emerald-500" size={16} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Neural Processing</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-10 bg-[#030712]">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative group">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the neural network..."
              className="w-full bg-white/5 border border-white/5 rounded-[32px] py-6 px-8 outline-none focus:border-emerald-500/50 transition-all font-medium text-lg pr-20 group-hover:bg-white/[0.08]"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <Send size={24} />
            </button>
          </form>
          <p className="text-center mt-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </main>
    </div>
  );
}
