"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain } from "lucide-react";
import { useState, useEffect } from "react";

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-[#030712] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-600/20 rounded-full blur-[120px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-600/20 rounded-full blur-[120px]" 
            />
          </div>

          <div className="relative flex flex-col items-center">
            {/* Pulsing Avatar Hexagon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-32 h-32 mb-8"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-blue-500/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-purple-500/20 rounded-full"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 relative overflow-hidden group">
                  <motion.div
                    animate={{ 
                      y: [0, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Brain className="text-white" size={40} />
                  </motion.div>
                  <motion.div 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  />
                </div>
              </div>

              {/* Orbiting Particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <div 
                    className="w-2 h-2 bg-blue-400 rounded-full blur-[2px]"
                    style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: i === 0 ? '-4px' : i === 1 ? '100%' : '50%',
                      marginTop: i === 2 ? '-4px' : '0'
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="flex items-center space-x-2 justify-center mb-2">
                <Sparkles size={16} className="text-blue-400" />
                <h2 className="text-2xl font-bold font-jakarta tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                  AI Automate
                </h2>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                Initializing Neural Framework
              </p>
            </motion.div>

            {/* Loading Bar */}
            <div className="w-48 h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
