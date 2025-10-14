import { useState, useEffect } from "react";
import { useUserGeolocation } from "@/hooks/useUserGeolocation";

import { generateSessionToken } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export type LocationFeature = {
  type: string;
  properties: {
    mapbox_id: string;
    coordinates: {
      longitude: number;
      latitude: number;
    };
    name_preferred: string;
    place_formatted: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number];
  };
};

type Suggestion = {
  name: string;
  name_preferred: string;
  mapbox_id: string;
  feature_type: string;
  place_formatted: string;
  context: {
    country: {
      id: string;
      name: string;
      country_code: string;
      country_code_alpha_3: string;
    };
  };
  language: string;
  maki: string;
};

type Props = {
  location: { lat: number; lng: number };
  onLocationChange: (location: LocationFeature) => void;
};

function LocationFilter({ location, onLocationChange }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sugestions, setSugestions] = useState<Suggestion[]>([]);
  const [selectedSugestion, setSelectedSugestion] = useState<Suggestion | null>(
    null
  );
  // const [feature, setFeature] = useState<any>(null);
  const [sessionToken, setSessionToken] = useState("");
  // const { location, loading } = useUserGeolocation();

  useEffect(() => {
    setSessionToken(generateSessionToken());
  }, []);

  useEffect(() => {
    if (location) {
      (async () => {
        await reverseGeocode(location.lat, location.lng);
      })();
    }
  }, [location]);

  const fetchSugestions = async (searchQuery: string) => {
    let proximity = null;

    if (location) {
      proximity = `&proximity=${location.longitude},${location.latitude}`;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/suggest?` +
          `q=${encodeURIComponent(searchQuery)}` +
          `&types=country%2Cregion%2Cdistrict%2Cpostcode%2Clocality` +
          `&country=DE` +
          `${proximity && proximity}` +
          `&session_token=${sessionToken}` +
          `&access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      setSugestions(data.suggestions || []);
    } catch (error) {
      console.error("Search error:", error);
      setSugestions([]);
    }
  };

  const fetchSuggestedFeature = async (id: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/` +
          `${id}?` +
          `&session_token=${sessionToken}` +
          `&access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`
      );

      if (!response.ok) {
        throw new Error("Retrieve request failed");
      }

      const data = await response.json();
      // setFeature(data.features[0]);
      onLocationChange(data.features[0]);

      if (!query) {
        setSelectedSugestion({ ...data.features[0].properties });
        setQuery(data.features[0].properties.name_preferred);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSugestions([]);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?` +
          `&types=country%2Cregion%2Cdistrict%2Cpostcode%2Clocality` +
          `&access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const localityFeature = data.features.find((feature) =>
          feature.place_type.includes("locality")
        );

        if (localityFeature) {
          setSelectedSugestion({
            name_preferred: localityFeature.text,
          });
          setQuery(localityFeature.text);
        }
        return localityFeature ? localityFeature.text : data.features[0].text;
      }
      // return "";
    } catch (error) {
      console.error("Помилка геокодінга:", error);
      return "";
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query && query !== selectedSugestion?.name_preferred) {
        fetchSugestions(query);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (sugestions.length > 0) {
      setOpen(true);
    }
  }, [sugestions]);

  const handleSelect = async (sugestedItem: Suggestion) => {
    setSelectedSugestion(sugestedItem);
    setQuery(sugestedItem.name_preferred);

    await fetchSuggestedFeature(sugestedItem.mapbox_id);

    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <Command
          className="border-input rounded-md border rounded-e-none h-9"
          shouldFilter={false}
        >
          <CommandInput
            placeholder="Location"
            value={query}
            onValueChange={setQuery}
            className="border-0 outline-0 ring-0"
          />
          <PopoverContent
            className="w-80"
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <CommandList>
              <CommandEmpty>Місто не знайдено</CommandEmpty>
              <CommandGroup>
                {sugestions.map((item) => {
                  return (
                    <CommandItem
                      key={item.mapbox_id}
                      value={item.mapbox_id}
                      onSelect={() => {
                        handleSelect(item);
                      }}
                      className="flex flex-col align-start items-start gap-0 "
                    >
                      <h3 className="bold">{item.name}</h3>
                      <p className="text-gray-500">{item.place_formatted}</p>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </PopoverContent>
        </Command>
      </PopoverAnchor>
    </Popover>
  );
}

export default LocationFilter;
