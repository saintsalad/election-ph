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
  function getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  return (
    <main>
      {/* Hero Section */}
      <AspectRatio ratio={16 / 8.5} className='bg-transparent relative'>
        <Image
          draggable={false}
          priority={true}
          src={hero}
          alt='Election PH Hero banner'
          fill
          className='object-cover hero-banner'
        />
        <div className='absolute flex flex-col w-full h-full bg-opacity-40 items-center md:items-start justify-center'>
          <div className='text-center md:text-left lg:max-w-[900px] md:pl-40 pt-12 md:pt-0'>
            <h1 className='text-white text-3xl md:text-7xl font-light'>
              ELECTION PH
            </h1>
            <div className='text-white mt-3 px-10 md:px-0 flex flex-col items-center md:items-start'>
              <p className='font-extralight md:text-lg'>
                Welcome to your trusted space for impartial surveys. Share your
                political views and participate in meaningful discussions. Join
                our community and help shape the future of our country. Your
                voice matters!
              </p>
              <Link href='/signup'>
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

      {/* Interesting Features Section */}
      <div className='relative flex justify-center mx-5 md:mx-0 py-26 sm:py-28'>
        <div className='max-w-5xl w-full'>
          <h1 className='text-4xl font-black mb-10 text-slate-800'>
            What&#39;s interesting? 🤔
          </h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {interestingFeatures.map((feature, index) => (
              <div
                key={index}
                className='flex flex-1 gap-x-3 bg-gray-200 p-5 rounded-lg shadow'>
                <div className='bg-gray-50 max-h-28 max-w-28 md:max-h-32 md:max-w-32 aspect-square rounded-full flex flex-1 justify-center items-center overflow-hidden pt-[40px]'>
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
    </main>
  );
}
