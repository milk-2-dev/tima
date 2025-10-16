import { Input } from "@/components/ui/input";
import { useId, useMemo } from "react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

import { eventTypesService } from "@/api/services/eventTypesService";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, useEffect } from "react";

import { useSearchParams } from "react-router";
import LocationFilter from "./filters/locationFilter";
import DateFilter from "./filters/dateFilter";

import type { Filters, MapboxFeature, EventType } from "@/types";

type Props = {
  filters: Filters;
  loading: boolean;
  onChangeFilters: (filters: Filters) => void;
};

function Header({ filters, onChangeFilters, loading }: Props) {
  // const [searchParams, setSearchParams] = useSearchParams();

  // const [locationId, setLocationId] = useState<string | null>(null);
  // const [location, setLocation] = useState<string | null>(null);

  const radiusInput = useId();
  const [radiusValue, setRadiusValue] = useState<number>(0);

  const eventTypeSelect = useId();
  const [eventTypeValue, setEventTypeValue] = useState<string | undefined>();

  // const [selectedCityRadius, setSelectedCityRadius] = useState<number>(0);

  // const [selectedEventType, setSelectedEventType] = useState<
  //   string | undefined
  // >("1c2e168e-00d9-4895-a10d-9f18646896c2");

  // const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [eventTypes, setEventTypes] = useState<EventType[]>([]);

  const {
    loading: isLoadingTypes,
    error,
    data,
    executeQuery,
    reset,
    isSuccess,
    isError,
  } = useSupabaseQuery();

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    const result = await executeQuery(() => eventTypesService.getData());
    if (result?.data) {
      setEventTypes(result.data);
    }
  };

  const mapCenter = useMemo(() => {
    const { lat, lng } = filters;

    return {
      lat,
      lng,
    };
  }, [filters.lat, filters.lng]);

  useEffect(() => {
    setRadiusValue(Number(filters.radius) || 0);
  }, [filters.radius]);

  useEffect(() => {
    setEventTypeValue(filters.eventTypeId);
  }, [filters.eventTypeId]);

  // useEffect(() => {
  //   const radiusParam = searchParams.get("radius") || "";
  //   const eventTypeParam = searchParams.get("interest") || "";
  //   const eventDateParam = searchParams.get("date") || "";
  //   const eventMapboxId = searchParams.get("mapbox_id") || "";
  //   const eventLocation = searchParams.get("location") || "";

  //   if (radiusParam && radiusParam !== selectedCityRadius.toString()) {
  //     setRadiusValue(Number(radiusParam));
  //   }

  //   if (eventTypeParam && eventTypeParam !== selectedEventType) {
  //     setSelectedEventType(eventTypeParam);
  //   }

  //   if (eventDateParam !== selectedDate.toISOString()) {
  //     const date = new Date(eventDateParam);
  //     if (!isNaN(date.getTime())) {
  //       setSelectedDate(date);
  //     }
  //   }

  //   if (eventMapboxId && eventMapboxId !== locationId) {
  //     setLocationId(eventMapboxId);
  //   }

  //   if (eventLocation) {
  //     setLocation(eventLocation);
  //   }
  // }, [searchParams]);

  // useEffect(() => {
  //   if (selectedCityRadius) {
  //     searchParams.set("radius", selectedCityRadius.toString());
  //     setSearchParams(searchParams);
  //   }
  // }, [selectedCityRadius]);

  // useEffect(() => {
  //   if (selectedEventType) {
  //     searchParams.set("interest", selectedEventType);
  //     setSearchParams(searchParams);
  //   }
  // }, [selectedEventType]);

  // useEffect(() => {
  //   if (selectedDate) {
  //     const utcString = selectedDate.toISOString();
  //     searchParams.set("date", utcString);
  //     setSearchParams(searchParams);
  //   }
  // }, [selectedDate]);

  const handleLocationChange = (locationDetails: MapboxFeature) => {
    const { longitude, latitude } = locationDetails.properties.coordinates;

    const newFilters = {
      ...filters,
      placeType: locationDetails.properties.feature_type,
      lat: latitude,
      lng: longitude,
    };

    onChangeFilters(newFilters);
  };

  const handleRadiusChange = (radius: number) => {
    if (radius !== Number(filters.radius)) {
      const newFilters = {
        ...filters,
        radius,
      };

      onChangeFilters(newFilters);
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex flex-col items-start justify-between w-full gap-2 py-4 px-4 sm:flex-row sm:items-center sm:gap-0 md:h-16">
        {!loading && (
          <div className="flex w-full gap-4 sm:justify-between">
            <div className="flex w-3/12">
              <LocationFilter
                placeType={filters.placeType}
                location={mapCenter}
                onLocationChange={handleLocationChange}
              />

              <div className="relative -ms-px w-3/8">
                <Input
                  id={radiusInput}
                  className="rounded-s-none shadow-none [direction:inherit] peer pe-8 text-right"
                  placeholder="0"
                  type="text"
                  inputMode="decimal"
                  disabled={!mapCenter}
                  value={radiusValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setRadiusValue(Number(value));
                    }
                  }}
                  onBlur={handleRadiusChange.bind(null, radiusValue)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.currentTarget.blur();
                    }
                  }}
                  aria-label="Enter radius in kilometers"
                />
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                  km
                </span>
              </div>
            </div>
            <div>
              {isLoadingTypes ? (
                "Loading..."
              ) : (
                <Select
                  value={eventTypeValue}
                  onValueChange={(value) => {
                    setEventTypeValue(value);
                    onChangeFilters({ ...filters, eventTypeId: value });
                  }}
                >
                  <SelectTrigger id={eventTypeSelect}>
                    <SelectValue placeholder="Chess" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {isSuccess &&
                        eventTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.title}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              {/* <DateFilter
                selectedValue={selectedDate}
                onSelectedValueChanged={setSelectedDate}
              /> */}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
export default Header;
