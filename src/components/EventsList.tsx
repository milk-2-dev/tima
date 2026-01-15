import { useEffect } from "react";
import { MapPin, UserRoundCheck, Timer } from "lucide-react";
import { useInView } from "react-intersection-observer";

import { useUserGeolocation } from "@/hooks/useUserGeolocation";

import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

import type { EventItem } from "@/types/app.types";
import { getDistanceKm } from "@/lib/utils";

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
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex flex-col">
        {events.length > 0 &&
          events.map((item: EventItem) => {
            return <EventsListItem key={item.id} itemData={item} />;
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
    </div>
  );
}

function EventsListItem({ itemData }: { itemData: EventItem }) {
  const { coords } = useUserGeolocation();

  const startDateString: string = itemData.start_datetime.split("T")[0];
  const startTimeString: string = itemData.start_datetime
    .split("T")[1]
    .slice(0, 5);
  const endTimeString: string | null =
    itemData.end_datetime && itemData.end_datetime.split("T")[1].slice(0, 5);

  const eventTime = `${startTimeString}${
    endTimeString ? ` - ${endTimeString}` : ""
  }`;

  const [lng, lat] = itemData.location.coordinates;

  let distance = null;

  if (coords) {
    const km = getDistanceKm(coords.lat, coords.lng, lat, lng);
    distance = Math.ceil(km * 10) / 10;
  }

  return (
    <Item asChild>
      <a href="#">
        <div className="w-full">
          <div className="flex justify-between items-center gap-4">
            <p className="w-full text-muted-foreground text-xs uppercase relative z-0 overflow-hidden after:content-[''] after:absolute after:top-[50%] after:left-[35%] after:border-t after:border-t-gray-200 after:w-full after:-z-10">
              {itemData.type.title}
            </p>

            <p className="text-sm shrink-0">{startDateString}</p>
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
              <p className="">
                {itemData.venue_name} {distance && `(${distance} km)`}
              </p>
              <p className="text-muted-foreground text-xs">
                {itemData.adress.full_address}
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center">
              <Timer size={16} className="text-muted-foreground" />
              <span className="ms-2">{eventTime}</span>
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
