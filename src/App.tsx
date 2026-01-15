import { useState, useEffect, useMemo, useContext, useCallback } from "react";
import { useSearchParams } from "react-router";

import { useUserGeolocation } from "@/hooks/useUserGeolocation";
import { useQuerySync } from "@/hooks/useQuerySync";
import { useEvents } from '@/hooks/useEvents';

import "./App.css";

import Header from "@/components/Header";
import EventList from "@/components/EventsList";
import Map from "@/components/Map";

import type { Filters, Coordinates } from "@/types/app.types";

import { FiltersContext } from "@/contexts/FiltersContext";


const defaultCenter: Coordinates = { lat: 52.517037, lng: 13.38886 }; // Default to Berlin
const defaultPlaceType = "locality";

function App() {
  const [searchParams] = useSearchParams();
  const { getCurrentPosition } = useUserGeolocation();

  const [isAppLoading, setIsAppLoading] = useState(true);

  const today = new Date().toISOString().slice(0, 10);

  const [filters, setFilters] = useState({} as Filters);

  const { events, isLoading, hasMore, loadMore } = useEvents(filters);

  const initializeApp = useCallback(async () => {
    try {
      setIsAppLoading(true);

      const latitude = searchParams.get("lat");
      const longitude = searchParams.get("lng");

      if (!latitude && !longitude) {
        console.log("📍 Отримую локацію клієнта...");
        const { lat, lng } = await getCurrentPosition();

        setFilters((prev) => ({
          ...prev,
          lat,
          lng,
        }));
      } else {
        console.log("📍 Використовую локацію із урл...");
        setFilters((prev) => ({
          ...prev,
          lat: Number(latitude),
          lng: Number(longitude),
        }));
      }
    } catch (err) {
      console.error("❌ Помилка ініціалізації:", err);

      setFilters((prev) => ({
        ...prev,
        lat: defaultCenter.lat,
        lng: defaultCenter.lng,
      }));
    } finally {
      setIsAppLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  useQuerySync(filters, setFilters, {
    start: today,
    eventCategoryId: "e31fe882-a8cc-4644-bde9-ed57356dfcef",
    lat: defaultCenter.lat,
    lng: defaultCenter.lng,
    placeType: defaultPlaceType,
    radius: 5,
  });

  const contextFilters = useContext(FiltersContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (Object.keys(filters).length) {
        contextFilters.updateValue(filters);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters]);

  const mapCenter = useMemo(() => {
    return {
      lat: Number(filters.lat),
      lng: Number(filters.lng),
    };
  }, [filters.lat, filters.lng]);

  const handleChangeFilters = (newFilters: typeof filters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        loading={isAppLoading}
        filters={filters}
        onChangeFilters={handleChangeFilters}
      />
      <div className="flex bg-gray-200 font-roboto h-[calc(100vh-65px)]">
        <div className="flex">
          <div className="hidden fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>
          <div
            className="-translate-x-full ease-in fixed inset-y-0 left-0 z-30 w-96
        overflow-y-auto transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0"
          >
            {!isAppLoading && (
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
            {!isAppLoading && (
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
