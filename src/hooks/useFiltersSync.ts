import { useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router";
import { useFiltersStore } from "@/stores/filtersStore";
import { geolocationService } from "@/services/geolocation";

// const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export function useFiltersSync() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    lat,
    lng,
    placeType,
    radius,
    eventCategoryId,
    startDate,
    hasAskedForLocation,
    setDefaultLocation,
    setLocation,
    setRadius,
    setCategory,
    setStartDate,
    setFilters,
    setLoadingLocation,
    setLocationError,
    setHasAskedForLocation,
  } = useFiltersStore();

  const hasMounted = useRef(false);

  // ========== URL → Store ==========
  useEffect(() => {
    const urlFilters: any = {};

    // Location з URL
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (lat && lng) {
      urlFilters.lat = parseFloat(lat);
      urlFilters.lng = parseFloat(lng);
    }

    // placeType з URL
    const placeType = searchParams.get("placeType");
    if (placeType) {
      urlFilters.placeType = placeType;
    }

    // Radius
    const urlRadius = searchParams.get("radius");
    if (urlRadius) {
      urlFilters.radius = parseInt(urlRadius, 10);
    }

    // Category
    const urlCategoryId = searchParams.get("eventCategoryId");
    if (urlCategoryId) {
      urlFilters.eventCategoryId = urlCategoryId;
    }

    // Date
    const urlStartDate = searchParams.get("startDate");
    if (urlStartDate) {
      urlFilters.startDate = urlStartDate;
    }

    if (Object.keys(urlFilters).length > 0) {
      setFilters(urlFilters);
    }
    
    return () => {
      hasMounted.current = false;
    };
  }, []);

  // ========== Store → URL ==========
  useEffect(() => {
    //only after initial mount
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    };
    
    const params = new URLSearchParams();

    if (lat && lng) {
      params.set("lat", lat.toString());
      params.set("lng", lng.toString());
    }

    // placeType з URL
    if (placeType) {
      params.set("placeType", placeType);
    }

    if (radius !== 10) {
      // default
      params.set("radius", radius.toString());
    }

    if (eventCategoryId) {
      params.set("eventCategoryId", eventCategoryId);
    }

    if (startDate) {
      params.set("startDate", startDate);
    }

    setSearchParams(params, { replace: true });

    return () => {
      hasMounted.current = false;
    };
  }, [lat, lng, radius, eventCategoryId, startDate, setSearchParams]);

  // ========== Geolocation Request ==========
  const requestLocation = useCallback(async () => {
    // Якщо вже є локація в URL - не питаємо дозволу
    if (lat && lng) {
      setHasAskedForLocation(true);
      return;
    }

    // Якщо вже питали - не питаємо знову
    if (hasAskedForLocation) {
      return;
    }

    try {
      setLoadingLocation(true);
      setLocationError(null);
      setHasAskedForLocation(true);

      const coords = await geolocationService.getCurrentPosition();

      // Отримуємо адресу
      // const address = await geolocationService.getAddressFromCoords(
      //   coords.lat,
      //   coords.lng,
      //   MAPBOX_TOKEN
      // );

      // setLocation({ ...coords, address });
      setLocation({ ...coords });
    } catch (error: any) {
      console.error("Geolocation error:", error);
      setLocationError(error.message || "Failed to get location");
      setDefaultLocation();
    } finally {
      setLoadingLocation(false);
    }
  }, [
    lat,
    lng,
    hasAskedForLocation,
    setDefaultLocation,
    setLocation,
    setLoadingLocation,
    setLocationError,
    setHasAskedForLocation,
  ]);

  // Автоматично питаємо дозвіл при першому завантаженні
  useEffect(() => {
    if (!hasAskedForLocation) {
      requestLocation();
    }
  }, [hasAskedForLocation, requestLocation]);

  return {
    requestLocation, // для ручного запиту (кнопка "Використати мою локацію")
  };
}
