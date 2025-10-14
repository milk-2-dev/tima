import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { Map, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export type Coordinates = { lng: number; lat: number };

type Props = {
  events: any[]; // Array of event objects with at least { id, latitude, longitude }
  center: Coordinates;
  onMove: (newCenter: { lat: number; lng: number }, newZoom: number) => void;
};

const EventsMap = ({ events, center, onMove }: Props) => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef(null);
  const marker = useRef<Marker | null>(null);
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

  const flyToLocation = (center: Coordinates) => {
    if (mapRef.current === null) return;

    mapRef.current.flyTo({ center, zoom: 14 });

    if (marker.current) {
      marker.current.setLngLat(center);
    } else {
      marker.current = new mapboxgl.Marker({ color: "red" })
        .setLngLat(center)
        .addTo(mapRef.current);
    }
  };

  useEffect(() => {
    if (!mapInitialized) {
      return initMap(center);
    } else {
      flyToLocation(center);
    }
  }, [center]);

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
