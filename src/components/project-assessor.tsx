"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  Mail, 
  FileText,
  Loader2,
  Sparkles,
  BarChart3,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectAssessor() {
  const [projectUrl, setProjectUrl] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectUrl && !description) return;
    
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectUrl, description, email }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Neural assessment failed");
      setResult(json.result);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/10 rounded-lg text-blue-500">
            <Target size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold font-jakarta">Project Assessor</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Neural Evaluation Protocol</p>
          </div>
        </div>
        {result && (
          <button 
            onClick={() => {
              setResult(null);
              setProjectUrl("");
              setDescription("");
            }}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest"
          >
            New Assessment
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.form 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={submit} 
            className="glass-card p-8 rounded-[32px] border-white/5 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center space-x-2">
                  <Mail size={12} />
                  <span>Contact Email</span>
                </label>
                <input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 outline-none focus:border-blue-500/50 transition-all text-sm font-medium" 
                  placeholder="operator@company.com" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center space-x-2">
                  <Globe size={12} />
                  <span>Project Repository / URL</span>
                </label>
                <input 
                  value={projectUrl} 
                  onChange={(e) => setProjectUrl(e.target.value)} 
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 outline-none focus:border-blue-500/50 transition-all text-sm font-medium" 
                  placeholder="https://github.com/org/repo" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center space-x-2">
                <FileText size={12} />
                <span>Executive Summary / Description</span>
              </label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 outline-none focus:border-blue-500/50 transition-all text-sm font-medium min-h-[120px] resize-none" 
                placeholder="Describe the core architecture and business value..."
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <Sparkles size={12} className="text-blue-500" />
                <span>AI-Powered Insights Enabled</span>
              </div>
              
              <button 
                disabled={loading || (!projectUrl && !description)} 
                className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Begin Assessment</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 glass-card p-8 rounded-[32px] border-white/5 text-center flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4 relative z-10">Neural Score</p>
                <div className="text-7xl font-bold font-jakarta bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent relative z-10">
                  {result.score ?? "—"}
                </div>
                <div className="mt-6 flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 relative z-10">
                  <TrendingUp size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">High Potential</span>
                </div>
              </div>

              <div className="lg:col-span-2 glass-card p-8 rounded-[32px] border-white/5 flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-blue-400 mb-4">
                  <BarChart3 size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">Executive Summary</span>
                </div>
                <p className="text-gray-300 leading-relaxed font-medium">
                  {result.summary}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-8 rounded-[32px] border-white/5 bg-emerald-500/[0.02]">
                <div className="flex items-center space-x-2 text-emerald-400 mb-6">
                  <CheckCircle2 size={18} />
                  <h4 className="text-sm font-black uppercase tracking-widest">Strategic Strengths</h4>
                </div>
                <ul className="space-y-4">
                  {(result.strengths || []).map((s: string, i: number) => (
                    <li key={i} className="flex items-start space-x-3 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="font-medium">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-8 rounded-[32px] border-white/5 bg-amber-500/[0.02]">
                <div className="flex items-center space-x-2 text-amber-400 mb-6">
                  <AlertTriangle size={18} />
                  <h4 className="text-sm font-black uppercase tracking-widest">Critical Risks</h4>
                </div>
                <ul className="space-y-4">
                  {(result.risks || []).map((s: string, i: number) => (
                    <li key={i} className="flex items-start space-x-3 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                      <span className="font-medium">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {result.recommendation && (
              <div className="glass-card p-8 rounded-[32px] border-blue-500/20 bg-blue-600/5">
                <div className="flex items-center space-x-2 text-blue-400 mb-3">
                  <Sparkles size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">Neural Recommendation</span>
                </div>
                <p className="text-blue-100/80 font-bold italic leading-relaxed">
                  "{result.recommendation}"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-400 text-sm font-medium"
        >
          <AlertTriangle size={18} />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
}

export default ProjectAssessor;

