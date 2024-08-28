import { Candidate, CandidateRating, UserRating } from "@/lib/definitions";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Star, MessageCircleMore, ChevronLeft } from "lucide-react";
import { useBrowserAndDevice } from "@/hooks/useBrowserAndDevice";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { saveDocument } from "@/lib/firebase/functions";
import { useAuthStore } from "@/lib/store";
import axios from "axios";
import { useQuery } from "react-query";
import Link from "next/link";

function useUserRating(candidateId: string) {
  return useQuery<UserRating>(`user-rating-${candidateId}`, async () => {
    const { data } = await axios.get<UserRating>(
      `/api/user/rate?candidateId=${candidateId}`
    );
    return data;
  });
}

const CandidateViewMobile = ({
  candidate,
  candidateRate,
  candidateRateRefetch,
}: {
  candidate: Candidate;
  candidateRate: CandidateRating;
  candidateRateRefetch: () => void;
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [tempRating, setTempRating] = useState<number>(0);
  const [isEditRating, setIsEditRating] = useState(false);
  const user = useAuthStore((state) => state.user);

  const {
    status: userRatingSts,
    data: userRating,
    error: userRatingErr,
    isFetching: userRatingLoading,
    refetch: userRatingRefetch,
  } = useUserRating(candidate.id);

  const { browserType, deviceType } = useBrowserAndDevice();

  useEffect(() => {
    if (!api) return;

    const updateActiveIndex = () => setActiveIndex(api.selectedScrollSnap());
    api.on("select", updateActiveIndex);

    return () => {
      api.off("select", updateActiveIndex);
      api.destroy();
    };
  }, [api]);

  useEffect(() => {
    setRating(0);
  }, []);

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

  const pageOneHeight = () => {
    switch (browserType) {
      case "safari":
        return "h-[85%]";
      case "chrome":
        if (deviceType === "ios") return "h-[83%]";
        if (deviceType === "android") return "h-[90%]";
        break;
      default:
        return "h-[100%]";
    }
  };

  const handleRateCandidate = async (index: number) => {
    const newStars = index + 1;
    setTempRating(newStars);
  };

  // TODO: move inserting data to api route; api/candidate/rate
  const handleSubmitRating = async () => {
    const _userId = user?.uid;
    if (_userId === "" || !_userId) {
      alert("userid is missing, please report to admin 😭");
      return;
    }

    const rate = {
      rate: tempRating,
      candidateId: candidate.id,
      userId: _userId,
      dateCreated: new Date(),
    };

    const res = await saveDocument<UserRating>("candidateRate", rate);
    if (res.success) {
      console.log("Successfully saved", res.data);
      userRatingRefetch();
      candidateRateRefetch();
    } else {
      console.error("Error while saving rating", res.data);
    }
  };

  return (
    <div className='flex flex-1 w-full h-full'>
      <Carousel setApi={setApi} className='w-full h-full -z-0 fixed'>
        <CarouselContent>
          {/* page1 */}
          <CarouselItem>
            <div className='h-[100vh] relative bg-black'>
              <div className={`relative ${pageOneHeight()} w-[100%]`}>
                <Image
                  draggable={"false"}
                  src={candidate.image}
                  alt={candidate.name}
                  fill
                  className='object-cover relative'
                />
                <div className='h-[180px] absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent'>
                  <div className='flex flex-1 h-full flex-col justify-end p-5 text-white'>
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
            </div>
          </CarouselItem>

          {/* page2 */}
          <CarouselItem
            style={{ overflowY: "scroll" }}
            className='bg-transparent'>
            <div className='relative p-5 pb-[200px] mt-[44px] max-h-[100vh] overflow-scroll'>
              <h2 className='text-2xl font-extrabold'>Biography</h2>
              <div>{candidate.description}</div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <div className='fixed bottom-3 left-0 right-0 flex justify-center p-4 pointer-events-none'>
        <div className='flex gap-x-1.5'>{renderDots()}</div>
      </div>

      <Link href={"/candidate"} className='fixed top-14 left-1'>
        <ChevronLeft color='#FFF' className='h-8 w-8  drop-shadow-xl' />
      </Link>

      {/* actions section  */}
      <div className='fixed pr-4 right-0 bottom-1/3'>
        {/* Rate section */}
        <Drawer>
          <DrawerTrigger asChild>
            <div className='cursor-pointer text-center mb-5'>
              <Star
                fill={rating || userRating?.rate ? "#facc15" : "none"}
                className='h-8 w-8 drop-shadow-xl'
                color={rating || userRating?.rate ? "#facc15" : "white"}
              />
              <div className='text-xs font-semibold text-white mt-0.5 drop-shadow-xl'>
                {/* {candRatingLoading && "..."} */}
                {candidateRate ? candidateRate.averageRating : 0}
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            {!userRating?.rate && (
              <div className='mx-auto w-full max-w-sm'>
                <DrawerHeader className='pb-0'>
                  <DrawerTitle>Rate Candidate (test mode)</DrawerTitle>
                  <DrawerDescription>
                    Click on the stars and submit.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className='pb-5'>
                  <div className='flex flex-1 flex-row w-full justify-center gap-x-4 mb-8'>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        onClick={() => handleRateCandidate(index)}
                        key={index}
                        fill={index < tempRating ? "#facc15" : "#cbd5e1"}
                        className='h-8 w-8'
                        color={index < tempRating ? "#facc15" : "#cbd5e1"}
                      />
                    ))}
                  </div>

                  <DrawerClose asChild>
                    <Button onClick={handleSubmitRating} size='lg'>
                      Submit
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            )}

            {userRating && userRating.rate > 0 && (
              <div className='mx-auto w-full max-w-sm'>
                <DrawerHeader className='pb-0'>
                  <DrawerTitle>Rating Submitted ✨</DrawerTitle>
                  <DrawerDescription>
                    Thank you! You can update your rating in 3 days if needed.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className='pb-5'>
                  <div className='flex flex-1 flex-row w-full justify-center gap-x-4 mb-8'>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        onClick={() => handleRateCandidate(index)}
                        key={index}
                        fill={index < userRating.rate ? "#facc15" : "#cbd5e1"}
                        className='h-8 w-8 '
                        color={index < userRating.rate ? "#facc15" : "#cbd5e1"}
                      />
                    ))}
                  </div>

                  <DrawerClose asChild>
                    <Button
                      disabled={true}
                      onClick={handleSubmitRating}
                      size='lg'>
                      Submit
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            )}
          </DrawerContent>
        </Drawer>

        {/* TODO: comment section */}
        <Drawer>
          <DrawerTrigger asChild>
            <div className='cursor-pointer text-center mb-5'>
              <MessageCircleMore
                className='h-8 w-8 drop-shadow-xl'
                color='white'
              />
              <div className='text-xs font-semibold text-white mt-0.5 drop-shadow-xl'>
                0
              </div>
            </div>
          </DrawerTrigger>
          <DrawerContent className='min-h-[30vh]'>
            <div className='mx-auto w-full max-w-sm p-5 text-center'>
              <div>Feature will be available soon 🔒</div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default CandidateViewMobile;
