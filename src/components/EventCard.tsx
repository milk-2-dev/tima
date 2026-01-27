import { format } from "date-fns";

import {
  MapPin,
  UserRoundCheck,
  Timer,
  CalendarDays,
  Settings2,
} from "lucide-react";

import { useFiltersStore } from "@/stores/filtersStore";

import { ItemContent, ItemTitle } from "@/components/ui/item";

import type { EventItem } from "@/types/app.types";
import { getDistanceKm } from "@/lib/utils";
import { useEventsStore } from "@/stores/eventsStore";

function EventCard({ itemData }: { itemData: EventItem }) {
  const { lat: filtersLat, lng: filtersLng } = useFiltersStore();
  const { setHoveredEvent } = useEventsStore();

  const startDateString: string = format(
    new Date(itemData.start_datetime),
    "E dd MMM	yyyy"
  ); //itemData.start_datetime.split("T")[0];
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

  if (filtersLat && filtersLng) {
    const km = getDistanceKm(filtersLat, filtersLng, lat, lng);
    distance = Math.ceil(km * 10) / 10;
  }

  return (
    <div
      className="w-full"
      onMouseEnter={() => setHoveredEvent(itemData)}
      onMouseLeave={() => setHoveredEvent(null)}
    >
      <div className="flex mb-2">
        <div className="w-full flex items-center gap-4">
          <ItemContent className="me-2">
            <ItemTitle className="font-semibold text-sm">
              <a href="#">{itemData.title}</a>
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

      <div className="flex gap-2 text-sm">
        <div className="min-w-1/2">
          <div className="flex items-center">
            <CalendarDays size={16} className="text-muted-foreground" />
            <span className="ms-2 shrink-0">{startDateString}</span>
          </div>
          <div className="flex items-center">
            <Timer size={16} className="text-muted-foreground" />
            <span className="ms-2 shrink-0">{eventTime}</span>
          </div>
        </div>

        <div className="">
          <div className="flex items-center">
            <Settings2 size={16} className="text-muted-foreground" />
            <span className="text-sm ms-2">{itemData.type.title}</span>
          </div>
          <div className="flex items-center">
            <UserRoundCheck size={16} className="text-muted-foreground" />
            <span className="text-sm ms-2 shrink-0">7/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
