import { Link } from "react-router";

import { MapPin, CalendarIcon, Clock } from "lucide-react";

import { useFiltersStore } from "@/stores/filtersStore";
import { useEventsStore } from "@/stores/eventsStore";

import { Badge } from "@/components/ui/badge";
import { AvailableSpots } from "@/components/events/AvailableSpots";
import Participants from "@/components/Participants";

import type { EventItem } from "@/types/app.types";
import { getDistanceKm } from "@/lib/utils";

import { isFull, getEventTime, getFormatedDate, sportColors } from "@/helpers";

function EventCard({
  itemData,
  mode = "default",
}: {
  itemData: EventItem;
  mode?: string;
}) {
  const { lat: filtersLat, lng: filtersLng } = useFiltersStore();
  const { setHoveredEvent, selectedEvent } = useEventsStore();

  const isSelected = selectedEvent?.id === itemData.id;

  const full = isFull(itemData);
  const eventTime = getEventTime(itemData);
  const spotsLeft = itemData.max_players - itemData.current_players;

  const [lng, lat] = itemData.location.coordinates;

  let distance = null;

  if (filtersLat && filtersLng) {
    const km = getDistanceKm(filtersLat, filtersLng, lat, lng);
    distance = Math.ceil(km * 10) / 10;
  }

  return (
    <div
      className={`bg-white rounded-xl  transition-all duration-200 cursor-pointer overflow-hidden 
        ${mode === "deafult" ? "border hover:shadow-lg" : " "}
        ${full ? "opacity-75" : ""}
        ${
          isSelected && mode === "default"
            ? "border border-blue-500 ring-2 ring-blue-100 shadow-lg"
            : "border border-slate-100 hover:border-slate-200"
        }
        `}
      onMouseEnter={() => setHoveredEvent(itemData)}
      onMouseLeave={() => setHoveredEvent(null)}
    >
      <div className="relative h-36">
        <img
          src={itemData.image}
          alt={itemData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge
              className={`${
                sportColors[itemData.category.title] ||
                "bg-slate-100 text-slate-700"
              }`}
            >
              {itemData.category.title.charAt(0).toUpperCase() +
                itemData.category.title.slice(1)}
            </Badge>

            <Badge className={`${"bg-slate-100 text-slate-700"}`}>
              {itemData.type.title.charAt(0).toUpperCase() +
                itemData.type.title.slice(1)}
            </Badge>
          </div>
          <div>
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-sm font-semibold text-slate-900">
              {itemData?.price ? `$${itemData?.price}` : "Free"}
            </div>

            {full && (
              <div className="bg-red/90 backdrop-blur-sm rounded-lg px-2 py-1 text-sm font-semibold text-slate-900">
                FULL
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">
          <Link to={`/events/${itemData.id}`} id={`event-${itemData.id}`}>
            {itemData.title}
          </Link>
        </h3>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4 text-slate-400" />
              <span>{getFormatedDate(itemData.start_datetime)}</span>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{eventTime.getRange()}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <MapPin className="w-4 h-4 text-slate-400" />
            {/* <span className="line-clamp-1">{itemData.location}</span> */}
            <div>
              <p className="text-slate-600 line-clamp-1">
                {itemData.venue_name} {distance && `(${distance} km)`}
              </p>
              <p className=" text-xs text-slate-400">
                {itemData.adress.full_address}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Participants count={itemData.current_players} />
            <div className="flex items-center gap-1.5 text-black/70">
              <AvailableSpots event={itemData} variant="compact" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${
                spotsLeft <= 5
                  ? "bg-red-500"
                  : spotsLeft <= 10
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
            />
            <span className="text-xs text-slate-500">
              {spotsLeft} spots left
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
