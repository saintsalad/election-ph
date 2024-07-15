import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Candidate } from "@/lib/definitions";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import VoteConfirmation from "./vote-confirmation";

type SingleVoteCarouselViewProps = {
  candidates: Candidate[];
};

const SingleVoteCarouselView = ({
  candidates,
}: SingleVoteCarouselViewProps) => {
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
    const totalSlides = candidates.length;
    const maxDots = 5;
    const visibleDots = Math.min(totalSlides, maxDots);
    const start =
      activeIndex > 2 && totalSlides > maxDots
        ? Math.min(activeIndex - 2, totalSlides - maxDots)
        : 0;

    return Array.from({ length: visibleDots }, (_, i) => (
      <div
        key={i + start}
        className={`h-2 w-2 rounded-full ${
          i + start === activeIndex ? "bg-blue-600" : "bg-gray-400"
        } dark:bg-gray-600`}
      />
    ));
  };

  return (
    <div className='flex flex-1 flex-col items-center'>
      <Carousel
        setApi={setApi}
        className='w-full max-w-[340px] sm:max-w-md md:max-w-4xl p-0'>
        <CarouselContent>
          {candidates.map((candidate, index) => (
            <CarouselItem className='md:basis-1/2 lg:basis-1/3' key={index}>
              <div className='flex flex-col h-96 w-full sm:aspect-square items-center justify-center rounded-xl overflow-hidden'>
                <div className='relative h-full w-full rounded-xl overflow-hidden'>
                  <Image
                    priority
                    alt={candidate.name}
                    src={candidate.image}
                    fill
                    sizes='50'
                    className='-z-10'
                    style={{ objectFit: "cover" }}
                  />
                  <div className='flex flex-1 bg-rose-500 h-full bg-opacity-20 items-start justify-end flex-col p-5'>
                    <div className='text-xl font-semibold z-10 text-white'>
                      {candidate.name}
                    </div>
                    <div className='text-xs text-white uppercase'>
                      {candidate.party}
                    </div>
                    <div className='text-xs text-white mt-2'>
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Fuga error voluptatibus nam saepe nostrum.
                    </div>
                    <VoteConfirmation key={index} candidate={candidate}>
                      <div
                        // size='sm'
                        className='w-36 mt-5 self-center hidden sm:block'>
                        Vote
                      </div>
                    </VoteConfirmation>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='hidden sm:block' />
        <CarouselNext className='hidden sm:block' />

        <div className='flex gap-x-1.5 justify-center mt-4'>{renderDots()}</div>
        <div className='flex flex-1 w-full mt-5 sm:hidden'>
          <VoteConfirmation candidate={candidates[activeIndex]}>
            <div className='flex flex-1 bg-primary text-white justify-center items-center h-[40px] rounded-md text-sm cursor-pointer font-semibold hover:bg-opacity-5'>
              Vote
            </div>
          </VoteConfirmation>
        </div>
      </Carousel>
    </div>
  );
};

export default SingleVoteCarouselView;
