import { TrackerSign } from "@/components/TrackerSign";
import { Incident } from "@/types/incident.types";
import { Tracker } from "@/types/tracker.types";
import { daysSince } from "@/utils/timing";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TrackerPage() {
  const { slug } = useRouter().query;
  const [tracker, setTracker] = useState<Tracker | null>(null);
  const [incident, setIncident] = useState<string>("");
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const supabase = useSupabaseClient();
  const user = useUser();

  const fetchTracker = async () => {
    if (!slug) return;

    const { data, error } = await supabase
      .from("trackers")
      .select("*")
      .eq("slug", slug);
    if (error) {
      alert(error);
      return;
    }

    const { data: incidentsData, error: incidentsError } = await supabase
      .from("incidents")
      .select("*")
      .eq("tracker_id", data?.[0]?.id);
    if (incidentsError) {
      alert(incidentsError);
      return;
    }

    setTracker(data?.[0] ?? null);
    setIncidents(
      incidentsData.sort(
        (a, b) =>
          // Sort in descending order
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ) ?? []
    );
  };

  const deleteIncident = async (id: number) => {
    const { error } = await supabase.from("incidents").delete().eq("id", id);
    if (error) {
      alert(error);
      return;
    }
    fetchTracker();
  };

  useEffect(() => {
    fetchTracker();
  }, [slug]);

  if (!tracker) return null;

  const isOwner = tracker.email === user?.email;

  const declareIncident = async () => {
    if (!incident) return;
    const { error } = await supabase
      .from("incidents")
      .insert({ tracker_id: tracker.id, description: incident });
    if (error) {
      alert(error);
      return;
    }
    fetchTracker();
  };

  return (
    <div>
      <TrackerSign
        tracker={tracker}
        lastIncident={
          incidents[0] ? new Date(incidents[0].created_at) : undefined
        }
      />
      {isOwner && (
        <div>
          <label>
            Description:{" "}
            <input
              type="text"
              value={incident}
              onChange={(e) => setIncident(e.target.value)}
            />{" "}
          </label>
          <button onClick={declareIncident}>DECLARE INCIDENT</button>
        </div>
      )}
      <h3>Incidents:</h3>
      <ul>
        {incidents.map((incident, i) => {
          const date = new Date(incident.created_at);
          const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
          });
          const days = daysSince(
            new Date(
              i < incidents.length - 1
                ? incidents[i + 1].created_at
                : tracker.created_at
            ),
            date
          );
          return (
            <li key={incident.id}>
              [{formattedDate} - {days} days] {incident.description}{" "}
              {isOwner && (
                <button onClick={() => deleteIncident(incident.id)}>
                  Delete
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
