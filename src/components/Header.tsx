import { Input } from "@/components/ui/input";
import { useId } from "react";
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

import { useState, useEffect, useMemo } from "react";

import { useSearchParams } from "react-router";
import LocationFilter from "./filters/locationFilter";
import DateFilter from "./filters/dateFilter";

export type City = {
  value: string;
  label: string;
};

function Header() {
  const [searchParams, setSearchParams] = useSearchParams(); // city, radius, interest, date

  const [searchCityValue, setSearchCityValue] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const [cityRadiusValue, setCityRadiusValue] = useState<number>(0);
  const [selectedCityRadius, setSelectedCityRadius] = useState<number>(0);

  const [selectedEventType, setSelectedEventType] = useState<
    string | undefined
  >("1c2e168e-00d9-4895-a10d-9f18646896c2");

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [eventTypes, setEventTypes] = useState<
    { id: string; title: string; description: string }[]
  >([]);

  const { loading, error, data, executeQuery, reset, isSuccess, isError } =
    useSupabaseQuery();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const result = await executeQuery(() => eventTypesService.getData());
    if (result?.data) {
      setEventTypes(result.data);
    }
  };

  useEffect(() => {
    const cityParam = searchParams.get("city") || "";
    const radiusParam = searchParams.get("radius") || "";
    const eventTypeParam = searchParams.get("interest") || "";
    const eventDateParam = searchParams.get("date") || "";

    if (cityParam && cityParam !== selectedCity?.value) {
      const city = cities.find((c) => c.value === cityParam);

      if (city) {
        setSelectedCity(city);
        setSearchCityValue(city.label);
      }
    }

    if (radiusParam && radiusParam !== selectedCityRadius.toString()) {
      setCityRadiusValue(Number(radiusParam));
    }

    if (eventTypeParam && eventTypeParam !== selectedEventType) {
      setSelectedEventType(eventTypeParam);
    }

    if (eventDateParam !== selectedDate.toISOString()) {
      const date = new Date(eventDateParam);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCity) {
      searchParams.set("city", selectedCity.value);
      setSearchParams(searchParams);
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedCityRadius) {
      searchParams.set("radius", selectedCityRadius.toString());
      setSearchParams(searchParams);
    }
  }, [selectedCityRadius]);

  useEffect(() => {
    if (selectedEventType) {
      searchParams.set("interest", selectedEventType);
      setSearchParams(searchParams);
    }
  }, [selectedEventType]);

  useEffect(() => {
    if (selectedDate) {
      const utcString = selectedDate.toISOString();
      searchParams.set("date", utcString);
      setSearchParams(searchParams);
    }
  }, [selectedDate]);

  const cities = [
    { value: "kyiv", label: "Київ" },
    { value: "kharkiv", label: "Харків" },
    { value: "odesa", label: "Одеса" },
    { value: "dnipro", label: "Дніпро" },
    { value: "vinnucia", label: "Вінниця" },
    { value: "vinnucia2", label: "Вінниця2" },
    { value: "vinnucia3", label: "Вінниця3" },
  ];

  const filteredCities = useMemo(() => {
    if (searchCityValue.length === 0) {
      return cities.slice(0, 10); // Показать первые 10 городов, если строка поиска пуста
    }
    return cities
      .filter(({ label }) =>
        label.toLowerCase().includes(searchCityValue.toLowerCase())
      )
      .slice(0, 10); // Ограничиваем количество подсказок
  }, [searchCityValue]);

  const id = useId();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex flex-col items-start justify-between w-full gap-2 py-4 px-4 sm:flex-row sm:items-center sm:gap-0 md:h-16">
        <div className="flex w-full gap-4 sm:justify-between">
          <div className="flex w-3/12">
            <LocationFilter
              selectedValue={selectedCity}
              onSelectedValueChange={setSelectedCity}
              searchValue={searchCityValue}
              onSearchValueChange={setSearchCityValue}
              items={filteredCities ?? []}
              // isLoading={isLoading}
            />

            <div className="relative -ms-px w-3/8">
              <Input
                id={id}
                className="rounded-s-none shadow-none [direction:inherit] peer pe-8 text-right"
                placeholder="0"
                type="text"
                inputMode="decimal"
                disabled={!selectedCity}
                value={cityRadiusValue}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setCityRadiusValue(Number(value));
                  }
                }}
                onBlur={() => {
                  if (selectedCityRadius !== cityRadiusValue) {
                    setSelectedCityRadius(cityRadiusValue);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (selectedCityRadius !== cityRadiusValue) {
                      setSelectedCityRadius(cityRadiusValue);
                    }
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
            <Select
              value={selectedEventType}
              onValueChange={(value) => {
                setSelectedEventType(value);
              }}
            >
              <SelectTrigger id="interest">
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
          </div>
          <div>
            <DateFilter
              selectedValue={selectedDate}
              onSelectedValueChanged={setSelectedDate}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
