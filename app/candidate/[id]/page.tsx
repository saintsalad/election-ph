"use client";

import { Candidate, CandidateRating } from "@/lib/definitions";
import { useEffect, useState } from "react";
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

  // useEffect(() => {
  //   const candidatesStr = localStorage.getItem("candidates") ?? "";
  //   if (candidatesStr === "") {
  //     return;
  //   }
  //   const candidates: Candidate[] = JSON.parse(candidatesStr);
  //   const foo = candidates.filter((item) => item.id == params.id)[0];
  //   setCandidate(foo);
  // }, [params.id]);

  return (
    <>
      <div className='absolute top-0 left-0 w-full min-h-[100vh] sm:hidden'>
        {isFetching && "Loading ..."}
        {isError && "Error"}
        {/* {candidate && <CandidateViewMobile candidate={candidate} />} */}
      </div>

      <div className='absolute  top-0 sm:pt-[44px] lg:pt-[58px] overflow-y-scroll flex-1 h-full w-full no-scrollbar hidden sm:flex'>
        {candidate && candidateRate && (
          <CandidateViewDeskTop
            candidate={candidate}
            candidateRate={candidateRate}
          />
        )}
      </div>
    </>
  );
}

export default CandidateViewPage;
