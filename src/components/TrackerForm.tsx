import { Tracker } from "@/types/tracker.types";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { FormEvent, useState } from "react";

interface Props {
  onSubmit: () => void;
  editingTracker?: Tracker;
}

export function TrackerForm({ onSubmit, editingTracker }: Props) {
  const [tracker, setTracker] = useState<string>(editingTracker?.since ?? "");
  const [slug, setSlug] = useState<string>(editingTracker?.slug ?? "");

  const user = useUser();
  const supabase = useSupabaseClient();

  if (user === null) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingTracker) {
      const { error } = await supabase
        .from("trackers")
        .update({ since: tracker, slug })
        .eq("id", editingTracker.id);
      if (error) {
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("trackers").insert({
        email: user.email ?? "",
        since: tracker,
        slug
      });
      if (error) {
        alert(error.message);
        return;
      }
    }
    onSubmit();
  };

  const handleSlugChange = (newSlug: string) => {
    // Only allow letters, numbers, and hyphens
    setSlug(newSlug.replace(/[^a-zA-Z0-9-]/g, "").toLocaleLowerCase());
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>
        It has been X days since:{" "}
        <input
          type="text"
          value={tracker}
          onChange={(e) => setTracker(e.target.value)}
        />
      </p>
      <p>
        Slug (can only contain letters, numbers, and hyphens):{" "}
        <input
          type="text"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
        />
      </p>
      <button type="submit">Submit</button>
    </form>
  );
}
