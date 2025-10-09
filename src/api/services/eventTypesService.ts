import { supabase } from "../apiClient";

export const eventTypesService = {
  // Отримати всіх користувачів
  async getData() {
    const query = supabase.from("event_types").select("*");

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data;
  },
};
