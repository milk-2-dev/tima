import { supabase } from "../apiClient";

export const eventCategoriesService = {
  async getData() {
    const query = supabase.from("event_categories").select("*");

    const { data, error } = await query.order("title", {
      ascending: true,
    });

    if (error) throw error;
    return data;
  },
};
