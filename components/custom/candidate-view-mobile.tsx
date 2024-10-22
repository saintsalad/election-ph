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
  Loader2,
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
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes"; // If you're using a theme system
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import CommentSectionMobile from "./comment-section-mobile";
import useReactQueryNext from "@/hooks/useReactQueryNext";
import { Comment } from "@/lib/definitions"; // Make sure to import the Comment type

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
  const [daysUntilEdit, setDaysUntilEdit] = useState<number | null>(null);
  const [openCommentDrawer, setOpenCommentDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { theme } = useTheme(); // If using a theme system
  const queryClient = useQueryClient();

  // Determine background and text colors based on theme
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const gradientOverlay =
    theme === "dark"
      ? "bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent"
      : "bg-gradient-to-t from-black/80 to-transparent";

  // Determine icon colors based on theme and active index
  const getIconColor = (index: number) => {
    if (index === 0) return "text-white";
    return theme === "dark" ? "text-gray-200" : "text-gray-800";
  };

  useEffect(() => {
    setIsLoading(true); // Set loading to true initially
    if (candidate) {
      setIsLoading(false);
    }
  }, [candidate]);

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

  const saveRatingMutation = useMutation({
    mutationFn: async (ratingData: { rate: number; candidateId: string }) => {
      const { data } = await axios.post("/api/candidate/rate", ratingData, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["candidateRate", candidate?.id]);
      queryClient.invalidateQueries(["userRate", candidate?.id]);
      setDrawerMode("success");
      setDaysUntilEdit(3);
      userRateRefetch(); // Add this line to refetch user rate
      candidateRateRefetch(); // Optionally, also refetch candidate rate
    },
    onError: (error) => {
      console.error("Error submitting rating:", error);
      alert("An unexpected error occurred. Please try again.");
    },
  });

  const handleSubmitRating = () => {
    if (!candidate) {
      alert("Missing candidate. Please try again.");
      return;
    }

    saveRatingMutation.mutate({
      rate: tempRating,
      candidateId: candidate.id,
    });
  };

  const {
    data: commentsData,
    isLoading: isLoadingComments,
    error,
    refetchWithoutCache: refetchComments,
  } = useReactQueryNext<Comment[]>(
    `comments=${candidate?.id}`,
    `/api/candidate/comments?candidateId=${candidate?.id}`,
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

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
            <p
              className={cn(
                "text-base mb-4",
                theme === "dark" ? "text-gray-300" : "text-gray-800",
                className
              )}
              {...props}
            />
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
        className={`markdown ${textColor}`}>
        {text}
      </Markdown>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`flex flex-col w-full h-screen ${bgColor}`}>
        <div className='relative h-2/3 w-full'>
          <Skeleton className='h-full w-full' />
          <div className='absolute bottom-16 left-0 right-0 p-6'>
            <Skeleton className='h-8 w-3/4 mb-2' />
            <Skeleton className='h-6 w-1/4 mb-3' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full mt-2' />
          </div>
        </div>
        <div className='flex-1 bg-white p-4'>
          <Skeleton className='h-6 w-3/4 mb-4' />
          <Skeleton className='h-4 w-full mb-2' />
          <Skeleton className='h-4 w-full mb-2' />
          <Skeleton className='h-4 w-5/6 mb-2' />
        </div>
        <div className='fixed right-4 bottom-24'>
          <div className='bg-black/30 rounded-full p-2 flex flex-col items-center gap-2'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <Skeleton className='h-10 w-10 rounded-full' />
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <div className={`flex flex-1 w-full h-full ${bgColor}`}>
      <Carousel setApi={setCarouselApi} className='w-full h-full -z-0 fixed'>
        <CarouselContent>
          <CarouselItem>
            <div className='h-screen relative'>
              <div className='relative h-full w-full'>
                <Image
                  src={candidate.displayPhoto}
                  alt={candidate.displayName}
                  fill
                  sizes='100vw'
                  style={{ objectFit: "cover" }}
                  priority
                />
                <div className={`absolute inset-0 ${gradientOverlay}`} />
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
            <CarouselItem key={section} className={bgColor}>
              <div className={`h-screen overflow-y-auto pt-24 ${textColor}`}>
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

      <div className='fixed top-[64px] left-0 right-0 flex justify-between items-center p-2'>
        <Link
          href='/candidates'
          className={`p-2 rounded-full ${
            activeIndex === 0 ? "bg-black/20" : "bg-white/20"
          } backdrop-blur-md transition-all duration-300`}>
          <ChevronLeft className={`h-6 w-6 ${getIconColor(activeIndex)}`} />
        </Link>
        <button
          onClick={() => {
            /* TODO: Implement more options functionality */
          }}
          className={`p-2 rounded-full ${
            activeIndex === 0 ? "bg-black/20" : "bg-white/20"
          } backdrop-blur-md transition-all duration-300`}>
          <MoreVertical className={`h-6 w-6 ${getIconColor(activeIndex)}`} />
        </button>
      </div>

      <div className='fixed right-4 bottom-24'>
        <div className='bg-black/30 rounded-full p-2 flex flex-col items-center gap-2 shadow-lg'>
          <ActionButton
            Icon={Star}
            count={`${candidateRate?.averageRating ?? 0} (${
              candidateRate?.numberOfRatings ?? 0
            })`}
            active={!!userRate?.rate}
            onClick={() => setOpenRateDrawer(true)}
          />
          <ActionButton
            Icon={MessageCircle}
            count={commentsData?.length.toString() ?? "0"}
            onClick={() => setOpenCommentDrawer(true)}
          />
        </div>
      </div>

      <Drawer open={openRateDrawer} onOpenChange={setOpenRateDrawer}>
        <DrawerContent className={bgColor}>
          <div className='mx-auto w-full max-w-sm'>
            <DrawerHeader className='pb-0'>
              <DrawerTitle className={textColor}>Rate Candidate</DrawerTitle>
              <DrawerDescription
                className={
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }>
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
                  disabled={!tempRating || saveRatingMutation.isLoading}>
                  {saveRatingMutation.isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Submitting...
                    </>
                  ) : drawerMode === "rating" ? (
                    "Submit"
                  ) : (
                    "Update Rating"
                  )}
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
        <DrawerContent
          className={`${bgColor} h-[80vh] max-h-[80vh] min-h-[300px] overflow-hidden flex flex-col`}>
          <DrawerHeader className='sr-only'>
            <DrawerTitle>Comments</DrawerTitle>
            <DrawerDescription>View and add comments</DrawerDescription>
          </DrawerHeader>
          <div className='flex-1 overflow-hidden'>
            <CommentSectionMobile
              candidateId={candidate.id}
              commentsData={commentsData ?? []}
              isLoading={isLoadingComments}
              error={error}
              refetchComments={refetchComments}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

interface ActionButtonProps {
  Icon: LucideIcon;
  count: string;
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
