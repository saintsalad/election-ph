"use client";

import { Breadcrumbs } from "@/components/custom/breadcrumbs";
import { Heading } from "@/components/custom/heading";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { CandidateSchema } from "@/lib/form-schema"; // Adjust to your schema
import { useState } from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/master" },
  { title: "Candidates", link: "/master/candidates" },
  { title: "Add New", link: "/master/candidates/new" },
];

function AddNewCandidate() {
  const form = useForm<z.infer<typeof CandidateSchema>>({
    resolver: zodResolver(CandidateSchema),
    defaultValues: {
      name: "",
      party: "",
      image: "",
      shortDescription: "",
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof CandidateSchema>) {
    try {
      if (data.image) {
        const file = data.image as File;
        const reader = new FileReader();

        reader.onload = async (e) => {
          const fileDataUrl = e.target?.result as string;

          const storageRef = ref(
            storage,
            `candidates/${Date.now()}_${data.name}`
          );
          await uploadString(storageRef, fileDataUrl, "data_url");
          const imageUrl = await getDownloadURL(storageRef);

          data.image = imageUrl;
          await addDoc(collection(db, "candidates"), data);
          console.log("Document written with ID: ");

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
        };

        reader.readAsDataURL(file);
      } else {
        await addDoc(collection(db, "candidates"), data);
        console.log("Document written with ID: ");

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
      <Heading
        title='Add New Candidate'
        description='Manage and add new candidates.'
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
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., John Doe' {...field} />
                    </FormControl>
                    <FormDescription>
                      Full name of the candidate.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='party'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Party</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., Democratic Party' {...field} />
                    </FormControl>
                    <FormDescription>
                      The party to which the candidate belongs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Upload</FormLabel>
                    <FormControl>
                      <Input
                        type='file'
                        accept='image/jpg,image/jpeg,image/png'
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload candidate&#39;s image (JPG, JPEG, PNG).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='shortDescription'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input placeholder='Short description' {...field} />
                    </FormControl>
                    <FormDescription>
                      A brief summary about the candidate.
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
                      <Textarea
                        placeholder='Detailed description'
                        {...field}
                        rows={4} // Adjust the number of rows as needed
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed information about the candidate.
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

export default AddNewCandidate;
