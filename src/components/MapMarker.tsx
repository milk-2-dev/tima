import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import type { Map, Marker } from "mapbox-gl";
import type { EventItem } from "@/types/app.types";

import { createPortal } from "react-dom";
import { House } from "lucide-react";

type Props = {
  map: Map;
  feature: EventItem;
  isCenterMarker: boolean;
  isActive?: boolean;
  onClick: (feature: EventItem) => void;
};

const MapMarker = ({
  map,
  feature,
  isCenterMarker = false,
  isActive = false,
  onClick,
}: Props) => {
  // a ref for the mapboxgl.Marker instance
  const markerRef = useRef<Marker | undefined>(undefined);
  // a ref for an element to hold the marker's content
  const contentRef = useRef(document.createElement("div"));

  // instantiate the marker on mount, remove it on unmount
  useEffect(() => {
    markerRef.current = new mapboxgl.Marker(contentRef.current)
      .setLngLat(feature.location?.coordinates)
      .addTo(map);

    return () => {
      markerRef.current?.remove();
    };
  }, []);

  const markerClass = isActive ? "scale-110" : "";

  const handleClickOnMarker = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    onClick(feature);
  };

  return (
    <>
      {createPortal(
        <div
          onClick={handleClickOnMarker}
          className={`${markerClass} cursor-pointer ease-in-out hover:scale-110 transition-transform`}
        >
          {isCenterMarker ? (
            <House size={18} color="#F44336" fill="#F44336" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="#000000"
              className="lucide lucide-map-pin-icon lucide-map-pin"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" fill="white" />
            </svg>
          )}
        </div>,
        contentRef.current
      )}
    </>
  );
};

export default MapMarker;
