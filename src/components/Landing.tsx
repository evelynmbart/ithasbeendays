import { Tracker } from "@/types/tracker.types";
import { useEffect, useState } from "react";
import { SignIn } from "./SignIn";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { TrackerSign } from "./TrackerSign";
import { Incident } from "@/types/incident.types";
import { useRouter } from "next/router";

interface TrackerWithLatestIncident extends Tracker {
  latest_incident: [Incident] | [];
}

export function Landing() {
  const [trackers, setTrackers] = useState<TrackerWithLatestIncident[]>([]);

  const supabase = useSupabaseClient();
  const router = useRouter();

  const fetchTrackers = async () => {
    const { data, error } = await supabase
      .from("trackers")
      .select(
        `
      *,
      latest_incident:incidents(*)
    `
      )
      .order("created_at", { foreignTable: "incidents", ascending: false })
      .limit(1, { foreignTable: "incidents" }) // get only the latest incident date for each tracker
      .limit(1);

    setTrackers(data ?? []);
  };

  useEffect(() => {
    fetchTrackers();
  }, []);

  console.log(trackers);

  return (
    <div>
      <SignIn />
      <h1>It has been 0 days since you visited this site.</h1>
      <p>Sign in to create a tracker.</p>
      <br />
      <hr />
      <br />
      <h3>Here&apos;s a random tracker for your enjoyment:</h3>
      {trackers.map((tracker) => (
        <div key={tracker.id} onClick={() => router.push(`/${tracker.slug}`)}>
          <TrackerSign
            tracker={tracker}
            lastIncident={
              tracker.latest_incident[0]?.created_at
                ? new Date(tracker.latest_incident[0].created_at)
                : undefined
            }
          />
        </div>
      ))}
    </div>
  );
}
