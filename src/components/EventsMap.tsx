import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Supercluster from "supercluster";

import { useEventsStore } from "@/stores/eventsStore";
import { useFiltersStore } from "@/stores/filtersStore";

import { type EventItem } from "@/types/app.types";

import ClusterMarker from "./ClusterMarker";
import MapMarker from "./MapMarker";
import MapPopup from "./MapPopup";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

type EventProperties = {
  cluster: false;
  event: EventItem;
};

type ClusterProperties = {
  cluster: true;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: string;
};

type EventFeature = GeoJSON.Feature<GeoJSON.Point, EventProperties>;
type ClusterFeature = GeoJSON.Feature<GeoJSON.Point, ClusterProperties>;
type MapFeature = EventFeature | ClusterFeature;

export function EventsMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const events = useEventsStore((state) => state.events);
  const { selectedEvent, hoveredEvent, setSelectedEvent } = useEventsStore();

  const { lng, lat } = useFiltersStore();

  const [mapBounds, setMapBounds] = useState<
    [number, number, number, number] | null
  >(null);
  const [mapZoom, setMapZoom] = useState(10);

  // ========== Creating Supercluster ==========
  const cluster = useMemo(() => {
    const supercluster = new Supercluster<EventProperties>({
      radius: 100, // clustering radius
      maxZoom: 16, // clusterisation max zoom
      minZoom: 0,
    });

    // Конвертуємо events в GeoJSON features
    const points: EventFeature[] = events
      .filter((event) => event.location?.coordinates)
      .map((event) => ({
        type: "Feature",
        properties: {
          cluster: false,
          event: event,
        },
        geometry: { ...event.location },
      }));

    supercluster.load(points);
    return supercluster;
  }, [events]);

  const clustersAndPoints = useMemo(() => {
    if (!mapBounds || mapZoom === undefined) return [];

    return cluster.getClusters(mapBounds, Math.floor(mapZoom)) as MapFeature[];
  }, [cluster, mapBounds, mapZoom]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: !lng || !lat ? [30.5234, 50.4501] : [lng, lat],
      zoom: 10,
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

    // Оновлення bounds та zoom при русі карти
    const updateMapView = () => {
      if (!map.current) return;

      const bounds = map.current.getBounds();
      setMapBounds([
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ]);
      setMapZoom(map.current.getZoom());
    };

    //Events
    map.current.on("load", () => {
      console.log("Map loaded");
      updateMapView();
    });

    map.current.on("moveend", () => {
      console.log("Map move end");
      updateMapView();
    });

    map.current.on("zoomend", updateMapView);

    map.current.on("click", () => {
      const currentSelectedEvent = useEventsStore.getState().selectedEvent;

      // Remove opened popup on map click
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
      zoom: 10,
      duration: 1000,
    });
  }, [lng, lat]);

  const handleClusterClick = (
    clusterId: number,
    coordinates: [number, number]
  ) => {
    const expansionZoom = cluster.getClusterExpansionZoom(clusterId);

    map.current?.easeTo({
      center: coordinates,
      zoom: expansionZoom,
      duration: 500,
    });
  };

  return (
    <div
      id="map-container"
      ref={mapContainer}
      className="absolute top-0 left-0 w-full h-full"
    >
      {map.current &&
        clustersAndPoints.map((feature) => {
          const [lng, lat] = feature.geometry.coordinates;

          if (feature.properties.cluster) {
            const clusterFeature = feature as ClusterFeature;

            return (
              <ClusterMarker
                key={`cluster-${clusterFeature.properties.cluster_id}`}
                map={map.current!}
                coordinates={[lng, lat]}
                pointCount={clusterFeature.properties.point_count}
                onClick={() =>
                  handleClusterClick(clusterFeature.properties.cluster_id, [
                    lng,
                    lat,
                  ])
                }
              />
            );
          } else {
            const eventFeature = feature as EventFeature;
            const event = eventFeature.properties.event;

            return (
              <MapMarker
                key={event.id}
                map={map.current!}
                isCenterMarker={false}
                feature={event}
                isActive={selectedEvent?.id === event.id}
                isHovered={hoveredEvent?.id === event.id}
                onClick={setSelectedEvent}
              />
            );
          }
        })}

      {map.current && lng && lat && (
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
