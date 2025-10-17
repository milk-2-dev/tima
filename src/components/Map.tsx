import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { Map, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import type { Coordinates, EventItem } from "@/types";

type Props = {
  events: EventItem[];
  center: Coordinates;
  radius: number;
  onMove: (newCenter: Coordinates, newZoom: number) => void;
};

const EventsMap = ({ events, center, radius, onMove }: Props) => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef(null);
  const marker = useRef<Marker | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [mapInitialized, setMapInitialized] = useState(false);

  const initMap = (center: Coordinates) => {
    if (mapRef.current !== null) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

    const zoom = 10;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center,
      zoom: zoom,
    });

    if (marker.current) {
      marker.current.remove();
    }

    marker.current = new mapboxgl.Marker({ color: "red" })
      .setLngLat(center)
      .addTo(mapRef.current);

    mapRef.current.on("load", () => {
      setMapInitialized(true);
    });
  };

  // const flyToLocation = (center: Coordinates) => {
  //   if (mapRef.current === null) return;

  //   mapRef.current.flyTo({ center, zoom: 14 });

  //   if (marker.current) {
  //     marker.current.setLngLat(center);
  //   } else {
  //     marker.current = new mapboxgl.Marker({ color: "red" })
  //       .setLngLat(center)
  //       .addTo(mapRef.current);
  //   }
  // };

  const updateMarkers = () => {
    const map = mapRef.current;
    if (!map) return;

    // очищаємо старі маркери
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (events.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();

    // створюємо маркери
    events.forEach((event) => {
      const [lng, lat] = event.location.coordinates;

      const marker = new mapboxgl.Marker({ color: "#d669d8" })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2 text-sm">
              <strong>${event.title}</strong><br/>
              <span>📍 ${lat.toFixed(3)}, ${lng.toFixed(3)}</span>
            </div>
          `)
        )
        .addTo(map);

      markersRef.current.push(marker);
      bounds.extend([lng, lat]);
    });

    bounds.extend([center.lng, center.lat]);

    // fit до всіх точок
    // if (events.length > 1) {
      map.fitBounds(bounds, { padding: 80, animate: true, maxZoom: 14 });
    // } else {
    //   const [lng, lat] = events[0].location.coordinates;
    //   map.flyTo({ center: [lng, lat], zoom: 10 });
    // }
  };

  function fitMapToRadius(
    map: mapboxgl.Map,
    lat: number,
    lng: number,
    radiusKm: number
  ) {
    const R = 6371; // радіус Землі
    const dLat = (radiusKm / R) * (180 / Math.PI);
    const dLng =
      (radiusKm / (R * Math.cos((Math.PI * lat) / 180))) * (180 / Math.PI);

    const southWest = [lng - dLng, lat - dLat];
    const northEast = [lng + dLng, lat + dLat];

    const bounds = new mapboxgl.LngLatBounds(southWest, northEast);
    map.fitBounds(bounds, { padding: 60, animate: true });
  }

  useEffect(() => {
    if (!mapInitialized) {
      return initMap(center);
    }
  }, [center]);

  useEffect(() => {
    if (mapInitialized) {
      updateMarkers();
    }
  }, [events, mapInitialized]);

  // 4️⃣ Fallback: якщо подій немає, фокусуємось на центрі або радіусі
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (events.length === 0) {
      fitMapToRadius(map, center.lat, center.lng, radius);
    }
  }, [center, events]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
    };
  }, []);

  return (
    <div
      id="map-container"
      ref={mapContainerRef}
      className="absolute top-0 left-0 w-full h-full"
    />
  );
};

export default EventsMap;
