"use client";

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import InterviewCard from './InterviewCard';
import { Input } from './ui/input';

interface TrackListProps {
  initialTracks: any[];
  userId?: string;
}

const TrackList = ({ initialTracks, userId }: TrackListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  const filteredTracks = useMemo(() => {
    return initialTracks.filter((track) => {
      const matchesSearch = 
        track.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.techstack.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = filterType === "All" || track.type === filterType;
      
      return matchesSearch && matchesType;
    });
  }, [searchQuery, filterType, initialTracks]);

  const types = ["All", "Technical", "Behavioral", "System Design", "Pedagogical"];

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search roles or technologies (e.g. React, Manager)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-slate-900 transition-all shadow-inner"
          />
        </div>
        
        <div className="flex gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-x-auto no-scrollbar">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                filterType === type 
                  ? "bg-emerald-600 text-white shadow-lg" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredTracks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTracks.map((track) => (
            <InterviewCard
              key={track.id}
              userId={userId}
              interviewId={track.id}
              role={track.role}
              type={track.type}
              techstack={track.techstack}
              createdAt={track.createdAt}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-20 text-center border-slate-800">
           <Search size={40} className="mx-auto text-slate-700 mb-4 opacity-20" />
           <p className="text-slate-500 font-medium">No tracks found matching "{searchQuery}"</p>
           <button 
            onClick={() => {setSearchQuery(""); setFilterType("All");}}
            className="mt-4 text-emerald-500 text-xs font-bold uppercase tracking-widest hover:underline"
           >
             Clear Filters
           </button>
        </div>
      )}
    </div>
  );
};

export default TrackList;
