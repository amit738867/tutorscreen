import React from 'react'
import dayjs from "dayjs"
import { Button } from "./ui/button"
import Link from "next/link"
import { Calendar, ChevronRight, Zap, Target } from "lucide-react"

const InterviewCard = ({ 
  interviewId, 
  userId, 
  role, 
  type, 
  techstack, 
  createdAt,
  feedback
}: InterviewCardProps & { feedback?: any }) => {
  const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM D, YYYY");
  
  const hasFeedback = !!feedback;
  const statusColor = hasFeedback 
    ? feedback.totalScore >= 80 ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" : 
      feedback.totalScore >= 60 ? "text-amber-500 bg-amber-500/10 border-amber-500/20" : "text-rose-500 bg-rose-500/10 border-rose-500/20"
    : "text-slate-500 bg-slate-500/5 border-white/5";
  
  const statusText = hasFeedback 
    ? feedback.totalScore >= 80 ? "Exemplary" : 
      feedback.totalScore >= 60 ? "Competent" : "Needs Review"
    : "Available Protocol";

  return (
    <div className="group relative bg-slate-950/40 border border-white/5 p-10 rounded-[2.5rem] transition-all duration-700 hover:bg-slate-900/40 hover:border-emerald-500/20 hover:-translate-y-2 flex flex-col gap-10 overflow-hidden shadow-2xl">
      {/* Subtle Glow Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
      
      <div className="flex flex-col gap-6 relative z-10">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] border w-fit ${statusColor}`}>
          <div className={`size-1.5 rounded-full animate-pulse ${hasFeedback ? "bg-current" : "bg-slate-600"}`} />
          {statusText}
        </div>
        
        <div className="space-y-3">
          <h3 className="text-3xl font-bold text-white tracking-tight leading-tight group-hover:text-emerald-400 transition-colors duration-500">
            {role}
          </h3>
          <div className="flex items-center gap-2 text-slate-500">
             <Target size={14} className="text-emerald-500/50" />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{type} Module</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 relative z-10 border-t border-white/5 pt-8 mt-auto">
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold flex items-center gap-2">
               <Calendar size={12} /> Last Active
            </p>
            <p className="text-xs font-medium text-slate-400 tabular-nums">{formattedDate}</p>
          </div>
          
          {hasFeedback && (
            <div className="text-right space-y-1">
               <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">Protocol Score</p>
               <p className="text-2xl font-black text-white tracking-tighter">
                 {feedback.totalScore}<span className="text-xs text-slate-500 ml-0.5">%</span>
               </p>
            </div>
          )}
        </div>

        <Button 
          asChild
          className={`w-full h-14 rounded-[1.5rem] text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 group/btn ${
            hasFeedback 
              ? "bg-slate-900 hover:bg-emerald-600 text-white border border-white/5 hover:border-emerald-500 shadow-xl" 
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_10px_30px_-5px_rgba(16,185,129,0.3)]"
          }`}
        >
          <Link href={feedback 
            ? `/interview/${interviewId}/feedback`
            : `/interview/${interviewId}`}
            className="flex items-center justify-center gap-2"
          >
              {feedback ? "Review Evaluation" : "Initiate Session"}
              <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default InterviewCard;