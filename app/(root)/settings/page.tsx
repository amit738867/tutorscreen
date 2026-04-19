"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Bell, Shield, Eye, Trash2, Cpu } from "lucide-react";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearData = () => {
    setIsClearing(true);
    setTimeout(() => {
      toast.success("Protocol cache purged successfully.");
      setIsClearing(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 space-y-16">
      <div className="border-b border-border-color pb-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
            System Control
          </div>
          <h1 className="text-6xl font-black text-text-primary tracking-tighter leading-none">
            System <span className="text-accent italic">Settings</span>
          </h1>
          <p className="text-text-secondary font-bold text-lg max-w-xl">
            Configure your technical environment and operational parameters.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        <SettingsSection title="Operational Protocols">
          <SettingsItem 
            icon={<Bell size={20} />} 
            label="Real-time Notifications" 
            description="Receive immediate feedback on session completion."
            action={<Switch checked={notifications} onCheckedChange={setNotifications} />}
          />
          <SettingsItem 
            icon={<Cpu size={20} />} 
            label="Advanced Analytics" 
            description="Enable deep-learning processing for pedagogy metrics."
            action={<Switch checked={analytics} onCheckedChange={setAnalytics} />}
          />
        </SettingsSection>

        <SettingsSection title="Security & Privacy">
          <SettingsItem 
            icon={<Shield size={20} />} 
            label="Anonymous Benchmarking" 
            description="Contribute to global scores without revealing identity."
            action={<Switch checked={true} />}
          />
          <div className="pt-6">
             <button 
                onClick={handleClearData}
                disabled={isClearing}
                className="flex items-center gap-4 p-6 w-full bg-rose-500/5 border border-rose-500/20 rounded-[2rem] hover:bg-rose-500/10 transition-all group"
             >
                <div className="size-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                   <Trash2 size={24} />
                </div>
                <div className="text-left">
                  <p className="text-text-primary font-black text-lg">Clear History</p>
                  <p className="text-text-secondary font-bold text-sm">Permanently delete all session records and data.</p>
                </div>
                <div className="ml-auto text-rose-500 font-black uppercase tracking-[0.2em] text-[10px] group-hover:underline">
                   {isClearing ? "Purging..." : "Initialize Purge"}
                </div>
             </button>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="space-y-8">
      <h3 className="text-[11px] font-black text-text-primary uppercase tracking-[0.3em] opacity-60 border-b border-border-color pb-6">{title}</h3>
      <div className="space-y-6">
        {children}
      </div>
  </div>
);

const SettingsItem = ({ icon, label, description, action }: { icon: any, label: string, description: string, action: React.ReactNode }) => (
  <div className="bg-card-bg p-8 border border-border-color rounded-[2.5rem] flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-6">
       <div className="size-12 rounded-xl bg-bg-secondary border border-border-color flex items-center justify-center text-accent shadow-inner">
          {icon}
       </div>
       <div>
          <p className="text-text-primary font-black text-lg tracking-tight">{label}</p>
          <p className="text-text-secondary font-bold text-sm">{description}</p>
       </div>
    </div>
    {action}
  </div>
);

export default SettingsPage;
