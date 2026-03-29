"use client";

export const dynamic = "force-dynamic";

import { motion } from "framer-motion";
import { 
  Mail, 
  Zap, 
  MessageSquare, 
  Video, 
  ShieldCheck, 
  LayoutDashboard,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import EligibilityTest from "@/components/eligibility-test";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard", active: true },
  { label: "Email Manager", icon: Mail, href: "/dashboard/email" },
  { label: "Task Engine", icon: Zap, href: "/dashboard/tasks" },
  { label: "AI Support", icon: MessageSquare, href: "/dashboard/support" },
  { label: "Meetings", icon: Video, href: "/dashboard/meeting" },
];

const stats = [
  { label: "Emails Processed", value: "1,284", change: "+12.5%", trend: "up" },
  { label: "Hours Saved", value: "142.5", change: "+8.2%", trend: "up" },
  { label: "Active Tasks", value: "12", change: "Running", trend: "neutral" },
];

export default function Dashboard() {
  const [showEligibilityTest, setShowEligibilityTest] = useState(false);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  useEffect(() => {
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

  const handleTestComplete = (passed: boolean) => {
    localStorage.setItem("ai_eligibility", passed ? "passed" : "failed");
    setIsEligible(passed);
    if (passed) {
      setShowEligibilityTest(false);
    } else {
      // Allow them to retry or handle as needed
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] text-white overflow-hidden">
      {showEligibilityTest && (
        <EligibilityTest onComplete={handleTestComplete} />
      )}
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#030712] flex flex-col">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold font-jakarta">AI Automate</span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group",
                  item.active 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-500 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={20} className={cn(item.active ? "text-white" : "group-hover:text-blue-400")} />
                <span className="font-medium">{item.label}</span>
                {item.active && <motion.div layoutId="active" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <div className="glass-card rounded-2xl p-5 border-blue-500/20 bg-blue-500/5">
            <div className="flex items-center space-x-2 text-blue-400 mb-2">
              <ShieldCheck size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Free Trial</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">7 days remaining in your professional trial.</p>
            <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold font-jakarta mb-2">Executive Overview</h1>
            <p className="text-gray-500">Welcome back, Commander. Here's your automation status.</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-3 glass-card rounded-xl hover:bg-white/5 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#030712]" />
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white/10" />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-3xl"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</span>
                <div className={cn(
                  "px-2 py-1 rounded-lg text-[10px] font-bold",
                  stat.trend === 'up' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                )}>
                  {stat.change}
                </div>
              </div>
              <div className="text-4xl font-bold font-jakarta">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Preview Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 rounded-[40px] relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Mail size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Email Intelligence</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                12 spam threats neutralized in the last hour. 45 high-priority messages organized.
              </p>
              <Link href="/dashboard/email" className="inline-flex items-center space-x-2 text-blue-400 font-bold group-hover:translate-x-2 transition-transform">
                <span>Manage Inbox</span>
                <ChevronRight size={18} />
              </Link>
            </div>
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Mail size={160} />
            </div>
          </motion.div>

          {/* Task Preview Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 rounded-[40px] relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-600/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Automation Status</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                "Quarterly Report Analysis" is 82% complete. Neural engine is processing data.
              </p>
              <Link href="/dashboard/tasks" className="inline-flex items-center space-x-2 text-purple-400 font-bold group-hover:translate-x-2 transition-transform">
                <span>View Engine</span>
                <ChevronRight size={18} />
              </Link>
            </div>
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={160} />
            </div>
          </motion.div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12 glass-card rounded-[40px] p-10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold font-jakarta">Neural Activity</h3>
            <button className="text-sm font-bold text-blue-400">View Logs</button>
          </div>
          
          <div className="space-y-8">
            {[
              { time: "2m ago", event: "Spam identified & moved to quarantine", details: "Sender: support@shady-site.com", icon: ShieldCheck, color: "text-emerald-500" },
              { time: "15m ago", event: "Automated task 'Client Follow-up' completed", details: "Sent 12 personalized emails", icon: CheckCircle2, color: "text-blue-500" },
              { time: "1h ago", event: "AI Voice meeting generated transcription", details: "Room: Board Meeting #42", icon: Video, color: "text-purple-500" }
            ].map((log, i) => (
              <div key={i} className="flex items-start space-x-6 group">
                <div className={cn("mt-1 p-2 rounded-lg bg-white/5", log.color)}>
                  <log.icon size={18} />
                </div>
                <div className="flex-1 border-b border-white/5 pb-6">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold">{log.event}</h4>
                    <span className="text-xs text-gray-600">{log.time}</span>
                  </div>
                  <p className="text-sm text-gray-500">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
