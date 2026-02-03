import { useMemo, useState } from "react";

import { useFiltersStore } from "@/stores/filtersStore";
import { useFiltersSync } from "@/hooks/useFiltersSync";
import { useEvents } from "@/hooks/useEvents";

import "./App.css";
import { Grid, List, MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import FiltersPanel from "@/components/FiltersPanel";
import EventList from "@/components/EventsList";
import { EventsMap } from "@/components/EventsMap";

function App() {
  const { setFilters } = useFiltersStore();
  const [viewMode, setViewMode] = useState("grid");
  const [showMap, setShowMap] = useState(true);

  // Sync filters with URL
  useFiltersSync();

  // Read filters from store
  const {
    lat,
    lng,
    placeType,
    radius,
    eventCategoryId,
    startDate,
    isLoadingLocation,
  } = useFiltersStore();

  const filters = useMemo(
    () => ({
      lat,
      lng,
      placeType,
      radius,
      eventCategoryId,
      startDate,
    }),
    [lat, lng, placeType, radius, eventCategoryId, startDate]
  );

  const { events, isLoading, hasMore, loadMore } = useEvents(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <FiltersPanel
        loading={isLoadingLocation}
        filters={filters}
        onChangeFilters={setFilters}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {!isLoadingLocation && (
            <EventList
              loading={isLoading}
              hasMore={hasMore}
              loadMore={loadMore}
              events={events}
            />
          )}
        </div>

        <div className="lg:sticky lg:top-22 h-[calc(100vh-200px)] min-h-[500px] bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <EventsMap />
        </div>
      </div>
    </div>
  );
}

export default App;
