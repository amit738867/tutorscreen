import Link from "next/link";
import { Button } from "@/components/ui/button";
import TrackList from "@/components/TrackList";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getLatestInterviews } from "@/lib/actions/general.action";
import { staticTracks } from "@/constants/tracks";

async function InterviewsPage() {
  const user = await getCurrentUser();
  const dbInterviews = await getLatestInterviews({ userId: user?.id! });
  
  // Combine DB tracks with static expert tracks
  const allInterviews = [...(dbInterviews || []), ...staticTracks];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            Roadmap
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Available <span className="text-emerald-500 italic lowercase">Tracks</span>
          </h1>
          <p className="text-slate-500 max-w-xl">
            Explore 75+ public interview modules calibrated by industry experts. Use search to find your specific role.
          </p>
        </div>
      </div>

      <TrackList initialTracks={allInterviews || []} userId={user?.id} />
    </div>
  );
}

export default InterviewsPage;
