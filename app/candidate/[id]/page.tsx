"use client";

import { useSearchParams } from "next/navigation";
import { decryptJson } from "@/lib/functions/crypto";
import { Candidate } from "@/lib/definitions";
import { useEffect, useState } from "react";
import Image from "next/image";
import SingleVoteCarouselView from "@/components/custom/single-vote-carouselview";
import CandidateViewMobile from "@/components/custom/candidate-view-mobile";

function CandidateViewPage({ params }: { params: { id: string } }) {
  const [candidate, setCandidate] = useState<Candidate>();

  useEffect(() => {
    const candidatesStr = localStorage.getItem("candidates") ?? "";
    const candidates: Candidate[] = JSON.parse(candidatesStr);
    const foo = candidates.filter((item) => item.id == params.id)[0];
    setCandidate(foo);
  }, [params.id]);

  return (
    <div className='absolute top-0 left-0 w-full h-full '>
      {candidate && <CandidateViewMobile candidate={candidate} />}
    </div>
  );
}

export default CandidateViewPage;
