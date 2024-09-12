"use client";

import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import hero from "@/public/images/hero.jpg";
import ShimmerButton from "@/components/magicui/shimmer-button";
import Link from "next/link";
import memoji1 from "@/public/images/memoji1.png";
import memoji2 from "@/public/images/memoji2.png";
import memoji3 from "@/public/images/memoji3.png";
import memoji4 from "@/public/images/memoji4.png";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import GridPattern from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";
import WordFadeIn from "@/components/magicui/word-fade-in";

const interestingFeatures = [
  {
    title: "Accessible",
    description:
      "Every Filipino can register to participate in surveys, share their views, and join meaningful discussions. Your voice shapes our community.",
    image: memoji1,
  },
  // {
  //   title: "Secured Participation",
  //   description:
  //     "Your data and responses are secure. Participate in surveys confidently, knowing your privacy is our top priority.",
  //   image: memoji2,
  // },
  {
    title: "Real-Time",
    description:
      "Stay updated with real-time survey results. See how opinions are shaping up as votes come in, giving you a live snapshot of the community's views.",
    image: memoji2,
  },
  {
    title: "Anonymous",
    description:
      "Your identity remains confidential. Share your honest opinions without fear, knowing that your responses are anonymous.",
    image: memoji3,
  },
  // {
  //   title: "Bot Prevention",
  //   description:
  //     "Our advanced bot prevention measures ensure that survey results are accurate and genuine, maintaining the integrity of your participation.",
  //   image: memoji1,
  // },
  {
    title: "Bias-Free",
    description:
      "Our platform is designed to minimize biases, providing fair and balanced survey results that truly reflect the community's opinions.",
    image: memoji4,
  },
];

export default function Home() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

      {/* Interesting Features Section */}
      <div className='relative flex justify-center mx-5 md:mx-0 py-26 sm:py-28'>
        <div className='max-w-5xl w-full'>
          <h1 className='text-3xl sm:text-4xl text-center sm:text-left font-black mb-5 sm:mb-10 text-slate-800'>
            What&#39;s interesting? 🤔
          </h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {interestingFeatures.map((feature, index) => (
              <div
                key={index}
                className='flex flex-1 gap-x-3 bg-slate-100 p-5 rounded-lg border'>
                <div className='bg-gradient-to-r from-orange-400 to-yellow-200 max-h-28 max-w-28 md:max-h-32 md:max-w-32 aspect-square rounded-full flex flex-1 justify-center items-center overflow-hidden pt-[40px]'>
                  <Image
                    draggable={false}
                    alt={feature.title}
                    height={95}
                    width={95}
                    className='object-cover w-auto h-auto'
                    src={feature.image}
                  />
                </div>
                <div className='flex flex-1 flex-col justify-center'>
                  <h2 className='text-xl md:text-2xl font-extrabold text-slate-700'>
                    {feature.title}
                  </h2>
                  <div className='text-slate-600 text-sm'>
                    {feature.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Placeholder for additional content */}
      <div className='relative flex flex-col w-full  justify-center items-center py-28 mb-28'>
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

      <div className='w-full bg-primary footer-wave-clip'>
        <div className='max-w-5xl mx-auto w-full px-5 sm:px-20 pt-20'>
          <footer className='flex flex-col'>
            <div className='text-white flex flex-col md:flex-row justify-between mb-20'>
              <div className='mb-8 md:mb-0 md:w-1/3'>
                <h3 className='text-xl font-bold mb-4'>Election PH</h3>
                <div className='text-sm'>
                  Empowering Filipinos with a secure and transparent platform
                  for voicing opinions and engaging in meaningful community
                  discussions about elections and civic matters.
                </div>
              </div>
              <div className='mb-8 md:mb-0'>
                <h4 className='text-lg font-semibold mb-3'>Quick Links</h4>
                <ul className='text-sm'>
                  <li className='mb-2'>
                    <Link href='/' className='hover:underline'>
                      Home
                    </Link>
                  </li>
                  <li className='mb-2'>
                    <Link href='/about' className='hover:underline'>
                      About Us
                    </Link>
                  </li>
                  <li className='mb-2'>
                    <Link href='/contact' className='hover:underline'>
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className='text-lg font-semibold mb-3'>Connect With Us</h4>
                <ul className='text-sm'>
                  <li className='mb-2'>
                    <Link
                      href='https://facebook.com'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:underline'>
                      Facebook
                    </Link>
                  </li>
                  <li className='mb-2'>
                    <Link
                      href='https://twitter.com'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:underline'>
                      Twitter
                    </Link>
                  </li>
                  <li className='mb-2'>
                    <Link
                      href='https://instagram.com'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:underline'>
                      Instagram
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className='text-white text-sm text-center pb-8'>
              © {new Date().getFullYear()} Election PH. All rights reserved.
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
