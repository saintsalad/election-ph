import { CandidateNext, CandidateRating, UserRating } from "@/lib/definitions";
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
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CandidateViewMobile = ({
  candidate,
  candidateRate,
  candidateRateRefetch,
  userRate,
  userRateRefetch,
}: {
  candidate: CandidateNext | undefined;
  candidateRate: CandidateRating | undefined;
  userRate: UserRating | undefined;
  candidateRateRefetch: () => void;
  userRateRefetch: () => void;
}) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [tempRating, setTempRating] = useState<number>(0);
  const [isEditRating, setIsEditRating] = useState(false);
  const [openRateDrawer, setOpenRateDrawer] = useState(false);
  const user = useAuthStore((state) => state.user);

  const { browserType, deviceType } = useBrowserAndDevice();

  useEffect(() => {
    if (!carouselApi) return;

    const updateActiveIndex = () =>
      setActiveIndex(carouselApi.selectedScrollSnap());
    carouselApi.on("select", updateActiveIndex);

    return () => {
      carouselApi.off("select", updateActiveIndex);
      carouselApi.destroy();
    };
  }, [carouselApi]);

  useEffect(() => {
    setRating(0);
  }, []);

  const renderDots = () => {
    const totalSlides = 5;
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

    if (!candidate) {
      alert("candidate id is missing, please try again 🥲");
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
      candidateRateRefetch();
      userRateRefetch();
      setTimeout(() => {
        setOpenRateDrawer(true);
      }, 1500);
    } else {
      console.error("Error while saving rating", res.data);
    }
  };

  const markedComponent = (text: string) => {
    return (
      <div className='relative px-5 pt-12 pb-[100px] mt-[44px] max-h-[100vh] overflow-scroll'>
        <Markdown
          remarkPlugins={[remarkGfm]}
          className='markdown prose prose-slate text-slate-700 text-base'>
          {text}
        </Markdown>
      </div>
    );
  };

  return (
    <>
      {candidate && (
        <div className='flex flex-1 w-full h-full'>
          <Carousel
            setApi={setCarouselApi}
            className='w-full h-full -z-0 fixed'>
            <CarouselContent>
              {/* page1 */}
              <CarouselItem>
                <div className='h-[100vh] relative bg-black'>
                  <div className={`relative ${pageOneHeight()} w-[100%]`}>
                    <Image
                      draggable={"false"}
                      src={candidate.displayPhoto}
                      alt={candidate.displayPhoto}
                      fill
                      className='object-cover relative'
                    />
                    <div className='h-[180px] absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent'>
                      <div className='flex flex-1 h-full flex-col justify-end p-5 text-white'>
                        <h2 className='text-2xl md:text-base font-bold'>
                          {candidate.displayName}
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

              {/* biography ⭐ */}
              <CarouselItem
                style={{ overflowY: "scroll" }}
                className='bg-transparent'>
                {markedComponent(candidate.biography)}
              </CarouselItem>

              {/* education ⭐ */}
              <CarouselItem
                style={{ overflowY: "scroll" }}
                className='bg-transparent'>
                {markedComponent(candidate.educAttainment)}
              </CarouselItem>

              {/* achievements ⭐ */}
              <CarouselItem
                style={{ overflowY: "scroll" }}
                className='bg-transparent'>
                {markedComponent(candidate.achievements)}
              </CarouselItem>

              {/* platform & policy ⭐ */}
              <CarouselItem
                style={{ overflowY: "scroll" }}
                className='bg-transparent'>
                {markedComponent(candidate.platformAndPolicy)}
              </CarouselItem>
            </CarouselContent>
          </Carousel>

          <div className='fixed bottom-3 left-0 right-0 flex justify-center p-4 pointer-events-none'>
            <div className='flex gap-x-1.5'>{renderDots()}</div>
          </div>

          <Link href={"/candidates"} className='fixed top-14 left-1'>
            <ChevronLeft color='#FFF' className='h-8 w-8  drop-shadow-xl' />
          </Link>

          {/* actions section  */}
          <div className='fixed pr-4 right-0 bottom-1/3'>
            {/* Rate section */}
            <Drawer open={openRateDrawer} onOpenChange={setOpenRateDrawer}>
              <DrawerTrigger asChild>
                <div className='cursor-pointer text-center mb-5'>
                  <Star
                    fill={rating || userRate?.rate ? "#facc15" : "none"}
                    className='h-8 w-8 drop-shadow-xl'
                    color={rating || userRate?.rate ? "#facc15" : "white"}
                  />
                  <div className='text-xs font-semibold text-white mt-0.5 drop-shadow-xl'>
                    {/* {candRatingLoading && "..."} */}
                    {candidateRate ? candidateRate.averageRating : 0}
                  </div>
                </div>
              </DrawerTrigger>
              <DrawerContent>
                {!userRate?.rate && (
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

                {userRate && userRate.rate > 0 && (
                  <div className='mx-auto w-full max-w-sm'>
                    <DrawerHeader className='pb-0'>
                      <DrawerTitle>Rating Submitted ✨</DrawerTitle>
                      <DrawerDescription>
                        Thank you! You can update your rating in 3 days if
                        needed.
                      </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className='pb-5'>
                      <div className='flex flex-1 flex-row w-full justify-center gap-x-4 mb-8'>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            onClick={() => handleRateCandidate(index)}
                            key={index}
                            fill={index < userRate.rate ? "#facc15" : "#cbd5e1"}
                            className='h-8 w-8 '
                            color={
                              index < userRate.rate ? "#facc15" : "#cbd5e1"
                            }
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
                <DrawerTitle hidden></DrawerTitle>
                <DrawerDescription className='mx-auto w-full max-w-sm p-5 text-center'>
                  Feature will be available soon 🔒
                </DrawerDescription>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      )}
    </>
  );
};

export default CandidateViewMobile;
