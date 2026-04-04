"use client";

import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface InputBoxProps {
  onSend: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
  focusTrigger?: number;
  chips?: string[];
  error?: string | null;
}

export function InputBox({ onSend, disabled, placeholder = "Type your answer...", focusTrigger, chips = [], error }: InputBoxProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, focusTrigger, error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleChipClick = (chipValue: string) => {
    if (!disabled) {
      onSend(chipValue);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-12 pt-4 bg-background z-20 flex flex-col gap-4">
      {/* Suggestion Chips */}
      <AnimatePresence>
        {chips.length > 0 && !disabled && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {chips.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="bg-white border border-secondary text-slate-900 hover:bg-slate-50 hover:border-primary px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98] hover:scale-[1.02] duration-300"
              >
                {chip}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <form
          onSubmit={handleSubmit}
          className={clsx(
            "relative flex items-center w-full bg-white rounded-xl shadow-md transition-all duration-300",
            error ? "border-2 border-primary shadow-primary/10" : "border border-slate-200 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary focus-within:shadow-lg"
          )}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={disabled}
            placeholder={disabled ? "AI is processing..." : placeholder}
            className="flex-1 bg-transparent py-5 pl-7 pr-16 outline-none text-[17px] font-medium text-slate-900 placeholder-slate-400 disabled:opacity-50"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="absolute right-3 p-3 rounded-full bg-primary text-white disabled:bg-slate-300 disabled:text-white transition-all hover:bg-primary/95 active:scale-[0.98] hover:scale-[1.02] duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Error Text */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-7 pt-3"
            >
              <p className="text-sm font-bold text-primary tracking-tight">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
