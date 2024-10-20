"use client";

import { CandidateNext, CandidateRating, UserRating } from "@/lib/definitions";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import CandidateViewMobile from "@/components/custom/candidate-view-mobile";
import { useQuery } from "react-query";
import axios from "axios";
import CandidateViewDeskTop from "@/components/custom/candidate-view-desktop";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useReactQueryNext from "@/hooks/useReactQueryNext";

function useCandidate(candidateId: string) {
  return useReactQueryNext<CandidateNext>(
    [`candidate-${candidateId}`],
    `/api/candidate?candidateId=${candidateId}`,
    {
      retry: false,
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          throw new Error("Candidate not found");
        }
      },
      refetchOnWindowFocus: false,
    }
  );
}

function useCandidateRate(candidateId: string) {
  return useReactQueryNext<CandidateRating>(
    [`candidate-rate-${candidateId}`],
    `/api/candidate/rate?candidateId=${candidateId}`,
    {
      refetchOnWindowFocus: false,
    }
  );
}

function useUserRating(candidateId: string) {
  return useReactQueryNext<UserRating>(
    [`user-rating-${candidateId}`],
    `/api/user/rate?candidateId=${candidateId}`,
    {
      refetchOnWindowFocus: false,
    }
  );
}

function CandidateViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const {
    status,
    data: candidate,
    isError,
    error,
    isLoading,

    isFetching,
  } = useCandidate(params.id);

  const { data: candidateRate, refetchWithoutCache: candidateRateRefetch } =
    useCandidateRate(params.id || "");

  const { data: userRate, refetchWithoutCache: userRateRefetch } =
    useUserRating(params.id);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (
      isError &&
      error instanceof Error &&
      error.message === "Request failed with status code 404"
    ) {
      router.replace("/not-found");
    }
  }, [isError, error, router]);

  return (
    <>
      {isDesktop && (
        <ScrollArea className='pt-20 flex-1 min-h-[100vh] w-full !overflow-y-scroll no-scrollbar'>
          <CandidateViewDeskTop
            isLoading={isLoading}
            candidate={candidate}
            candidateRate={candidateRate}
          />
        </ScrollArea>
      )}

      {!isDesktop && (
        <div className='absolute top-0 left-0 w-full min-h-[100vh]'>
          <CandidateViewMobile
            userRateRefetch={() => userRateRefetch()}
            userRate={userRate}
            candidateRateRefetch={() => candidateRateRefetch()}
            candidate={candidate}
            candidateRate={candidateRate}
          />
        </div>
      )}
    </>
  );
}

export default CandidateViewPage;
