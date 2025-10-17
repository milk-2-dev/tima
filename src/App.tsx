import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useUserGeolocation } from "@/hooks/useUserGeolocation";
import { useQuerySync } from "@/hooks/useQuerySync";

import "./App.css";

import { eventService } from "@/api/services/eventService";

import Header from "@/components/Header";
import EventList from "@/components/EventsList";
import Map from "@/components/Map";

import type { Filters, Coordinates, EventItem } from "@/types";

const defaultCenter: Coordinates = { lat: 52.517037, lng: 13.38886 }; // Default to Berlin
const defaultPlaceType = "locality";

function App() {
  const {
    loading: isLoadingEvents,
    data,
    executeQuery,
    isSuccess,
  } = useSupabaseQuery();
  const [searchParams] = useSearchParams();
  const { getCurrentPosition } = useUserGeolocation();

  const [events, setEvents] = useState<EventItem[]>([]);
  // const [location, setLocation] = useState(defaultCenter);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().slice(0, 10);

  const [filters, setFilters] = useState({} as Filters);

  const initializeApp = async () => {
    try {
      setIsAppLoading(true);
      setError(null);

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
        const test1 = Number(latitude);
        const test2 = Number(longitude);
        setFilters((prev) => ({
          ...prev,
          lat: test1,
          lng: test2,
        }));
      }
    } catch (err) {
      console.error("❌ Помилка ініціалізації:", err);
      setError(err.message);
      setFilters((prev) => ({
        ...prev,
        lat: defaultCenter.lat,
        lng: defaultCenter.lng,
      }));
    } finally {
      setIsAppLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  useQuerySync(filters, setFilters, {
    date: today,
    eventTypeId: "1c2e168e-00d9-4895-a10d-9f18646896c2",
    lat: defaultCenter.lat,
    lng: defaultCenter.lng,
    placeType: defaultPlaceType,
    radius: 0
  });

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      fetchEvents();
    }
  }, [filters]);

  const mapCenter = useMemo(() => {
    return {
      lat: Number(filters.lat),
      lng: Number(filters.lng),
    };
  }, [filters.lat, filters.lng]);

  const fetchEvents = async () => {
    console.log("Fetching events start");
    const response = await executeQuery(() => eventService.getEvents(filters));
    if (response && response.data) {
      setEvents(response.data);
    }
  };

  const handleChangeFilters = (newFilters: typeof filters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <>
      <Header
        loading={isAppLoading}
        filters={filters}
        onChangeFilters={handleChangeFilters}
      />
      <div className="flex h-screen bg-gray-200 font-roboto">
        <div className="flex">
          <div className="hidden fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>
          <div
            className="-translate-x-full ease-in fixed inset-y-0 left-0 z-30 w-96
        overflow-y-auto transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0"
          >
            {!isAppLoading && (
              <EventList
                loading={isLoadingEvents}
                isSuccess={isSuccess}
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
    </>
  );
}

export default App;
