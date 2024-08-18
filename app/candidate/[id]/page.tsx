"use client";

import { Candidate } from "@/lib/definitions";
import { useEffect, useState } from "react";
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
    <div className='absolute top-0 left-0 w-full min-h-[100vh]'>
      {candidate && <CandidateViewMobile candidate={candidate} />}
    </div>
  );
}

export default CandidateViewPage;
