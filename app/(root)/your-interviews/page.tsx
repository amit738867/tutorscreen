import React from "react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import InterviewCard from "@/components/InterviewCard";
import { BookOpen, Search } from "lucide-react";

async function HistoryPage() {
  const user = await getCurrentUser();
  const interviews = await getInterviewsByUserId(user?.id!);

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      <div className="border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <BookOpen size={14} />
            The Vault
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Session <span className="text-emerald-500 italic lowercase">History</span>
          </h1>
          <p className="text-slate-500 max-w-xl font-medium">
            A comprehensive record of your previous AI interview simulations and analyzed performance data.
          </p>
        </div>
      </div>

      {interviews && interviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {interviews.map((interview: any) => (
            <InterviewCard
              key={interview.id}
              userId={user?.id}
              interviewId={interview.id}
              role={interview.role}
              type={interview.type}
              techstack={interview.techstack}
              createdAt={interview.createdAt}
              feedback={interview.feedback}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-24 text-center border-dashed border-white/5 bg-slate-900/40">
           <div className="size-16 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto mb-6 text-slate-600">
              <Search size={32} />
           </div>
           <h3 className="text-2xl font-bold text-white mb-2">Vault is Empty</h3>
           <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto">Complete a practice session to start building your professional performance record.</p>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
