"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Search, 
  RefreshCw,
  Filter,
  MoreVertical,
  Inbox,
  ShieldAlert,
  Star,
  Archive,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

const MOCK_EMAILS = [
  { id: 1, from: "John Doe", subject: "Quarterly Report Analysis", content: "Hi team, I've attached the latest performance metrics for Q1. Please review and let me know your thoughts by EOD.", type: "Real", category: "Internal", summary: "Requesting review of Q1 performance metrics.", time: "10:24 AM" },
  { id: 2, from: "Marketing Pro", subject: "URGENT: YOU WON $50,000!!!", content: "Congratulations! You are our lucky winner. Click the link below to claim your cash prize immediately. No strings attached!", type: "Spam", summary: "Malicious phishing attempt promising fake prize money.", time: "09:15 AM" },
  { id: 3, from: "Acme Corp", subject: "Invoice #INV-2024-001", content: "Your subscription for Acme Enterprise has been renewed. Please find the attached invoice for your records. Total: $1,200.00", type: "Real", category: "Billing", summary: "Subscription renewal invoice for Acme Enterprise.", time: "Yesterday" },
  { id: 4, from: "Sarah Williams", subject: "Client Meeting Notes", content: "Great session today! Here are the key takeaways from our meeting with the Global Tech team. They are ready to move forward.", type: "Real", category: "Clients", summary: "Summary of successful client meeting with Global Tech.", time: "Yesterday" },
];

export default function EmailPage() {
  const { user } = useUser();
  const [emails, setEmails] = useState(MOCK_EMAILS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isGmailConnected, setIsGmailConnected] = useState(false);

  // Check if Gmail is connected via Clerk's external accounts
  useEffect(() => {
    if (user && user.externalAccounts) {
      const hasGmail = user.externalAccounts.some(
        (acc) => acc.provider === "google" && acc.verification?.status === "verified"
      );
      setIsGmailConnected(hasGmail);
    }
  }, [user]);

  const analyzeEmails = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    
    try {
      const response = await fetch("/api/email/organize", {
        method: "POST",
        body: JSON.stringify({ emails }),
        headers: { "Content-Type": "application/json" }
      });

      if (!response.ok) throw new Error("Neural organization error");

      const data = await response.json();
      
      // Merge AI analysis results with current emails
      // The API returns an object where keys are likely email IDs or just an array
      // Let's assume it returns a list of analyzed emails or a mapping
      const analyzedEmails = emails.map(email => {
        const analysis = data[email.id] || data.emails?.find((e: any) => e.id === email.id);
        if (analysis) {
          return {
            ...email,
            type: analysis.type || email.type,
            category: analysis.category || email.category,
            summary: analysis.summary || email.summary
          };
        }
        return email;
      });

      setEmails(analyzedEmails);
    } catch (error) {
      console.error("Email Intelligence Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const connectGmail = async () => {
    if (!user) return;
    try {
      // Create external account (Google) flow
      await user.createExternalAccount({
        redirectUrl: window.location.href,
        strategy: "oauth_google",
      });
    } catch (err: any) {
      console.error("Clerk OAuth Error:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] text-white overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-80 border-r border-white/5 bg-[#030712] flex flex-col">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors mb-10 group">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-widest">Back to Hub</span>
          </Link>

          <h1 className="text-3xl font-bold font-jakarta mb-8">Email Intelligence</h1>

          <div className="space-y-6 mb-10">
            <div className="p-5 glass-card rounded-[28px] border-white/5 bg-white/5">
              <div className="flex items-center space-x-3 mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  isGmailConnected ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                )}>
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500">Google Sync</p>
                  <p className="text-sm font-bold">{isGmailConnected ? "Connected" : "Disconnected"}</p>
                </div>
              </div>
              
              {!isGmailConnected ? (
                <button 
                  onClick={connectGmail}
                  className="w-full py-3 bg-white text-black rounded-2xl font-bold text-xs hover:bg-gray-200 transition-all shadow-xl shadow-white/5"
                >
                  Connect Gmail
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
                  <CheckCircle size={12} />
                  <span>Reading Real Mails...</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {[
              { id: 'all', label: 'All Inboxes', icon: Inbox, count: 12 },
              { id: 'real', label: 'Verified Real', icon: CheckCircle, count: 8 },
              { id: 'spam', label: 'Neural Spam', icon: ShieldAlert, count: 4 },
              { id: 'starred', label: 'Starred', icon: Star, count: 2 },
              { id: 'archive', label: 'Archive', icon: Archive, count: 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                  activeTab === tab.id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="flex items-center space-x-3">
                  <tab.icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  activeTab === tab.id ? "bg-white/20" : "bg-white/5"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8">
          <div className="glass-card rounded-2xl p-6 border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center space-x-2 text-blue-400 mb-2">
              <RefreshCw size={14} className="animate-spin-slow" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Neural Sync</span>
            </div>
            <p className="text-xs text-gray-400">Our AI is monitoring your inboxes in real-time.</p>
          </div>
        </div>
      </aside>

      {/* Main Inbox View */}
      <main className="flex-1 flex flex-col">
        {/* Header Toolbar */}
        <header className="h-24 border-b border-white/5 px-10 flex items-center justify-between bg-[#030712]/50 backdrop-blur-xl">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search across all inboxes..." 
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-3 glass-card rounded-xl hover:bg-white/5 transition-colors">
              <Filter size={20} />
            </button>
            <button 
              onClick={analyzeEmails}
              disabled={isAnalyzing}
              className="px-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={cn(isAnalyzing && "animate-spin")} size={16} />
              <span>{isAnalyzing ? "Analyzing..." : "Sync & Scan"}</span>
            </button>
          </div>
        </header>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="space-y-4">
            <AnimatePresence>
              {emails.map((email, i) => (
                <motion.div
                  key={email.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card group rounded-[32px] p-8 hover:bg-white/[0.04] transition-all border-white/5 hover:border-white/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                        email.type === 'Real' ? "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/5" : "bg-red-500/10 text-red-500 shadow-red-500/5"
                      )}>
                        {email.type === 'Real' ? <CheckCircle size={22} /> : <ShieldAlert size={22} />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-0.5">
                          <h3 className="font-bold text-lg">{email.from}</h3>
                          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{email.time}</span>
                        </div>
                        <p className="text-gray-400 font-medium">{email.subject}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {email.category && (
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                          {email.category}
                        </span>
                      )}
                      <button className="p-2 text-gray-600 hover:text-white transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="pl-16">
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">
                      {email.content}
                    </p>
                    
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className={cn(
                        "p-5 rounded-2xl border flex items-start space-x-4 transition-all",
                        email.type === 'Real' 
                          ? "bg-blue-500/5 border-blue-500/10" 
                          : "bg-red-500/5 border-red-500/10"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg mt-0.5",
                        email.type === 'Real' ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"
                      )}>
                        <AlertCircle size={14} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1 block">Neural Analysis</span>
                        <p className={cn(
                          "text-xs font-medium italic leading-relaxed",
                          email.type === 'Real' ? "text-blue-300" : "text-red-300"
                        )}>
                          {email.summary}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
