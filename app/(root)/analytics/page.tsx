import { BarChart3, TrendingUp, Target, Award, Brain } from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserFeedback } from "@/lib/actions/general.action";

async function AnalyticsPage() {
  const user = await getCurrentUser();
  const feedbackList = await getUserFeedback(user?.id!);

  const totalSessions = feedbackList.length;
  
  // Calculate Averages
  const avgScore = totalSessions > 0 
    ? Math.round(feedbackList.reduce((acc, f) => acc + (f.totalScore || 0), 0) / totalSessions)
    : 0;

  // Identify Strengths based on new Pedagogical Pillars
  const categories = [
    { name: "Clarity", avg: totalSessions > 0 ? feedbackList.reduce((acc, f) => acc + (f.clarity?.score || 0), 0) / totalSessions : 0 },
    { name: "Simplicity", avg: totalSessions > 0 ? feedbackList.reduce((acc, f) => acc + (f.simplicity?.score || 0), 0) / totalSessions : 0 },
    { name: "Patience", avg: totalSessions > 0 ? feedbackList.reduce((acc, f) => acc + (f.patience?.score || 0), 0) / totalSessions : 0 },
    { name: "Fluency", avg: totalSessions > 0 ? feedbackList.reduce((acc, f) => acc + (f.fluency?.score || 0), 0) / totalSessions : 0 },
    { name: "Warmth", avg: totalSessions > 0 ? feedbackList.reduce((acc, f) => acc + (f.warmth?.score || 0), 0) / totalSessions : 0 },
  ];

  const coreStrength = totalSessions > 0 
    ? categories.reduce((prev, current) => (prev.avg > current.avg) ? prev : current).name
    : "Analyzing";

  // Calculate Growth Trend
  let growthTrend = "Awaiting Data";
  if (totalSessions >= 2) {
    const recentScore = feedbackList[0].totalScore || 0;
    const previousScores = feedbackList.slice(1);
    const prevAvg = previousScores.reduce((acc, f) => acc + (f.totalScore || 0), 0) / previousScores.length;
    const deltaVal = recentScore - prevAvg;
    const roundedDelta = Math.abs(Math.round(deltaVal));
    
    if (deltaVal > 0) growthTrend = `+${roundedDelta}% Growth`;
    else if (deltaVal < 0) growthTrend = `-${roundedDelta}% Change`;
    else growthTrend = "Steady";
  } else if (totalSessions === 1) {
    growthTrend = "Baseline Established";
  }

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      <div className="border-b border-border-color pb-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
            <Brain size={14} />
            Intelligence Hub
          </div>
          <h1 className="text-6xl font-black text-text-primary tracking-tighter leading-none">
            Performance <span className="text-accent italic lowercase">Analytics</span>
          </h1>
          <p className="text-text-secondary max-w-xl font-bold text-lg">
            Live quantitative benchmarks derived from your actual session performance and AI evaluation history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={<Target size={20} />} label="Average Score" value={`${avgScore}%`} trend="Overall performance" />
        <MetricCard icon={<Award size={20} />} label="Core Strength" value={totalSessions > 0 ? coreStrength : "--"} trend="Top performing area" />
        <MetricCard icon={<TrendingUp size={20} />} label="Growth Signal" value={growthTrend} trend="Longitudinal delta" />
        <MetricCard icon={<BarChart3 size={20} />} label="Total Sessions" value={totalSessions.toString()} trend="Finalized in Vault" />
      </div>

      <div className="bg-card-bg p-12 border border-border-color rounded-[3rem] relative overflow-hidden group shadow-xl">
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center justify-between mb-12 relative z-10">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-text-primary tracking-tight">Historical Performance Mapping</h3>
            <p className="text-text-secondary text-sm font-bold">Quantifying improvement across the last {totalSessions} sessions</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <div className="size-2 rounded-full bg-accent" />
               <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Your Score</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="h-px w-6 border-t-2 border-dashed border-border-color" />
               <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Target (80%)</span>
             </div>
          </div>
        </div>
        
        {totalSessions > 0 ? (
          <div className="relative h-96 w-full flex gap-6 relative z-10">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between h-80 text-[10px] font-black text-text-secondary pr-6 border-r-2 border-border-color uppercase tracking-widest">
               <span>100%</span>
               <span>50%</span>
               <span>0%</span>
            </div>

            <div className="flex-1 relative h-80 flex items-end justify-between gap-4">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                 <div className="w-full border-t border-border-color opacity-50" />
                 <div className="w-full border-t border-border-color opacity-50" />
                 <div className="w-full border-t border-border-color opacity-50" />
              </div>

              {/* Target Line */}
              <div className="absolute left-0 right-0 border-t-2 border-dashed border-accent/30 z-0 pointer-events-none" style={{ bottom: '80%' }}>
                <span className="absolute -top-6 right-0 text-[10px] font-black text-accent uppercase tracking-[0.3em]">Recruiter Benchmark</span>
              </div>

              {/* Bars */}
              {feedbackList.slice(0, 10).reverse().map((f, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar h-full justify-end">
                  <div 
                    className="w-full max-w-[48px] bg-accent/10 border-2 border-accent rounded-t-xl transition-all duration-500 hover:bg-accent group-hover/bar:shadow-lg group-hover/bar:shadow-accent/20 relative z-10"
                    style={{ height: `${f.totalScore}%` }}
                  >
                    {/* Rich Tooltip */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-card-bg border border-accent p-3 rounded-2xl shadow-2xl opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none z-50 min-w-[140px]">
                       <p className="text-[8px] font-black text-text-secondary uppercase mb-1 tracking-widest">{new Date(f.createdAt).toLocaleDateString()}</p>
                       <p className="text-[11px] font-black text-text-primary truncate max-w-[120px] mb-2">{f.role || "Session"}</p>
                       <div className="flex items-center justify-between">
                         <span className="text-sm font-black text-accent">{f.totalScore}%</span>
                         <span className="text-[9px] font-black uppercase text-text-secondary">{f.finalVerdict}</span>
                       </div>
                    </div>
                  </div>
                  {/* X-Axis Label */}
                  <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] truncate max-w-[50px] text-center">
                    {f.role?.split(' ')[0] || `S${i+1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-80 w-full bg-bg-secondary rounded-[2.5rem] flex items-center justify-center border-2 border-border-color border-dashed">
            <div className="text-center space-y-4">
              <BarChart3 size={48} className="mx-auto text-text-secondary opacity-20" />
              <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Initial Data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, trend }: { icon: any, label: string, value: string, trend: string }) {
  return (
    <div className="bg-card-bg p-8 border border-border-color rounded-[2.5rem] flex flex-col justify-between space-y-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="size-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-sm">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-text-secondary font-black mb-1">{label}</p>
        <p className="text-3xl font-black text-text-primary tracking-tighter leading-none">{value}</p>
        <p className="text-[10px] text-accent font-bold uppercase tracking-[0.1em] mt-2">{trend}</p>
      </div>
    </div>
  );
}

export default AnalyticsPage;
