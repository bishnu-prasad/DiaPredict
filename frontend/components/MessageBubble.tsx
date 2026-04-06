"use client";

import { motion } from "framer-motion";
import { User, Stethoscope, CheckCircle2, AlertTriangle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import clsx from "clsx";

export type MessageType = "text" | "loading" | "result" | "error";

export interface PredictionResult {
  risk_level: string;
  probability: number;
  formData?: Record<string, any>;
}

export interface MessageData {
  id: string;
  role: "ai" | "user";
  text?: string;
  type: MessageType;
  payload?: PredictionResult;
  createdAt: number;
}

interface MessageBubbleProps {
  msg: MessageData;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
  const { role, text, type, payload } = msg;
  const isAI = role === "ai";

  const renderContent = () => {
    if (type === "loading") {
      return (
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-accent" />
          <span className="font-bold text-slate-700 italic">Analyzing your clinical data...</span>
        </div>
      );
    }

    if (type === "error") {
      return (
        <div className="flex items-start gap-3 p-1 text-red-900">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <span className="font-bold leading-relaxed">{text || "An unexpected error occurred."}</span>
        </div>
      );
    }

    if (type === "result" && payload) {
      const riskLevel = payload.risk_level?.toLowerCase() || "low";
      const riskMapping = {
        low: { color: "border-green-500 bg-green-50 text-green-900 fill-green-500", icon: CheckCircle2 },
        moderate: { color: "border-orange-500 bg-orange-50 text-orange-900 fill-orange-500", icon: AlertTriangle },
        medium: { color: "border-orange-500 bg-orange-50 text-orange-900 fill-orange-500", icon: AlertTriangle },
        high: { color: "border-primary bg-blue-50 text-blue-900 fill-primary", icon: XCircle },
      };
      
      const config = riskMapping[riskLevel as keyof typeof riskMapping] || riskMapping.low;
      const Icon = config.icon;

      return (
        <div className={`p-6 rounded-2xl border-2 shadow-lg transition-all duration-500 ${config.color}`}>
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-current/10">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
              <Icon className="w-10 h-10" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">Stratification</div>
              <div className="text-3xl font-black capitalize italic underline underline-offset-4">
                {riskLevel} Risk
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/90 p-4 rounded-xl border border-current/5 shadow-sm text-slate-900">
              <span className="font-bold text-sm block mb-1">Probability Index</span>
              <span className="text-2xl font-black text-primary">{(payload.probability * 100).toFixed(2)}%</span>
            </div>

            <div className="bg-white/90 p-4 rounded-xl border border-current/5 shadow-sm text-slate-800">
              <span className="font-bold text-sm block mb-2">Key Diagnostic Inputs</span>
              <ul className="list-disc pl-5 space-y-1.5 font-bold text-[13px]">
                <li>HbA1c level: {payload.formData?.HbA1c_level || "N/A"}</li>
                <li>Glucose profile: {payload.formData?.blood_glucose_level || "N/A"}</li>
                <li>BMI index: {payload.formData?.bmi || "N/A"}</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return <div className="whitespace-pre-wrap">{text}</div>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={clsx(
        "flex w-full mt-4 space-x-3 max-w-4xl",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      {isAI && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center border border-slate-200 mt-1 shadow-sm">
          <Stethoscope className="w-5 h-5 text-accent" />
        </div>
      )}

      <div
        className={clsx(
          "px-5 py-3.5 rounded-2xl max-w-[85%] text-[16px] font-medium leading-relaxed shadow-sm transition-all duration-300",
          isAI
            ? type !== "text"
              ? "bg-white border border-slate-300 text-slate-900 shadow-sm"
              : "bg-white border border-slate-300 text-slate-800 shadow-sm"
            : "bg-primary text-white shadow-lg",
          isAI ? "rounded-bl-sm" : "rounded-br-sm"
        )}
      >
        {renderContent()}
      </div>

      {!isAI && (
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-sm mt-1">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </motion.div>
  );
}
