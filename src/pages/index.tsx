import { CreateTracker } from "@/components/CreateTracker";
import { SignIn } from "@/components/SignIn";
import { SignOut } from "@/components/SignOut";
import { Database } from "@/types/database.types";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const user = useUser();
  const supabase = useSupabaseClient<Database>();
  const [trackers, setTrackers] = useState<
    Database["public"]["Tables"]["trackers"]["Row"][]
  >([]);

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
      </div>
      <hr />
      <CreateTracker refresh={fetchTrackers} />
    </>
  );
}
