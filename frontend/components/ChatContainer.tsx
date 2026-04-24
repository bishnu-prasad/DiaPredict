"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { MessageBubble, type MessageData, type PredictionResult } from "./MessageBubble";
import { InputBox } from "./InputBox";
import { TypingIndicator } from "./TypingIndicator";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Edit2, Activity } from "lucide-react";

const STORAGE_KEY = "dia_state_pro_v2";

// 1 -> gender, 2 -> age, 3 -> hypertension, 4 -> heart_disease, 5 -> bmi, 6 -> HbA1c, 7 -> glucose, 8 -> smoking
const STEPS = [
  { id: "gender", q: "Let's start! What is your gender?", chips: ["Male", "Female"] },
  { id: "age", q: "How old are you? (1–120)", chips: [] },
  { id: "hypertension", q: "Do you have hypertension (high blood pressure)?", chips: ["Yes", "No"] },
  { id: "heart_disease", q: "Do you have any heart disease history?", chips: ["Yes", "No"] },
  { id: "bmi", q: "What is your BMI? (10–60)", chips: [] },
  { id: "HbA1c_level", q: "What is your HbA1c level? (3–15)", chips: [] },
  { id: "blood_glucose_level", q: "What is your blood glucose level? (50–300)", chips: [] },
  { id: "smoking_history", q: "What is your smoking history?", chips: ["never", "former", "current", "not current"] },
];

export function ChatContainer() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // SAFE RESTORE LOGIC (DEFENSIVE)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const rawMessages = Array.isArray(parsed.messages) ? parsed.messages : [];
          // Verify messages are serializable and follow the new v2 schema
          const cleanMessages = rawMessages.filter((m: MessageData) => m && m.id && m.role);
          
          setMessages(cleanMessages);
          setCurrentStep(Number(parsed.currentStep) || 0);
          setFormData(parsed.formData || {});
          setHasStarted(Boolean(parsed.hasStarted));
          
          if (Number(parsed.currentStep) >= STEPS.length || cleanMessages.some(m => m.type === "result")) {
            setIsComplete(true);
          }
        }
      }
    } catch (e) {
      console.error("Corrupted storage, resetting...", e);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // SAFE SERIALIZATION LAYER
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    try {
      // Force serialization check - should contain NO JSX, NO any, NO functions
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        messages,
        currentStep,
        formData,
        hasStarted
      }));
      console.log("Saving messages:", messages);
    } catch (error) {
      console.error("Storage save failed:", error);
    }
  }, [messages, currentStep, formData, hasStarted, isLoaded]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, hasStarted, inputError, isLoading]);

  const handleRestart = () => {
    if (window.confirm("Are you sure you want to restart your assessment? This will clear your current progress.")) {
      localStorage.removeItem(STORAGE_KEY);
      setMessages([]);
      setCurrentStep(0);
      setFormData({});
      setHasStarted(false);
      setIsComplete(false);
      setIsTyping(false);
      setIsLoading(false);
      setInputError(null);
    }
  };

  const handleEditLast = () => {
    if (messages.length === 0 || isTyping || isLoading || !hasStarted) return;
    
    let lastUserIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    setMessages(prev => prev.slice(0, lastUserIndex));
    const newStep = Math.max(0, currentStep - 1);
    setCurrentStep(newStep);
    
    const newForm = { ...formData };
    delete newForm[STEPS[newStep].id];
    setFormData(newForm);
    setIsComplete(false);
    setInputError(null);
    setFocusTrigger(p => p + 1);
  };

  const startAssessment = () => {
    setHasStarted(true);
    setIsTyping(true);
    setTimeout(() => {
      setMessages([
        { 
          id: uuid(),
          role: "ai", 
          text: "Hello! I am DiaPredict AI.\nLet's evaluate your clinical profile strictly.",
          type: "text",
          createdAt: Date.now()
        },
        { 
          id: uuid(),
          role: "ai", 
          text: STEPS[0].q,
          type: "text",
          createdAt: Date.now()
        }
      ]);
      setIsTyping(false);
      setFocusTrigger(prev => prev + 1);
    }, 800);
  };

  const handleSend = async (rawText: string) => {
    if (!rawText.trim() || !hasStarted || isComplete || isTyping || isLoading) return;
    
    setInputError(null);
    const text = rawText.trim();
    const lowerText = text.toLowerCase();
    
    // Strict Step-Based Validation BEFORE API / State Update
    let isValid = false;
    let parsedValue: any = null;
    let explicitError = "Please enter a valid value.";
    
    const stepDef = STEPS[currentStep];
    const stepId = stepDef.id;

    if (stepId === "gender") {
      if (lowerText === "female" || lowerText === "f") { isValid = true; parsedValue = 0; }
      else if (lowerText === "male" || lowerText === "m") { isValid = true; parsedValue = 1; }
      else explicitError = "Please identify as Male or Female.";
    } 
    else if (stepId === "hypertension" || stepId === "heart_disease") {
      if (lowerText === "yes" || lowerText === "y") { isValid = true; parsedValue = 1; }
      else if (lowerText === "no" || lowerText === "n") { isValid = true; parsedValue = 0; }
      else explicitError = "Please answer with Yes or No.";
    } 
    else if (stepId === "smoking_history") {
      const validT = ["never", "former", "current", "not current"];
      if (validT.includes(lowerText)) { isValid = true; parsedValue = lowerText; }
      else explicitError = "Valid: never, former, current, or not current.";
    } 
    else {
      const num = Number(text);
      if (!isNaN(num)) {
        if (stepId === "age" && num >= 1 && num <= 120) { isValid = true; parsedValue = num; }
        else if (stepId === "bmi" && num >= 10 && num <= 60) { isValid = true; parsedValue = num; }
        else if (stepId === "HbA1c_level" && num >= 3 && num <= 15) { isValid = true; parsedValue = num; }
        else if (stepId === "blood_glucose_level" && num >= 50 && num <= 300) { isValid = true; parsedValue = num; }
        else explicitError = `Range Error: ${stepId.replace(/_/g, " ")} must be ${STEPS[currentStep].q.split("(")[1].split(")")[0]}`;
      } else explicitError = "Please enter a valid number.";
    }

    if (!isValid) {
       setInputError(explicitError);
       setFocusTrigger(p => p + 1);
       return;
    }

    // Input Accepted
    const userMsgId = uuid();
    setMessages(prev => [...prev, { 
      id: userMsgId,
      role: "user", 
      text: text,
      type: "text",
      createdAt: Date.now()
    }]);
    
    const nextFormData = { ...formData, [stepId]: parsedValue };
    setFormData(nextFormData);

    if (currentStep + 1 < STEPS.length) {
      setIsTyping(true);
      setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setMessages(prev => [...prev, { 
          id: uuid(),
          role: "ai", 
          text: STEPS[nextStep].q,
          type: "text",
          createdAt: Date.now()
        }]);
        setIsTyping(false);
        setFocusTrigger(p => p + 1);
      }, 600);
    } else {
      // PREDICTION TIME
      setIsComplete(true);
      performPrediction(nextFormData);
    }
  };

  const performPrediction = async (payload: any) => {
    setIsLoading(true);
    const loadingId = uuid();
    setMessages(prev => [...prev, { 
      id: loadingId,
      role: "ai", 
      type: "loading",
      createdAt: Date.now()
    }]);

    console.log("Payload Prepared:", payload);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${API_URL}/predict`, payload);
      const result: PredictionResult = response.data;

      setMessages(prev => {
        const filtered = prev.filter(m => m.type !== "loading");
        return [
          ...filtered,
          {
            id: uuid(),
            role: "ai",
            type: "result",
            payload: { ...result, formData: payload },
            createdAt: Date.now()
          }
        ];
      });
    } catch (error: any) {
      console.error("Backend error:", error.response?.data);
      
      let errorMsg = "Something went wrong. Please try again.";
      if (!error.response) {
        errorMsg = "Cannot connect to server. Start backend.";
      } else if (error.response.status === 422) {
        errorMsg = "Invalid input values. Check ranges.";
      } else if (error.response.status === 500) {
        errorMsg = "Server error. Try again.";
      }

      setMessages(prev => {
        const filtered = prev.filter(m => m.type !== "loading");
        return [...filtered, {
          id: uuid(),
          role: "ai",
          type: "error",
          text: errorMsg,
          createdAt: Date.now()
        }];
      });
      setIsComplete(false); // Allow them to reset or try again
    } finally {
      setIsLoading(false);
      setFocusTrigger(p => p + 1);
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-w-4xl mx-auto w-full relative">
      <AnimatePresence>
        {hasStarted && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-0 right-0 z-30 flex justify-center gap-5 pointer-events-none"
          >
            <button 
              onClick={handleRestart}
              className="pointer-events-auto flex items-center gap-2 bg-white px-5 py-2.5 rounded-full text-[14px] font-black text-slate-800 border border-slate-200 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] duration-300"
            >
              <RotateCcw className="w-4 h-4" /> Reset Chat
            </button>
            {!isComplete && currentStep > 0 && messages.some(m => m.role === "user") && (
              <button 
                onClick={handleEditLast}
                disabled={isTyping || isLoading}
                className="pointer-events-auto flex items-center gap-2 bg-white px-5 py-2.5 rounded-full text-[14px] font-black text-slate-800 border border-slate-200 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 disabled:opacity-50"
              >
                <Edit2 className="w-4 h-4" /> Edit Previous
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto px-6 py-28 space-y-1 no-scrollbar scroll-smooth">
        {!hasStarted && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, ease: "easeInOut" }}
             className="flex flex-col items-center justify-center h-full text-center p-10 space-y-8"
           >
             <div className="p-8 bg-white border border-slate-100 shadow-xl rounded-3xl">
               <Activity className="w-12 h-12 text-primary" />
             </div>
             <div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4 text-center">Clinical Prediction Core</h2>
               <p className="text-slate-700 max-w-sm mx-auto font-bold text-lg leading-relaxed text-center">Provide 8 clinical parameters for an instant diabetes risk stratification score.</p>
             </div>
             <button onClick={startAssessment} className="bg-primary text-white font-black flex items-center gap-3 px-10 py-5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30">
               Launch Assessment <Play className="w-5 h-5 fill-current" />
             </button>
           </motion.div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} />
        ))}
        {isTyping && <TypingIndicator />}
        
        <div ref={endOfMessagesRef} className="h-12" />
      </div>

      <AnimatePresence>
        {hasStarted && !isComplete && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
             <InputBox 
               onSend={handleSend} 
               disabled={isTyping || isLoading} 
               focusTrigger={focusTrigger} 
               error={inputError}
               chips={messages.length > 0 && !isTyping && !isLoading && messages[messages.length-1].role !== "user" ? STEPS[currentStep]?.chips || [] : []}
             />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
