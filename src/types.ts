import type { Database } from "@/types/supabase";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventCategory = Database["public"]["Tables"]["event_categories"]["Row"];
type EventType = Database["public"]["Tables"]["event_types"]["Row"];

type CleanEventBase = Omit<
  EventRow,
  "author_id" | "created_at" | "event_category_id" | "event_type_id"
>;

export type EventWithRelations = CleanEventBase & {
  category: Omit<EventCategory, "created_at">;
  type: Omit<EventType, "created_at">;
};

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
  date: Date;
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
// export interface EventType {
//   id: EventTypeId;
//   title: string;
//   description: string;
// }

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: {
    id: EventCategoryId;
    title: string;
    description: string;
  };
  type: {
    id: EventTypeId;
    title: string;
    description: string;
  };
  location: Location;
  date: string;
  min_players: number;
  max_players: number;
}
