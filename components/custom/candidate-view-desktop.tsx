"use client";

import Image from "next/image";
import hero from "@/public/images/hero.jpg";
import { useState } from "react";
import { Star, EllipsisVertical, MoreHorizontal } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SocialIcon } from "react-social-icons";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { CandidateNext, CandidateRating } from "@/lib/definitions";
import "react-social-icons/x";
import "react-social-icons/facebook";
import { candidateViewTabs } from "@/constants/data";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import CommentSectionMobile from "./comment-section-mobile";
import useReactQueryNext from "@/hooks/useReactQueryNext";

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
  const { theme } = useTheme();

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    error,
    refetchWithoutCache: refetchComments,
  } = useReactQueryNext<Comment[]>(
    `comments=${candidate?.id}`,
    `/api/candidate/comments?candidateId=${candidate?.id}`,
    {
      // refetchOnWindowFocus: false,
      // refetchOnReconnect: false,
    }
  );

  if (isLoading || !candidate) {
    return <CandidateViewSkeleton />;
  }

  return (
    <>
      {candidate && candidateRate ? (
        <div className='flex flex-1 flex-col w-full relative'>
          <AspectRatio ratio={16 / 5} className='bg-transparent relative'>
            <Image
              draggable={false}
              priority={true}
              src={hero}
              alt='Election PH Hero banner'
              fill
              className='object-cover h-full w-full lg:rounded-t-xl'
            />
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-background/80' />
          </AspectRatio>

          <div className='px-6 -top-20 relative'>
            <div className='flex flex-1 mb-5 bg-background/80 dark:bg-background/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg'>
              <div className='relative h-[200px] w-[200px] rounded-l-xl overflow-hidden bg-slate-200'>
                <Image
                  draggable={false}
                  alt={candidate.displayName}
                  fill
                  sizes='200px'
                  className='object-cover h-full w-full relative'
                  src={candidate.displayPhoto}
                  placeholder='blur'
                  blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAJoAMoaOHs9QAAAABJRU5ErkJggg=='
                />
              </div>
              <div className='flex flex-1 flex-col pt-6 px-6 relative'>
                <div className='absolute right-2 top-2'>
                  <Menubar className='border-none shadow-none p-0'>
                    <MenubarMenu>
                      <MenubarTrigger className='cursor-pointer p-1'>
                        <EllipsisVertical className='h-5 w-5 text-slate-600' />
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

                <h1 className='text-3xl font-bold text-foreground flex items-center mb-2'>
                  {candidate.ballotNumber}. {candidate.displayName}
                </h1>

                <div className='text-sm text-muted-foreground mb-3 line-clamp-2'>
                  {candidate.shortDescription}
                </div>

                <div className='flex flex-wrap items-center gap-3 mb-3'>
                  <Badge
                    variant='secondary'
                    className='rounded-full px-2 py-0.5 text-xs font-medium capitalize'>
                    {candidate.party}
                  </Badge>

                  <div
                    title={`average of ${candidateRate.averageRating} rating from ${candidateRate.numberOfRatings} user/s`}
                    role='button'
                    className='font-semibold text-xs text-foreground hover:opacity-70 flex items-center bg-muted rounded-full px-2 py-0.5'
                    onClick={() => setActiveTab("rating")}>
                    <Star
                      className='h-3 w-3 mr-1'
                      color='#facc15'
                      fill='#facc15'
                    />
                    {candidateRate.averageRating} (
                    {candidateRate.numberOfRatings})
                  </div>
                </div>

                <div className='flex flex-wrap items-center gap-2 mb-3'>
                  {candidate.socialLinks &&
                    candidate.socialLinks.map((item, i) => {
                      if (item.type !== "custom") {
                        return (
                          <SocialIcon
                            key={i}
                            url={item.url}
                            network={item.type}
                            style={{ height: 24, width: 24 }}
                            target='_blank'
                            rel='noopener noreferrer'
                          />
                        );
                      } else {
                        return (
                          <Link
                            title={item.url}
                            target='_blank'
                            href={item.url}
                            key={i}
                            className='rounded-full h-6 w-6 bg-slate-200 flex justify-center items-center hover:bg-slate-300 transition-colors'>
                            <LinkIcon color='#475569' className='h-3 w-3' />
                          </Link>
                        );
                      }
                    })}
                </div>

                {/* <Separator className='mb-3' /> */}

                {/* Additional content can go here if needed */}
              </div>
            </div>

            <div className='mt-6'>
              <Tabs
                onValueChange={setActiveTab}
                value={activeTab}
                className='w-full'>
                <div className='flex justify-center mb-4'>
                  <TabsList className='bg-muted inline-flex h-10 items-center justify-center rounded-full p-1'>
                    <RenderTabTriggers />
                  </TabsList>
                </div>

                <div className='mt-4'>
                  <RenderTabContents candidate={candidate} />
                  <TabsContent value='rating'>
                    <div className='!max-w-none p-5 text-foreground bg-card rounded-md min-h-52 shadow-sm'>
                      <p className='text-sm text-muted-foreground'>
                        <CommentSectionMobile
                          candidateId={candidate.id}
                          commentsData={commentsData ?? []}
                          isLoading={isLoadingComments}
                          refetchComments={refetchComments}
                          error={error}
                        />
                      </p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
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
    <TabsTrigger
      key={item.value}
      value={item.value}
      className='inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm'>
      {item.label}
    </TabsTrigger>
  ));
};

const RenderTabContents = ({ candidate }: { candidate: CandidateNext }) => {
  const markedComponent = (text: string | undefined) => {
    return (
      <div className='!max-w-none p-5 text-foreground bg-card rounded-md min-h-52 shadow-sm'>
        {text ? (
          <Markdown
            remarkPlugins={[remarkGfm]}
            className='markdown prose prose-sm dark:prose-invert'>
            {text}
          </Markdown>
        ) : (
          <p className='text-sm text-muted-foreground italic'>
            No information available at this time.
          </p>
        )}
      </div>
    );
  };

  return candidateViewTabs.map((item) => (
    <TabsContent key={item.value} value={item.value}>
      {item.id &&
        markedComponent(
          candidate[item.id as keyof CandidateNext] as string | undefined
        )}
    </TabsContent>
  ));
};

const CandidateViewSkeleton = () => {
  return (
    <div className='flex flex-1 flex-col w-full relative'>
      <AspectRatio ratio={16 / 5} className='bg-transparent relative'>
        <Skeleton className='h-full w-full lg:rounded-t-xl' />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-background/80' />
      </AspectRatio>

      <div className='px-6 -top-20 relative'>
        <div className='flex flex-1 mb-5 bg-white/80 backdrop-blur-md rounded-xl overflow-hidden shadow-lg'>
          <Skeleton className='h-[200px] w-[200px] rounded-l-xl' />
          <div className='flex flex-1 flex-col pt-6 px-6 relative'>
            <Skeleton className='h-8 w-3/4 mb-2' />
            <Skeleton className='h-4 w-1/2 mb-3' />
            <div className='flex gap-x-2 mb-3'>
              <Skeleton className='h-6 w-24 rounded-full' />
              <Skeleton className='h-6 w-24 rounded-full' />
            </div>
            <div className='flex gap-x-2 mb-3'>
              <Skeleton className='h-6 w-6 rounded-full' />
              <Skeleton className='h-6 w-6 rounded-full' />
              <Skeleton className='h-6 w-6 rounded-full' />
            </div>
          </div>
        </div>

        <div className='mt-6'>
          <Skeleton className='h-10 w-full mb-4 rounded-full' />
          <Skeleton className='h-64 w-full rounded-md' />
        </div>
      </div>
    </div>
  );
};

export default CandidateViewDeskTop;
