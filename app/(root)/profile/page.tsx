import { getCurrentUser } from "@/lib/actions/auth.action";
import { User, Mail, Calendar, ShieldCheck } from "lucide-react";

async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-12 pb-20 max-w-4xl mx-auto">
      <div className="border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            Account Entity
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Operator <span className="text-emerald-500 italic lowercase">Profile</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-8 flex flex-col items-center text-center space-y-4 border-white/10">
            <div className="size-32 rounded-3xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-emerald-500">
               <User size={64} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user?.name}</h3>
              <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest mt-1">Verified Operator</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-8 space-y-8 border-white/5">
            <h3 className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/5 pb-4">Identity Details</h3>
            
            <div className="space-y-6">
              <ProfileItem icon={<User size={18} />} label="Full Name" value={user?.name || "N/A"} />
              <ProfileItem icon={<Mail size={18} />} label="Email Address" value={user?.email || "N/A"} />
              <ProfileItem icon={<ShieldCheck size={18} />} label="Operator Status" value="Active / Premium" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="size-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-emerald-500 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
}

export default ProfilePage;
