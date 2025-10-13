import { useState, useEffect } from "react";

export const useUserGeolocation = (options = {}) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Геолокація не підтримується браузером");
      setLoading(false);
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLocation({ latitude, longitude });
        setLoading(false);
      },
      (error) => {
        setError(getErrorMessage(error));
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
        ...options,
      }
    );
  }, []);

  const getErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Користувач відмовив у доступі до геолокації";
      case error.POSITION_UNAVAILABLE:
        return "Інформація про місцезнаходження недоступна";
      case error.TIMEOUT:
        return "Час очікування геолокації вийшов";
      default:
        return "Сталася невідома помилка";
    }
  };

  return { location, loading, error };
};
