"use client";

import Image from "next/image";
import hero from "@/public/images/hero.jpg";
import { useState } from "react";
import { Star, EllipsisVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SocialIcon } from "react-social-icons/component";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { CandidateNext, CandidateRating } from "@/lib/definitions";
import "react-social-icons/x";
import "react-social-icons/facebook";
import { candidateViewTabs } from "@/constants/data";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const CandidateViewDeskTop = ({
  candidate,
  candidateRate,
  isLoading,
}: {
  candidate: CandidateNext | undefined;
  candidateRate: CandidateRating | undefined;
  isLoading: boolean;
}) => {
  const [activeTab, setActiveTab] = useState("bio");

  if (isLoading || !candidate) {
    return <CandidateViewSkeleton />;
  }

  return (
    <>
      {candidate && candidateRate ? (
        <div className='flex flex-1 flex-col w-full pb-20 relative'>
          <AspectRatio ratio={16 / 5} className='bg-transparent relative'>
            <Image
              draggable={false}
              priority={true}
              src={hero}
              alt='Election PH Hero banner'
              fill
              className='object-cover h-full w-full lg:rounded-md'
            />
          </AspectRatio>

          <div className='px-5 -top-16 relative'>
            <div className='flex flex-1  mb-10  border-[10px] border-white bg-white rounded-md overflow-hidden  drop-shadow-sm'>
              <div className='relative h-[200px] w-[200px] rounded-md overflow-hidden'>
                <Image
                  draggable={false}
                  alt={candidate.displayName}
                  fill
                  sizes='200px'
                  className='object-cover h-full w-full relative'
                  src={candidate.displayPhoto}
                />
              </div>
              <div className='bg-white flex flex-1 flex-col pt-6 px-5 relative'>
                <div className='absolute right-1 top-1'>
                  <div className='flex flex-1 gap-x-3 items-center'>
                    {/* rate button */}

                    {/* action button */}

                    <Menubar className='border-none shadow-none p-0'>
                      <MenubarMenu>
                        <MenubarTrigger
                          className={cn(
                            buttonVariants({
                              variant: "ghost",
                              class: "cursor-pointer",
                            })
                          )}>
                          <EllipsisVertical className='h-5 w-5' />
                        </MenubarTrigger>
                        <MenubarContent>
                          <MenubarItem>Share</MenubarItem>
                          <MenubarItem>Suggest Edit</MenubarItem>
                          <MenubarSeparator />
                          <MenubarItem>Report</MenubarItem>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  </div>
                </div>

                {/* name */}
                <h1 className='text-3xl font-bold text-slate-800 flex items-center'>
                  {candidate.balotNumber}. {candidate.displayName}
                </h1>

                {/* short desc */}
                <div className='text-sm text-slate-800'>
                  {candidate.shortDescription}
                </div>

                <div className='flex mt-2 gap-x-3 items-center'>
                  <Badge variant='default' className='rounded-full'>
                    REPUBLICAN
                  </Badge>

                  <div
                    title={`average of ${candidateRate.averageRating} rating from ${candidateRate.numberOfRatings} user/s`}
                    role='button'
                    className='font-semibold text-sm text-slate-800 hover:opacity-70 flex'
                    onClick={() => setActiveTab("rating")}>
                    <Star
                      className='h-5 w-5 mr-1'
                      color='#facc15'
                      fill='#facc15'
                    />
                    {candidateRate.averageRating}(
                    {candidateRate.numberOfRatings})
                  </div>
                </div>

                <Separator className='mt-3' />

                <div className='flex flex-1 items-center gap-x-3'>
                  {candidate.socialLinks &&
                    candidate.socialLinks.map((item, i) => {
                      if (item.type !== "custom") {
                        return (
                          <SocialIcon
                            title={item.url}
                            className='max-h-8 max-w-8 antialiased'
                            network={item.type}
                            key={i}
                            target='_blank'
                            href={item.url}
                          />
                        );
                      } else {
                        return (
                          <Link
                            title={item.url}
                            target='_blank'
                            href={item.url}
                            key={i}
                            className='rounded-full h-8 w-8 bg-slate-900 flex justify-center items-center'>
                            <LinkIcon
                              color='white'
                              className='h-4 w-4 antialiased'
                            />
                          </Link>
                        );
                      }
                    })}
                </div>
              </div>
            </div>

            <Tabs
              onValueChange={setActiveTab}
              value={activeTab}
              className='w-full'>
              <TabsList className='bg-transparent'>
                <RenderTabTriggers></RenderTabTriggers>
              </TabsList>

              <RenderTabContents candidate={candidate} />
              <TabsContent value='rating'>
                <div className='!max-w-none p-5 text-slate-700 bg-white rounded-md min-h-52 shadow-sm'>
                  <div className='text-sm'>
                    This feature is currently only available in mobile version.
                    🔒
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <CandidateViewSkeleton />
      )}
    </>
  );
};

const RenderTabTriggers = () => {
  return candidateViewTabs.map((item) => (
    <TabsTrigger key={item.value} value={item.value}>
      {item.label}
    </TabsTrigger>
  ));
};

const RenderTabContents = ({ candidate }: { candidate: CandidateNext }) => {
  const markedComponent = (text: string) => {
    if (!text) return null; // Handle undefined or empty text

    return (
      <Markdown
        remarkPlugins={[remarkGfm]}
        className='markdown prose prose-slate !max-w-none p-5 text-slate-700 bg-white rounded-md min-h-52 shadow-sm'>
        {text}
      </Markdown>
    );
  };

  return candidateViewTabs
    .filter((item) => item.value !== "rating")
    .map((item) => (
      <TabsContent key={item.value} value={item.value}>
        {item.id &&
          markedComponent(candidate[item.id as keyof CandidateNext] as string)}
      </TabsContent>
    ));
};

const CandidateViewSkeleton = () => {
  return (
    <div className='flex flex-1 flex-col w-full pb-20 relative'>
      <AspectRatio ratio={16 / 5} className='bg-transparent relative'>
        <Skeleton className='h-full w-full lg:rounded-md' />
      </AspectRatio>

      <div className='px-5 -top-16 relative'>
        <div className='flex flex-1 mb-10 border-[10px] border-white bg-white rounded-md overflow-hidden drop-shadow-sm'>
          <Skeleton className='h-[200px] w-[200px]' />
          <div className='bg-white flex flex-1 flex-col pt-6 px-5 relative'>
            <Skeleton className='h-8 w-3/4 mb-2' />
            <Skeleton className='h-4 w-1/2 mb-4' />
            <div className='flex gap-x-2 mb-4'>
              <Skeleton className='h-6 w-24' />
              <Skeleton className='h-6 w-24' />
            </div>
            <Skeleton className='h-8 w-full' />
          </div>
        </div>

        <div className='w-full'>
          <Skeleton className='h-10 w-full mb-4' />
          <Skeleton className='h-64 w-full' />
        </div>
      </div>
    </div>
  );
};

export default CandidateViewDeskTop;
