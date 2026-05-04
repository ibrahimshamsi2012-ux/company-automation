"use client";

import { motion } from "framer-motion";
import { 
  Mail, 
  Zap, 
  MessageSquare, 
  Video, 
  LayoutDashboard, 
  Bell, 
  Search, 
  ChevronRight, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Settings, 
  ShieldCheck, 
  ZapOff 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import EligibilityTest from "@/components/eligibility-test";
import { ProjectAssessor } from "@/components/project-assessor";
import { useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { isFeatureEnabled } from "@/lib/feature-flags";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard", active: true, feature: null },
  { label: "Email Intelligence", icon: Mail, href: "/dashboard/email", feature: 'EMAIL_INTELLIGENCE' },
  { label: "Neural Engine", icon: Zap, href: "/dashboard/tasks", feature: 'TASK_ENGINE' },
  { label: "AI Support", icon: MessageSquare, href: "/dashboard/support", feature: 'AI_AGENT' },
  { label: "Boardroom", icon: Video, href: "/dashboard/meeting", feature: 'MEETING_AUTOMATION' },
];

function UserNav() {
  const clerk = useUser();
  const user = clerk?.user;
  const isEligible = typeof localStorage !== 'undefined' ? localStorage.getItem("ai_eligibility") === "passed" : false;

  return (
    <div className="flex items-center space-x-3 px-2 py-3">
      <UserButton afterSignOutUrl="/" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold truncate">{user?.fullName || user?.username || "Neural Operator"}</p>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
          {isEligible ? "Verified Node" : "Awaiting Verification"}
        </p>
      </div>
    </div>
  );
}

function WelcomeBanner() {
  const { user } = useUser();
  return (
    <div className="relative p-12 rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-900 overflow-hidden shadow-2xl shadow-blue-500/20">
      <div className="absolute top-0 right-0 p-12 opacity-10">
        <ShieldCheck size={200} />
      </div>
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-5xl font-bold font-jakarta mb-4 leading-tight">
          Welcome back, <br />{user?.firstName || "Operator"}.
        </h1>
        <p className="text-blue-100/70 text-lg font-medium mb-8">
          Your neural company is running at <span className="text-white font-bold">99.8% efficiency</span>. 12 active automations are currently processing data.
        </p>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/tasks" className="px-8 py-3 bg-white text-black rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-lg">
            Manage Automations
          </Link>
          <button className="px-8 py-3 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all backdrop-blur-md border border-white/10">
            System Health
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [showEligibilityTest, setShowEligibilityTest] = useState(false);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const eligibility = localStorage.getItem("ai_eligibility");
    if (eligibility === "passed") {
      setIsEligible(true);
    } else if (eligibility === "failed") {
      setIsEligible(false);
      setShowEligibilityTest(true);
    } else {
      setShowEligibilityTest(true);
    }
  }, []);

  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_');

  const handleTestComplete = (passed: boolean) => {
    localStorage.setItem("ai_eligibility", passed ? "passed" : "failed");
    setIsEligible(passed);
    if (passed) setShowEligibilityTest(false);
  };

  const handleUpgrade = async () => {
    setIsSubscribing(true);
    try {
      const res = await fetch("/api/stripe/checkout");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Upgrade error:", err);
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex h-screen bg-[#030712] text-white overflow-hidden">
      {showEligibilityTest && <EligibilityTest onComplete={handleTestComplete} />}
      
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#030712] flex flex-col shrink-0">
        <div className="p-8 flex-1">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold font-jakarta tracking-tight">AI Automate</span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const enabled = !item.feature || isFeatureEnabled(item.feature as any);
              return (
                <Link
                  key={item.label}
                  href={enabled ? item.href : "#"}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group relative",
                    item.active 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-500 hover:text-white hover:bg-white/5",
                    !enabled && "opacity-50 cursor-not-allowed grayscale"
                  )}
                >
                  <item.icon size={20} className={cn(item.active ? "text-white" : "group-hover:text-blue-400")} />
                  <span className="font-medium text-sm">{item.label}</span>
                  {!enabled && <ZapOff size={12} className="ml-auto text-gray-600" />}
                  {item.active && <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 pt-10 border-t border-white/5">
            <div className="p-5 glass-card rounded-[28px] border-blue-500/20 bg-blue-500/5 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-600/10 rounded-full blur-2xl group-hover:bg-blue-600/20 transition-all" />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-2">Enterprise Plan</p>
                <p className="text-xs text-gray-400 mb-4 font-medium leading-relaxed">
                  Unlock advanced neural models and unlimited automations.
                </p>
                <button 
                  onClick={handleUpgrade}
                  disabled={isSubscribing}
                  className="w-full py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2"
                >
                  {isSubscribing ? <span className="animate-pulse">Connecting...</span> : <span>Upgrade Now</span>}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5">
          {hasClerk ? (
            <UserNav />
          ) : (
            <div className="flex items-center space-x-3 px-2 py-3 grayscale opacity-50">
              <div className="w-8 h-8 bg-white/10 rounded-full" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">Neural Operator</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Guest Mode</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-white/5 px-10 flex items-center justify-between bg-[#030712]/50 backdrop-blur-xl">
          <div className="flex items-center space-x-2 text-gray-500">
            <LayoutDashboard size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Enterprise Hub</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Global Search..." 
                className="bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500/50 transition-all w-64"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#030712]" />
            </button>
            <button className="p-2 text-gray-500 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Welcome Banner */}
            {hasClerk ? (
              <WelcomeBanner />
            ) : (
              <div className="relative p-12 rounded-[40px] bg-gradient-to-br from-blue-600/50 to-indigo-900/50 overflow-hidden shadow-2xl border border-white/5 grayscale">
                <div className="relative z-10 max-w-2xl">
                  <h1 className="text-5xl font-bold font-jakarta mb-4 leading-tight">
                    Welcome back, <br />Operator.
                  </h1>
                  <p className="text-blue-100/70 text-lg font-medium mb-8">
                    Your neural company is running in <span className="text-white font-bold">Safe Mode</span>. Sign in to unlock full efficiency and active automations.
                  </p>
                  <div className="flex items-center space-x-4">
                    <Link href="/dashboard" className="px-8 py-3 bg-white text-black rounded-2xl font-bold hover:bg-gray-100 transition-all">
                      Sign In Now
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Active Meetings", value: "2", icon: Video, color: "text-blue-400", bg: "bg-blue-400/10" },
                { label: "Processed Tasks", value: "1,284", icon: Zap, color: "text-purple-400", bg: "bg-purple-400/10" },
                { label: "Neural Insights", value: "24", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-400/10" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-8 rounded-[32px] border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold font-jakarta">{stat.value}</p>
                  </div>
                  <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", stat.bg, stat.color)}>
                    <stat.icon size={28} />
                  </div>
                </div>
              ))}
            </div>

            {/* Project Assessor Section */}
            <div className="pt-10">
              <ProjectAssessor />
            </div>

            {/* Recent Activity Section (Mocked for layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold font-jakarta">Live Neural Log</h3>
                  <button className="text-xs font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300">View History</button>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card p-6 rounded-3xl border-white/5 flex items-center space-x-4 group hover:bg-white/5 transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-400 transition-colors">
                        <TrendingUp size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Sales Analysis Optimized</p>
                        <p className="text-xs text-gray-500">Task Engine completed a quarterly revenue projection.</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-emerald-400">+12% Efficient</p>
                        <p className="text-[10px] text-gray-600">2 mins ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-jakarta">Verification Status</h3>
                <div className="glass-card p-8 rounded-[32px] border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 flex items-center justify-center mb-6 relative">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                      <ShieldCheck className="text-blue-500" size={32} />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Security Verified</h4>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                      Your account is protected by AES-256 encryption and neural biometric verification.
                    </p>
                    <button className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all">
                      Security Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
