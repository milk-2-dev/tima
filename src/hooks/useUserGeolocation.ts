import { useState, useCallback } from "react";
import type { Coordinates } from "@/types";

export const useUserGeolocation = (options = {}) => {
  const [location, setLocation] = useState({
    coords: null,
    isLoading: false,
    error: null,
  });

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
    ...options,
  };

  const getCurrentPosition = useCallback((): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      setLocation((prev) => ({ ...prev, isLoading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          setLocation({ coords, isLoading: false, error: null });
          resolve(coords);
        },
        (error) => {
          const errorMessage = getGeolocationError(error);
          setLocation({ coords: null, isLoading: false, error: errorMessage });
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }, [defaultOptions]);

  return {
    coords: location.coords,
    isLoading: location.isLoading,
    error: location.error,
    getCurrentPosition,
  };
};
//Todo: @Klim перевести повідомлення на english
const getGeolocationError = (error) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Доступ до локації заблоковано. Дозвольте доступ у налаштуваннях браузера.";
    case error.POSITION_UNAVAILABLE:
      return "Інформація про локацію недоступна.";
    case error.TIMEOUT:
      return "Час очікування локації вийшов.";
    default:
      return "Сталася невідома помилка при отриманні локації.";
  }
};
