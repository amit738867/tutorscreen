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
  role?: string;
  interviewType?: string;
  techstack?: string[];
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
  role,
  interviewType,
  techstack,
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
        const isStaticTrack = targetId?.startsWith("tech-") || 
                             targetId?.startsWith("edu-") || 
                             targetId?.startsWith("fin-") || 
                             targetId?.startsWith("mkt-") || 
                             targetId?.startsWith("ext-") ||
                             targetId?.startsWith("t-");

        if (isStaticTrack) targetId = undefined;

        if (!targetId) {
          const newInterview = await createInterview({
            userId: userId,
            role: customParams?.role || role || "Interview Practice",
            type: customParams?.interviewType || interviewType || "Practice",
            techstack: customParams?.stack || techstack || ["General"],
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

    const tone = persona === "recruiter" ? "critical and demanding" : "professional yet supportive";
    
    if (customParams) {
      dynamicPersona = `You are an expert interviewer conducting a ${tone} ${customParams.interviewType} interview for a ${customParams.level} ${customParams.role} position. 
The focus is on the following tech stack/skills: ${customParams.stack.join(", ")}. 
Your goal is to evaluate ${userName}'s suitability for this specific role with a ${persona} mindset.`;
    } else if (role) {
      dynamicPersona = `You are an expert interviewer conducting a ${tone} ${interviewType || "Technical"} interview for a ${role} position. 
The focus is on the following tech stack/skills: ${techstack?.join(", ") || "General Knowledge"}. 
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
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary/60 backdrop-blur-3xl animate-in fade-in duration-700">
        <div className="absolute inset-0 bg-radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)" />
        
        <div className="relative space-y-12 text-center z-10 px-6">
          <div className="relative size-40 mx-auto rounded-[3rem] bg-bg-secondary border border-border-color flex items-center justify-center shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-accent/5 animate-pulse" />
            <div className="size-20 border-[8px] border-accent/10 border-t-accent rounded-full animate-spin shadow-lg" />
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[12px] font-black uppercase tracking-[0.5em] animate-pulse">
              AI Processing
            </div>
            <h2 className="text-7xl md:text-9xl font-black text-text-primary tracking-[calc(-0.05em)] leading-none uppercase italic">
              Evaluating <br />
              <span className="text-accent not-italic">Performance.</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto font-bold text-xl tracking-tight leading-relaxed opacity-60">
              Synchronizing session logs with pedagogical benchmarks...
            </p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="absolute bottom-20 w-full max-w-md px-10">
          <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden border border-border-color">
            <div className="h-full bg-accent animate-progress-fast" />
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-black text-text-secondary uppercase tracking-[0.4em] opacity-40">
            <span>Data Ingestion</span>
            <span>Finalizing Analysis</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-16">
      <div className="flex bg-bg-secondary p-1.5 rounded-2xl border border-border-color shadow-inner">
        <button 
          onClick={() => setMode("voice")} 
          className={cn("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300", 
          mode === "voice" ? "bg-accent text-white shadow-lg" : "text-text-secondary hover:text-text-primary")}
        >
          Voice Protocol
        </button>
        <button 
          onClick={() => setMode("text")} 
          className={cn("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300", 
          mode === "text" ? "bg-accent text-white shadow-lg" : "text-text-secondary hover:text-text-primary")}
        >
          Text Overlay
        </button>
      </div>

      <div className="text-center space-y-6 max-w-2xl">
        <div className="flex items-center justify-center gap-4">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
            <div className="size-2 bg-accent rounded-full animate-pulse" />
            Live Session
          </div>
          {callStatus === CallStatus.ACTIVE && (
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-bg-secondary border border-border-color text-text-secondary text-[10px] font-black uppercase tracking-[0.3em]">
              Question {questionCount} <span className="text-text-secondary/30 mx-1">/</span> {maxQuestions}
            </div>
          )}
        </div>
        <h1 className="text-6xl font-black text-text-primary tracking-tighter leading-none">
          Interview <span className="text-accent italic">Practice</span>
        </h1>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        <div className="bg-card-bg p-12 flex flex-col items-center justify-center space-y-10 border border-border-color rounded-[3rem] relative overflow-hidden group shadow-xl">
          <div className="relative size-44 rounded-full bg-bg-secondary border border-border-color flex items-center justify-center overflow-hidden shadow-inner">
            <div className={cn("relative z-10 size-24 rounded-full border-4 border-accent/20 flex items-center justify-center transition-all duration-700", callStatus === CallStatus.ACTIVE ? "bg-accent/10 scale-110 shadow-lg shadow-accent/10" : "bg-bg-primary")}>
              <Bot className={cn("size-12 transition-colors duration-500", callStatus === CallStatus.ACTIVE ? "text-accent" : "text-text-secondary/40")} />
            </div>
            {isSpeaking && <div className="absolute inset-0 border-[6px] border-accent/20 rounded-full animate-ping" />}
          </div>
          <h3 className="text-[11px] font-black text-text-primary tracking-[0.5em] uppercase">AI Intelligence</h3>
        </div>

        <div className="bg-card-bg p-12 flex flex-col items-center justify-center space-y-10 border border-border-color rounded-[3rem] group shadow-xl">
          {mode === "voice" ? (
            <>
              <div className="relative size-44 rounded-full bg-bg-secondary border border-border-color flex items-center justify-center overflow-hidden shadow-inner">
                <div className="relative z-10 size-24 rounded-full bg-bg-primary border border-border-color flex items-center justify-center shadow-lg">
                  <User className="size-12 text-text-secondary/40" />
                </div>
              </div>
              <h3 className="text-[11px] font-black text-text-primary tracking-[0.5em] uppercase">{userName}</h3>
            </>
          ) : (
            <div className="w-full h-full flex flex-col space-y-8">
               <textarea 
                value={textInput} 
                onChange={(e) => setTextInput(e.target.value)} 
                placeholder="Initialize response sequence..." 
                className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-secondary/30 resize-none font-bold text-lg leading-relaxed no-scrollbar" 
              />
               <button 
                onClick={handleSendText} 
                disabled={!textInput.trim() || callStatus !== CallStatus.ACTIVE} 
                className="w-full h-16 bg-accent hover:bg-accent/90 disabled:bg-bg-secondary disabled:text-text-secondary/30 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-[1.5rem] shadow-lg shadow-accent/20 transition-all duration-500"
              >
                Send Response
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Transcription Chat */}
      {messages.length > 0 && (
        <div className="w-full max-w-6xl bg-card-bg p-12 border border-border-color rounded-[3.5rem] space-y-10 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-border-color pb-6">
            <h3 className="text-[11px] font-black text-text-secondary uppercase tracking-[0.4em]">Protocol Transcription</h3>
            <div className="text-[9px] font-black text-accent uppercase tracking-[0.3em] bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20 shadow-sm">Active Log</div>
          </div>
          
          <div ref={scrollRef} className="max-h-[400px] overflow-y-auto space-y-8 pr-6 no-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-6 items-start animate-in fade-in slide-in-from-bottom-4 duration-500", m.role === "user" ? "flex-row-reverse" : "")}>
                <div className={cn("size-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-500", m.role === "user" ? "bg-bg-secondary text-text-secondary border border-border-color" : "bg-accent/10 text-accent border border-accent/20")}>
                  {m.role === "user" ? <User size={18} /> : <Bot size={18} />}
                </div>
                <div className={cn("flex-1 space-y-2", m.role === "user" ? "text-right" : "")}>
                  <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.4em] opacity-40">{m.role === "assistant" ? "AI Interviewer" : userName}</p>
                  <p className={cn("text-lg leading-relaxed font-bold tracking-tight transition-colors duration-500", m.role === "assistant" ? "text-text-primary" : "text-text-secondary")}>
                    {m.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pb-16">
        {callStatus !== CallStatus.ACTIVE ? (
          <button 
            onClick={handleCall} 
            disabled={callStatus === CallStatus.CONNECTING} 
            className={cn("px-16 py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[12px] transition-all duration-500 shadow-2xl hover:scale-[1.05] active:scale-95", 
            callStatus === CallStatus.CONNECTING ? "bg-bg-secondary text-text-secondary/30" : "bg-accent text-white hover:bg-accent/90 shadow-accent/20")}
          >
            {callStatus === CallStatus.CONNECTING ? "Connecting Protocol..." : "Initialize Practice"}
          </button>
        ) : (
          <button 
            onClick={handleDisconnect} 
            className="px-16 py-6 rounded-[2rem] font-black uppercase tracking-[0.4em] text-[12px] bg-rose-600 text-white hover:bg-rose-500 shadow-2xl shadow-rose-500/20 transition-all duration-500 hover:scale-[1.05] active:scale-95"
          >
            End Protocol
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;