import { useState, useEffect } from "react";
import { useId, useMemo } from "react";

import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

import { eventTypesService } from "@/api/services/eventTypesService";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import LocationFilter from "./filters/locationFilter";
import DateFilter from "./filters/dateFilter";

import type { Filters, MapboxFeature, EventType } from "@/types";

type Props = {
  filters: Filters;
  loading: boolean;
  onChangeFilters: (filters: Filters) => void;
};

function Header({ filters, onChangeFilters, loading }: Props) {
  const radiusInput = useId();
  const [radiusValue, setRadiusValue] = useState<number>(0);

  const eventTypeSelect = useId();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [eventTypeValue, setEventTypeValue] = useState<string | undefined>();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    loading: isLoadingTypes,
    executeQuery,
    isSuccess,
  } = useSupabaseQuery();

  const fetchEventTypes = async () => {
    const result = await executeQuery(() => eventTypesService.getData());
    if (result?.data) {
      setEventTypes(result.data);
    }
  };

  useEffect(() => {
    fetchEventTypes();
  }, []);

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

  useEffect(() => {
    setSelectedDate(new Date(filters.date));
  }, [filters.date]);

  const handleLocationChange = (locationDetails: MapboxFeature) => {
    const { longitude, latitude } = locationDetails.properties.coordinates;

    const newFilters = {
      ...filters,
      placeType: locationDetails.properties.feature_type,
      lat: Number(latitude),
      lng: Number(longitude),
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

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const isoDate = date.toISOString().split("T")[0];

    if (isoDate !== filters.date) {
      const newFilters = {
        ...filters,
        date: isoDate,
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
              <DateFilter
                selectedValue={selectedDate}
                onSelectedValueChanged={handleDateChange.bind(null)}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
export default Header;
