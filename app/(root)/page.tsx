import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import { staticTracks } from "@/constants/tracks";

async function Home() {
  const user = await getCurrentUser();
  const [userInterviews, dbInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);
  
  // Combine for Featured Tracks
  const allInterview = [...(dbInterviews || []), ...staticTracks];
  const hasPastInterviews = userInterviews?.length! > 0;

  return (
    <div className="space-y-32 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[640px] flex items-center overflow-hidden rounded-[3rem] bg-bg-secondary shadow-xl">
        {/* Decorative elements only visible in dark mode or subtle in light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] dark:bg-grid-white/[0.05]" />
        
        <div className="relative z-10 w-full px-8 md:px-20 flex flex-col lg:flex-row items-center gap-16 py-16">
          <div className="flex-1 space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.4em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Intelligence Protocol Active
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-text-primary tracking-tighter leading-[0.9] transition-colors duration-500">
              Ace your next <br />
              <span className="text-accent italic">Interview.</span>
            </h1>
            
            <p className="text-xl text-text-secondary max-w-xl font-bold leading-relaxed">
              Practice with our high-fidelity AI simulations, get data-driven evaluation, and master the pedagogy of elite performance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Button asChild size="lg" className="h-16 px-10 bg-accent hover:bg-accent/90 text-white rounded-[1.5rem] shadow-lg shadow-accent/20 transition-all duration-500 hover:scale-[1.05] active:scale-95 uppercase tracking-[0.2em] font-black text-[11px]">
                <Link href="/interview" className="flex items-center gap-3">
                  <Play size={16} fill="currentColor" />
                  Smart Simulation
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-16 px-10 border-border-color bg-bg-primary text-text-secondary hover:text-accent hover:bg-accent/5 rounded-[1.5rem] transition-all duration-500 uppercase tracking-[0.2em] font-black text-[11px]">
                <Link href="/interview/custom" className="flex items-center gap-2">
                  <Sparkles size={16} className="text-accent" />
                  Custom Path
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex-1 relative hidden lg:block">
            <div className="absolute -inset-10 bg-accent/10 rounded-full blur-[100px] opacity-20 dark:opacity-50" />
            <div className="bg-card-bg p-6 rounded-[3rem] border-2 border-border-color relative group shadow-2xl transition-all duration-700 hover:rotate-2">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-accent to-transparent rounded-[2.8rem] opacity-10 group-hover:opacity-30 transition-opacity" />
              <Image
                src="/robot.png"
                alt="AI Interview"
                width={500}
                height={500}
                className="rounded-[2.5rem] relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="space-y-12">
        <div className="flex items-end justify-between border-b border-border-color pb-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-text-primary tracking-tighter">Recent Activity</h2>
            <p className="text-text-secondary font-bold">Your latest sessions and performance insights</p>
          </div>
          {hasPastInterviews && (
            <Link href="/your-interviews" className="group flex items-center gap-3 text-accent font-black uppercase tracking-[0.2em] text-[10px] transition-all">
              View History
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
        
        {userInterviews && userInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {userInterviews
              .slice(0, 3)
              .map((interview: any) => (
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
          <div className="bg-card-bg p-24 text-center border-2 border-dashed border-border-color rounded-[3rem] shadow-sm">
            <h3 className="text-3xl font-black text-text-primary tracking-tight mb-3">No Recent Activity</h3>
            <p className="text-text-secondary font-bold mb-10 max-w-sm mx-auto">Complete your first evaluation protocol to start tracking your pedagogical metrics.</p>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-[1.2rem] px-10 h-14 font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-accent/20">
              <Link href="/interview">Begin First Session</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Featured Tracks */}
      <section className="space-y-12">
        <div className="flex items-end justify-between border-b border-border-color pb-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-text-primary tracking-tighter">Featured Tracks</h2>
            <p className="text-text-secondary font-bold">Recommended modules to boost your pedagogical preparation</p>
          </div>
          <Link href="/interviews" className="group flex items-center gap-3 text-accent font-black uppercase tracking-[0.2em] text-[10px] transition-all">
            Explore All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {allInterview?.slice(0, 6).map((track: any) => (
            <InterviewCard
              key={track.id}
              userId={user?.id}
              interviewId={track.id}
              role={track.role}
              type={track.type}
              techstack={track.techstack}
              createdAt={track.createdAt}
            />
          ))}
        </div>
      </section>

      {/* Simple CTA */}
      <section className="relative rounded-[3.5rem] bg-accent/5 dark:bg-accent/10 border border-border-color p-16 md:p-24 overflow-hidden group shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(16,185,129,0.1),transparent)]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-black text-text-primary tracking-tighter leading-none">
            Ready to <span className="text-accent italic">Advance?</span>
          </h2>
          <p className="text-xl text-text-secondary font-bold leading-relaxed max-w-2xl mx-auto">
            Practice as much as you need and acquire the evaluation metrics required to join the elite tier of educators.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-[1.5rem] px-12 h-16 font-black uppercase tracking-[0.3em] text-[12px] shadow-2xl shadow-accent/20 transition-all duration-500 hover:scale-[1.05]">
            <Link href="/interview">
              Initialize Protocol
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;