"use client";

import { Candidate, CandidateRating } from "@/lib/definitions";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import CandidateViewMobile from "@/components/custom/candidate-view-mobile";
import { useQuery } from "react-query";
import axios from "axios";
import CandidateViewDeskTop from "@/components/custom/candidate-view-desktop";

function useCandidate(candidateId: string) {
  return useQuery<Candidate>(`candidate-${candidateId}`, async () => {
    const { data } = await axios.get<Candidate>(
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

function CandidateViewPage({ params }: { params: { id: string } }) {
  const {
    status,
    data: candidate,
    isError,
    isFetching,
    refetch,
  } = useCandidate(params.id);

  const { data: candidateRate } = useCandidateRate(params.id || "");

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {isDesktop ? (
        <div className='absolute  top-0 sm:pt-[44px] lg:pt-[58px] overflow-y-scroll flex-1 h-full w-full no-scrollbar'>
          {candidate && candidateRate && (
            <CandidateViewDeskTop
              candidate={candidate}
              candidateRate={candidateRate}
            />
          )}
        </div>
      ) : (
        <div className='absolute top-0 left-0 w-full min-h-[100vh]'>
          {isFetching && "Loading ..."}
          {isError && "Error"}
          {candidate && candidateRate && (
            <CandidateViewMobile candidate={candidate} />
          )}
        </div>
      )}
    </>
  );
}

export default CandidateViewPage;
