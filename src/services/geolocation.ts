import type { Coordinates } from "@/types/app.types";

export interface GeolocationError {
  code: number;
  message: string;
}

export const geolocationService = {
  // Перевірка підтримки
  isSupported(): boolean {
    return 'geolocation' in navigator;
  },

  // Запит на отримання позиції
  async getCurrentPosition(): Promise<Coordinates> {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by your browser');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          let message = 'Unable to retrieve your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out';
              break;
          }
          
          reject({ code: error.code, message });
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // кешувати на 5 хв
        }
      );
    });
  },

  // Reverse geocoding через Mapbox (отримати адресу з координат)
  async getAddressFromCoords(
    lat: number,
    lng: number,
  ): Promise<string> {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&types=place,locality`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
      
      return 'Unknown location';
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'Unknown location';
    }
  },
};