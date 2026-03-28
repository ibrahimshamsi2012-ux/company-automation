"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mail, 
  Zap, 
  MessageSquare, 
  Video, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Globe,
  Cpu,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "AI Email Orchestrator",
    description: "Intelligent spam filtering and automated inbox organization with neural summarization.",
    icon: Mail,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Neural Task Engine",
    description: "Transform natural language instructions into complex multi-step automated workflows.",
    icon: Zap,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    title: "Omnichannel AI Support",
    description: "Real-time voice and text assistance with human-like reasoning and robot-voice capabilities.",
    icon: MessageSquare,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Smart Meeting Suite",
    description: "Enterprise-grade livestreams and meetings with real-time AI transcription and insights.",
    icon: Video,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  }
];

const stats = [
  { label: "Tasks Automated", value: "2M+" },
  { label: "Time Saved", value: "500k hrs" },
  { label: "Company Users", value: "10k+" },
  { label: "AI Accuracy", value: "99.9%" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-none bg-[#030712]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight font-jakarta">AI Automate</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#stats" className="hover:text-white transition-colors">Enterprise</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-sm font-medium hover:text-blue-400 transition-colors">
              Sign In
            </Link>
            <Link 
              href="/dashboard" 
              className="px-6 py-2.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-all transform active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card mb-8"
          >
            <Sparkles size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-100">AI-Powered Enterprise Solutions</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-8xl font-extrabold font-jakarta mb-8 leading-[1.1] tracking-tight"
          >
            Scale Your Operations <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              With Neural Intelligence
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Automate complex business processes in minutes, not weeks. 
            The all-in-one AI platform for modern companies.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all hover:shadow-2xl hover:shadow-blue-500/40 flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight size={20} />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 glass-card rounded-full font-bold text-lg hover:bg-white/10 transition-all">
              Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold font-jakarta mb-2">{stat.value}</div>
              <div className="text-gray-500 text-sm font-medium uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-[#030712]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-jakarta mb-6">Designed for Modern Teams</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built with precision, powered by the world's most advanced AI models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="glass-card p-10 rounded-[32px] group"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110", feature.bg, feature.color)}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold font-jakarta mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg mb-8">
                  {feature.description}
                </p>
                <div className="flex items-center text-sm font-bold text-blue-400 cursor-pointer group-hover:translate-x-2 transition-transform">
                  <span>Learn More</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-32 px-6">
        <div className="max-w-5xl mx-auto glass-card rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <Globe size={300} />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold font-jakarta mb-8 leading-tight">
              Ready to automate <br /> your business?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
              Join the future of company management. Start your 7-day free trial today. 
              Only $20/month after.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center space-x-3 text-gray-300">
                <CheckCircle2 className="text-emerald-500" size={20} />
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <CheckCircle2 className="text-emerald-500" size={20} />
                <span className="font-medium">Cancel anytime</span>
              </div>
            </div>
            <Link 
              href="/dashboard"
              className="mt-12 inline-flex px-12 py-5 bg-white text-black rounded-full font-bold text-xl hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#030712]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="text-blue-500" size={24} />
              <span className="text-2xl font-bold tracking-tight font-jakarta">AI Automate</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">
              The professional automation platform for modern enterprises. 
              Powering the next generation of efficient companies.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
          © 2026 AI Automate. All rights reserved. Professional automation for professional teams.
        </div>
      </footer>
    </div>
  );
}
