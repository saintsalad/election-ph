"use client";

import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UserCircle2, Check, ChevronsUpDown, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useToast } from "@/components/ui/use-toast";

// Import the cities data
import citiesData from "@/lib/json/cities.json";

interface UserInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userInfo: UserInfo) => void;
}

interface UserInfo {
  age: string;
  gender: string;
  education: string;
  city: string;
}

interface City {
  code: string;
  name: string;
  // Add other properties as needed
}

const userInfoSchema = z.object({
  age: z
    .string()
    .min(1, "Age is required")
    .refine((val) => {
      const num = parseInt(val, 10);
      return num >= 10 && num <= 120;
    }, "Invalid age"),
  gender: z.enum(["male", "female", "other"]),
  education: z.enum([
    "elementary",
    "highschool",
    "vocational",
    "college",
    "postgraduate",
  ]),
  city: z.string().min(1, "City is required"),
});

type UserInfoFormData = z.infer<typeof userInfoSchema>;

function useCities(isOpen: boolean) {
  return useQuery<City[]>(
    "cities",
    async () => {
      try {
        const { data } = await axios.get<City[]>("/api/cities");
        return data;
      } catch (error) {
        console.error("Error fetching cities:", error);
        return citiesData; // Fallback to local data
      }
    },
    {
      enabled: isOpen, // Only trigger the query when isOpen is true
    }
  );
}

function useSaveUserInfo(onSuccess: () => void) {
  const { toast } = useToast();

  return useMutation(
    (userInfo: UserInfo) => axios.post("/api/user/info", userInfo),
    {
      onSuccess: () => {
        onSuccess();
        toast({
          title: "Success!",
          description:
            "Your information has been saved successfully. Thank you for updating your details.",
          variant: "success",
        });
      },
      onError: (error) => {
        console.error("Error saving user info:", error);
        toast({
          title: "Error",
          description:
            "There was an error saving your information. Please try again.",
          variant: "destructive",
        });
      },
    }
  );
}

export function UserInfoDialog({
  isOpen,
  onClose,
  onSubmit,
}: UserInfoDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: cities = citiesData, isLoading } = useCities(isOpen);
  const saveUserInfo = useSaveUserInfo(() => {
    onClose();
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      age: "",
      gender: undefined,
      education: undefined,
      city: "",
    },
  });

  const onSubmitForm = async (data: UserInfoFormData) => {
    try {
      await saveUserInfo.mutateAsync(data);
      onSubmit(data);
    } catch (error) {
      console.error("Error saving user info:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[550px] w-full max-w-[95vw] p-4 sm:p-6 rounded-md'>
        <DialogHeader className='space-y-3 sm:space-y-4'>
          <div className='flex items-center justify-center'>
            <UserCircle2 className='w-12 h-12 sm:w-16 sm:h-16 text-blue-600' />
          </div>
          <DialogTitle className='text-xl sm:text-2xl font-bold text-center text-slate-800'>
            Know You Better Before Voting {isOpen ? "isOpen" : "isClosed"}
          </DialogTitle>
          <DialogDescription className='text-sm sm:text-base text-center text-slate-600 max-w-[400px] mx-auto'>
            Your anonymous insights will enhance our understanding of voter
            demographics and preferences.
          </DialogDescription>
        </DialogHeader>
        <Card className='mt-4 sm:mt-6 border-0 shadow-none'>
          <CardContent className='grid gap-3 sm:gap-4 p-0 sm:p-6'>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                {/* Age field */}
                <div className='space-y-1 sm:space-y-2'>
                  <Label
                    htmlFor='age'
                    className='text-sm font-medium text-slate-700'>
                    Age
                  </Label>
                  <Controller
                    name='age'
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id='age'
                        type='number'
                        placeholder='Your age'
                        min='11'
                        max='120'
                        className='text-sm sm:text-base'
                      />
                    )}
                  />
                  {errors.age && (
                    <p className='text-red-500 text-xs sm:text-sm'>
                      {errors.age.message}
                    </p>
                  )}
                </div>
                {/* Gender field */}
                <div className='space-y-1 sm:space-y-2'>
                  <Label
                    htmlFor='gender'
                    className='text-sm font-medium text-slate-700'>
                    Gender
                  </Label>
                  <Controller
                    name='gender'
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger
                          id='gender'
                          className='text-sm sm:text-base'>
                          <SelectValue placeholder='Select' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='male'>Male</SelectItem>
                          <SelectItem value='female'>Female</SelectItem>
                          <SelectItem value='other'>
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className='text-red-500 text-xs sm:text-sm'>
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Education field */}
              <div className='space-y-1 sm:space-y-2 mt-3 sm:mt-4'>
                <Label
                  htmlFor='education'
                  className='text-sm font-medium text-slate-700'>
                  Highest Education Level
                </Label>
                <Controller
                  name='education'
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id='education' className='text-base'>
                        <SelectValue placeholder='Select education level' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='elementary'>Elementary</SelectItem>
                        <SelectItem value='highschool'>High School</SelectItem>
                        <SelectItem value='vocational'>Vocational</SelectItem>
                        <SelectItem value='college'>College</SelectItem>
                        <SelectItem value='postgraduate'>
                          Post-graduate
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.education && (
                  <p className='text-red-500 text-sm'>
                    {errors.education.message}
                  </p>
                )}
              </div>
              {/* City field */}
              <div className='space-y-1 sm:space-y-2 mt-3 sm:mt-4 relative'>
                <Label
                  htmlFor='city'
                  className='text-sm font-medium text-slate-700'>
                  City
                </Label>
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          role='combobox'
                          aria-expanded={open}
                          className='w-full justify-between text-base'>
                          {field.value
                            ? cities.find((city) => city.name === field.value)
                                ?.name
                            : "Select city..."}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className=' p-0 w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]'>
                        <Command className='w-full'>
                          <CommandInput placeholder='Search city...' />
                          <CommandList className='w-full'>
                            <CommandEmpty>No city found.</CommandEmpty>
                            <CommandGroup className='max-h-64 overflow-y-auto'>
                              {cities.map((city) => (
                                <CommandItem
                                  key={city.code}
                                  onSelect={() => {
                                    field.onChange(city.name);
                                    setOpen(false);
                                  }}>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === city.name
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {city.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.city && (
                  <p className='text-red-500 text-sm'>{errors.city.message}</p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <DialogFooter className='mt-4 sm:mt-6 flex flex-col space-y-3 sm:space-y-4'>
          <div className='flex flex-1 flex-col space-y-2'>
            <Button
              size='lg'
              onClick={handleSubmit(onSubmitForm)}
              disabled={saveUserInfo.isLoading}
              className='w-full py-2 text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-lg flex items-center justify-center'>
              {saveUserInfo.isLoading ? (
                <Loader className='animate-spin h-5 w-5' />
              ) : (
                "Submit"
              )}
            </Button>
            {/* <Button
              variant='ghost'
              size='lg'
              onClick={onClose}
              disabled={saveUserInfo.isLoading}
              className='w-full py-2 text-sm sm:text-base font-semibold text-slate-700 hover:bg-slate-100 transition-colors duration-200 rounded-lg flex items-center justify-center'>
              I prefer not to share my information
            </Button> */}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
