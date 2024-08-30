"use client";

import { Candidate, CandidateNext, CandidateRating } from "@/lib/definitions";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import hero from "@/public/images/hero.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, EllipsisVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
// import { marked } from "marked";
// import "github-markdown-css/github-markdown.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SocialIcon } from "react-social-icons/component";
import { Badge } from "@/components/ui/badge";
import "react-social-icons/x";
import "react-social-icons/facebook";

const CandidateViewDeskTop = ({
  candidate,
  candidateRate,
}: {
  // candidate: Candidate;
  candidate: CandidateNext;
  candidateRate: CandidateRating;
}) => {
  const [activeTab, setActiveTab] = useState("bio");

  const markedComponent = (text: string) => {
    return (
      <Markdown
        remarkPlugins={[remarkGfm]}
        className='markdown prose prose-slate !max-w-none p-5 text-slate-700 bg-white rounded-md min-h-52 shadow-sm'>
        {text}
      </Markdown>
    );
  };

  return (
    <div className='flex flex-1 flex-col w-full pb-20 relative'>
      <AspectRatio ratio={16 / 5} className='bg-transparent relative'>
        <Image
          draggable={false}
          priority={true}
          src={hero}
          alt='Election PH Hero banner'
          fill
          className='object-cover lg:rounded-md'
        />
      </AspectRatio>

      <div className='px-5 -top-16 relative'>
        <div className='flex flex-1  mb-10  border-[10px] border-white bg-white rounded-md overflow-hidden  drop-shadow-sm'>
          <div className='relative h-[200px] w-[200px] rounded-md overflow-hidden'>
            <Image
              draggable={false}
              alt={candidate.displayName}
              fill
              className='object-cover relative'
              src={candidate.displayPhoto}
            />
          </div>
          <div className='bg-white flex flex-1 flex-col pt-8 px-5 relative'>
            <div className='absolute right-2 top-2'>
              <div className='flex flex-1 gap-x-3 items-center'>
                {/* rate button */}
                <div
                  title={`average of ${candidateRate.averageRating} rating from ${candidateRate.numberOfRatings} user/s`}
                  role='button'
                  className='font-semibold text-sm text-slate-800 hover:opacity-70 flex self-start'
                  onClick={() => setActiveTab("rating")}>
                  <Star
                    className='h-5 w-5 mr-1'
                    color='#facc15'
                    fill='#facc15'
                  />
                  {candidateRate.averageRating}({candidateRate.numberOfRatings})
                </div>

                {/* action button */}
                <div role='button' onClick={() => alert("menu")}>
                  <EllipsisVertical className='h-5 w-5' />
                </div>
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

            <Badge variant='default' className='mt-2 self-start rounded-full'>
              REPUBLICAN
            </Badge>

            <Separator className='my-4' />

            <div className='flex gap-x-3'>
              {candidate &&
                candidate.socialLinks.map((item, i) => {
                  return (
                    <SocialIcon
                      className='max-h-8 max-w-8 antialiased'
                      network={item.type}
                      key={i}
                      target='_blank'
                      href={item.url}
                    />
                  );
                })}
            </div>
          </div>
        </div>

        <Tabs onValueChange={setActiveTab} value={activeTab} className='w-full'>
          <TabsList className='bg-transparent'>
            <TabsTrigger value='rating'>Rating ✨</TabsTrigger>
            <TabsTrigger value='bio'>Biography</TabsTrigger>
            <TabsTrigger value='educ-attainment'>
              Educational Attainment
            </TabsTrigger>
            <TabsTrigger value='achievements'>Achievements</TabsTrigger>
            <TabsTrigger value='platform-policy'>Platform & Policy</TabsTrigger>
          </TabsList>

          <TabsContent value='bio'>
            {markedComponent(candidate.biography)}
          </TabsContent>
          <TabsContent value='educ-attainment'>
            {markedComponent(candidate.educAttainment)}
          </TabsContent>
          <TabsContent value='achievements'>
            {markedComponent(candidate.achievements)}
          </TabsContent>
          <TabsContent value='platform-policy'>
            {markedComponent(candidate.platformAndPolicy)}
          </TabsContent>
          <TabsContent value='rating'>Rate here 🚨</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CandidateViewDeskTop;
