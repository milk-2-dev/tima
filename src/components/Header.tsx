import { Input } from "@/components/ui/input";
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
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValue, setSelectedValue] = useState<City | null>(null);

  useEffect(() => {
    const search = searchParams.get("city") || "";

    if (search && search !== selectedValue?.value) {
      const city = cities.find((c) => c.value === search);

      if (city) {
        setSelectedValue(city);
        setSearchValue(city.label);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedValue) {
      searchParams.set("city", selectedValue.value);
      setSearchParams(searchParams);
    }
  }, [selectedValue]);

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
    if (searchValue.length === 0) {
      return cities.slice(0, 10); // Показать первые 10 городов, если строка поиска пуста
    }
    return cities
      .filter(({ label }) =>
        label.toLowerCase().includes(searchValue.toLowerCase())
      )
      .slice(0, 10); // Ограничиваем количество подсказок
  }, [searchValue]);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex flex-col items-start justify-between w-full gap-2 py-4 px-4 sm:flex-row sm:items-center sm:gap-0 md:h-16">
        <div className="flex w-full gap-4 sm:justify-between">
          <div className="flex w-3/12">
            <LocationFilter
              selectedValue={selectedValue}
              onSelectedValueChange={setSelectedValue}
              searchValue={searchValue}
              onSearchValueChange={setSearchValue}
              items={filteredCities ?? []}
              // isLoading={isLoading}
            />

            <div className="relative -ms-px w-3/8">
              <Input
                type="text"
                className="rounded-s-none shadow-none [direction:inherit] peer pe-8 text-right"
                placeholder="0"
              />
              <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                km
              </span>
            </div>
          </div>
          <div>
            <Select>
              <SelectTrigger id="location">
                <SelectValue placeholder="Chess" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="5">Volleyball</SelectItem>
                  <SelectItem value="10">Football</SelectItem>
                  <SelectItem value="15">Bascketball</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <DateFilter />
          </div>
        </div>
      </div>
    </header>
  );
}
export default Header;
