"use client";

import { useSearchParams } from "next/navigation";
import { CandidateSchema, SocialLink, SocialLinkType } from "@/lib/form-schema";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
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
import { Candidate, CandidateNext } from "@/lib/definitions";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, InputProps } from "@/components/ui/input";
import { Breadcrumbs } from "@/components/custom/breadcrumbs";
import { Heading } from "@/components/custom/heading";
import { Separator } from "@/components/ui/separator";
import { getFileNameFromUrl, getPathFromUrl } from "@/lib/firebase/functions";
import { Textarea } from "@/components/ui/textarea";
import { Tag, TagInput } from "emblor";
import Link from "next/link";

const breadcrumbItems = [
  { title: "Dashboard", link: "/master" },
  { title: "Candidates", link: "/master/candidates" },
  { title: "Update Candidate", link: "/master/update-candidate" },
];

const UpdateCandidate = ({ params }: { params: { id: string } }) => {
  const [fileName, setFileName] = useState("");
  const [candidateCopy, setCandidateCopy] = useState<CandidateNext>();
  const id = params.id;
  const fileUploadRef = useRef<HTMLInputElement>(null);

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
    handleSubmit,
    reset,
    resetField,
    control,
    setValue,
    formState: { errors, isDirty },
  } = form;

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const docRef = doc(db, "candidates", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const d = docSnap.data() as CandidateNext;
          if (d) {
            setCandidateCopy(d);
            reset(d);
            mapTags(d.socialLinks);
          }
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
      setValue("displayPhoto", file, { shouldDirty: true }); // Pass the file object to the form
    } else {
      setFileName(""); // Reset file name if no file selected
      setValue("displayPhoto", "", { shouldDirty: true }); // Clear the image field if no file
      resetField("displayPhoto", undefined);
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
      const existingImageUrl = existingData.displayPhoto as string;

      // Check if new image is being uploaded
      if (data.displayPhoto instanceof File) {
        const file = data.displayPhoto as File;
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
            `candidates/${Date.now()}_${data.displayName}`
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
    setValue("displayPhoto", "");
    resetField("displayPhoto", undefined);
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
  };

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

  function mapTags(links: SocialLink[]) {
    if (links && links.length) {
      const tags = links.map((item, i) => {
        return {
          id: i.toString(),
          text: item.url,
        };
      });

      setTags(tags);
    }
  }

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
              {/* ⭐ displayName */}
              <FormField
                control={control}
                name='displayName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Display Name<span className='text-red-600'>*</span>
                    </FormLabel>
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
                    <FormLabel>
                      Party<span className='text-red-600'>*</span>
                    </FormLabel>
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

              {/* ⭐ displayPhoto */}
              <FormField
                control={control}
                name='displayPhoto'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Candidate Photo<span className='text-red-600'>*</span>
                    </FormLabel>

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
                          : getFileNameFromUrl(
                              candidateCopy?.displayPhoto || ""
                            )}
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

              {/* ⭐ coverPhoto */}
              <FormField
                control={form.control}
                name='coverPhoto'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Photo</FormLabel>
                    <FormControl>
                      <Input
                        disabled
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
                          body: "flex items-center pl-3 ",
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
                          shouldDirty: true,
                        });
                      }}
                      activeTagIndex={activeTagIndex}
                      setActiveTagIndex={setActiveTagIndex}
                    />
                  </FormControl>
                  <FormDescription className='text-left'>
                    Social accounts that the candidate related.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='mr-2' type='submit' disabled={!isDirty}>
              Save Changes
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
};

export default UpdateCandidate;
