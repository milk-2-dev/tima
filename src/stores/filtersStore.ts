import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { Coordinates, Filters, PlaceType } from "@/types/app.types";

interface FiltersState extends Filters {
  // State

  // Geolocation state
  isLoadingLocation: boolean;
  locationError: string | null;
  hasAskedForLocation: boolean;

  // Actions
  setLocation: (location: Coordinates) => void;
  setPlaceType: (placeType: PlaceType) => void;
  setRadius: (radius: number) => void;
  setCategory: (category: string) => void;
  setStartDate: (date: string) => void;

  // Geolocation actions
  setLoadingLocation: (loading: boolean) => void;
  setLocationError: (error: string | null) => void;
  setHasAskedForLocation: (asked: boolean) => void;

  // Bulk update (для синхронізації з URL)
  setFilters: (filters: Partial<FiltersState>) => void;

  // Reset
  resetFilters: () => void;
}

const DEFAULT_COORDINATES: Coordinates = { lat: 52.517037, lng: 13.38886 }; // Default to Berlin
const DEFAULT_RADIUS = 10;
const DEFAULT_PLACE_TYPE = "locality";
const DEFAULT_CATEGORY_ID = "e31fe882-a8cc-4644-bde9-ed57356dfcef";

const initialState = {
  lat: null,
  lng: null,
  placeType: DEFAULT_PLACE_TYPE,
  radius: DEFAULT_RADIUS,
  eventCategoryId: DEFAULT_CATEGORY_ID,
  startDate: new Date().toISOString().slice(0, 10),
  isLoadingLocation: false,
  locationError: null,
  hasAskedForLocation: false,
};

export const useFiltersStore = create<FiltersState>()(
  devtools(
    (set) => ({
      ...initialState,

      setDefaultLocation: () =>
        set({ lat: DEFAULT_COORDINATES.lat, lng:DEFAULT_COORDINATES.lng, locationError: null }, false, "setLocation"),
      
      setLocation: ({ lat, lng }) =>
        set({ lat, lng, locationError: null }, false, "setLocation"),

      setRadius: (radius) => set({ radius }, false, "setRadius"),

      setCategory: (eventCategoryId) =>
        set({ eventCategoryId }, false, "setCategory"),

      setStartDate: (startDate) => set({ startDate }, false, "setStartDate"),

      setLoadingLocation: (isLoadingLocation) =>
        set({ isLoadingLocation }, false, "setLoadingLocation"),

      setLocationError: (locationError) =>
        set({ locationError }, false, "setLocationError"),

      setHasAskedForLocation: (hasAskedForLocation) =>
        set({ hasAskedForLocation }, false, "setHasAskedForLocation"),

      setFilters: (filters) =>
        set(
          (state) => ({
            ...state,
            ...filters,
          }),
          false,
          "setFilters"
        ),

      resetFilters: () =>
        set(
          {
            ...initialState,
            hasAskedForLocation: true, // зберігаємо, що вже питали
          },
          false,
          "resetFilters"
        ),
    }),
    { name: "FiltersStore" }
  )
);
