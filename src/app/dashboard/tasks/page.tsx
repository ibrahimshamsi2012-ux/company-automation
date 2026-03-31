"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  Cpu,
  Sparkles,
  History,
  Settings2,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function TasksPage() {
  const [taskDescription, setTaskDescription] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const executeTask = async () => {
    setIsExecuting(true);
    setTimeout(() => {
      setResult({
        steps: [
          "Neural data parsing initiated",
          "Cross-referencing financial spreadsheets",
          "Generating visual data projections",
          "Compiling executive summary"
        ],
        completed: "Professional Q1 Report draft has been synthesized and saved to your secure cloud storage.",
        timeSaved: "6.5 hours",
      });
      setIsExecuting(false);
    }, 3000);
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

          <h1 className="text-3xl font-bold font-jakarta mb-8">Neural Engine</h1>

          <div className="space-y-2">
            {[
              { label: 'Automation Hub', icon: Zap, active: true },
              { label: 'Neural Logs', icon: History, active: false },
              { label: 'Engine Config', icon: Settings2, active: false },
            ].map((tab) => (
              <button
                key={tab.label}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
                  tab.active ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "text-gray-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8">
          <div className="glass-card rounded-2xl p-6 border-purple-500/20 bg-purple-500/5">
            <div className="flex items-center space-x-2 text-purple-400 mb-2">
              <Cpu size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">CPU Allocation</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                className="h-full bg-purple-500"
              />
            </div>
            <p className="text-[10px] text-gray-500">Processing at 2.4 TFLOPS</p>
          </div>
        </div>
      </aside>

      {/* Main Automation View */}
      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Sparkles size={18} />
              </div>
              <span className="text-sm font-bold text-purple-400 uppercase tracking-widest">Advanced Orchestration</span>
            </div>
            <h2 className="text-4xl font-bold font-jakarta">What should we automate today?</h2>
          </header>

          <div className="glass-card rounded-[40px] p-10 mb-10 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Cpu size={200} />
            </div>

            <textarea 
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Describe your complex workflow here... e.g., 'Analyze the last 3 months of sales data and generate a visual summary for the board.'"
              className="w-full h-48 bg-transparent border-none outline-none text-xl font-medium placeholder:text-gray-700 resize-none mb-8 leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="p-3 glass-card rounded-xl text-gray-500 hover:text-white transition-colors">
                  <Settings2 size={20} />
                </button>
                <span className="text-xs text-gray-600 font-medium tracking-wide italic">
                  GPT-4 Neural Model Selected
                </span>
              </div>

              <button 
                onClick={executeTask}
                disabled={isExecuting || !taskDescription}
                className="px-10 py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/20 flex items-center space-x-3 disabled:opacity-50 group"
              >
                {isExecuting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Play size={20} className="fill-current" />
                    <span>Execute Neural Path</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-[40px] p-10 border-emerald-500/20 bg-emerald-500/[0.02]"
              >
                <div className="flex items-center space-x-3 mb-10 text-emerald-400">
                  <CheckCircle2 size={24} />
                  <h3 className="text-2xl font-bold font-jakarta">Task Successfully Synthesized</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Neural Execution Steps</h4>
                    <div className="space-y-4">
                      {(result.steps || []).map((step: string, i: number) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center space-x-3 text-gray-300"
                        >
                          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-sm font-medium">{step}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">Synthesis Outcome</h4>
                              <p className="text-gray-100 font-medium leading-relaxed">{result.completed || ""}</p>
                    </div>
                    
                    <div className="glass-card p-6 rounded-3xl border-emerald-500/10 flex items-center space-x-4">
                      <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Efficiency Gain</p>
                        <p className="text-xl font-bold text-emerald-400">{result.timeSaved || "—"} Saved</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
