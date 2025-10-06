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

  // Отримати користувача по ID
  async getById(userId) {
    const { data, error } = await supabase.from("event_types").select("*");

    if (error) throw error;
    return data;
  },

  // Створити користувача
  async create(userData) {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Оновити користувача
  async update(userId, updates) {
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
  async delete(userId) {
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) throw error;
    return true;
  },
};
