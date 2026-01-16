import { useState, useEffect } from "react";
import { useId, useMemo } from "react";

import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

import { eventCategoriesService } from "@/api/services/eventCategoriesService";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import LocationFilter from "./filters/locationFilter";
import DateFilter from "./filters/dateFilter";

import type { Filters, MapboxFeature, EventCategory } from "@/types/app.types";

type Props = {
  filters: Filters;
  loading: boolean;
  onChangeFilters: (filters: Filters) => void;
};

function Header({ filters, onChangeFilters, loading }: Props) {
  const radiusInput = useId();
  const [radiusValue, setRadiusValue] = useState<number>(0);

  const eventCategorySelect = useId();
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [eventCategoryValue, setEventCategoryValue] = useState<
    string | undefined
  >();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const {
    loading: isLoadingTypes,
    executeQuery,
    isSuccess,
  } = useSupabaseQuery();

  const fetchEventCategories = async () => {
    const result = await executeQuery(() => eventCategoriesService.getData());
    if (result?.data) {
      setEventCategories(result.data);
    }
  };

  useEffect(() => {
    fetchEventCategories();
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
    setEventCategoryValue(filters.eventCategoryId);
  }, [filters.eventCategoryId]);

  useEffect(() => {
    setSelectedDate(new Date(filters.startDate));
  }, [filters.startDate]);

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

    if (isoDate !== filters.startDate) {
      const newFilters = {
        ...filters,
        startDate: isoDate,
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
                  value={eventCategoryValue}
                  onValueChange={(value) => {
                    setEventCategoryValue(value);
                    onChangeFilters({ ...filters, eventCategoryId: value });
                  }}
                >
                  <SelectTrigger id={eventCategorySelect}>
                    <SelectValue placeholder="Chess" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {isSuccess &&
                        eventCategories.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
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
            <div>
              <Dialog>
                <form>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit profile</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label htmlFor="name-1">Name</Label>
                        <Input
                          id="name-1"
                          name="name"
                          defaultValue="Pedro Duarte"
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="username-1">Username</Label>
                        <Input
                          id="username-1"
                          name="username"
                          defaultValue="@peduarte"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
export default Header;
