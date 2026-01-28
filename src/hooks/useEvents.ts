import { useCallback, useEffect, useRef } from "react";
import { useEventsStore } from "@/stores/eventsStore";
import { eventsService } from "@/services/supabase/eventsService";
import type { FetchEventsParams } from "@/services/supabase/eventsService";

export function useEvents(filters?: FetchEventsParams) {
  const {
    events,
    isLoading,
    error,
    page,
    hasMore,
    total,
    setEvents,
    appendEvents,
    setLoading,
    setError,
    setPagination,
    reset,
  } = useEventsStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelPreviousRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    if (
      filters &&
      Object.keys(filters).length === 0 &&
      filters.lng &&
      filters.lat
    )
      return;

    // Canceling previous request
    cancelPreviousRequest();

    try {
      setLoading(true);
      setError(null);

      abortControllerRef.current = new AbortController();

      const response = await eventsService.fetchEvents({
        ...filters,
        page: 0,
        signal: abortControllerRef.current.signal,
      });

      setEvents(response.events);
      setPagination(0, response.hasMore, response.total);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        console.log("Request was cancelled");
        return;
      }

      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [filters, setEvents, setLoading, setError, setPagination]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;

      const response = await eventsService.fetchEvents({
        ...filters,
        page: nextPage,
      });

      appendEvents(response.events);
      setPagination(nextPage, response.hasMore, response.total);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load more events"
      );
    } finally {
      setLoading(false);
    }
  }, [
    filters,
    page,
    hasMore,
    isLoading,
    appendEvents,
    setLoading,
    setError,
    setPagination,
  ]);

  const refresh = useCallback(() => {
    reset();
    fetchEvents();
  }, [fetchEvents, reset]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    hasMore,
    total,
    loadMore,
    refresh,
  };
}

export function useEvent(id: string) {
  const { selectedEvent, setSelectedEvent, setLoading, setError } =
    useEventsStore();

  useEffect(() => {
    if (selectedEvent?.id === id) {
      return;
    }

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const event = await eventsService.fetchEventById(id);
        setSelectedEvent(event);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, setSelectedEvent, setLoading, setError]);

  return selectedEvent;
}
