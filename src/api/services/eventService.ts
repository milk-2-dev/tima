import type { EventItem, Filters } from "@/types";
import { supabase } from "../apiClient";
import { getDistanceKm } from "@/lib/utils";

export const eventService = {
  // Отримати всіх користувачів
  async getEvents(filters: Filters): Promise<EventItem[]> {
    let query = supabase.from("events").select("*");

    if (filters.date) {
      query = query.gte("date", filters.date);
    }

    if (filters.eventTypeId) {
      query = query.eq("type", filters.eventTypeId);
    }

    query.limit(20);

    const { data, error } = await query.order("date", {
      ascending: false,
    });

    if (error) throw error;

    const filtered = (data as EventItem[]).filter((event) => {
      const [lng, lat] = event.location.coordinates;

      // обчислюємо відстань
      const distance = getDistanceKm(filters.lat, filters.lng, lat, lng);

      const matchesRadius = distance <= filters.radius;

      return matchesRadius;
    });

    // 3️⃣ Сортуємо за відстанню (опціонально)
    const sorted = filtered.sort((a, b) => {
      const [lngA, latA] = a.location.coordinates;
      const [lngB, latB] = b.location.coordinates;
      const distA = getDistanceKm(filters.lat, filters.lng, latA, lngA);
      const distB = getDistanceKm(filters.lat, filters.lng, latB, lngB);
      return distA - distB;
    });

    return sorted;
  },

  // Отримати користувача по ID
  // async getUserById(userId) {
  //   const { data, error } = await supabase
  //     .from("users")
  //     .select("*")
  //     .eq("id", userId)
  //     .single();

  //   if (error) throw error;
  //   return data;
  // },

  // // Створити користувача
  // async createUser(userData) {
  //   const { data, error } = await supabase
  //     .from("users")
  //     .insert([userData])
  //     .select()
  //     .single();

  //   if (error) throw error;
  //   return data;
  // },

  // // Оновити користувача
  // async updateUser(userId, updates) {
  //   const { data, error } = await supabase
  //     .from("users")
  //     .update(updates)
  //     .eq("id", userId)
  //     .select()
  //     .single();

  //   if (error) throw error;
  //   return data;
  // },

  // // Видалити користувача
  // async deleteUser(userId) {
  //   const { error } = await supabase.from("users").delete().eq("id", userId);

  //   if (error) throw error;
  //   return true;
  // },
};
