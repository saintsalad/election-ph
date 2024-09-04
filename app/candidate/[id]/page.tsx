"use client";

import {
  Candidate,
  CandidateNext,
  CandidateRating,
  UserRating,
} from "@/lib/definitions";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import CandidateViewMobile from "@/components/custom/candidate-view-mobile";
import { useQuery } from "react-query";
import axios from "axios";
import CandidateViewDeskTop from "@/components/custom/candidate-view-desktop";
import { ScrollArea } from "@/components/ui/scroll-area";

function useCandidate(candidateId: string) {
  return useQuery<CandidateNext>(`candidate-${candidateId}`, async () => {
    const { data } = await axios.get<CandidateNext>(
      `/api/candidate?candidateId=${candidateId}`
    );
    return data;
  });
}

function useCandidateRate(candidateId: string) {
  return useQuery<CandidateRating>(`candidateRate-${candidateId}`, async () => {
    const { data } = await axios.get<CandidateRating>(
      `/api/candidate/rate?candidateId=${candidateId}`
    );
    return data;
  });
}

function useUserRating(candidateId: string) {
  return useQuery<UserRating>(`user-rating-${candidateId}`, async () => {
    const { data } = await axios.get<UserRating>(
      `/api/user/rate?candidateId=${candidateId}`
    );
    return data;
  });
}

function CandidateViewPage({ params }: { params: { id: string } }) {
  const {
    status,
    data: candidate,
    isError,
    isFetching,
    refetch,
  } = useCandidate(params.id);

  const { data: candidateRate, refetch: candidateRateRefetch } =
    useCandidateRate(params.id || "");

  const { data: userRate, refetch: userRateRefetch } = useUserRating(params.id);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {isDesktop && candidate && candidateRate && (
        <ScrollArea className='pt-11 lg:pt-16 flex-1 min-h-[100vh] w-full !overflow-y-scroll no-scrollbar'>
          <CandidateViewDeskTop
            candidate={candidate}
            candidateRate={candidateRate}
          />
        </ScrollArea>
      )}

      {!isDesktop && !isFetching && (
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
