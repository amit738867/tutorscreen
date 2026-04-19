import { Book, Video, FileText, Globe } from "lucide-react";

async function ResourcesPage() {
  return (
    <div className="max-w-6xl mx-auto py-20 px-6 space-y-16">
      <div className="border-b border-border-color pb-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
            Knowledge Base
          </div>
          <h1 className="text-6xl font-black text-text-primary tracking-tighter leading-none">
            Learning <span className="text-accent italic">Vault</span>
          </h1>
          <p className="text-text-secondary font-bold text-lg max-w-xl">
            Curated materials to supplement your AI interview simulations and accelerate your career growth.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <ResourceCard 
          icon={<Book />} 
          title="Pedagogy Guide" 
          description="Master the art of teaching and clear communication with our structured guidelines."
        />
        <ResourceCard 
          icon={<Video />} 
          title="Simulation Analysis" 
          description="Watch breakdowns of top-performing interview sessions and learn from the best."
        />
        <ResourceCard 
          icon={<FileText />} 
          title="Resume Protocol" 
          description="Optimize your professional profile to pass elite screening processes."
        />
        <ResourceCard 
          icon={<Globe />} 
          title="Industry Standards" 
          description="Stay updated with the latest expectations from top-tier tech firms."
        />
      </div>
    </div>
  );
}

function ResourceCard({ icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="bg-card-bg p-10 border border-border-color rounded-[3rem] space-y-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group shadow-sm">
      <div className="size-14 rounded-2xl bg-bg-secondary border border-border-color flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-inner">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-black text-text-primary tracking-tight">{title}</h3>
        <p className="text-text-secondary font-bold leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default ResourcesPage;
