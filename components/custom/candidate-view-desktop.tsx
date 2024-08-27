import { Candidate, CandidateRating } from "@/lib/definitions";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import hero from "@/public/images/hero.jpg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, EllipsisVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const CandidateViewDeskTop = ({
  candidate,
  candidateRate,
}: {
  candidate: Candidate;
  candidateRate: CandidateRating;
}) => {
  const [activeTab, setActiveTab] = useState("bio");

  return (
    <div className='flex flex-1 flex-col w-full pb-10 relative'>
      <AspectRatio ratio={16 / 5} className='bg-transparent relative mt-5'>
        <Image
          draggable={false}
          priority={true}
          src={hero}
          alt='Election PH Hero banner'
          fill
          className='object-cover rounded-md'
        />
      </AspectRatio>

      <div className='px-5 -top-16 relative'>
        <div className='flex flex-1 gap-x-5  mb-10'>
          <div className=' relative h-[210px] w-[210px] rounded-md overflow-hidden drop-shadow-sm '>
            <Image
              draggable={false}
              alt={candidate.name}
              fill
              className='object-cover relative'
              src={candidate.image}
            />
          </div>
          <div className='bg-white flex flex-1 flex-col rounded-md drop-shadow-sm pt-8 px-5 relative'>
            {/* action button */}
            <div
              role='button'
              onClick={() => alert("menu")}
              className='absolute right-3 top-4'>
              <EllipsisVertical className='h-5 w-5' />
            </div>

            {/* name */}
            <div className='text-4xl font-bold mb-1 text-slate-800'>
              {candidate.name}
            </div>

            {/* party */}
            <div className='text-xs font-normal uppercase bg-green-500 self-start py-1 px-2 rounded-full mb-2 text-slate-800'>
              {candidate.party}
            </div>

            {/* rate button */}
            <div
              role='button'
              className='font-semibold text-sm text-slate-800 hover:opacity-70 flex self-start'
              onClick={() => setActiveTab("rating")}>
              <Star className='h-5 w-5 mr-1' color='#facc15' fill='#facc15' />
              {candidateRate.averageRating}({candidateRate.numberOfRatings})
            </div>

            <Separator className='my-5' />
          </div>
        </div>

        <Tabs onValueChange={setActiveTab} value={activeTab} className='w-full'>
          <TabsList className='bg-slate-200'>
            <TabsTrigger value='rating'>Rating ✨</TabsTrigger>
            <TabsTrigger value='bio'>Biography</TabsTrigger>
            <TabsTrigger value='educ-attainment'>
              Educational Attainment
            </TabsTrigger>
            <TabsTrigger value='achievements'>Achievements</TabsTrigger>
            <TabsTrigger value='platform-policy'>Platform & Policy</TabsTrigger>
          </TabsList>
          <TabsContent value='bio'>{candidate.description}</TabsContent>
          <TabsContent value='educ-attainment'>
            Feature will be unlock soon. 🔒
          </TabsContent>
          <TabsContent value='achievements'>
            Feature will be unlock soon. 🔒
          </TabsContent>
          <TabsContent value='platform-policy'>
            Feature will be unlock soon. 🔒
          </TabsContent>
          <TabsContent value='rating'>Rate here 🚨</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CandidateViewDeskTop;
