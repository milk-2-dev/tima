import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { useEventsStore } from "@/stores/eventsStore";
import { useFiltersStore } from "@/stores/filtersStore";

import MapMarker from "./MapMarker";
import MapPopup from "./MapPopup";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export function EventsMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const events = useEventsStore((state) => state.events);
  const selectedEvent = useEventsStore((state) => state.selectedEvent);
  const setSelectedEvent = useEventsStore((state) => state.setSelectedEvent);

  const { lng, lat, radius } = useFiltersStore();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: !lng || !lat ? [30.5234, 50.4501] : [lng, lat], // [30.5234, 50.4501], // Київ за замовчуванням
      zoom: 12,
    });

    // Controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );

    //Events
    map.current.on("load", () => {
      console.log("Map loaded");
    });

    map.current.on("moveend", () => {
      console.log("Map move end");
    });

    map.current.on("click", () => {
      const currentSelectedEvent = useEventsStore.getState().selectedEvent;

      //Remove opened popup on map click
      if (currentSelectedEvent) {
        setSelectedEvent(null);
      }

      console.log("Map clicked");
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // ========== Update map when the location changed ==========
  useEffect(() => {
    if (!map.current || !lng || !lat) return;

    map.current.flyTo({
      center: [lng, lat],
      zoom: 12,
      duration: 1000,
    });
  }, [lng, lat]);

  useEffect(() => {
    if (!map.current) return;
    updateMarkers();
  }, [events, selectedEvent]);

  const updateMarkers = () => {
    if (events.length === 0) {
      fitMapToRadius();
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    events.forEach((event) => {
      bounds.extend([...event.location.coordinates]);
    });

    if (lng && lat) {
      bounds.extend([lng, lat]); // add current position from filters
    }

    map.current?.fitBounds(bounds, {
      padding: 80,
      animate: true,
      maxZoom: 14,
    });
  };

  function fitMapToRadius() {
    const R = 6371; // радіус Землі
    const dLat = (radius / R) * (180 / Math.PI);
    const dLng =
      (radius / (R * Math.cos((Math.PI * lat) / 180))) * (180 / Math.PI);

    const southWest = [lng - dLng, lat - dLat];
    const northEast = [lng + dLng, lat + dLat];

    const bounds = new mapboxgl.LngLatBounds(southWest, northEast);
    map.current?.fitBounds(bounds, { padding: 60, animate: true });
  }

  return (
    <div
      id="map-container"
      ref={mapContainer}
      className="absolute top-0 left-0 w-full h-full"
    >
      {map.current &&
        events.length > 0 &&
        events.map((feature) => {
          return (
            <MapMarker
              key={feature.id}
              map={map.current}
              feature={feature}
              isActive={selectedEvent?.id === feature.id}
              onClick={setSelectedEvent}
            />
          );
        })}
      {map.current && (
        <MapMarker
          key="center-marker"
          map={map.current}
          isCenterMarker={true}
          feature={{ location: { coordinates: [lng, lat] } }}
          onClick={() => setSelectedEvent(null)}
        />
      )}

      {map.current && (
        <MapPopup map={map.current} activeFeature={selectedEvent} />
      )}
    </div>
  );
}
