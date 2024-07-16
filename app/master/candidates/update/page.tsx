"use client";

import { useSearchParams } from "next/navigation";
import { CandidateSchema } from "@/lib/form-schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Candidate } from "@/lib/definitions";
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
import { Input, InputProps } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/custom/breadcrumbs";
import { Heading } from "@/components/custom/heading";
import { Separator } from "@/components/ui/separator";
import { getFileNameFromUrl, getPathFromUrl } from "@/lib/firebase/functions";
import { Textarea } from "@/components/ui/textarea";

const breadcrumbItems = [
  { title: "Dashboard", link: "/master" },
  { title: "Candidates", link: "/master/candidates" },
  { title: "Update Candidate", link: "/master/update-candidate" },
];

const UpdateCandidate = () => {
  const [fileName, setFileName] = useState("");
  const [candidateCopy, setCandidateCopy] = useState<Candidate>();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id") || "";
  const fileUploadRef = useRef<HTMLInputElement>(null);

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

  const {
    handleSubmit,
    reset,
    resetField,
    control,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const docRef = doc(db, "candidates", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const d = docSnap.data() as Candidate;
          setCandidateCopy(d);
          reset(d);
        } else {
          console.log("No such document!");
        }
      };

      fetchData();
    }
  }, [reset, id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name); // Set file name for display
      setValue("image", file); // Pass the file object to the form
    } else {
      setFileName(""); // Reset file name if no file selected
      setValue("image", ""); // Clear the image field if no file
      resetField("image", undefined);
    }
  };

  // Update function
  async function onSubmit(data: z.infer<typeof CandidateSchema>) {
    try {
      const docRef = doc(db, "candidates", id);

      // Fetch existing document
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error("Document does not exist");
      }

      const existingData = docSnap.data();
      const existingImageUrl = existingData?.image as string;

      // Check if new image is being uploaded
      if (data.image instanceof File) {
        const file = data.image as File;
        const reader = new FileReader();

        reader.onload = async (e) => {
          const fileDataUrl = e.target?.result as string;

          // Delete the existing image from Firebase Storage
          if (existingImageUrl) {
            const existingImageRef = ref(
              storage,
              getPathFromUrl(existingImageUrl)
            );
            try {
              await deleteObject(existingImageRef);
              console.log("Deleted existing image successfully.");
            } catch (error) {
              console.error("Error deleting existing image: ", error);
            }
          }

          // Upload new image to Firebase Storage
          const newImageRef = ref(
            storage,
            `candidates/${Date.now()}_${data.name}`
          );
          await uploadString(newImageRef, fileDataUrl, "data_url");
          const newImageUrl = await getDownloadURL(newImageRef);

          // Update document with the new image URL
          await updateDoc(docRef, {
            ...data,
            image: newImageUrl,
          });

          toast({
            title: "Document updated",
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
        // If no new image, just update the document
        await updateDoc(docRef, {
          ...data,
          image: existingImageUrl, // Ensure image field is not removed if not updated
        });

        toast({
          title: "Document updated",
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
      console.error("Error updating document: ", e);
      throw e;
    }
  }

  const resetFileUpload = () => {
    setFileName("");
    setValue("image", "");
    resetField("image", undefined);
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      <Heading
        title='Update Candidate'
        description='Manages to update candidate details.'
      />
      <Separator className='mt-4' />

      <div className='w-full max-w-4xl mx-auto p-4'>
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-6 overflow-auto'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Candidate name' {...field} />
                    </FormControl>
                    <FormDescription>
                      Full name of the candidate.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='party'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Party</FormLabel>
                    <FormControl>
                      <Input placeholder='Political party' {...field} />
                    </FormControl>
                    <FormDescription>
                      Party the candidate is affiliated with.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='image'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Upload</FormLabel>

                    <FormControl>
                      <Input
                        ref={fileUploadRef}
                        type='file'
                        accept='image/jpg,image/jpeg,image/png'
                        onChange={handleFileChange}
                      />
                    </FormControl>
                    <FormDescription>
                      <span
                        title='Current Image'
                        className='text-xs bg-slate-100 px-2 py-1.5 rounded-md font-mono'>
                        <span className='mr-1'>🖼️</span>
                        {fileName
                          ? fileName
                          : getFileNameFromUrl(candidateCopy?.image || "")}
                      </span>
                      {fileName && (
                        <span
                          title='clear'
                          className='cursor-pointer ml-2'
                          onClick={() => resetFileUpload()}>
                          ❌
                        </span>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='shortDescription'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input placeholder='Short description' {...field} />
                    </FormControl>
                    <FormDescription>
                      Brief description of the candidate.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Detailed description'
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Detailed description of the candidate.
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

export default UpdateCandidate;
