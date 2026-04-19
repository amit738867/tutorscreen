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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border-color pb-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.3em]">
            Roadmap
          </div>
          <h1 className="text-6xl font-black text-text-primary tracking-tighter leading-none">
            Available <span className="text-accent italic lowercase">Tracks</span>
          </h1>
          <p className="text-text-secondary max-w-xl font-bold text-lg">
            Explore 75+ public interview modules calibrated by industry experts. Use search to find your specific role.
          </p>
        </div>
      </div>

      <TrackList initialTracks={allInterviews || []} userId={user?.id} />
    </div>
  );
}

export default InterviewsPage;
