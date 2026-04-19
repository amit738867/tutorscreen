import { BookOpen, Code, Terminal, MessageSquare, Zap } from "lucide-react";

function ResourcesPage() {
  return (
    <div className="space-y-12 pb-20 max-w-5xl mx-auto">
      <div className="border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            Knowledge Vault
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Curated <span className="text-emerald-500 italic lowercase">Resources</span>
          </h1>
          <p className="text-slate-500 max-w-xl">
            Access elite pedagogical materials, concept simplification guides, and student empathy protocols.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ResourceCard 
          icon={<Code size={24} />} 
          title="Pedagogical Core" 
          description="Master the fundamentals of teaching and the art of explaining complex concepts simply."
          count="42 Modules"
        />
        <ResourceCard 
          icon={<Terminal size={24} />} 
          title="Student Psychology" 
          description="Learn to navigate student frustration and build trust through empathy-driven communication."
          count="18 Guides"
        />
        <ResourceCard 
          icon={<MessageSquare size={24} />} 
          title="Concept Simplification" 
          description="Refine your ability to break down advanced topics for K-12 and beginner audiences."
          count="25 Protocols"
        />
        <ResourceCard 
          icon={<Zap size={24} />} 
          title="Engagement Drills" 
          description="Rapid-fire scenarios to sharpen your reflexes for handling confused or difficult students."
          count="Unlimited"
        />
      </div>
    </div>
  );
}

function ResourceCard({ icon, title, description, count }: { icon: any, title: string, description: string, count: string }) {
  return (
    <div className="glass-card p-8 border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col justify-between h-full">
      <div className="space-y-6">
        <div className="size-12 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{count}</span>
        <div className="size-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all cursor-pointer">
           <Zap size={14} />
        </div>
      </div>
    </div>
  );
}

export default ResourcesPage;
