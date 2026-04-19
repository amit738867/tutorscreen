"use client";

import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Bell, Lock, Eye, Monitor, Brain, Mic, Trash2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { updateUserPreferences, clearUserHistory } from "@/lib/actions/general.action";
import { toast } from "sonner"; // Assuming sonner is available or similar

function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleToggle = async (key: string, value: any) => {
    if (!user) return;
    const updatedUser = { ...user, [key]: value };
    setUser(updatedUser);
    
    setSaving(true);
    await updateUserPreferences(user.id, { [key]: value });
    setSaving(false);
  };

  const handleClear = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    
    setSaving(true);
    await clearUserHistory(user.id);
    setConfirmClear(false);
    setSaving(false);
    alert("History cleared successfully!");
  };

  if (loading) return <div className="p-20 text-center text-slate-500 uppercase tracking-widest text-xs font-bold animate-pulse">Synchronizing Settings...</div>;

  return (
    <div className="space-y-12 pb-20 max-w-4xl mx-auto">
      <div className="border-b border-white/5 pb-10">
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            System Config
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Interface <span className="text-emerald-500 italic lowercase">Settings</span>
          </h1>
          <p className="text-slate-500">Configure your intelligence core and data privacy preferences.</p>
        </div>
      </div>

      <div className="space-y-6">
        <SettingsSection title="Intelligence Core">
          <SettingsToggle 
            icon={<Brain size={18} />} 
            label="Recruiter Mode" 
            description="AI adopts a more critical, professional tone (v/s Mentor mode)" 
            active={user?.persona === "recruiter"}
            onToggle={() => handleToggle("persona", user?.persona === "recruiter" ? "mentor" : "recruiter")}
          />
        </SettingsSection>

        <SettingsSection title="Communication">
          <SettingsToggle 
            icon={<Mic size={18} />} 
            label="AI Voice Interaction" 
            description="Enable high-fidelity speech synthesis during sessions" 
            active={user?.voiceEnabled !== false}
            onToggle={() => handleToggle("voiceEnabled", user?.voiceEnabled === false)}
          />
        </SettingsSection>

        <SettingsSection title="Data Management">
          <div className="flex items-center justify-between p-2 rounded-xl border border-rose-500/10 bg-rose-500/5">
             <div className="flex items-center gap-4 p-4">
                <div className="size-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                  <Trash2 size={18} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Clear History</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Permanently delete all sessions from the Vault</p>
                </div>
             </div>
             <Button 
                onClick={handleClear}
                disabled={saving}
                variant="destructive" 
                className={`mr-4 h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${confirmClear ? "bg-rose-600 animate-pulse" : "bg-slate-800 hover:bg-rose-900"}`}
             >
                {confirmClear ? "Click to Confirm" : "Purge Data"}
             </Button>
          </div>
        </SettingsSection>
        
        {saving && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl animate-bounce">
            Saving Preferences...
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="glass-card p-8 space-y-6 border-white/5">
      <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] opacity-60 border-b border-white/5 pb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function SettingsToggle({ icon, label, description, active = false, onToggle }: { icon: any, label: string, description: string, active?: boolean, onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className={`size-10 rounded-xl border transition-all flex items-center justify-center ${active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-slate-800 border-white/5 text-slate-500 group-hover:text-slate-400'}`}>
          {icon}
        </div>
        <div>
          <p className="text-white font-medium">{label}</p>
          <p className="text-xs text-slate-600">{description}</p>
        </div>
      </div>
      <div 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${active ? 'bg-emerald-600 shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]' : 'bg-slate-800 border border-white/5 hover:border-white/10'}`}
      >
         <div className={`absolute top-1 left-1 size-4 bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-6 shadow-lg' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}

export default SettingsPage;
