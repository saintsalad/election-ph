"use client";

import { Candidate } from "@/lib/definitions";
import { useEffect, useState } from "react";
import CandidateViewMobile from "@/components/custom/candidate-view-mobile";
import { useQuery } from "react-query";
import axios from "axios";

function useCandidateRating(candidateId: string) {
  return useQuery<Candidate>(`candidate-${candidateId}`, async () => {
    const { data } = await axios.get<Candidate>(
      `/api/candidate?candidateId=${candidateId}`
    );
    return data;
  });
}

function CandidateViewPage({ params }: { params: { id: string } }) {
  // const [candidate, setCandidate] = useState<Candidate>();

  const {
    status,
    data: candidate,
    isError,
    isFetching,
    refetch,
  } = useCandidateRating(params.id);

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
    <div className='absolute top-0 left-0 w-full min-h-[100vh]  md:hidden'>
      {isFetching && "Loading ..."}
      {isError && "Error"}
      {candidate && <CandidateViewMobile candidate={candidate} />}
    </div>
  );
}

export default CandidateViewPage;
