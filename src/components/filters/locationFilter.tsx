import { useState, useEffect } from "react";

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

import type { City } from "../Header";

type Props = {
  selectedValue: City | null;
  onSelectedValueChange: (value: City) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  items: City[];
  // isLoading?: boolean;
};

function LocationFilter({
  selectedValue,
  onSelectedValueChange,
  searchValue,
  onSearchValueChange,
  items,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchValue.length > 1 && searchValue !== selectedValue?.label) {
      //Якщо рядок пошуку має більше одного символу і не співпадає з вибраним значенням, відкриваємо поповер
      setOpen(true);
    }
  }, [searchValue, items]);

  const handleSelect = (city: City) => {
    onSelectedValueChange(city);
    onSearchValueChange(city.label);
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
            value={searchValue}
            onValueChange={onSearchValueChange}
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
                {items.map((city) => {
                  return (
                    <CommandItem
                      key={city.value}
                      value={city.value}
                      onSelect={() => {
                        handleSelect(city);
                      }}
                    >
                      {city.label}
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
