import { useMemo } from "react";

import { useFiltersStore } from "@/stores/filtersStore";
import { useFiltersSync } from "@/hooks/useFiltersSync";
import { useEvents } from "@/hooks/useEvents";

import "./App.css";

import Header from "@/components/Header";
import EventList from "@/components/EventsList";
import Map from "@/components/Map";

function App() {
  const { setFilters } = useFiltersStore();

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

  const mapCenter = useMemo(() => {
    return {
      lat: Number(lat),
      lng: Number(lng),
    };
  }, [lat, lng]);

  return (
    <div className="flex flex-col h-screen">
      <Header
        loading={isLoadingLocation}
        filters={filters}
        onChangeFilters={setFilters}
      />
      <div className="flex bg-gray-200 font-roboto h-[calc(100vh-65px)]">
        <div className="flex">
          <div className="hidden fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>
          <div
            className="-translate-x-full ease-in fixed inset-y-0 left-0 z-30 w-96
        overflow-y-auto transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0"
          >
            {!isLoadingLocation && (
              <EventList
                loading={isLoading}
                hasMore={hasMore}
                loadMore={loadMore}
                events={events}
              />
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 relative">
            {!isLoadingLocation && (
              <Map
                events={events}
                center={mapCenter}
                radius={filters.radius}
                // onMove={(newCenter, newZoom) =>
                // updateUrlParams({
                //   lat: newCenter.lat,
                //   lng: newCenter.lng,
                //   zoom: newZoom,
                // })
                // }
                onMove={(newCenter, newZoom) => {}}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
