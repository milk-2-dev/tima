import { supabase } from "../apiClient";

export const eventService = {
  // Отримати всіх користувачів
  async getEvents(filters = {}) {
    console.log("Filters:", filters);
    let query = supabase.from("events").select("*");

    if (filters.date) {
      query = query.gte("date", filters.date);
    }

    if (filters.interest) {
      query = query.eq("type", filters.interest);
    }

    if (filters.location || filters.radius) {
      query = query.within("location", filters.location, filters.radius * 1000);
    }

    query.range(0, 9);

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;
    return data;
  },

  // Отримати користувача по ID
  async getUserById(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Створити користувача
  async createUser(userData) {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Оновити користувача
  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Видалити користувача
  async deleteUser(userId) {
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) throw error;
    return true;
  },
};
