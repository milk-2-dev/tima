import { supabase } from "@/lib/supabase";
import type { Filters } from "@/types/app.types";
import { getDistanceKm } from "@/lib/utils";

export interface FetchEventsParams extends Filters {
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

export interface FetchEventsResponse {
  events: Event[];
  total: number;
  hasMore: boolean;
}

export const eventsService = {
  async fetchEvents(params: FetchEventsParams): Promise<FetchEventsResponse> {
    try {
      const {
        page = 0,
        limit = 20,
        lng,
        lat,
        placeType,
        radius,
        eventTypeId,
        eventCategoryId,
        startDate,
        signal,
      } = params;

      if (signal?.aborted) {
        throw new DOMException("Request aborted", "AbortError");
      }

      const from = page * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("events")
        .select(
          `
    id, title, description, start_datetime, end_datetime, location, min_players, max_players,
    adress, venue_name,
    category: event_categories!event_category_id (id, title, description),
    type: event_types!event_type_id (id, title, description)`,
          { count: "exact" }
        )
        .order("start_datetime", { ascending: false })
        .range(from, to);

      if (startDate) {
        query = query.gte("start_datetime", startDate);
      }

      if (eventCategoryId) {
        query = query.eq("event_category_id", eventCategoryId);
      }

      query.limit(limit);

      // Географічний пошук (якщо є локація)
      // if (location) {
      //   // Supabase PostGIS запит
      //   // Потребує geography column в БД
      //   query = query.lte(
      //     "location",
      //     `POINT(${location.lng} ${location.lat})`,
      //     { radius: radius * 1000 } // метри
      //   );
      // }

      const { data, error, count } = await query.abortSignal(signal);

      if (signal?.aborted) {
        throw new DOMException("Request aborted", "AbortError");
      }

      if (error) throw error;

      const filteredEvents =
        data?.filter((event) => {
          const eventLng = event.location.coordinates[0];
          const eventLat = event.location.coordinates[1];

          const distance = getDistanceKm(lat, lng, eventLat, eventLng);

          const matchesRadius = distance <= radius;

          return matchesRadius;
        }) || [];

      if (signal?.aborted) {
        throw new DOMException("Request aborted", "AbortError");
      }

      const sortedEvents = filteredEvents.sort((a, b) => {
        const [lngA, latA] = a.location.coordinates;
        const [lngB, latB] = b.location.coordinates;
        const distA = getDistanceKm(lat, lng, latA, lngA);
        const distB = getDistanceKm(lat, lng, latB, lngB);
        return distA - distB;
      });

      return {
        events: sortedEvents,
        total: count || 0,
        hasMore: (count || 0) > to + 1,
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        //internal logging for aborted requests
      }
      throw error;
    }
  },

  // Fetch одного івенту
  async fetchEventById(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from("events")
      .select("*, profiles(username, avatar_url), participants(count)")
      .eq("id", id)
      .single();

    if (error) throw error;

    return data
      ? {
          ...data,
          organizer_name: data.profiles?.username,
          organizer_avatar: data.profiles?.avatar_url,
          current_players: data.participants?.[0]?.count || 0,
        }
      : null;
  },

  // Створення івенту
  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from("events")
      .insert(eventData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Оновлення
  async updateEvent(id: string, updates: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from("events")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Видалення
  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) throw error;
  },
};
