import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDownIcon } from "lucide-react";

type Props = {
  selectedValue: Date;
  onSelectedValueChanged: (date: Date) => void;
};

function DateFilter({ selectedValue, onSelectedValueChanged }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="w-48 justify-between font-normal"
        >
          {/* {date ? date.toLocaleDateString() : "Select date"} */}
          {selectedValue.toLocaleDateString()}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single" 
          selected={selectedValue}
          captionLayout="dropdown"
          timeZone="UTC"
          startMonth={new Date(new Date().getFullYear(), new Date().getMonth())}
          disabled={{ before: new Date() }}
          onSelect={(date) => {
            // setDate(date);
            onSelectedValueChanged(date!);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DateFilter;
