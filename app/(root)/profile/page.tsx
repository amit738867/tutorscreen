import { getCurrentUser } from "@/lib/actions/auth.action";
import { User, Mail, Shield, Zap } from "lucide-react";

async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-12">
      <div className="border-b border-border-color pb-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
            User Identity
          </div>
          <h1 className="text-6xl font-black text-text-primary tracking-tighter leading-none">
            Operator <span className="text-accent italic">Profile</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1 bg-card-bg p-10 border border-border-color rounded-[3rem] text-center space-y-6 shadow-xl">
          <div className="size-24 rounded-full bg-accent flex items-center justify-center mx-auto text-white shadow-lg shadow-accent/20">
            <User size={40} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-text-primary tracking-tight">{user?.name}</h3>
            <p className="text-text-secondary text-sm font-bold">{user?.email}</p>
          </div>
        </div>

        <div className="md:col-span-2 bg-card-bg p-12 border border-border-color rounded-[3rem] space-y-10 shadow-xl">
          <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[0.4em] border-b border-border-color pb-6">Identity Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <InfoItem icon={<User size={18} />} label="Full Name" value={user?.name || "N/A"} />
            <InfoItem icon={<Mail size={18} />} label="Email Address" value={user?.email || "N/A"} />
            <InfoItem icon={<Shield size={18} />} label="Access Tier" value="Elite Operator" />
            <InfoItem icon={<Zap size={18} />} label="Persona Mode" value={user?.persona || "Mentor"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="space-y-2">
        <div className="flex items-center gap-2 text-text-secondary">
          {icon}
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
        </div>
        <p className="text-text-primary font-bold text-lg">{value}</p>
    </div>
  )
}

export default ProfilePage;
