import { Database } from "@/types/database.types";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Tracker() {
  const { tracker: trackerID } = useRouter().query;
  const [tracker, setTracker] = useState<
    Database["public"]["Tables"]["trackers"]["Row"] | null
  >(null);
  const supabase = useSupabaseClient<Database>();
  const user = useUser();

  const fetchTracker = async () => {
    if (!trackerID) return;
    const { data, error } = await supabase
      .from("trackers")
      .select("*")
      .eq("id", trackerID);
    setTracker(data?.[0] ?? null);
  };

  useEffect(() => {
    fetchTracker();
  }, [trackerID]);

  if (!tracker) return null;

  const daysSince = Math.floor(
    (new Date().getTime() - new Date(tracker.created_at).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div>
      <p>Am I the owner? {tracker.email === user?.email ? "Yes" : "No"}</p>
      <p>
        It has been {daysSince} days since {tracker.since}
      </p>
      <button>DECLARE INCIDENT</button>
      <h3>Incidents:</h3>
      <ul>
        <li>Incident 1</li>
      </ul>
    </div>
  );
}
