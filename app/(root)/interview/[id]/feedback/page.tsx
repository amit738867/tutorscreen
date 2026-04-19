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

  const PillarCard = ({ label, detail }: { label: string; detail?: { score: number; explanation: string } }) => {
    if (!detail) return null;
    return (
      <div className="bg-card-bg p-8 border border-border-color rounded-[2.5rem] flex flex-col items-center text-center space-y-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-full shadow-sm">
        {/* Score Up */}
        <div className="relative size-20 rounded-2xl bg-bg-secondary border border-accent/20 flex items-center justify-center group-hover:border-accent transition-colors shadow-inner">
           <span className="text-3xl font-black text-text-primary">{detail.score}<span className="text-[10px] text-text-secondary">%</span></span>
           <div className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        {/* Label */}
        <p className="text-[11px] font-black text-accent uppercase tracking-[0.4em]">{label}</p>
        
        {/* Brief in Bottom */}
        <p className="text-xs text-text-secondary font-bold leading-relaxed">
          {detail.explanation}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Recruiter Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-border-color pb-12">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors group mb-4">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Protocol Dashboard</span>
          </Link>
          
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-text-primary tracking-tighter leading-none">
              Evaluation: <span className="text-accent italic lowercase">{interview.role}</span>
            </h1>
            <div className="flex items-center gap-4 text-text-secondary">
              <div className="flex items-center gap-2">
                 <Calendar size={14} />
                 <span className="text-[10px] font-bold uppercase tracking-widest tabular-nums">
                   {feedback?.createdAt ? dayjs(feedback.createdAt).format("MMM D, YYYY") : "Pending"}
                 </span>
              </div>
              <div className="size-1 bg-border-color rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{interview.type} Track</span>
            </div>
          </div>
        </div>

        {/* Prominent Verdict */}
        <div className="flex items-center gap-6 bg-card-bg p-8 rounded-[2.5rem] border border-border-color shadow-xl">
           <div className="text-right space-y-1">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Final Verdict</p>
              <h2 className={`text-3xl font-black uppercase tracking-tighter ${feedback?.finalVerdict === "Selected" ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"}`}>
                {feedback?.finalVerdict || "Evaluating..."}
              </h2>
           </div>
           <div className={cn("size-20 rounded-2xl flex items-center justify-center", feedback?.finalVerdict === "Selected" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500" : "bg-rose-500/10 text-rose-600 dark:text-rose-500 shadow-[0_0_30px_-5px_currentColor]")}>
              {feedback?.finalVerdict === "Selected" ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
           </div>
        </div>
      </div>

      {/* Main Analysis Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-16">
           <div className="space-y-8">
              <div className="flex items-center gap-3">
                 <Info size={16} className="text-accent" />
                 <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[0.4em]">Executive Summary</h3>
              </div>
              <p className="text-4xl font-bold text-text-secondary leading-tight italic border-l-[6px] border-accent pl-10">
                "{feedback?.summary || "Synthesis in progress..."}"
              </p>
           </div>

           {/* Pedagogy Pillars */}
           <div className="space-y-10">
              <div className="flex items-center gap-3">
                 <BarChart3 size={16} className="text-accent" />
                 <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[0.4em]">Pedagogical Pillars</h3>
              </div>
              
              <div className="space-y-6">
                 {/* Row 1: 3 Items */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PillarCard label="Clarity" detail={feedback?.clarity} />
                    <PillarCard label="Simplicity" detail={feedback?.simplicity} />
                    <PillarCard label="Patience" detail={feedback?.patience} />
                 </div>
                 {/* Row 2: 2 Items */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:max-w-[66.6%]">
                    <PillarCard label="Fluency" detail={feedback?.fluency} />
                    <PillarCard label="Warmth" detail={feedback?.warmth} />
                 </div>
              </div>
           </div>

           {/* Evidence Section */}
           <div className="space-y-10">
              <div className="flex items-center gap-3">
                 <Quote size={16} className="text-accent" />
                 <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[0.4em]">Candidate Evidence</h3>
              </div>
              <div className="bg-bg-secondary border border-accent/20 rounded-[3rem] p-16 relative overflow-hidden group hover:border-accent transition-all duration-500 shadow-lg">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Quote size={120} className="text-accent" />
                 </div>
                 <p className="relative z-10 text-2xl text-text-secondary leading-relaxed font-bold italic whitespace-pre-wrap">
                    {feedback?.evidence || "No direct evidence flagged."}
                 </p>
              </div>
           </div>
        </div>

        {/* Sidebar Actions & Score */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-card-bg p-12 border border-border-color rounded-[3rem] space-y-10 sticky top-32 shadow-2xl">
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em]">Global Score</p>
                    <Award size={20} className="text-accent" />
                 </div>
                 <div className="text-8xl font-black text-text-primary tracking-tighter tabular-nums leading-none">
                    {feedback?.totalScore || 0}<span className="text-2xl text-accent ml-1">%</span>
                 </div>
                 <div className="h-3 w-full bg-bg-secondary rounded-full overflow-hidden border border-accent/10">
                    <div className="h-full bg-accent transition-all duration-1000 shadow-[0_0_20px_rgba(16,185,129,0.4)]" style={{ width: `${feedback?.totalScore || 0}%` }} />
                 </div>
              </div>

              <div className="space-y-4 pt-6">
                 <Button asChild className="w-full h-16 bg-accent hover:bg-accent/90 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-accent/20 transition-all duration-500 hover:scale-[1.02]">
                    <Link href={`/interview/${id}`} className="flex items-center justify-center gap-3">
                       <RotateCcw size={16} />
                       Launch Re-evaluation
                    </Link>
                 </Button>
                 <Button asChild variant="outline" className="w-full h-16 border-border-color text-text-secondary hover:text-accent hover:bg-accent/5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500">
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