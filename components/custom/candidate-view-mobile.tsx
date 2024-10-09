import { CandidateNext, CandidateRating, UserRating } from "@/lib/definitions";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import {
  Star,
  MessageCircleMore,
  ChevronLeft,
  MoreVertical,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { saveDocument } from "@/lib/firebase/functions";
import { useAuthStore } from "@/lib/store";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LucideIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface CandidateViewMobileProps {
  candidate: CandidateNext | undefined;
  candidateRate: CandidateRating | undefined;
  userRate: UserRating | undefined;
  candidateRateRefetch: () => void;
  userRateRefetch: () => void;
}

const CandidateViewMobile = ({
  candidate,
  candidateRate,
  candidateRateRefetch,
  userRate,
  userRateRefetch,
}: CandidateViewMobileProps) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  const [openRateDrawer, setOpenRateDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"rating" | "success" | "edit">(
    "rating"
  );
  const user = useAuthStore((state) => state.user);
  const [daysUntilEdit, setDaysUntilEdit] = useState<number | null>(null);
  const [openCommentDrawer, setOpenCommentDrawer] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;

    const updateActiveIndex = () =>
      setActiveIndex(carouselApi.selectedScrollSnap());
    carouselApi.on("select", updateActiveIndex);

    return () => {
      carouselApi.off("select", updateActiveIndex);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (userRate?.rate) {
      setTempRating(userRate.rate);
      const { canEdit, daysLeft } = getEditStatus(userRate);
      setDrawerMode(canEdit ? "edit" : "success");
      setDaysUntilEdit(daysLeft);
    } else {
      setDrawerMode("rating");
      setDaysUntilEdit(null);
    }
  }, [userRate]);

  const getEditStatus = (
    rating: UserRating
  ): { canEdit: boolean; daysLeft: number } => {
    const ratingDate = new Date(rating.dateCreated);
    const today = new Date();
    const daysSinceRating = differenceInDays(today, ratingDate);
    const daysLeft = Math.max(3 - daysSinceRating, 0);
    return { canEdit: daysLeft === 0, daysLeft };
  };

  const handleRateCandidate = (index: number) => {
    if (drawerMode === "rating" || drawerMode === "edit") {
      setTempRating(index + 1);
    }
  };

  const handleSubmitRating = async () => {
    if (!user?.uid || !candidate) {
      alert("Missing user ID or candidate. Please try again.");
      return;
    }

    const rate = {
      rate: tempRating,
      candidateId: candidate.id,
      userId: user.uid,
      dateCreated: new Date().toISOString(),
    };

    const res = await saveDocument<UserRating>("candidateRate", rate);
    if (res.success) {
      candidateRateRefetch();
      userRateRefetch();
      setDrawerMode("success");
      setDaysUntilEdit(3); // Reset to 3 days after new rating
    } else {
      alert("Error while saving rating. Please try again.");
    }
  };

  const renderDots = () => {
    const totalSlides = 5;
    const maxDots = 5;
    const visibleDots = Math.min(totalSlides, maxDots);
    const start = Math.min(Math.max(activeIndex - 2, 0), totalSlides - maxDots);

    return Array.from({ length: visibleDots }, (_, i) => (
      <div
        key={i + start}
        className={`h-1 w-1 rounded-full transition-all duration-300 ${
          i + start === activeIndex ? "bg-white w-3" : "bg-white/50"
        }`}
      />
    ));
  };

  const markedComponent = (text: string) => (
    <div className='px-4 py-6 overflow-y-auto'>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ className, ...props }) => (
            <h1
              className={cn("text-2xl font-bold mb-4", className)}
              {...props}
            />
          ),
          h2: ({ className, ...props }) => (
            <h2
              className={cn("text-xl font-semibold mb-3", className)}
              {...props}
            />
          ),
          h3: ({ className, ...props }) => (
            <h3
              className={cn("text-lg font-medium mb-2", className)}
              {...props}
            />
          ),
          p: ({ className, ...props }) => (
            <p className={cn("text-base mb-4", className)} {...props} />
          ),
          ul: ({ className, ...props }) => (
            <ul className={cn("list-disc pl-5 mb-4", className)} {...props} />
          ),
          ol: ({ className, ...props }) => (
            <ol
              className={cn("list-decimal pl-5 mb-4", className)}
              {...props}
            />
          ),
          li: ({ className, ...props }) => (
            <li className={cn("mb-1", className)} {...props} />
          ),
          a: ({ className, ...props }) => (
            <a
              className={cn("text-blue-500 underline", className)}
              {...props}
            />
          ),
          blockquote: ({ className, ...props }) => (
            <blockquote
              className={cn(
                "border-l-4 border-gray-300 pl-4 italic my-4",
                className
              )}
              {...props}
            />
          ),
          code: ({ className, ...props }) => (
            <code
              className={cn("bg-gray-100 rounded px-1 py-0.5", className)}
              {...props}
            />
          ),
          pre: ({ className, ...props }) => (
            <pre
              className={cn(
                "bg-gray-100 rounded p-3 overflow-x-auto my-4",
                className
              )}
              {...props}
            />
          ),
        }}
        className='markdown text-gray-800'>
        {text}
      </Markdown>
    </div>
  );

  if (!candidate) return null;

  return (
    <div className='flex flex-1 w-full h-full bg-black'>
      <Carousel setApi={setCarouselApi} className='w-full h-full -z-0 fixed'>
        <CarouselContent>
          <CarouselItem>
            <div className='h-screen relative'>
              <div className='relative h-full w-full'>
                <Image
                  src={candidate.displayPhoto}
                  alt={candidate.displayName}
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent' />
                <div className='absolute bottom-16 left-0 right-0 p-6 text-white'>
                  <h2 className='text-3xl font-bold mb-2'>
                    {candidate.displayName}
                  </h2>
                  <div className='inline-block text-xs font-medium uppercase bg-green-500 py-1 px-3 rounded-full mb-3'>
                    {candidate.party}
                  </div>
                  <p className='text-sm font-light text-white/90 min-h-[4.5em] line-clamp-3'>
                    {candidate.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          </CarouselItem>

          {[
            "biography",
            "educAttainment",
            "achievements",
            "platformAndPolicy",
          ].map((section) => (
            <CarouselItem key={section} className='bg-white'>
              <div className='h-screen overflow-y-auto pt-24'>
                {/* <h3 className='text-xl font-semibold mb-2 px-4 pt-20 sticky top-0 bg-white z-10 w-full text-center capitalize'>
                  {section === "educAttainment" ? "Education" : section}
                </h3> */}
                {markedComponent(
                  candidate[section as keyof CandidateNext] as string
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className='fixed bottom-6 left-0 right-0 flex justify-center'>
        <div className='flex gap-x-1.5 bg-black/20 backdrop-blur-md px-2 py-1 rounded-full'>
          {renderDots()}
        </div>
      </div>

      <Link
        href='/candidates'
        className='fixed top-[72px] left-4 bg-black/20 backdrop-blur-md p-2 rounded-full'>
        <ChevronLeft color='#FFF' className='h-6 w-6' />
      </Link>

      <div className='fixed right-4 bottom-32'>
        <div className='bg-black/30 rounded-full p-2 flex flex-col items-center gap-2 shadow-lg'>
          <ActionButton
            Icon={Star}
            count={candidateRate?.averageRating ?? 0}
            active={!!userRate?.rate}
            onClick={() => setOpenRateDrawer(true)}
          />
          <ActionButton
            Icon={MessageCircle}
            count={0}
            onClick={() => setOpenCommentDrawer(true)}
          />
          <ActionButton
            Icon={MoreVertical}
            onClick={() => {
              /* TODO: Implement more options functionality */
            }}
          />
        </div>
      </div>

      <Drawer open={openRateDrawer} onOpenChange={setOpenRateDrawer}>
        <DrawerContent>
          <div className='mx-auto w-full max-w-sm'>
            <DrawerHeader className='pb-0'>
              <DrawerTitle>Rate Candidate</DrawerTitle>
              <DrawerDescription>
                {drawerMode === "rating" &&
                  "Click on the stars to rate the candidate."}
                {drawerMode === "success" && "Thank you for rating!"}
                {drawerMode === "edit" && "You can now update your rating."}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className='pb-5'>
              <div className='flex flex-1 flex-row w-full justify-center gap-x-4 mb-8'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    onClick={() => handleRateCandidate(index)}
                    fill={index < tempRating ? "#facc15" : "#cbd5e1"}
                    className={`h-8 w-8 ${
                      drawerMode !== "success" ? "cursor-pointer" : ""
                    }`}
                    color={index < tempRating ? "#facc15" : "#cbd5e1"}
                  />
                ))}
              </div>

              {drawerMode !== "success" && (
                <Button
                  onClick={handleSubmitRating}
                  size='lg'
                  disabled={!tempRating}>
                  {drawerMode === "rating" ? "Submit" : "Update Rating"}
                </Button>
              )}

              {drawerMode === "success" &&
                daysUntilEdit !== null &&
                daysUntilEdit > 0 && (
                  <p className='text-center text-sm text-gray-500'>
                    You can update your rating in {daysUntilEdit} day
                    {daysUntilEdit !== 1 ? "s" : ""}.
                  </p>
                )}

              {drawerMode === "success" && daysUntilEdit === 0 && (
                <Button onClick={() => setDrawerMode("edit")} size='lg'>
                  Edit Rating
                </Button>
              )}
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={openCommentDrawer} onOpenChange={setOpenCommentDrawer}>
        <DrawerContent>
          <div className='mx-auto w-full max-w-sm'>
            <DrawerHeader>
              <DrawerTitle>Comments</DrawerTitle>
              <DrawerDescription>
                This feature is currently under maintenance.
              </DrawerDescription>
            </DrawerHeader>
            <div className='p-4 flex flex-col items-center justify-center h-40'>
              <MessageCircle className='h-12 w-12 text-gray-400 mb-4' />
              <p className='text-center text-gray-600'>
                We&apos;re working on bringing comments to you soon. Check back
                later!
              </p>
            </div>
            <DrawerFooter>
              <Button onClick={() => setOpenCommentDrawer(false)}>Close</Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

interface ActionButtonProps {
  Icon: LucideIcon;
  count?: number;
  active?: boolean;
  onClick: () => void;
}

function ActionButton({
  Icon,
  count,
  active = false,
  onClick,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className='p-2 rounded-full flex flex-col items-center transition-all hover:bg-white/10'>
      <Icon
        className={`h-6 w-6 ${active ? "text-yellow-400" : "text-white"}`}
        fill={active ? "#facc15" : "none"}
      />
      {count !== undefined && (
        <span className='text-xs font-semibold text-white mt-1'>{count}</span>
      )}
    </button>
  );
}

export default CandidateViewMobile;
