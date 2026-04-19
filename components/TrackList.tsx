"use client";

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import InterviewCard from './InterviewCard';

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
    <div className="space-y-12">
      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search roles or technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 pl-14 pr-6 bg-card-bg border border-border-color rounded-[1.5rem] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all shadow-sm font-bold"
          />
        </div>
        
        <div className="flex gap-2 p-2 bg-bg-secondary border border-border-color rounded-[1.5rem] overflow-x-auto no-scrollbar shadow-inner">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-8 h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap ${
                filterType === type 
                  ? "bg-accent text-white shadow-lg shadow-accent/20" 
                  : "text-text-secondary hover:text-accent hover:bg-accent/5"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredTracks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
        <div className="bg-card-bg p-24 text-center border-2 border-dashed border-border-color rounded-[3rem]">
           <Search size={48} className="mx-auto text-text-secondary mb-6 opacity-20" />
           <p className="text-text-secondary font-black uppercase tracking-[0.2em] text-sm">Protocol "{searchQuery}" Not Found</p>
           <button 
            onClick={() => {setSearchQuery(""); setFilterType("All");}}
            className="mt-6 text-accent text-[10px] font-black uppercase tracking-[0.4em] hover:underline"
           >
             Reset Intelligence Feed
           </button>
        </div>
      )}
    </div>
  );
};

export default TrackList;
