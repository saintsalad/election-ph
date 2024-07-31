"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import hero from "@/public/images/hero.jpg";
import ShimmerButton from "@/components/magicui/shimmer-button";
import Link from "next/link";
import memoji1 from "@/public/images/memoji1.png";
import memoji2 from "@/public/images/memoji2.png";

const Interesting = [
  {
    title: "Accessible to All",
    description:
      "Every Filipino can register to participate in surveys, share their views, and join meaningful discussions. Your voice shapes our community.",
    image: memoji1,
  },

  {
    title: "Secured Participation",
    description:
      "Your data and responses are secure. Participate in surveys confidently, knowing your privacy is our top priority.",
    image: memoji2,
  },
];

export default function Home() {
  return (
    <main className=''>
      {/* hero section */}
      <AspectRatio ratio={16 / 9} className='bg-muted relative '>
        <Image
          draggable={false}
          priority={true}
          src={hero}
          alt='Election PH Hero banner'
          fill
          className='object-cover'
        />

        <div className='absolute flex flex-1 flex-col w-full h-full bg-gray-700 bg-opacity-40 md:items-start items-center  justify-center'>
          <div className='lg:max-w-[900px] md:pl-40 text-center md:text-left pt-12 md:pt-0'>
            <h1 className='text-white text-3xl md:text-7xl font-light'>
              ELECTION PH
            </h1>
            <div className='text-white font-base mt-3 px-10 md:px-0 flex flex-1 flex-col items-center md:items-start'>
              <p className='font-extralight md:text-lg'>
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

      <div className='relative flex flex-1 justify-center mx-5 md:mx-0'>
        <div className='max-w-5xl w-full py-16'>
          <h1 className='text-4xl font-black mb-10 text-slate-800'>
            What&#39;s interesting? 🤔
          </h1>

          {/* list section  */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {Interesting &&
              Interesting.map((item, i) => (
                <div
                  key={i}
                  className='flex flex-1 gap-x-3 bg-gray-200 p-5 rounded-lg shadow'>
                  <div className='bg-gray-50 max-h-28 max-w-28 md:max-h-32 md:max-w-32 aspect-square rounded-full flex flex-1 justify-center items-center overflow-hidden pt-5'>
                    <Image
                      draggable={false}
                      alt='lorem'
                      height={90}
                      width={90}
                      className='object-cover w-auto h-auto'
                      src={item.image}
                    />
                  </div>
                  <div className='flex flex-1 flex-col justify-center'>
                    <h2 className='text-xl md:text-2xl font-extrabold text-slate-700'>
                      {item.title}
                    </h2>
                    <div className='text-slate-600 text-sm'>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <AspectRatio ratio={16 / 9} className='bg-blue-50'>
        <div>test</div>
      </AspectRatio>
    </main>
  );
}
