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
    <div className='flex flex-1 w-full items-end max-h-screen'>
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

      <Carousel setApi={setApi} className='w-full h-full'>
        <CarouselContent>
          <CarouselItem>
            <div className='h-full relative'>
              <Image
                draggable='false'
                src={candidate.image}
                fill
                alt={candidate.name}
                className='object-cover'
              />
              <div className='absolute h-1/5 bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent '>
                <div className='flex flex-col justify-end p-3 text-white'>
                  <h2 className='text-sm md:text-base font-bold'>
                    {candidate.name}
                  </h2>
                  <p className='text-xs uppercase'>{candidate.party}</p>
                </div>
              </div>
            </div>
          </CarouselItem>

          <CarouselItem className='pt-[44px]'>
            <div className='h-screen relative p-5'>
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum
                quas sunt exercitationem ut delectus doloremque fuga
                repellendus, ipsa illum odio cum eius nisi quo nesciunt
                excepturi tenetur debitis ullam vel test?
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <div className='absolute bottom-0 left-0 right-0 flex justify-center p-4 pointer-events-none'>
        <div className='flex gap-x-1.5 '>{renderDots()}</div>
      </div>

      {/* actions section  */}
      <div className='absolute pr-4 gap-y-5 bottom-0 right-0 h-full flex flex-1 flex-col justify-center pointer-events-none'>
        <div className='cursor-pointer' onClick={() => alert()}>
          <Star className='h-8 w-8' color='white' />
        </div>
        <div className='cursor-pointer' onClick={() => alert()}>
          <MessageCircleMore className='h-8 w-8' color='white' />
        </div>
      </div>
    </div>
  );
};

export default CandidateViewMobile;
