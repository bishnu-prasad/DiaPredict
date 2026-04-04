"use client";

import { motion } from "framer-motion";
import { Stethoscope } from "lucide-react";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex w-full mt-4 space-x-3 max-w-4xl justify-start"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm mt-1">
        <Stethoscope className="w-4 h-4 text-blue-600" />
      </div>

      <div className="px-5 py-4 rounded-2xl rounded-bl-none text-[15px] bg-white border border-slate-200 shadow-sm flex items-center space-x-1.5 h-[50px]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 rounded-full bg-slate-400"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-slate-400"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-slate-400"
        />
      </div>
    </motion.div>
  );
}
