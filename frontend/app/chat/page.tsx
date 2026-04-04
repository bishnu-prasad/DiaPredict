"use client";

import { ChatContainer } from "../../components/ChatContainer";
import { Stethoscope } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 flex flex-col font-sans selection:bg-blue-200">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-800 text-[17px] tracking-tight leading-tight flex items-center gap-2">
                DiaPredict
                <span className="px-2 py-0.5 rounded-full bg-blue-100/50 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200/50 mt-[1px]">AI DOCTOR</span>
              </h1>
            </div>
          </Link>
          <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            Secure & Private
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <ChatContainer />
    </main>
  );
}
