import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getFeedbackByInterviewId,
  getInterviewsById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { CheckCircle2, XCircle, Calendar, ArrowLeft, RotateCcw, Quote, Info, BarChart3, Award } from "lucide-react";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewsById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
    if (score >= 60) return "text-amber-500 border-amber-500/20 bg-amber-500/5";
    return "text-rose-500 border-rose-500/20 bg-rose-500/5";
  };

  const PillarCard = ({ label, detail }: { label: string; detail?: { score: number; explanation: string } }) => {
    if (!detail) return null;
    return (
      <div className="glass-card p-6 border-white/10 bg-slate-900/40 flex flex-col items-center text-center space-y-4 group hover:border-emerald-500/40 hover:bg-slate-900/60 transition-all duration-500 h-full shadow-lg">
        {/* Score Up */}
        <div className="relative size-16 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors shadow-inner">
           <span className="text-2xl font-black text-white">{detail.score}<span className="text-[10px] text-slate-500">%</span></span>
           <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        {/* Label */}
        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.3em]">{label}</p>
        
        {/* Brief in Bottom */}
        <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
          {detail.explanation}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Recruiter Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group mb-4">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Protocol Dashboard</span>
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-white tracking-tight">
              Evaluation: <span className="text-emerald-500 italic lowercase">{interview.role}</span>
            </h1>
            <div className="flex items-center gap-4 text-slate-500">
              <div className="flex items-center gap-2">
                 <Calendar size={14} />
                 <span className="text-[10px] font-bold uppercase tracking-widest tabular-nums">
                   {feedback?.createdAt ? dayjs(feedback.createdAt).format("MMM D, YYYY") : "Pending"}
                 </span>
              </div>
              <div className="size-1 bg-slate-800 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{interview.type} Track</span>
            </div>
          </div>
        </div>

        {/* Prominent Verdict */}
        <div className="flex items-center gap-6 bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 shadow-2xl">
           <div className="text-right space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Final Verdict</p>
              <h2 className={`text-2xl font-black uppercase tracking-widest ${feedback?.finalVerdict === "Selected" ? "text-emerald-500" : "text-rose-500"}`}>
                {feedback?.finalVerdict || "Evaluating..."}
              </h2>
           </div>
           <div className={cn("size-16 rounded-2xl flex items-center justify-center", feedback?.finalVerdict === "Selected" ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500 shadow-[0_0_30px_-5px_currentColor]")}>
              {feedback?.finalVerdict === "Selected" ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
           </div>
        </div>
      </div>

      {/* Main Analysis Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
           <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Info size={16} className="text-emerald-500" />
                 <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Executive Summary</h3>
              </div>
              <p className="text-3xl font-medium text-slate-300 leading-tight italic border-l-4 border-emerald-500 pl-8">
                "{feedback?.summary || "Synthesis in progress..."}"
              </p>
           </div>

           {/* Pedagogy Pillars - Score Up, Brief Bottom, 3 over 2 layout */}
           <div className="pt-8 space-y-8">
              <div className="flex items-center gap-3">
                 <BarChart3 size={16} className="text-emerald-500" />
                 <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Pedagogical Pillars</h3>
              </div>
              
              <div className="space-y-4">
                 {/* Row 1: 3 Items */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PillarCard label="Clarity" detail={feedback?.clarity} />
                    <PillarCard label="Simplicity" detail={feedback?.simplicity} />
                    <PillarCard label="Patience" detail={feedback?.patience} />
                 </div>
                 {/* Row 2: 2 Items */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:max-w-[66%]">
                    <PillarCard label="Fluency" detail={feedback?.fluency} />
                    <PillarCard label="Warmth" detail={feedback?.warmth} />
                 </div>
              </div>
           </div>

           {/* Evidence Section */}
           <div className="pt-12 space-y-8">
              <div className="flex items-center gap-3">
                 <Quote size={16} className="text-emerald-500" />
                 <h3 className="text-xs font-bold text-white uppercase tracking-[0.3em]">Candidate Evidence</h3>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[3rem] p-12 relative overflow-hidden group hover:bg-emerald-500/10 transition-colors shadow-lg">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Quote size={120} className="text-emerald-500" />
                 </div>
                 <p className="relative z-10 text-xl text-slate-300 leading-relaxed font-medium italic whitespace-pre-wrap">
                    {feedback?.evidence || "No direct evidence flagged."}
                 </p>
              </div>
           </div>
        </div>

        {/* Sidebar Actions & Score */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card p-10 bg-gradient-to-br from-slate-900 to-slate-950 border-white/10 space-y-8 sticky top-8 shadow-2xl">
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Global Score</p>
                    <Award size={16} className="text-emerald-500" />
                 </div>
                 <div className="text-7xl font-black text-white tracking-tighter tabular-nums">
                    {feedback?.totalScore || 0}<span className="text-2xl text-slate-700">%</span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.4)]" style={{ width: `${feedback?.totalScore || 0}%` }} />
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                 <Button asChild className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all">
                    <Link href={`/interview/${id}`} className="flex items-center justify-center gap-3">
                      <RotateCcw size={16} />
                      Launch Re-evaluation
                    </Link>
                 </Button>
                 <Button asChild variant="outline" className="w-full h-16 border-white/10 text-slate-500 hover:text-white hover:bg-slate-800 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[10px] transition-all">
                    <Link href="/">Return to Vault</Link>
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}