"use client";

import Link from "next/link";
import { ArrowRight, Brain, Zap, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import clsx from "clsx";

const DEMO_SEQUENCE = [
  { role: "ai", text: "Let's evaluate your diabetes risk.\nWhat is your age?" },
  { role: "user", text: "45" },
  { role: "ai", text: "Do you have hypertension?" },
  { role: "user", text: "Yes" },
  { role: "ai", text: "Analyzing your data...", isTyping: true },
  { role: "ai", text: "You are at Moderate Risk", isResult: true }
];

function StaticChatDemo() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (msgIndex < DEMO_SEQUENCE.length - 1) {
      const isTypingPhase = DEMO_SEQUENCE[msgIndex].isTyping;
      const timeout = setTimeout(() => {
        setMsgIndex(m => m + 1);
      }, isTypingPhase ? 1500 : 1000);
      return () => clearTimeout(timeout);
    }
  }, [msgIndex]);

  const visibleMessages = DEMO_SEQUENCE.slice(0, msgIndex);
  if (msgIndex < DEMO_SEQUENCE.length && DEMO_SEQUENCE[msgIndex].isTyping && msgIndex !== 0) {
    visibleMessages.push(DEMO_SEQUENCE[msgIndex]);
  } else if (msgIndex < DEMO_SEQUENCE.length && msgIndex !== 0) {
     visibleMessages.push(DEMO_SEQUENCE[msgIndex]);
  } else if (msgIndex === 0) {
     visibleMessages.push(DEMO_SEQUENCE[0]);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 w-full max-w-[420px] h-[480px] flex flex-col relative overflow-hidden">
      <div className="flex-1 flex flex-col justify-end space-y-5 relative z-10 no-scrollbar">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleMessages.map((msg, i) => {
            const isUser = msg.role === "user";
            
            if (msg.isTyping && msgIndex === i) {
               return (
                 <motion.div 
                   key={`typing-${i}`}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.98 }}
                   transition={{ duration: 0.4, ease: "easeInOut" }}
                   className="flex justify-start w-full"
                 >
                   <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center space-x-1 min-h-[46px]">
                     <span className="font-bold text-slate-400 tracking-widest text-xl leading-none -mt-2">...</span>
                   </div>
                 </motion.div>
               )
            }

            return (
              <motion.div 
                key={i}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className={clsx("flex w-full", isUser ? "justify-end" : "justify-start")}
              >
                <div className={clsx(
                  "px-5 py-3.5 rounded-2xl text-[16px] font-medium leading-relaxed max-w-[85%] whitespace-pre-wrap shadow-sm",
                  isUser 
                    ? "bg-primary text-white rounded-br-sm" 
                     : msg.isResult 
                       ? "bg-white border-2 border-primary/20 text-slate-800 rounded-bl-sm shadow-md"
                       : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                )}>
                  {msg.isResult ? (
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      {msg.text}
                    </div>
                  ) : msg.text}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-secondary/50 transition-all font-medium">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold tracking-tight text-slate-900 text-xl">DiaPredict</span>
          <div className="hidden md:flex items-center space-x-8 text-slate-700">
            <a href="#features" className="relative group overflow-hidden transition-colors hover:text-slate-900">
              Features
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </a>
            <a href="#how-it-works" className="relative group overflow-hidden transition-colors hover:text-slate-900">
              How it works
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </a>
            <a href="#connect" className="relative group overflow-hidden transition-colors hover:text-slate-900">
              Connect
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </a>
          </div>
          <Link href="/chat" className="bg-primary text-white font-bold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg hover:bg-accent transition-all duration-300 hover:scale-[1.05] active:scale-[0.97]">
            Start Chat
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-32 flex flex-col md:flex-row items-center justify-between gap-16 relative">
        <div className="flex-1 space-y-8 z-10 text-center md:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-5xl md:text-[64px] font-extrabold tracking-tight text-slate-900 leading-[1.1]"
          >
            Chat with an AI Health Assistant for Diabetes Risk Analysis
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeInOut" }}
            className="text-lg md:text-xl text-slate-700 max-w-xl mx-auto md:mx-0 leading-relaxed font-medium"
          >
            Interact with an intelligent AI assistant that guides you step-by-step, analyzes your health data, and delivers instant diabetes risk insights.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
            className="flex flex-col sm:flex-row items-center gap-5 justify-center md:justify-start"
          >
            <Link href="/chat" className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold shadow-md hover:shadow-lg hover:bg-accent transition-all duration-300 hover:scale-[1.05] active:scale-[0.97] w-full sm:w-auto justify-center">
              Start Assessment <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how-it-works" className="font-semibold text-slate-900 transition-colors underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-accent duration-300 py-3.5">
              Learn More
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
          className="flex-1 w-full max-w-[450px] flex justify-center md:justify-end"
        >
          <StaticChatDemo />
        </motion.div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-32 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">How it works</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle2, title: "Enter Health Data", desc: "Start a quick assessment inputting 8 core vitals." },
              { icon: Brain, title: "AI Analysis", desc: "Our platform processes data instantly and securely." },
              { icon: Zap, title: "Get Instant Result", desc: "Receive immediate mapped risk stratification and insights." }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: "easeInOut" }}
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ translateY: -4 }}
                className="p-8 rounded-2xl bg-white shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-accent/10">
                  <f.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-700 font-medium text-[16px] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="connect" className="py-20 px-6 text-center border-t border-secondary/30">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <span className="font-bold tracking-tight text-slate-900 text-xl mb-8">Connect</span>
          
          <div className="flex items-center gap-8 mb-12">
            <a href="https://github.com/bishnu-prasad" target="_blank" rel="noreferrer" className="flex items-center justify-center text-slate-800 font-semibold underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-primary transition-all duration-300">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/bishnuprasad-tripathy" target="_blank" rel="noreferrer" className="flex items-center justify-center text-slate-800 font-semibold underline underline-offset-4 decoration-2 decoration-transparent hover:decoration-primary transition-all duration-300">
              LinkedIn
            </a>
          </div>

          <p className="text-sm text-slate-600 font-medium">
             © {new Date().getFullYear()} DiaPredict · Engineered with precision.
          </p>
        </div>
      </footer>
    </div>
  );
}