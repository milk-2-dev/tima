import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

interface ClusterMarkerProps {
  map: mapboxgl.Map;
  coordinates: [number, number];
  pointCount: number;
  onClick: () => void;
}

export default function ClusterMarker({
  map,
  coordinates,
  pointCount,
  onClick,
}: ClusterMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Створюємо DOM element для кластера
    const el = document.createElement("div");
    el.className = "cluster-marker";
    
    // Розмір кластера залежить від кількості точок
    const size = 30 + Math.min(pointCount / 10, 20);
    
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.borderRadius = "50%";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "center";
    el.style.cursor = "pointer";
    el.style.fontWeight = "bold";
    el.style.fontSize = "14px";
    el.style.color = "white";
    el.style.border = "3px solid white";
    el.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
    el.style.transition = "all 0.2s ease";
    
    // Колір залежить від кількості подій
    if (pointCount < 10) {
      el.style.backgroundColor = "#51bbd6";
    } else if (pointCount < 30) {
      el.style.backgroundColor = "#f1f075";
      el.style.color = "#333";
    } else {
      el.style.backgroundColor = "#f28cb1";
    }

    el.textContent = pointCount.toString();

    // Hover effect
    // el.addEventListener("mouseenter", () => {
    //   el.style.transform = "scale(1.1)";
    // });

    // el.addEventListener("mouseleave", () => {
    //   el.style.transform = "scale(1)";
    // });

    // Click handler
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick();
    });

    elementRef.current = el;

    // Створюємо Mapbox marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat(coordinates)
      .addTo(map);

    markerRef.current = marker;

    // Cleanup
    return () => {
      marker.remove();
    };
  }, [map, coordinates, pointCount, onClick]);

  // Оновлюємо позицію якщо coordinates змінились
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat(coordinates);
    }
  }, [coordinates]);

  // Оновлюємо контент якщо pointCount змінився
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.textContent = pointCount.toString();
    }
  }, [pointCount]);

  return null;
}