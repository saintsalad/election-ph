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
import FAQ from "@/components/custom/faq";
import { useTheme } from "next-themes";
import { Lock, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import HomeSecuritySection from "@/components/custom/home-security-section";

export default function Home() {
  const { theme } = useTheme();

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
                <ShimmerButton
                  className='h-10 mt-4 px-10 text-white dark:text-white'
                  background='rgba(0, 0, 1)'
                  darkBackground='rgba(20, 20, 20)'>
                  Join Us
                </ShimmerButton>
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
                  <ShimmerButton
                    className='h-10 mt-4 px-10 text-white dark:text-white font-semibold'
                    background={
                      theme === "dark"
                        ? "rgba(30, 41, 59, 0.8)"
                        : "rgba(15, 23, 42, 0.8)"
                    }
                    darkBackground='rgba(30, 41, 59, 0.8)'>
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
      <div className='relative flex flex-col w-full justify-center items-center py-28 px-5 overflow-hidden bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900'>
        <div className='mb-3 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-1 rounded-full'>
          ✨ ABOUT US
        </div>
        <h1 className='text-center max-w-3xl text-xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 z-10 mb-6'>
          We are committed to offering a secure and transparent platform for
          Filipinos to voice their opinions and engage in meaningful community
          discussions.
        </h1>
        <p className='text-center max-w-2xl text-slate-600 dark:text-slate-300 z-10 mb-8'>
          Our mission is to empower every Filipino citizen with a platform to
          express their views, participate in surveys, and contribute to the
          democratic process.
        </p>
        <Link href='/about'>
          <ShimmerButton
            className='h-10 px-6 text-white dark:text-white font-semibold'
            background={
              theme === "dark"
                ? "rgba(30, 41, 59, 0.8)"
                : "rgba(15, 23, 42, 0.8)"
            }
            darkBackground='rgba(30, 41, 59, 0.8)'>
            Learn More About Us
          </ShimmerButton>
        </Link>

        <GridPattern
          width={40}
          height={40}
          x={-1}
          y={-1}
          className={cn(
            "absolute inset-0 h-full w-full",
            "opacity-30 dark:opacity-20",
            "[mask-image:radial-gradient(ellipse_800px_400px_at_50%_50%,white,transparent)]"
          )}
        />
      </div>

      {/* Improved Security Section */}
      <HomeSecuritySection />

      <div className='mb-20'>
        <FAQ showItems={5} />
      </div>

      <MainFooter />
    </main>
  );
}
