"use client";

import { useSearchParams } from "next/navigation";
import { ElectionSchema } from "@/lib/form-schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Election } from "@/lib/definitions";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ComboBox } from "@/components/custom/combo-box";
import { Input } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/custom/breadcrumbs";
import { Heading } from "@/components/custom/heading";
import { Separator } from "@/components/ui/separator";
import { DatePicker } from "@/components/custom/date-picker";

const breadcrumbItems = [
  { title: "Dashboard", link: "/master" },
  { title: "Election", link: "/master/election" },
  { title: "Update Election", link: "/master/update" },
];

const UpdateElection = ({ params }: { params: { id: string } }) => {
  const id = params.id;

  const form = useForm<z.infer<typeof ElectionSchema>>({
    resolver: zodResolver(ElectionSchema),
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

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const docRef = doc(db, "elections", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          reset(docSnap.data() as Election);
        } else {
          console.log("No such document!");
        }
      };

      fetchData();
    }
  }, [reset, id]);

  async function onSubmit(data: z.infer<typeof ElectionSchema>) {
    try {
      if (!id) {
        throw new Error("Document ID is required for updating.");
      }

      data.electionType = data.electionType.toLowerCase();
      const docRef = doc(db, "elections", id);
      await updateDoc(docRef, data);

      // Show success toast
      toast({
        title: "Document updated",
        description: (
          <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
            <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e;
    }
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <Heading
        title='Update Election'
        description='Manages to update election.'
      />
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
                      <Input
                        className='capitalize'
                        placeholder='e.g., presidential'
                        {...field}
                      />
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
                            value={value}
                            onChange={(date) =>
                              onChange(date ? date.toISOString() : "")
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
                        control={control}
                        name='endDate'
                        render={({ field: { value, onChange } }) => (
                          <DatePicker
                            value={value}
                            onChange={(date) =>
                              onChange(date ? date.toISOString() : "")
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
                        placeholder='Candidate IDs (comma-separated)'
                        value={
                          Array.isArray(field.value)
                            ? field.value.join(", ")
                            : ""
                        }
                        onChange={(e) => {
                          const value = e.target.value
                            .split(",")
                            .map((id) => id.trim());
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      List of candidate IDs (comma-separated).
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
};

export default UpdateElection;
