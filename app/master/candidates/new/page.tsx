"use client";

import { Breadcrumbs } from "@/components/custom/breadcrumbs";
import { Heading } from "@/components/custom/heading";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { CandidateSchema, SocialLink, SocialLinkType } from "@/lib/form-schema";
import { Tag, TagInput } from "emblor";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const breadcrumbItems = [
  { title: "Dashboard", link: "/master" },
  { title: "Candidates", link: "/master/candidates" },
  { title: "Add New", link: "/master/candidates/new" },
];

function AddNewCandidate() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const form = useForm<z.infer<typeof CandidateSchema>>({
    resolver: zodResolver(CandidateSchema),
    defaultValues: {
      displayName: "",
      party: "",
      displayPhoto: "",
      shortDescription: "",
      balotNumber: 0,
      coverPhoto: "",
      biography: "",
      educAttainment: "",
      achievements: "",
      platformAndPolicy: "",
      socialLinks: [],
    },
  });

  const {
    formState: { errors },
  } = form;

  console.log(errors);

  async function onSubmit(data: z.infer<typeof CandidateSchema>) {
    try {
      if (data.displayPhoto) {
        const file = data.displayPhoto as File;
        const reader = new FileReader();

        reader.onload = async (e) => {
          const fileDataUrl = e.target?.result as string;

          const storageRef = ref(
            storage,
            `candidates/${Date.now()}_${data.displayName}`
          );
          await uploadString(storageRef, fileDataUrl, "data_url");
          const imageUrl = await getDownloadURL(storageRef);

          data.displayPhoto = imageUrl;
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

  function getUrlType(url: string): SocialLinkType {
    const patterns: { [key in SocialLinkType]: RegExp } = {
      facebook: /facebook\.com/i,
      instagram: /instagram\.com/i,
      x: /x\.com|twitter\.com/i, // Both X.com and Twitter.com
      custom: /.*/, // Default case
    };

    for (const type in patterns) {
      if (patterns[type as SocialLinkType].test(url)) {
        return type as SocialLinkType;
      }
    }

    return "custom"; // If no pattern matches, return "custom"
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
              {/* ⭐ displayName */}
              <FormField
                control={form.control}
                name='displayName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Display Name<span className='text-red-600'>*</span>
                    </FormLabel>
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

              {/* ⭐ party */}
              <FormField
                control={form.control}
                name='party'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Party<span className='text-red-600'>*</span>
                    </FormLabel>
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

              {/* ⭐ displayPhoto */}
              <FormField
                control={form.control}
                name='displayPhoto'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Candidate Photo<span className='text-red-600'>*</span>
                    </FormLabel>
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
                      Upload candidate&#39;s photo (JPG, JPEG, PNG).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ⭐ coverPhoto */}
              <FormField
                control={form.control}
                name='coverPhoto'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Photo</FormLabel>
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
                      Upload cover photo (JPG, JPEG, PNG).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ⭐ balotNumber */}
              <FormField
                control={form.control}
                name='balotNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Balot Number<span className='text-red-600'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='e.g, 69' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='shortDescription'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Short Description<span className='text-red-600'>*</span>
                  </FormLabel>
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
              name='biography'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Biography<span className='text-red-600'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Detailed Biography'
                      {...field}
                      rows={5} // Adjust the number of rows as needed
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed information about the candidate.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='educAttainment'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Educational Attainment 🎓</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Detailed Educational Attainment'
                      {...field}
                      rows={5} // Adjust the number of rows as needed
                    />
                  </FormControl>
                  <FormDescription>
                    Educational Attainment blah blah
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='achievements'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Achievements 🥳</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Achievements'
                      {...field}
                      rows={5} // Adjust the number of rows as needed
                    />
                  </FormControl>
                  <FormDescription>Achievements blah blah</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='platformAndPolicy'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform & Policy 🥳</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Platform & Policy'
                      {...field}
                      rows={5} // Adjust the number of rows as needed
                    />
                  </FormControl>
                  <FormDescription>Platform & Policy blah blah</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='socialLinks'
              render={({ field }) => (
                <FormItem className='flex flex-col items-start'>
                  <FormLabel className='text-left'>Social Link 🌐</FormLabel>
                  <FormControl className='w-full'>
                    <TagInput
                      styleClasses={{
                        input: "border-none shadow-none px-2",
                        inlineTagsContainer: "white p-2 rounded",
                        tag: {
                          body: "flex items-center pl-3",
                        },
                      }}
                      placeholder='https://'
                      tags={tags}
                      className='sm:min-w-[450px]'
                      setTags={(newTags) => {
                        setTags(newTags);
                        const socialLinks: SocialLink[] = (
                          newTags as Tag[]
                        ).map((tag) => ({
                          type: getUrlType(tag.text),
                          url: tag.text,
                        }));

                        form.setValue("socialLinks", socialLinks, {
                          shouldValidate: true,
                        });
                      }}
                      activeTagIndex={activeTagIndex}
                      setActiveTagIndex={setActiveTagIndex}
                    />
                  </FormControl>
                  <FormDescription className='text-left'>
                    Social accounts that the candidate related.{" "}
                    {JSON.stringify(form.getValues("socialLinks"))}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='mr-2' type='submit'>
              Submit
            </Button>

            <Link
              href={"/master/candidates"}
              className={cn(buttonVariants({ variant: "outline" }))}>
              Cancel
            </Link>
          </form>
        </Form>
      </div>
    </>
  );
}

export default AddNewCandidate;
