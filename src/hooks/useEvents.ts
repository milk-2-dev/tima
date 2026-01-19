import { useCallback, useEffect } from 'react';
import { useEventsStore } from '@/stores/eventsStore';
import { eventsService } from '@/services/supabase/eventsService';
import type { FetchEventsParams } from '@/services/supabase/eventsService';

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

  // Завантаження першої сторінки
  const fetchEvents = useCallback(async () => {
    if (filters && Object.keys(filters).length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const response = await eventsService.fetchEvents({
        ...filters,
        page: 0,
      });

      setEvents(response.events);
      setPagination(0, response.hasMore, response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [filters, setEvents, setLoading, setError, setPagination]);

  // Завантаження наступної сторінки (infinite scroll)
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
      setError(err instanceof Error ? err.message : 'Failed to load more events');
    } finally {
      setLoading(false);
    }
  }, [filters, page, hasMore, isLoading, appendEvents, setLoading, setError, setPagination]);

  // Рефреш (перезавантаження з початку)
  const refresh = useCallback(() => {
    reset();
    fetchEvents();
  }, [fetchEvents, reset]);

  // Auto-fetch при зміні фільтрів
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

// Окремий хук для одного івенту
export function useEvent(id: string) {
  const { selectedEvent, setSelectedEvent, setLoading, setError } = useEventsStore();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const event = await eventsService.fetchEventById(id);
        setSelectedEvent(event);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, setSelectedEvent, setLoading, setError]);

  return selectedEvent;
}