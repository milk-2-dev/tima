import { useMemo } from "react";
import { MapPin, UserRoundCheck, Timer } from "lucide-react";

import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

import type { EventItem } from "@/types";

type Props = {
  loading: boolean;
  isSuccess: boolean;
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

function EventsList({ loading, isSuccess, events }: Props) {
  const groupByDateEvents = useMemo(() => {
    if (!events || events.length === 0) return [];

    return events.reduce((acc, event) => {
      const dateKey = event.date.split("T")[0]; // "2025-10-21"
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    }, {});
  }, [events]);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col">
        {loading ? (
          <>
            <SkeletonDemo />
            <div className="my-4" />
            <SkeletonDemo />
          </>
        ) : (
          isSuccess &&
          Object.entries(groupByDateEvents).map(([date, events]) => (
            <div key={date} className="">
              <div className="text-white py-4 sticky top-0 bg-primary shadow-sm z-10">
                <h4 className="text-sm text-center leading-none font-medium">
                  {date}
                </h4>
              </div>
              {events.length > 0 ? (
                events.map((item: EventItem) => {
                  return <EventsListItem key={item.id} itemData={item} />;
                })
              ) : (
                <EventsListEmpty date={date} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EventsListItem({ itemData }: { itemData: EventItem }) {
  return (
    <Item asChild>
      <a href="#">
        <div className="w-full">
          <div className="flex justify-between items-center gap-4">
            <p className="w-full text-muted-foreground text-xs uppercase relative z-0 overflow-hidden after:content-[''] after:absolute after:top-[50%] after:left-[35%] after:border-t after:border-t-gray-200 after:w-full after:-z-10">
              {itemData.type.title}
            </p>

            <p className="text-sm">28.10.2025</p>
          </div>

          <div className="flex mb-2">
            <div className="w-full flex items-center gap-4">
              <ItemContent className="me-2">
                <ItemTitle className="font-semibold text-sm">
                  {itemData.title}
                </ItemTitle>
              </ItemContent>
            </div>
          </div>

          <div className="text-sm flex gap-2 mb-1">
            <MapPin size={16} className="text-muted-foreground" />
            <div>
              <p className="">BSV Brochterbeck (3.5 km)</p>
              {/* <p className="text-muted-foreground text-xs">
                    Brochterbeck, Am Sportweg 5
                  </p> */}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center">
              <Timer size={16} className="text-muted-foreground" />
              <span className="ms-2">18:15 - 19:15</span>
            </div>

            <div className="flex items-center">
              <UserRoundCheck size={16} className="text-muted-foreground" />
              <span className="text-sm ms-2">7/10</span>
            </div>
          </div>
        </div>
      </a>
    </Item>
  );
}

function EventsListEmpty(date) {
  const text = `No events found for ${date}`;

  return (
    <Item>
      <ItemContent className="min-h-24 flex-col justify-center items-center">
        <ItemTitle className="justify-center">{text}</ItemTitle>
      </ItemContent>
    </Item>
  );
}

export default EventsList;
