"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, isValid, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date | string;
  onChange: (date: Date | undefined) => void;
}

// Helper function to parse value to Date
const parseToDate = (value: Date | string | undefined): Date | undefined => {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string") {
    const parsedDate = new Date(value);
    return isValid(parsedDate) ? parsedDate : undefined;
  }
  return undefined;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(parseToDate(value));

  React.useEffect(() => {
    // Update state if value changes from parent
    setDate(parseToDate(value));
  }, [value]);

  const popoverRef = React.useRef<HTMLButtonElement>(null);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onChange(newDate);
    if (popoverRef.current) {
      popoverRef.current.click(); // Close the popover after date selection
    }
  };

  const formattedDate =
    date && isValid(date) ? format(date, "PPP") : "Pick a date";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          ref={popoverRef}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}>
          <CalendarIcon className='mr-2 h-4 w-4' />
          {formattedDate}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
