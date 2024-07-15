import React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  value: string;
  label: string;
}

interface ComboBoxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const ComboBox = React.forwardRef<HTMLButtonElement, ComboBoxProps>(
  ({ options = [], value, onChange, onBlur }, ref) => {
    const [open, setOpen] = React.useState(false);

    // Handle the selection and close the dropdown
    const handleSelect = (currentValue: string) => {
      if (currentValue !== value) {
        onChange(currentValue); // Update value on selection
      }
      setOpen(false); // Close dropdown after selection
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between'
            onBlur={onBlur}
            onClick={() => setOpen(!open)} // Toggle dropdown on button click
          >
            {value
              ? options.find((option) => option.value === value)?.label ||
                "Select an option..."
              : "Select an option..."}
            <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0'>
          <Command>
            <CommandInput placeholder='Search...' className='h-9' />
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}>
                    {option.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

ComboBox.displayName = "ComboBox";

export { ComboBox };
