import { Tracker } from "@/types/tracker.types";
import styled from "styled-components";

interface Props {
  tracker: Tracker;
}

export function TrackerItem({ tracker }: Props) {
  return (
    <Container>
      <Link href={`/${tracker.slug}`}>{tracker.since}</Link>
      <button>Edit</button>
      <button>Delete</button>
    </Container>
  );
}

const Container = styled.div`
  display: block;
  margin: 1em;
`;

const Link = styled.a``;
