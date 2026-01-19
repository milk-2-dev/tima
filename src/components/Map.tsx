import { useEffect, useRef, useState } from "react";

import type { Ref } from "react";
import type { Map } from "mapbox-gl";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import MapMarker from "./MapMarker";
import MapPopup from "./MapPopup";

import type { Coordinates, EventItem, EventTypeId } from "@/types/app.types";

type Props = {
  events: EventItem[];
  center: Coordinates;
  radius: number;
  onMove: (newCenter: Coordinates, newZoom: number) => void;
};

const EventsMap = ({ events, center, radius }: Props) => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<Ref<HTMLDivElement> | undefined>(undefined);
  const [activeFeature, setActiveFeature] = useState<EventItem | undefined>();
  const activeFeatureId = useRef<EventTypeId | null>(null);

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
    if (events.length === 0) {
      fitMapToRadius();
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    events.forEach((event) => {
      const [lng, lat] = event.location?.coordinates;

      bounds.extend([lng, lat]);
    });

    bounds.extend([center.lng, center.lat]);

    mapRef.current?.fitBounds(bounds, {
      padding: 80,
      animate: true,
      maxZoom: 14,
    });
  };

  function fitMapToRadius() {
    const { lat, lng } = center;
    const R = 6371; // радіус Землі
    const dLat = (radius / R) * (180 / Math.PI);
    const dLng =
      (radius / (R * Math.cos((Math.PI * lat) / 180))) * (180 / Math.PI);

    const southWest = [lng - dLng, lat - dLat];
    const northEast = [lng + dLng, lat + dLat];

    const bounds = new mapboxgl.LngLatBounds(southWest, northEast);
    mapRef.current?.fitBounds(bounds, { padding: 60, animate: true });
  }

  useEffect(() => {
    if (mapRef.current) {
      updateMarkers();
    }
  }, [events]);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center,
      minZoom: 5.5,
      zoom: 10,
    });

    mapRef.current.on("load", () => {
      console.log("Map loaded");
    });

    mapRef.current.on("moveend", () => {
      console.log("Map move end");
    });

    mapRef.current.on("click", () => {
      //Remove opened popup on map click
      if (activeFeatureId.current) {
        setActiveFeature(undefined);
        activeFeatureId.current = null;
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleMarkerClick = (feature: EventItem) => {
    setActiveFeature(feature);
    activeFeatureId.current = feature.id;
  };

  return (
    <div
      id="map-container"
      ref={mapContainerRef}
      className="absolute top-0 left-0 w-full h-full"
    >
      {mapRef.current &&
        center &&
        events.map((feature) => {
          return (
            <MapMarker
              key={feature.id}
              map={mapRef.current}
              feature={feature}
              isActive={activeFeature?.id === feature.id}
              onClick={handleMarkerClick}
            />
          );
        })}
      {mapRef.current && center && (
        <MapMarker
          key="center-marker"
          map={mapRef.current}
          isCenterMarker={true}
          feature={{ location: { coordinates: [center.lng, center.lat] } }}
          onClick={handleMarkerClick}
        />
      )}
      {mapRef.current && (
        <MapPopup map={mapRef.current} activeFeature={activeFeature} />
      )}
    </div>
  );
};

export default EventsMap;
