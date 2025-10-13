import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

import "./App.css";

import { eventService } from "@/api/services/eventService";

import Header from "@/components/Header";
import EventList from "@/components/EventsList";
import Map from "@/components/Map";

import type { Coordinates } from "@/components/Map";

const defaultCenter: Coordinates = [13.38886, 52.517037]; // Default to Berlin

function App() {
  const [searchParams] = useSearchParams();
  const { loading, data, executeQuery, isSuccess } = useSupabaseQuery();
  const [events, setEvents] = useState<any[]>([]);
  const [location, setLocation] = useState(defaultCenter);

  useEffect(() => {
    fetchEvents();
  }, [searchParams]);

  const fetchEvents = async () => {
    const searchParamsObj = Object.fromEntries(searchParams.entries());
    const response = await executeQuery(() =>
      eventService.getEvents(searchParamsObj)
    );
    if (response && response.data) {
      setEvents(response.data);
    }
  };

  const updateUrlParams = (props) => {
    console.log("updateUrlParams", props);
  };

  return (
    <>
      <Header />
      <div className="flex h-screen bg-gray-200 font-roboto">
        <div className="flex">
          <div className="hidden fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden"></div>
          <div
            className="-translate-x-full ease-in fixed inset-y-0 left-0 z-30 w-96
        overflow-y-auto transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0"
          >
            <EventList
              loading={loading}
              isSuccess={isSuccess}
              events={events}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 relative">
            <Map
              events={events}
              center={location}
              onMove={(newCenter, newZoom) =>
                updateUrlParams({
                  lat: newCenter.lat,
                  lng: newCenter.lng,
                  zoom: newZoom,
                })
              }
            />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
