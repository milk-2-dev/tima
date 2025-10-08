import React from "react";

type Props = {
  loading: boolean;
  isSuccess: boolean;
  events: { id: string; title: string }[] | null;
};

function EventsList({ loading, isSuccess, events }: Props) {
  return (
    <ul>
      {isSuccess && events !== null
        ? events.map((event) => {
            return <li key={event.id}>{event.title}</li>;
          })
        : "No events found"}
    </ul>
  );
}

export default EventsList;
