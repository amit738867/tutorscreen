"use client";

import React, { useState } from "react";
import Agent from "@/components/Agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

const CustomInterviewPage = () => {
  const [step, setStep] = useState<"form" | "interview">("form");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    interviewType: "Technical",
    level: "Junior",
    stack: "",
    amount: 5
  });

  const [userName, setUserName] = useState("Candidate");
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userPrefs, setUserPrefs] = useState({
    persona: "mentor",
    voiceEnabled: true
  });

  React.useEffect(() => {
     const fetchUser = async () => {
        try {
          const user = await getCurrentUser();
          if (user) {
            setUserName(user.name);
            setUserId(user.id);
            setUserPrefs({
              persona: user.persona || "mentor",
              voiceEnabled: user.voiceEnabled !== false
            });
          }
        } catch (e) {
          console.log("Error fetching user session:", e);
        }
     };
     fetchUser();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setStep("interview");
      setLoading(false);
    }, 1000);
  };

  if (step === "interview") {
    return (
      <div className="py-10">
        <Agent 
          userName={userName}
          userId={userId!}
          type="custom"
          persona={userPrefs.persona}
          voiceEnabled={userPrefs.voiceEnabled}
          customParams={{
            role: formData.role,
            interviewType: formData.interviewType,
            level: formData.level,
            stack: formData.stack.split(",").map(s => s.trim()),
            amount: formData.amount
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 space-y-16">
      <div className="space-y-6">
        <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-accent transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Dashboard</span>
        </Link>
        <h1 className="text-6xl font-black text-text-primary tracking-tighter leading-tight">
          Configure <span className="text-accent italic">Custom</span> Session
        </h1>
        <p className="text-text-secondary font-bold text-lg max-w-xl">
          Tailor your practice session by specifying your target role, experience level, and technology stack.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card-bg p-12 md:p-16 space-y-10 border border-border-color rounded-[3.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-[80px] -mr-16 -mt-16 opacity-0 dark:opacity-100" />
        
        <div className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="role" className="text-text-secondary font-black uppercase tracking-[0.4em] text-[10px]">Target Role</Label>
            <Input 
              id="role"
              required
              placeholder="e.g. Senior Frontend Engineer"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="bg-bg-secondary border-border-color h-16 rounded-2xl text-text-primary font-bold placeholder:text-text-secondary/30"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 flex flex-col">
              <Label className="text-text-secondary font-black uppercase tracking-[0.4em] text-[10px]">Protocol Type</Label>
              <select 
                value={formData.interviewType} 
                onChange={(e) => setFormData({...formData, interviewType: e.target.value})}
                className="bg-bg-secondary border border-border-color rounded-2xl h-16 px-6 text-text-primary font-bold focus:outline-none focus:ring-4 focus:ring-accent/10 appearance-none cursor-pointer"
              >
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
                <option value="HR / Cultural">HR / Cultural</option>
                <option value="System Design">System Design</option>
              </select>
            </div>

            <div className="space-y-3 flex flex-col">
              <Label className="text-text-secondary font-black uppercase tracking-[0.4em] text-[10px]">Seniority Level</Label>
              <select 
                value={formData.level} 
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="bg-bg-secondary border border-border-color rounded-2xl h-16 px-6 text-text-primary font-bold focus:outline-none focus:ring-4 focus:ring-accent/10 appearance-none cursor-pointer"
              >
                <option value="Intern">Intern</option>
                <option value="Junior">Junior</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead / Architect">Lead / Architect</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="stack" className="text-text-secondary font-black uppercase tracking-[0.4em] text-[10px]">Technology Stack</Label>
            <Input 
              id="stack"
              placeholder="e.g. React, TypeScript, GraphQL"
              value={formData.stack}
              onChange={(e) => setFormData({...formData, stack: e.target.value})}
              className="bg-bg-secondary border-border-color h-16 rounded-2xl text-text-primary font-bold placeholder:text-text-secondary/30"
            />
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex justify-between items-end">
              <Label htmlFor="amount" className="text-text-secondary font-black uppercase tracking-[0.4em] text-[10px]">Question Depth</Label>
              <span className="text-2xl font-black text-accent">{formData.amount}</span>
            </div>
            <input 
              type="range"
              id="amount"
              min="3"
              max="10"
              step="1"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
              className="w-full h-3 bg-bg-secondary rounded-full appearance-none cursor-pointer accent-accent border border-border-color"
            />
            <div className="flex justify-between text-[9px] text-text-secondary/40 font-black uppercase tracking-[0.3em]">
              <span>Minimal</span>
              <span>Exhaustive</span>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-20 bg-accent hover:bg-accent/90 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[12px] shadow-2xl shadow-accent/20 transition-all duration-500 flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
          {loading ? "Initializing Protocol..." : "Launch Custom Session"}
        </Button>
      </form>
    </div>
  );
};

export default CustomInterviewPage;
