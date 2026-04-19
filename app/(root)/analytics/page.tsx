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

  // Calculate Growth Trend (No numerical delta)
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
    <div className="space-y-12 pb-20 max-w-5xl mx-auto">
      <div className="border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <Brain size={14} />
            Intelligence Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Performance <span className="text-emerald-500 italic lowercase">Analytics</span>
          </h1>
          <p className="text-slate-500 max-w-xl">
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

      <div className="glass-card p-10 border-white/5 bg-slate-900/40 relative overflow-hidden group">
        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center justify-between mb-10">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Historical Performance Mapping</h3>
            <p className="text-slate-500 text-sm">Quantifying your improvement across the last {totalSessions} sessions</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="size-2 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Score</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="h-px w-4 bg-slate-700 border-t border-dashed border-slate-500" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target (80%)</span>
             </div>
          </div>
        </div>
        
        {totalSessions > 0 ? (
          <div className="relative h-80 w-full flex gap-4">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between h-64 text-[10px] font-bold text-slate-600 pr-4 border-r border-white/5 uppercase tracking-tighter">
               <span>100%</span>
               <span>50%</span>
               <span>0%</span>
            </div>

            <div className="flex-1 relative h-64 flex items-end justify-between gap-2">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                 <div className="w-full border-t border-white/5" />
                 <div className="w-full border-t border-white/5" />
                 <div className="w-full border-t border-white/5" />
              </div>

              {/* Target Line */}
              <div className="absolute left-0 right-0 border-t border-dashed border-emerald-500/30 z-0 pointer-events-none" style={{ bottom: '80%' }}>
                <span className="absolute -top-5 right-0 text-[8px] font-black text-emerald-500/50 uppercase tracking-[0.2em]">Recruiter Benchmark</span>
              </div>

              {/* Bars */}
              {feedbackList.slice(0, 10).reverse().map((f, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar h-full justify-end">
                  <div 
                    className="w-full max-w-[42px] bg-emerald-500/10 border border-emerald-500/20 rounded-t-lg transition-all duration-500 hover:bg-emerald-500 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] relative z-10"
                    style={{ height: `${f.totalScore}%` }}
                  >
                    {/* Rich Tooltip */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 border border-white/10 p-2 rounded-lg shadow-2xl opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none z-50 min-w-[120px]">
                       <p className="text-[8px] font-bold text-slate-500 uppercase mb-1">{new Date(f.createdAt).toLocaleDateString()}</p>
                       <p className="text-[10px] font-bold text-white truncate max-w-[100px] mb-1">{f.role || "Session"}</p>
                       <div className="flex items-center justify-between">
                         <span className="text-xs font-black text-emerald-400">{f.totalScore}%</span>
                         <span className="text-[8px] font-bold uppercase text-slate-400">{f.finalVerdict}</span>
                       </div>
                    </div>
                  </div>
                  {/* X-Axis Label */}
                  <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest truncate max-w-[40px] text-center">
                    {f.role?.split(' ')[0] || `S${i+1}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64 w-full bg-slate-800/30 rounded-2xl flex items-center justify-center border border-white/5 border-dashed">
            <div className="text-center space-y-4">
              <BarChart3 size={48} className="mx-auto text-slate-700 opacity-20" />
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Awaiting Initial Data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, trend }: { icon: any, label: string, value: string, trend: string }) {
  return (
    <div className="glass-card p-6 border-white/5 flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold mb-1">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-[10px] text-slate-500 font-medium mt-1">{trend}</p>
      </div>
    </div>
  );
}

export default AnalyticsPage;

