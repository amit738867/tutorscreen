import React from 'react'
import dayjs from "dayjs"
import { Button } from "./ui/button"
import Link from "next/link"
import { Calendar, ChevronRight, Target } from "lucide-react"

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
    ? feedback.totalScore >= 80 ? "text-emerald-600 bg-emerald-50 dark:text-emerald-500 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : 
      feedback.totalScore >= 60 ? "text-amber-600 bg-amber-50 dark:text-amber-500 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" : "text-rose-600 bg-rose-50 dark:text-rose-500 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20"
    : "text-text-secondary bg-bg-secondary border-border-color";
  
  const statusText = hasFeedback 
    ? feedback.totalScore >= 80 ? "Exemplary" : 
      feedback.totalScore >= 60 ? "Competent" : "Needs Review"
    : "Available Protocol";

  return (
    <div className="group relative bg-card-bg border border-border-color p-10 rounded-[2.5rem] transition-all duration-500 hover:shadow-xl dark:hover:shadow-accent/5 hover:-translate-y-1 flex flex-col gap-10 overflow-hidden shadow-sm">
      {/* Subtle Glow Background - Dark Mode Only */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[80px] -mr-16 -mt-16 opacity-0 dark:opacity-100 transition-opacity" />
      
      <div className="flex flex-col gap-6 relative z-10">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] border w-fit ${statusColor}`}>
          <div className={`size-1.5 rounded-full animate-pulse ${hasFeedback ? "bg-current" : "bg-text-secondary"}`} />
          {statusText}
        </div>
        
        <div className="space-y-3">
          <h3 className="text-3xl font-black text-text-primary tracking-tighter leading-tight group-hover:text-accent transition-colors duration-500">
            {role}
          </h3>
          <div className="flex items-center gap-2 text-text-secondary">
             <Target size={14} className="text-accent/70" />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{type} Module</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 relative z-10 border-t border-border-color pt-8 mt-auto">
        <div className="flex justify-between items-center">
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-secondary font-bold flex items-center gap-2">
               <Calendar size={12} /> Last Active
            </p>
            <p className="text-xs font-bold text-text-primary tabular-nums">{formattedDate}</p>
          </div>
          
          {hasFeedback && (
            <div className="text-right space-y-1">
               <p className="text-[10px] uppercase tracking-[0.3em] text-text-secondary font-bold">Protocol Score</p>
               <p className="text-2xl font-black text-text-primary tracking-tighter">
                 {feedback.totalScore}<span className="text-xs text-text-secondary ml-0.5">%</span>
               </p>
            </div>
          )}
        </div>

        <Button 
          asChild
          className={`w-full h-14 rounded-[1.5rem] text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 group/btn shadow-md hover:shadow-lg ${
            hasFeedback 
              ? "bg-bg-secondary hover:bg-accent text-text-primary hover:text-white border border-border-color hover:border-accent" 
              : "bg-accent hover:bg-accent/90 text-white shadow-accent/20"
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