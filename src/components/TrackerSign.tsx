import { Incident } from "@/types/incident.types";
import { Tracker } from "@/types/tracker.types";
import { daysSince } from "@/utils/timing";
import { Display } from "react-7-segment-display";
import styled from "styled-components";

interface Props {
  tracker: Tracker;
  lastIncident?: Date;
}

export function TrackerSign({ tracker, lastIncident }: Props) {
  return (
    <Container>
      <TopBar>It has been</TopBar>
      <Content>
        <DaysContainer>
          <SevenSegment>
            <Display
              value={daysSince(
                new Date(lastIncident ?? tracker.created_at),
                new Date()
              ).toString()}
              count={4}
              height={50}
              color="red"
              skew={false}
            />
          </SevenSegment>
          <div>days</div>
        </DaysContainer>
        since {tracker.since}
      </Content>
    </Container>
  );
}

const Container = styled.div`
  width: 400px;
  border: 2px solid gray;
  border-radius: 10px;
  padding: 8px;
  font-family: Arial, sans-serif;
  color: black;

  * {
    text-decoration: none;
    color: black;
  }
`;

const TopBar = styled.div`
  text-transform: uppercase;
  font-size: 32px;
  font-weight: bold;
  background-color: darkorange;
  border-radius: 8px 8px 0 0;
  text-align: center;
  padding: 4px;
`;

const Content = styled.div`
  margin: 0 20px 16px;
  text-align: center;
  font-weight: bold;
  font-size: 30px;
  line-height: 1.5;
`;

const DaysContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px;
  gap: 16px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 48px;
`;

const SevenSegment = styled.div`
  background: black;
  padding: 4px;
  border: 6px solid white;
  outline: 1px solid gray;

  & * {
    padding: 0 !important;
  }
`;
