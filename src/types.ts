import type { Database } from "@/types/supabase";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventCategory = Database["public"]["Tables"]["event_categories"]["Row"];
type EventType = Database["public"]["Tables"]["event_types"]["Row"];

// type CleanEventBase = Omit<
//   EventRow,
//   "author_id" | "created_at" | "event_category_id" | "event_type_id"
// >;
type EventAdress = {
  city: string;
  street: string;
  building: string;
  postal_code: string;
  full_address: string;
};

type CleanEventBase = Pick<
  EventRow,
  | "id"
  | "title"
  | "description"
  // | "adress"
  | "start_datetime"
  | "end_datetime"
  | "venue_name"
  | "location"
>;

// export type EventWithRelations = CleanEventBase & {
//   category: Omit<EventCategory, "created_at">;
//   type: Omit<EventType, "created_at">;
// };

// type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type Expand<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object ? Expand<T[K]> : T[K];
    }
  : T;

export type EventWithRelations = Expand<
  CleanEventBase & {
    adress: EventAdress;
    category: Pick<EventCategory, "description" | "id" | "title">;
    type: Omit<EventType, "created_at">;
  }
>;

export type Latitude = number;
export type Longitude = number;

export type Coordinates = { lng: Longitude; lat: Latitude };
export type Location = { type: string; coordinates: [Longitude, Latitude] };
export type Date = string; // ISO 8601 format: YYYY-MM-DD
export type PlaceType = "postcode" | "locality" | "district" | "region";

export interface Filters {
  lng: Longitude;
  lat: Latitude;
  placeType: PlaceType;
  radius: number; // in kilometers
  eventTypeId: EventTypeId;
  eventCategoryId: EventCategoryId;
  start: Date;
}

export interface MapboxFeature {
  id: string;
  type: "Feature";
  place_type: string[];
  relevance: number;
  text: string; // коротка назва, наприклад "Berlin"
  place_name: string; // повна адреса, наприклад "Berlin, Germany"
  center: [number, number]; // [lng, lat]
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: Record<string, any>;
  context?: {
    id: string;
    text: string;
    wikidata?: string;
    short_code?: string;
  }[];
}

export type EventTypeId = string;
export type EventCategoryId = string;

export type EventItem = EventWithRelations;
