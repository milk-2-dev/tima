import { supabase } from "@/lib/supabase";
import type { Event } from "@/stores/eventsStore";
import { getDistanceKm } from "@/lib/utils";

export interface FetchEventsParams {
  page?: number;
  limit?: number;
  category?: string;
  location?: { lat: number; lng: number };
  radius?: number; // в км
  date?: string;
  skill_level?: string;
}

export interface FetchEventsResponse {
  events: Event[];
  total: number;
  hasMore: boolean;
}

export const eventsService = {
  // Fetch з пагінацією та фільтрами
  async fetchEvents(params: FetchEventsParams): Promise<FetchEventsResponse> {
    const {
      page = 0,
      limit = 20,
      lng,
      lat,
      placeType,
      radius,
      eventTypeId,
      eventCategoryId,
      start,
    } = params;

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

    if (start) {
      query = query.gte("start_datetime", start);
    }

    if (eventCategoryId) {
      query = query.eq("event_category_id", eventCategoryId);
    }

    query.limit(20);

    // if (date) {
    //   const startOfDay = new Date(date);
    //   startOfDay.setHours(0, 0, 0, 0);
    //   const endOfDay = new Date(date);
    //   endOfDay.setHours(23, 59, 59, 999);

    //   query = query
    //     .gte("date_time", startOfDay.toISOString())
    //     .lte("date_time", endOfDay.toISOString());
    // }

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

    const { data, error, count } = await query;

    if (error) throw error;

    // const events =
    //   data?.map((event: any) => ({
    //     ...event,
    //     organizer_name: event.profiles?.username,
    //     organizer_avatar: event.profiles?.avatar_url,
    //     current_players: event.participants?.length || 0,
    //   })) || [];

    const filteredEvents =
      data?.filter((event) => {
        const [lng, lat] = event.location.coordinates;

        // обчислюємо відстань
        const distance = getDistanceKm(lat, lng, lat, lng);

        const matchesRadius = distance <= radius;

        return matchesRadius;
      }) || [];

    // 3️⃣ Сортуємо за відстанню (опціонально)
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
