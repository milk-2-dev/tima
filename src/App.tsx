import { useState, useEffect } from "react";
import { useSupabaseQuery } from "./hooks/useSupabaseQuery";

import "./App.css";
import { eventService } from "./api/services/eventService";
import Header from "./components/Header";

function App() {
  const [filters, setFilters] = useState({});

  const {
    loading,
    error,
    data: events,
    executeQuery,
    reset,
    isSuccess,
    isError,
  } = useSupabaseQuery();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    await executeQuery(() => eventService.getEvents(filters));
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
            {loading ? (
              "Loading..."
            ) : (
              <ul>
                {isSuccess &&
                  events.map((event) => {
                    return <li key={event.id}>{event.title}</li>;
                  })}
              </ul>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <p>Map</p>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
