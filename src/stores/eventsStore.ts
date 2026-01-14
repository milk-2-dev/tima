import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { EventItem } from '@/types/app.types'; // винесіть типи окремо

interface EventsState {
  // State
  events: EventItem[];
  selectedEvent: EventItem | null;
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  page: number;
  hasMore: boolean;
  total: number;
  
  // Actions
  setEvents: (events: EventItem[]) => void;
  appendEvents: (events: EventItem[]) => void; // для infinite scroll
  addEvent: (event: EventItem) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;
  setSelectedEvent: (event: EventItem | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPagination: (page: number, hasMore: boolean, total: number) => void;
  clearEvents: () => void;
  reset: () => void;
}

const initialState = {
  events: [],
  selectedEvent: null,
  isLoading: false,
  error: null,
  page: 0,
  hasMore: true,
  total: 0,
};

export const useEventsStore = create<EventsState>()(
  devtools(
    (set) => ({
      ...initialState,

      setEvents: (events) =>
        set({ events, error: null }, false, 'setEvents'),

      appendEvents: (newEvents) =>
        set(
          (state) => ({
            events: [...state.events, ...newEvents],
          }),
          false,
          'appendEvents'
        ),

      addEvent: (event) =>
        set(
          (state) => ({ 
            events: [event, ...state.events],
            total: state.total + 1,
          }),
          false,
          'addEvent'
        ),

      updateEvent: (id, updates) =>
        set(
          (state) => ({
            events: state.events.map((event) =>
              event.id === id ? { ...event, ...updates } : event
            ),
            selectedEvent:
              state.selectedEvent?.id === id
                ? { ...state.selectedEvent, ...updates }
                : state.selectedEvent,
          }),
          false,
          'updateEvent'
        ),

      deleteEvent: (id) =>
        set(
          (state) => ({
            events: state.events.filter((event) => event.id !== id),
            selectedEvent:
              state.selectedEvent?.id === id ? null : state.selectedEvent,
            total: state.total - 1,
          }),
          false,
          'deleteEvent'
        ),

      setSelectedEvent: (event) =>
        set({ selectedEvent: event }, false, 'setSelectedEvent'),

      setLoading: (loading) =>
        set({ isLoading: loading }, false, 'setLoading'),

      setError: (error) =>
        set({ error }, false, 'setError'),

      setPagination: (page, hasMore, total) =>
        set({ page, hasMore, total }, false, 'setPagination'),

      clearEvents: () =>
        set({ events: [], selectedEvent: null, error: null }, false, 'clearEvents'),

      reset: () =>
        set(initialState, false, 'reset'),
    }),
    { name: 'EventsStore' }
  )
);