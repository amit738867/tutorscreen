import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import TrackList from "@/components/TrackList";
import { Sparkles } from "lucide-react";
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
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden rounded-[2rem] bg-dark-100 border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02]" />
        
        <div className="relative z-10 w-full px-8 md:px-16 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              AI Interview Simulation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1]">
              Ace your next <br />
              <span className="text-emerald-500">Interview.</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
              Practice with our AI-powered interviewer, get real-time feedback, and improve your communication skills through immersive simulations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Button asChild size="lg" className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] transition-all duration-300">
                <Link href="/interview" className="flex items-center gap-2">
                  Smart Simulation
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.75 9H14.25M14.25 9L9.75 4.5M14.25 9L9.75 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl transition-all">
                <Link href="/interview/custom" className="flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-500" />
                  Custom Path
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex-1 relative hidden lg:block">
            <div className="absolute -inset-10 bg-emerald-500/20 rounded-full blur-[120px]" />
            <div className="glass-card p-4 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/50 to-transparent rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <Image
                src="/robot.png"
                alt="AI Interview"
                width={500}
                height={500}
                className="rounded-xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="space-y-10">
        <div className="flex items-end justify-between border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">Recent Activity</h2>
            <p className="text-slate-500">Your latest sessions and performance insights</p>
          </div>
          {hasPastInterviews && (
            <Link href="/your-interviews" className="group flex items-center gap-2 text-emerald-500 font-semibold text-sm">
              View History
              <span className="h-px w-8 bg-emerald-500/30 group-hover:w-12 transition-all" />
            </Link>
          )}
        </div>
        
        {userInterviews && userInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="glass-card p-16 text-center border-dashed border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-2">No Recent Activity</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">Complete your first interview simulation to start tracking your performance.</p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-8 h-12">
              <Link href="/interview">Begin First Session</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Featured Tracks */}
      <section className="space-y-10">
        <div className="flex items-end justify-between border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-white tracking-tight">Featured Tracks</h2>
            <p className="text-slate-500">Recommended modules to boost your preparation</p>
          </div>
          <Link href="/interviews" className="group flex items-center gap-2 text-emerald-500 font-semibold text-sm">
            Explore All
            <span className="h-px w-8 bg-emerald-500/30 group-hover:w-12 transition-all" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <section className="relative rounded-[2.5rem] bg-emerald-950/20 border border-emerald-500/20 p-12 md:p-20 overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(16,185,129,0.1),transparent)]" />
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Ready to improve your <span className="text-emerald-500">skills?</span>
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed">
            Practice as much as you need and get the feedback required to land your dream job.
          </p>
          <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-slate-100 rounded-xl px-10 h-14 font-bold transition-transform active:scale-95 shadow-xl">
            <Link href="/interview">
              Get Started
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;