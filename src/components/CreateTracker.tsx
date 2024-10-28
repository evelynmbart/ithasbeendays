import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { FormEvent, useState } from "react";

interface Props {
  refresh: () => Promise<void>;
}

export function CreateTracker({ refresh }: Props) {
  const [tracker, setTracker] = useState<string>("");
  const [slug, setSlug] = useState<string>("");

  const user = useUser();
  const supabase = useSupabaseClient();

  if (user === null) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.from("trackers").insert({
      email: user.email ?? "",
      since: tracker,
      slug
    });
    if (error) {
      alert(error.message);
      return;
    }
    refresh();
  };

  const handleSlugChange = (newSlug: string) => {
    // Only allow letters, numbers, and hyphens
    setSlug(newSlug.replace(/[^a-zA-Z0-9-]/g, "").toLocaleLowerCase());
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create tracker</h1>
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
