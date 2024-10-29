import { Landing } from "@/components/Landing";
import { SignOut } from "@/components/SignOut";
import { TrackerForm } from "@/components/TrackerForm";
import { TrackerItem } from "@/components/TrackerItem";
import { Tracker } from "@/types/tracker.types";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [trackers, setTrackers] = useState<Tracker[]>([]);

  const fetchTrackers = async () => {
    if (!user?.email) return;
    const { data, error } = await supabase
      .from("trackers")
      .select("*")
      .eq("email", user.email);
    setTrackers(data ?? []);
  };

  useEffect(() => {
    fetchTrackers();
  }, [user]);

  if (!user) return <Landing />;

  return (
    <>
      <Head>
        <title>it has been days</title>
      </Head>
      <div>
        <p>Signed in as {user.email}</p>
        <SignOut />
        <h2>My trackers:</h2>
        {trackers.length ? (
          <>
            <p>It has been X days since...</p>
            {trackers.map((tracker) => (
              <TrackerItem
                tracker={tracker}
                key={tracker.id}
                refresh={fetchTrackers}
              />
            ))}
          </>
        ) : (
          <p>You have no trackers yet. Create one below.</p>
        )}
      </div>
      <hr />
      <h2>Create a new tracker</h2>
      <TrackerForm onSubmit={fetchTrackers} />
    </>
  );
}
