"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import hero from "@/public/images/hero.jpg";
import ShimmerButton from "@/components/magicui/shimmer-button";
import Link from "next/link";
import GridPattern from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";
import WordFadeIn from "@/components/magicui/word-fade-in";
import HomeFeatures from "@/components/custom/home-features";
import HomeDisclaimerCard from "@/components/custom/home-disclaimer-card";
import Image from "next/image";
import MainFooter from "@/components/custom/layout/main-footer";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <div className='relative hidden sm:block'>
        <AspectRatio ratio={16 / 8.5} className='bg-transparent'>
          <Image
            draggable={false}
            priority={true}
            src={hero}
            alt='Election PH Hero banner'
            fill
            className='object-cover'
          />
          <div className='absolute flex flex-col w-full h-full bg-opacity-40 items-center justify-center'>
            <div className='text-center pt-12 md:pt-0'>
              <WordFadeIn
                delay={0.05}
                className='text-white text-3xl md:text-4xl font-semibold'
                words='Your Voice Matters'
              />
              <div className='text-white mt-3 px-10 md:px-0 flex flex-col items-center'>
                <div className='font-extralight md:text-lg max-w-[550px]'>
                  Take part in fair surveys, voice your thoughts, and help shape
                  tomorrow with <b>Election PH</b>.
                </div>
                <Link href='/signup'>
                  <ShimmerButton className='h-10 mt-4 px-10'>
                    Join Us
                  </ShimmerButton>
                </Link>
              </div>
            </div>
          </div>
        </AspectRatio>
      </div>

      {/* desktop hero */}
      <div className='min-h-40 mb-16 sm:hidden'>
        <div className='h-screen relative'>
          <Image
            draggable={false}
            priority={true}
            src={hero}
            alt='Election PH Hero banner'
            fill
            className='object-cover'
          />

          {/* mobile hero */}
          <div className='absolute flex flex-col w-full h-full bg-opacity-40  justify-center'>
            <div className='text-center pt-12 md:pt-0'>
              <WordFadeIn
                className='text-white text-2xl md:text-4xl font-semibold'
                words='Your Voice Matters'
              />
              <div className='text-white mt-1 md:mt-3 px-10 md:px-0 flex flex-col items-center'>
                <div className='font-extralight text-base md:text-lg max-w-[550px]'>
                  Take part in fair surveys, voice your thoughts, and help shape
                  tomorrow with
                  <b>Election PH</b>.
                </div>
                <Link href='/signup'>
                  <ShimmerButton className='h-10 mt-4 px-10'>
                    Join Us
                  </ShimmerButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <HomeFeatures />

      {/* Disclaimer Section */}
      <HomeDisclaimerCard />

      {/* Placeholder for additional content */}
      <div className='relative flex flex-col w-full justify-center items-center py-28 px-5 mb-28'>
        <div className='mb-3 text-sm text-slate-500'>ABOUT US ✨</div>
        <h1 className='text-center max-w-3xl text-xl sm:text-4xl font-bold  text-slate-800 z-10'>
          We are committed to offering a secure and transparent platform for
          Filipinos to voice their opinions and engage in meaningful community
          discussions.
        </h1>

        <GridPattern
          width={50}
          height={50}
          x={-1}
          y={-1}
          // strokeDasharray={"4 2"}
          className={cn(
            "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
          )}
        />
      </div>

      <MainFooter />
    </main>
  );
}
