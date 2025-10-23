import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { eventService } from "@/api/services/eventService";
import type { EventItem, Filters } from "@/types";

type EventsContextType = {
  events: EventItem[];
  filteredEvents: EventItem[];
  loading: boolean;
  error: string | null;
  activeFilter: EventFilter;
  fetchEvents: (filters: Filters) => Promise<void>;
  setActiveFilter: (filter: EventFilter) => void;
  clearEvents: () => void;
};

type EventFilter = "all" | "future" | "past" | { date: string };

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<EventFilter>("all");

  const {
    loading: isLoadingEvents,
    data,
    executeQuery,
    isSuccess,
  } = useSupabaseQuery();

  const fetchEvents = useCallback(async (filters: Filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await executeQuery(() =>
        eventService.getEvents(filters)
      );
      if (response && response.data) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
    } catch (err: any) {
      console.error("❌ Помилка запиту подій:", err);
      setError(err.message || "Помилка запиту");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearEvents = useCallback(() => setEvents([]), []);

  // 🧠 Обчислюємо відфільтрований список на льоту
  const filteredEvents = useMemo(() => {
    if (activeFilter === "all") return events;

    const today = new Date().toISOString().slice(0, 10);

    if (activeFilter === "future") {
      return events.filter((e) => e.date >= today);
    }

    if (activeFilter === "past") {
      return events.filter((e) => e.date < today);
    }

    if (typeof activeFilter === "object" && "date" in activeFilter) {
      return events.filter((e) => e.date === activeFilter.date);
    }

    return events;
  }, [events, activeFilter]);

  const value = useMemo(
    () => ({
      events,
      filteredEvents,
      loading,
      error,
      activeFilter,
      fetchEvents,
      setActiveFilter,
      clearEvents,
    }),
    [events, filteredEvents, loading, error, activeFilter, fetchEvents]
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};

export const useEvents = () => {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within an EventsProvider");
  return ctx;
};