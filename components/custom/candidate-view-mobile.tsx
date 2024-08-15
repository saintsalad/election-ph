import { Candidate } from "@/lib/definitions";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Star, MessageCircleMore } from "lucide-react";

const CandidateViewMobile = ({ candidate }: { candidate: Candidate }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateActiveIndex = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", updateActiveIndex);

    return () => {
      api.off("select", updateActiveIndex);
      api.destroy();
    };
  }, [api]);

  const renderDots = () => {
    const totalSlides = 2;
    const maxDots = 5;
    const visibleDots = Math.min(totalSlides, maxDots);
    const start =
      activeIndex > 2 && totalSlides > maxDots
        ? Math.min(activeIndex - 2, totalSlides - maxDots)
        : 0;

    return Array.from({ length: visibleDots }, (_, i) => (
      <div
        key={i + start}
        className={`h-1.5 w-1.5 rounded-full ${
          i + start === activeIndex ? "bg-yellow-400" : "bg-slate-300"
        } dark:bg-gray-600`}
      />
    ));
  };

  console.log(candidate);

  return (
    <div className='flex flex-1 w-full'>
      {/* <Image
        src={candidate.image}
        fill
        alt={candidate.name}
        className='object-cover'
      />

      <div className='absolute h-2/5 bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent '>
        <div className='flex flex-col justify-end p-3 text-white'>
          <h2 className='text-sm md:text-base font-bold'>{candidate.name}</h2>
          <p className='text-xs uppercase'>{candidate.party}</p>
        </div>
      </div> */}

      <Carousel setApi={setApi} className='w-full '>
        <CarouselContent>
          <CarouselItem className=' bg-black'>
            <div className='w-full flex flex-1 justify-center p-5 h-[85%] relative '>
              <Image
                draggable={"false"}
                src={candidate.image}
                alt={candidate.name}
                fill
                className='object-cover relative'
              />
              <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent '>
                <div className='flex flex-1  h-full flex-col justify-start p-5 mb-7 text-white'>
                  <h2 className='text-2xl md:text-base font-bold'>
                    {candidate.name}
                  </h2>
                  <div className='text-xs font-normal uppercase bg-green-500 self-start py-1 px-2 rounded-full mb-2'>
                    {candidate.party}
                  </div>
                  <p className='text-xs font-light text-slate-200'>
                    {candidate.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>

          <CarouselItem className=' bg-transparent pt-[44px]'>
            <div className='h-screen relative p-5'>
              <h2 className='text-2xl font-extrabold'>Biography</h2>
              <div>{candidate.description}</div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <div className='fixed bottom-3 left-0 right-0 flex justify-center p-4 pointer-events-none'>
        <div className='flex gap-x-1.5 '>{renderDots()}</div>
      </div>

      {/* actions section  */}
      <div className='fixed pr-4 gap-y-5  right-0 self-center flex flex-1 flex-col justify-center'>
        <div className='cursor-pointer text-center ' onClick={() => alert()}>
          <Star
            fill='yellow'
            className='h-8 w-8 drop-shadow-xl'
            color='yellow'
          />
          <div className='text-xs font-semibold text-white mt-0.5 drop-shadow-xl'>
            4.5
          </div>
        </div>
        <div className='cursor-pointer text-center' onClick={() => alert()}>
          <MessageCircleMore className='h-8 w-8 drop-shadow-xl' color='white' />
          <div className='text-xs font-semibold text-white mt-0.5 drop-shadow-xl'>
            1K
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateViewMobile;
