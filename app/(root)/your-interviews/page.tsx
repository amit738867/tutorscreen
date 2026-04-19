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
      <div className="border-b border-border-color pb-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
            <BookOpen size={14} />
            The Vault
          </div>
          <h1 className="text-6xl font-black text-text-primary tracking-tighter leading-none">
            Session <span className="text-accent italic">History</span>
          </h1>
          <p className="text-text-secondary max-w-xl font-bold text-lg">
            A comprehensive record of your previous AI interview simulations and analyzed performance data.
          </p>
        </div>
      </div>

      {interviews && interviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
        <div className="bg-card-bg p-32 text-center border-2 border-dashed border-border-color rounded-[3.5rem] shadow-sm">
           <div className="size-20 rounded-[2rem] bg-bg-secondary border border-border-color flex items-center justify-center mx-auto mb-8 text-text-secondary/40 shadow-inner">
              <Search size={32} />
           </div>
           <h3 className="text-3xl font-black text-text-primary tracking-tight mb-3">Vault is Empty</h3>
           <p className="text-text-secondary text-sm font-bold max-w-xs mx-auto">Complete a practice session to start building your professional performance record.</p>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
