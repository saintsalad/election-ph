"use client";

import { Breadcrumbs } from "@/components/custom/breadcrumbs";
import { Heading } from "@/components/custom/heading";
import { Separator } from "@/components/ui/separator";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { DatePicker } from "@/components/custom/date-picker";
import { ComboBox } from "@/components/custom/combo-box";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { differenceInYears, isAfter, isBefore, parseISO } from "date-fns";

const FormSchema = z
  .object({
    electionType: z.string().min(1, {
      message: "Election type is required.",
    }),
    votingType: z.enum(["single", "multiple"], {
      required_error: "Voting type is required.",
    }),
    numberOfVotes: z
      .number()
      .min(1, {
        message: "Number of votes must be at least 1.",
      })
      .max(30),
    startDate: z.string().min(1, {
      message: "Election start date is required.",
    }),
    endDate: z.string().min(1, {
      message: "Election end date is required.",
    }),
    description: z.string().optional(),
    candidates: z.string().array().min(1, {
      message: "At least one candidate is required.",
    }),
    status: z.enum(["active", "inactive"], {
      required_error: "Status is required.",
    }),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      // Ensure endDate is after startDate
      return isAfter(endDate, startDate);
    },
    {
      message: "The end date must be after the start date.",
      path: ["endDate"], // Show error on the endDate field
    }
  );

const breadcrumbItems = [
  { title: "Dashboard", link: "/master" },
  { title: "Election", link: "/master/election" },
  { title: "Add New", link: "/master/new" },
];

function AddNewElection() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      electionType: "",
      votingType: "single",
      numberOfVotes: 1,
      startDate: "",
      endDate: "",
      description: "",
      candidates: [""],
      status: "active",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const docRef = await addDoc(collection(db, "elections"), data);
      console.log("Document written with ID: ", docRef.id);
      if (docRef) {
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          ),
        });
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;
    }
  }
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <Heading title='Add New' description='Manages to add new election.' />
      <Separator className='mt-4' />

      <div className='w-full max-w-4xl mx-auto p-4'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 overflow-auto'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='electionType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Election Type</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., presidential' {...field} />
                    </FormControl>
                    <FormDescription>
                      Type of election (e.g., presidential, senatorial, etc.).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='votingType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voting Type</FormLabel>
                    <Controller
                      name='votingType'
                      control={form.control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <ComboBox
                          options={[
                            { value: "single", label: "Single" },
                            { value: "multiple", label: "Multiple" },
                          ]}
                          value={value || ""} // Ensure value is a string
                          onChange={(e) => onChange(e)}
                          onBlur={onBlur}
                        />
                      )}
                    />
                    <FormDescription>
                      Type of voting (single or multiple).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='startDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Controller
                        control={form.control}
                        name='startDate'
                        render={({ field: { value, onChange } }) => (
                          <DatePicker
                            value={value ? new Date(value) : undefined}
                            onChange={(date) =>
                              onChange(date?.toISOString() || "")
                            }
                          />
                        )}
                      />
                    </FormControl>
                    <FormDescription>
                      Date when the election starts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='endDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Controller
                        control={form.control}
                        name='endDate'
                        render={({ field: { value, onChange } }) => (
                          <DatePicker
                            value={value ? new Date(value) : undefined}
                            onChange={(date) =>
                              onChange(date?.toISOString() || "")
                            }
                          />
                        )}
                      />
                    </FormControl>
                    <FormDescription>
                      Date when the election starts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='numberOfVotes'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Votes</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='1'
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Number of votes allowed per person.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder='Election description' {...field} />
                    </FormControl>
                    <FormDescription>
                      Brief description of the election.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='candidates'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidates</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Candidate names (comma-separated)'
                        value={field.value.join(", ")}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      List of candidates (comma-separated).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Controller
                      name='status'
                      control={form.control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <ComboBox
                          options={[
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" },
                          ]}
                          value={value || ""} // Ensure value is a string
                          onChange={(e) => onChange(e)}
                          onBlur={onBlur}
                        />
                      )}
                    />
                    <FormDescription>
                      Status of the election (active or inactive).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </div>
    </>
  );
}

export default AddNewElection;
