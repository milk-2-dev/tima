import { useEffect } from "react";

import { useInView } from "react-intersection-observer";

import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import EventCard from "@/components/EventCard";

import type { EventItem } from "@/types/app.types";

type Props = {
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  events: EventItem[];
};

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

function EventsList({ events, loading, hasMore, loadMore }: Props) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  return (
    <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
      {events.length > 0 &&
        events.map((item: EventItem) => {
          return (
            <div
              className="hover:cursor-default"
              key={item.id}
            >
              <EventCard itemData={item} />
            </div>
          );
        })}

      {!loading && events.length === 0 && <EventsListIsEmpty />}

      {hasMore && (
        <div ref={ref}>
          <SkeletonDemo />
          <div className="my-4" />
          <SkeletonDemo />
        </div>
      )}
    </div>
  );
}

function EventsListIsEmpty() {
  const text = `No events found`;

  return (
    <Item>
      <ItemContent className="min-h-24 flex-col justify-center items-center">
        <ItemTitle className="justify-center">{text}</ItemTitle>
      </ItemContent>
    </Item>
  );
}

export default EventsList;
