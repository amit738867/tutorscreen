"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { 
  createFeedback, 
  finalizeInterview,
  createInterview
} from "@/lib/actions/general.action";
import { Mic, Phone, PhoneOff, Loader2, Bot, User, Waves } from "lucide-react";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  ANALYZING = "ANALYZING",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  type: string;
  interviewId?: string;
  feedbackId?: string;
  questions?: string[];
  customParams?: any;
  persona?: string;
  voiceEnabled?: boolean;
}

const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "e4d746d5-8048-40ea-ab78-86abe4aea6fd";

const Agent = ({
  userName,
  userId,
  type,
  interviewId,
  feedbackId,
  questions,
  customParams,
  persona = "mentor",
  voiceEnabled = true,
}: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>(null);

  const maxQuestions = customParams?.amount || 5;

  // Initialize Vapi once
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    if (!token) return;

    try {
      const Vapi = require("@vapi-ai/web").default;
      const vapi = new Vapi(token);
      setVapiInstance(vapi);

      return () => {
        try { vapi.stop(); } catch (e) {}
      };
    } catch (e) {
      console.error("Vapi Init Error:", e);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callStatus === CallStatus.ACTIVE) {
      timer = setInterval(() => {
        setElapsedTime((prev) => {
          const next = prev + 1;
          if (next >= 150) setIsTimeUp(true); 
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  // Sync event listeners
  useEffect(() => {
    if (!vapiInstance) return;

    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setQuestionCount(1);
      setElapsedTime(0);
      setIsTimeUp(false);
    };
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: any) => {
      if (message?.type === "transcript" && message?.transcriptType === "final") {
        const newMessage: SavedMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev) => [...prev, newMessage]);

        if (message.role === "assistant") {
          setQuestionCount(prev => Math.min(prev + 1, maxQuestions));
          if (message.transcript.toLowerCase().includes("gathered enough information")) {
            setTimeout(() => { vapiInstance.stop(); }, 3000); 
          }
        }
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: any) => {
      console.error("Vapi Error:", error);
      if (callStatus !== CallStatus.ANALYZING) setCallStatus(CallStatus.INACTIVE);
    };

    vapiInstance.on("call-start", onCallStart);
    vapiInstance.on("call-end", onCallEnd);
    vapiInstance.on("message", onMessage);
    vapiInstance.on("speech-start", onSpeechStart);
    vapiInstance.on("speech-end", onSpeechEnd);
    vapiInstance.on("error", onError);

    return () => {
      vapiInstance.off("call-start", onCallStart);
      vapiInstance.off("call-end", onCallEnd);
      vapiInstance.off("message", onMessage);
      vapiInstance.off("speech-start", onSpeechStart);
      vapiInstance.off("speech-end", onSpeechEnd);
      vapiInstance.off("error", onError);
    };
  }, [vapiInstance, callStatus, maxQuestions]);

  const [feedbackTriggered, setFeedbackTriggered] = useState(false);

  useEffect(() => {
    const handleGenerateFeedback = async (msgs: SavedMessage[]) => {
      if (feedbackTriggered) return;
      setFeedbackTriggered(true);
      setCallStatus(CallStatus.ANALYZING);

      try {
        let targetId = interviewId;
        if (targetId?.startsWith("t-")) targetId = undefined;

        if (!targetId) {
          const newInterview = await createInterview({
            userId: userId,
            role: customParams?.role || "Interview Practice",
            type: customParams?.interviewType || "Practice",
            techstack: customParams?.stack || ["General"],
            questions: [] 
          });
          if (newInterview.success) targetId = newInterview.id;
        }

        await finalizeInterview(targetId!);
        const result = await createFeedback({
          interviewId: targetId!,
          userId: userId!,
          transcript: msgs,
        });

        // Always push to feedback page if we have a targetId
        if (targetId) {
          router.push(`/interview/${targetId}/feedback`);
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error("Feedback Generation Error:", err);
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED && !feedbackTriggered && messages.length >= 1) {
      handleGenerateFeedback(messages);
    } else if (callStatus === CallStatus.FINISHED && messages.length === 0) {
      router.push("/");
    }
  }, [messages, callStatus, interviewId, router, userId, feedbackTriggered, customParams]);

  const handleCall = async () => {
    if (!vapiInstance) return;
    setCallStatus(CallStatus.CONNECTING);

    const formattedQuestions = (questions?.length
      ? questions.map((q) => `- ${q}`).join("\n")
      : ""
    ).trim();

    let dynamicPersona = `You are a friendly and professional Interview Coach helping ${userName} practice for their upcoming interview.`;
    if (persona === "recruiter") {
      dynamicPersona = `You are a strict and highly critical Executive Recruiter interviewing ${userName}. You expect concise, high-impact answers and you will probe for weaknesses in their logic or experience.`;
    }

    if (customParams) {
      const tone = persona === "recruiter" ? "critical and demanding" : "professional yet supportive";
      dynamicPersona = `You are an expert interviewer conducting a ${tone} ${customParams.interviewType} interview for a ${customParams.level} ${customParams.role} position. 
The focus is on the following tech stack/skills: ${customParams.stack.join(", ")}. 
Your goal is to evaluate ${userName}'s suitability for this specific role with a ${persona} mindset.`;
    }

    try {
      await vapiInstance.start(ASSISTANT_ID, {
        variableValues: {
          questions: formattedQuestions,
          username: userName,
          userid: userId,
        },
        model: {
          provider: "openai",
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `${dynamicPersona}
CORE RULES:
- Ask only one question at a time.
- You must ask exactly ${maxQuestions} questions total.
- Maintain a ${persona === "recruiter" ? "formal and analytical" : "natural and conversational"} tone.
- Ensure questions are relevant to the role.

INTERVIEW CLOSURE:
- When done, say exactly: "Thank you for the session! I have gathered enough information to provide your feedback. You can view your results in the dashboard now. Have a great day!"`
            }
          ]
        }
      });
      if (!voiceEnabled) vapiInstance.setMuted(true);
    } catch (err) {
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    try { vapiInstance.stop(); } catch (e) {}
  };

  const [textInput, setTextInput] = useState("");
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendText = () => {
    if (!textInput.trim() || !vapiInstance) return;
    const newMessage: SavedMessage = { role: "user", content: textInput };
    setMessages((prev) => [...prev, newMessage]);
    vapiInstance.send({ type: "add-message", message: { role: "user", content: textInput } });
    setTextInput("");
  };

  if (callStatus === CallStatus.ANALYZING) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8">
        <div className="relative size-32 rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center">
          <div className="size-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        </div>
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">Analyzing Performance</h2>
          <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">Evaluating your performance against industry benchmarks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12">
      <div className="flex bg-slate-800 p-1 rounded-xl border border-white/5">
        <button onClick={() => setMode("voice")} className={cn("px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all", mode === "voice" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300")}>Voice Protocol</button>
        <button onClick={() => setMode("text")} className={cn("px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all", mode === "text" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300")}>Text Overlay</button>
      </div>

      <div className="text-center space-y-4 max-w-2xl">
        <div className="flex items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Live Session
          </div>
          {callStatus === CallStatus.ACTIVE && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest">
              Question {questionCount} <span className="text-slate-600">of</span> {maxQuestions}
            </div>
          )}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Interview <span className="text-emerald-500 italic">Practice</span></h1>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="glass-card p-10 flex flex-col items-center justify-center space-y-8 border-white/5 relative overflow-hidden group">
          <div className="relative size-40 rounded-full bg-slate-900 border border-emerald-500/20 flex items-center justify-center overflow-hidden">
            <div className={cn("relative z-10 size-20 rounded-full border-2 border-emerald-500/30 flex items-center justify-center transition-all duration-700", callStatus === CallStatus.ACTIVE ? "bg-emerald-500/10 scale-110" : "bg-slate-800")}>
              <Bot className={cn("size-10 transition-colors", callStatus === CallStatus.ACTIVE ? "text-emerald-500" : "text-slate-600")} />
            </div>
            {isSpeaking && <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full animate-ping" />}
          </div>
          <h3 className="text-xl font-bold text-white tracking-widest uppercase">AI Intelligence</h3>
        </div>

        <div className="glass-card p-10 flex flex-col items-center justify-center space-y-8 border-white/5 group">
          {mode === "voice" ? (
            <>
              <div className="relative size-40 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center overflow-hidden">
                <div className="relative z-10 size-20 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center shadow-xl">
                  <User className="size-10 text-slate-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white tracking-widest uppercase">{userName}</h3>
            </>
          ) : (
            <div className="w-full h-full flex flex-col space-y-6">
               <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Type your response..." className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-700 resize-none font-medium leading-relaxed" />
               <button onClick={handleSendText} disabled={!textInput.trim() || callStatus !== CallStatus.ACTIVE} className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl">Send Response</button>
            </div>
          )}
        </div>
      </div>

      {/* Transcription Chat */}
      {messages.length > 0 && (
        <div className="w-full max-w-5xl glass-card p-8 border-white/5 space-y-6 bg-slate-950/30">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Protocol Transcription</h3>
            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">Active Log</div>
          </div>
          
          <div ref={scrollRef} className="max-h-[300px] overflow-y-auto space-y-6 pr-4 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2 duration-300", m.role === "user" ? "flex-row-reverse" : "")}>
                <div className={cn("size-8 rounded-lg flex items-center justify-center flex-shrink-0", m.role === "user" ? "bg-slate-800 text-slate-400" : "bg-emerald-500/10 text-emerald-500")}>
                  {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={cn("flex-1 space-y-1", m.role === "user" ? "text-right" : "")}>
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{m.role === "assistant" ? "AI Interviewer" : userName}</p>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">{m.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pb-12">
        {callStatus !== CallStatus.ACTIVE ? (
          <button onClick={handleCall} disabled={callStatus === CallStatus.CONNECTING} className={cn("px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] transition-all", callStatus === CallStatus.CONNECTING ? "bg-slate-800 text-slate-500" : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-2xl")}>
            {callStatus === CallStatus.CONNECTING ? "Connecting..." : "Start Practice"}
          </button>
        ) : (
          <button onClick={handleDisconnect} className="px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] bg-rose-600 text-white hover:bg-rose-500 shadow-2xl">End Session</button>
        )}
      </div>
    </div>
  );
};

export default Agent;