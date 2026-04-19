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
    <div className="max-w-2xl mx-auto py-20 px-6 space-y-12">
      <div className="space-y-4">
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
        </Link>
        <h1 className="text-5xl font-bold text-white tracking-tight">Configure <span className="text-emerald-500">Custom</span> Interview</h1>
        <p className="text-slate-400">Tailor your practice session by specifying your target role, level, and technology stack.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-10 space-y-8 border-white/5">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">What Role are you preparing for?</Label>
            <Input 
              id="role"
              required
              placeholder="e.g. Frontend Developer, Product Manager"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="bg-slate-900/50 border-white/10 h-12 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 flex flex-col">
              <Label className="text-slate-300 font-bold uppercase tracking-widest text-[10px] mb-2">Interview Type</Label>
              <select 
                value={formData.interviewType} 
                onChange={(e) => setFormData({...formData, interviewType: e.target.value})}
                className="bg-slate-900/50 border border-white/10 rounded-lg h-12 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
              >
                <option value="Technical" className="bg-slate-900">Technical</option>
                <option value="Behavioral" className="bg-slate-900">Behavioral</option>
                <option value="HR / Cultural" className="bg-slate-900">HR / Cultural</option>
                <option value="System Design" className="bg-slate-900">System Design</option>
              </select>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="text-slate-300 font-bold uppercase tracking-widest text-[10px] mb-2">Experience Level</Label>
              <select 
                value={formData.level} 
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="bg-slate-900/50 border border-white/10 rounded-lg h-12 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer"
              >
                <option value="Intern" className="bg-slate-900">Intern</option>
                <option value="Junior" className="bg-slate-900">Junior</option>
                <option value="Mid-Level" className="bg-slate-900">Mid-Level</option>
                <option value="Senior" className="bg-slate-900">Senior</option>
                <option value="Lead / Architect" className="bg-slate-900">Lead / Architect</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stack" className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">What's the Stack? (comma separated)</Label>
            <Input 
              id="stack"
              placeholder="e.g. React, TypeScript, Node.js, AWS"
              value={formData.stack}
              onChange={(e) => setFormData({...formData, stack: e.target.value})}
              className="bg-slate-900/50 border-white/10 h-12 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Number of Questions ({formData.amount})</Label>
            <input 
              type="range"
              id="amount"
              min="3"
              max="10"
              step="1"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <span>3 Questions</span>
              <span>10 Questions</span>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
          {loading ? "Initializing..." : "Launch Custom Session"}
        </Button>
      </form>
    </div>
  );
};

export default CustomInterviewPage;
