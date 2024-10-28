import { SignIn } from "@/components/SignIn";
import { SignOut } from "@/components/SignOut";
import { Database } from "@/types/database.types";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Display } from "react-7-segment-display";

export default function Home() {
  const user = useUser();
  const supabase = useSupabaseClient<Database>();
  const [trackers, setTrackers] = useState<
    Database["public"]["Tables"]["trackers"]["Row"][]
  >([]);
  const [newTracker, setNewTracker] = useState<string>("");

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

  if (!user) return <SignIn />;

  const createTracker = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await supabase.from("trackers").insert({
      email: user.email ?? "",
      since: newTracker
    });
    console.log(data, error);
    fetchTrackers();
  };

  return (
    <>
      <Head>
        <title>it has been days</title>
      </Head>
      <div>
        <p>Signed in as {user.email}</p>
        <SignOut />
        <h1>My trackers:</h1>
        {trackers.map((tracker) => (
          <div key={tracker.id}>{tracker.since}</div>
        ))}
        <form onSubmit={createTracker}>
          <h1>Create tracker:</h1>
          It has been X days since&nbsp;
          <input
            type="text"
            value={newTracker}
            onChange={(e) => setNewTracker(e.target.value)}
          />
          <button type="submit">Create tracker</button>
        </form>
      </div>
    </>
  );
}
