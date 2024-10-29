import { Tracker } from "@/types/tracker.types";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import { TrackerForm } from "./TrackerForm";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface Props {
  tracker: Tracker;
  refresh: () => void;
}

export function TrackerItem({ tracker, refresh }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const supabase = useSupabaseClient();

  const handleDelete = async () => {
    const { error } = await supabase
      .from("trackers")
      .delete()
      .eq("id", tracker.id);
    if (error) {
      alert(error.message);
      return;
    }
    refresh();
  };

  return (
    <Container>
      <Item>
        <Link href={`/${tracker.slug}`}>{tracker.since}</Link>
        <button onClick={() => setIsEditing(!isEditing)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </Item>
      {isEditing && (
        <TrackerForm
          editingTracker={tracker}
          onSubmit={() => {
            setIsEditing(false);
            refresh();
          }}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: block;
  margin: 1em;
`;

const Item = styled.div`
  display: flex;
  gap: 5px;
`;
