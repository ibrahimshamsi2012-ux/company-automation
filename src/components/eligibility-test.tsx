"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Brain, Lock, AlertCircle, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const questions = [
  {
    q: "How would you handle a high-priority task with ambiguous instructions?",
    options: [
      "Wait for clarification",
      "Break it down into logical steps and ask specific questions",
      "Guess and execute immediately",
      "Delegate it to someone else"
    ],
    correct: 1
  },
  {
    q: "What is the primary goal of AI company automation?",
    options: [
      "Replacing all human employees",
      "Reducing operational costs by 100%",
      "Enhancing productivity and saving time on repetitive tasks",
      "Generating random emails"
    ],
    correct: 2
  },
  {
    q: "How should you respond to a security alert in the automation dashboard?",
    options: [
      "Ignore it if the system is still running",
      "Immediately disable all automations and investigate",
      "Wait for the weekly report",
      "Delete the log entry"
    ],
    correct: 1
  },
  {
    q: "Which data should NEVER be shared with the AI assistant?",
    options: [
      "Company mission statement",
      "Public website URLs",
      "Raw employee social security numbers or private passwords",
      "Meeting room names"
    ],
    correct: 2
  },
  {
    q: "What does a 'Neural Task' typically involve?",
    options: [
      "A simple Google search",
      "Multi-step reasoning and automated execution",
      "Typing a word document",
      "Sending a single email"
    ],
    correct: 1
  },
  {
    q: "How often should automation logs be reviewed?",
    options: [
      "Once a year",
      "Regularly to ensure accuracy and compliance",
      "Only when something breaks",
      "Never, AI is perfect"
    ],
    correct: 1
  },
  {
    q: "What is the benefit of the 7-day free trial?",
    options: [
      "Getting the app for free forever",
      "Testing enterprise features before committing to a plan",
      "Hacking the system",
      "Spamming other users"
    ],
    correct: 1
  },
  {
    q: "How does the AI Robot help in meetings?",
    options: [
      "It records everything for blackmail",
      "It provides real-time insights and automated responses",
      "It tells jokes to waste time",
      "It mutes all participants"
    ],
    correct: 1
  },
  {
    q: "What is the requirement to unlock full automation features?",
    options: [
      "Paying $1000",
      "A score of 7/10 on the eligibility test",
      "Being a CEO",
      "Using the app for 1 year"
    ],
    correct: 1
  },
  {
    q: "How is your data protected in this app?",
    options: [
      "It isn't protected",
      "Enterprise-grade encryption and privacy protocols",
      "It's stored on a public server",
      "By a simple password"
    ],
    correct: 1
  }
];

export default function EligibilityTest({ onComplete }: { onComplete: (passed: boolean) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleNext = () => {
    if (selectedOption === questions[currentStep].correct) {
      setScore(s => s + 1);
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(c => c + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const isPassed = score >= 7;

  return (
    <div className="fixed inset-0 z-[100] bg-[#030712]/95 backdrop-blur-xl flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full glass-card rounded-[40px] p-10 border-white/5 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
        
        {!showResult ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600/10 rounded-lg text-blue-500">
                  <Brain size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">AI Eligibility Protocol</span>
              </div>
              <span className="text-xs font-bold text-blue-400">Question {currentStep + 1} of {questions.length}</span>
            </div>

            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
              />
            </div>

            <h2 className="text-2xl font-bold font-jakarta text-white">
              {questions[currentStep].q}
            </h2>

            <div className="grid gap-3">
              {questions[currentStep].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={cn(
                    "w-full text-left p-5 rounded-2xl border transition-all duration-300 group",
                    selectedOption === idx 
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                      : "bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      selectedOption === idx ? "border-white bg-white/20" : "border-white/10 group-hover:border-white/30"
                    )}>
                      {selectedOption === idx && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="w-full py-5 bg-white text-black rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{currentStep === questions.length - 1 ? "Complete Verification" : "Continue"}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        ) : (
          <div className="text-center py-8 space-y-8">
            <div className={cn(
              "w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-2xl",
              isPassed ? "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10" : "bg-red-500/10 text-red-500 shadow-red-500/10"
            )}>
              {isPassed ? <ShieldCheck size={48} /> : <AlertCircle size={48} />}
            </div>

            <div>
              <h2 className="text-4xl font-bold font-jakarta mb-4">
                {isPassed ? "Protocol Authorized" : "Access Restricted"}
              </h2>
              <p className="text-gray-500 max-w-sm mx-auto">
                {isPassed 
                  ? `Congratulations. You scored ${score}/10. Your neural profile is compatible with our automation systems.`
                  : `Your score of ${score}/10 does not meet the 7/10 minimum requirement for AI safety protocols.`}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 inline-block">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-1">Final Score</span>
              <span className={cn(
                "text-5xl font-black",
                isPassed ? "text-emerald-500" : "text-red-500"
              )}>{score * 10}%</span>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => onComplete(isPassed)}
                className={cn(
                  "w-full py-5 rounded-2xl font-bold text-lg transition-all",
                  isPassed ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                {isPassed ? "Enter Command Center" : "Retake Protocol"}
              </button>
              {!isPassed && (
                <button 
                  onClick={() => window.location.href = '/'}
                  className="text-gray-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                >
                  Return to Home
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
