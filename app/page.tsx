"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import hero from "@/public/images/hero.jpg";
import ShimmerButton from "@/components/magicui/shimmer-button";
import Link from "next/link";

export default function Home() {
  return (
    <main className='bg-red-50'>
      {/* hero section */}
      <AspectRatio ratio={16 / 9} className='bg-muted relative'>
        <Image
          priority={true}
          src={hero}
          alt='Election PH Hero banner'
          fill
          className='object-cover'
        />

        <div className='absolute flex flex-1 flex-col w-full h-full bg-gray-700 bg-opacity-40 items-start justify-center'>
          <div className='lg:max-w-[900px] pl-40'>
            <h1 className='text-white text-7xl font-light'>ELECTION PH</h1>
            <div className='text-white font-base mt-3'>
              <p className='font-extralight text-lg'>
                Welcome to your trusted space for impartial surveys. Share your
                political views and participate in meaningful discussions. Join
                our community and help shape the future of our country. Your
                voice matters!
              </p>
              <Link href={"/signup"}>
                <ShimmerButton
                  shimmerColor='yellow'
                  background='#020617'
                  color='#020617'
                  className='h-10 mt-4 px-10'>
                  Join Now
                </ShimmerButton>
              </Link>
            </div>
          </div>
        </div>
      </AspectRatio>

      <AspectRatio ratio={16 / 9} className='bg-red-200'>
        <div>test</div>
      </AspectRatio>

      <AspectRatio ratio={16 / 9} className='bg-blue-50'>
        <div>test</div>
      </AspectRatio>
    </main>
  );
}
