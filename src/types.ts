export type Latitude = number;
export type Longitude = number;

export type Coordinates = { lng: Longitude; lat: Latitude };

export type Date = string; // ISO 8601 format: YYYY-MM-DD
export type PlaceType = "postcode" | "locality" | "district" | "region";

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

export interface Filters {
  lng: Longitude;
  lat: Latitude;
  placeType: PlaceType;
  radius: number; // in kilometers
  eventTypeId: EventTypeId;
  date: Date;
}

export interface EventItem {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
  date: string;
}

export type EventTypeId = string;

export interface EventType {
  id: EventTypeId;
  title: string;
  description: string;
}
