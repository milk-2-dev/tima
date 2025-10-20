import { useMemo, useContext, useState } from "react";
import { MapPin, UserRoundCheck, Timer } from "lucide-react";

import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import type { EventItem } from "@/types";

import { FiltersContext } from "@/contexts/FiltersContext";

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
  const [useSortBy, setSortBy] = useState("targetDate");

  const filterContext = useContext(FiltersContext);

  const sorrtedEvents = useMemo(() => {
    return events.filter((item) => {
      const targetDate = new Date(filterContext.value?.date);
      const eventDate = new Date(item.date);
      return useSortBy === "targetDate"
        ? eventDate.toDateString() === targetDate.toDateString()
        : eventDate.toDateString() > targetDate.toDateString();
    });
  }, [events, useSortBy]);

  const handleTargetDateEvents = () => {
    setSortBy("targetDate");
  };

  const handleUpcomingEvents = () => {
    setSortBy("upcoming");
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center gap-4 px-4 pt-4">
        <div className="flex items-center justify-between gap-2">
          <Button
            variant={useSortBy === "upcoming" ? "outline" : "default"}
            className="max-sm:h-8 max-sm:px-2.5!"
            onClick={handleTargetDateEvents}
          >
            Target date
          </Button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            variant={useSortBy === "targetDate" ? "outline" : "default"}
            className="max-sm:h-8 max-sm:px-2.5!"
            onClick={handleUpcomingEvents}
          >
            Upcoming
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        {loading ? (
          <>
            <SkeletonDemo />
            <div className="my-4" />
            <SkeletonDemo />
          </>
        ) : isSuccess && sorrtedEvents.length > 0 ? (
          sorrtedEvents.map((item: EventItem) => {
            return <EventsListItem key={item.id} itemData={item} />;
          })
        ) : (
          <EventsListEmpty
            sortedBy={useSortBy}
            date={filterContext.value.date}
          />
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
              Training
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

function EventsListEmpty(sortedBy, date) {
  const text = useMemo(() => {
    return sortedBy === "targetDate"
      ? `No events found for ${date}`
      : `No upcoming events found`;
  }, [sortedBy]);

  return (
    <Item>
      <ItemContent>
        <ItemTitle className="font-semibold">{text}</ItemTitle>
      </ItemContent>
    </Item>
  );
}

export default EventsList;
