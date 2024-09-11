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
      {isDesktop ? (
        <AspectRatio ratio={16 / 8.5} className='bg-transparent relative'>
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
              <h1 className='text-white text-3xl md:text-4xl font-semibold'>
                Survey. Share. Influence
              </h1>
              <div className='text-white mt-3 px-10 md:px-0 flex flex-col items-center'>
                <p className='font-extralight md:text-lg max-w-[550px]'>
                  Take part in fair surveys, voice your thoughts, and help shape
                  tomorrow with Election PH.
                </p>
                <Link href='/signup'>
                  <ShimmerButton
                    // shimmerColor='yellow'
                    // background='#020617'
                    // color='#020617'
                    className='h-10 mt-4 px-10'>
                    Join Us
                  </ShimmerButton>
                </Link>
              </div>
            </div>
          </div>
        </AspectRatio>
      ) : (
        <div className='min-h-40 mb-16 '>
          <div className='h-screen relative'>
            <Image
              draggable={false}
              priority={true}
              src={hero}
              alt='Election PH Hero banner'
              fill
              className='object-cover'
            />

            <div className='absolute flex flex-col w-full h-full bg-opacity-40 mt-24'>
              <div className='text-center pt-12 md:pt-0'>
                <h1 className='text-white text-2xl md:text-4xl font-semibold'>
                  Survey. Share. Influence
                </h1>
                <div className='text-white mt-1 md:mt-3 px-10 md:px-0 flex flex-col items-center'>
                  <p className='font-extralight text-base md:text-lg max-w-[550px]'>
                    Take part in fair surveys, voice your thoughts, and help
                    shape tomorrow with Election PH.
                  </p>
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
      )}

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
                className='flex flex-1 gap-x-3 bg-gray-200 p-5 rounded-lg shadow'>
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
                  <p className='text-slate-600 text-sm'>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Placeholder for additional content */}
      <div className='relative flex flex-1 justify-center px-5 md:px-0'>
        <div className='flex flex-1 flex-col items-center py-16 sm:py-28 max-w-5xl'>
          <div className='mb-5 text-sm text-slate-500'>ABOUT US ✨</div>
          <h1 className='text-center max-w-3xl text-xl sm:text-4xl font-bold md:mb-32 mb-16 text-slate-800'>
            We are committed to offering a secure and transparent platform for
            Filipinos to voice their opinions and engage in meaningful community
            discussions.
          </h1>

          {/* <div className='mb-5 text-sm text-slate-500'>OUR MISSION 🚀</div>
          <h1 className='text-center max-w-4xl text-xl sm:text-xl font-bold md:mb-32 mb-16 text-slate-800'>
            To provide an engaging and secure platform that enables Filipinos to
            participate in online voting and surveys. We are dedicated to
            promoting civic engagement through a user-friendly experience while
            maintaining the highest standards of privacy and security. Please
            note that this platform does not reflect or impact official election
            results or governmental decisions.
          </h1> */}
        </div>
      </div>

      <footer className='footer-wave-clip bg-primary h-96 pt-20 px-5 sm:px-20 flex  flex-1 flex-col'>
        <div className='text-white flex-1 '>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia,
          libero sint! Sapiente rerum doloribus exercitationem eligendi
          voluptatibus facilis maiores, id dignissimos quo labore ratione
          dolorum laboriosam ut accusantium aliquam eos.
        </div>
        <div className='text-white py-5 text-center font-extralight text-sm'>
          Copyright © 2024 Election PH. All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}
