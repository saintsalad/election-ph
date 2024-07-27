"use client";

import { useSearchParams } from "next/navigation";
import VoteReceipt, { VoteReceiptRef } from "@/components/custom/vote-receipt";
import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  Suspense,
} from "react";
import { fetchDocumentById } from "@/lib/firebase/functions";
import { Election, Vote, VoteReceiptProps } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronLeftCircle } from "lucide-react";
import Link from "next/link";

function VerifyPage() {
  const [voteReceipt, setVoteReceipt] = useState<
    VoteReceiptProps | undefined
  >();
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const voteId = searchParams.get("id") || "";
  const voteReceiptRef = useRef<VoteReceiptRef>(null);
  const router = useRouter();

  const loadCandidates = useCallback(async () => {
    setLoading(true);
    if (voteId === "") {
      router.push("/not-found");
    }
    try {
      const vote = await fetchDocumentById<Vote>("votes", voteId);
      if (!vote) {
        router.push("/not-found");
      }

      const electionId = vote?.electionId || "";
      console.log("electionId", electionId);
      const election = await fetchDocumentById<Election>(
        "elections",
        electionId
      );

      if (vote && election) {
        const voteReceipt: VoteReceiptProps = {
          referenceId: vote.referenceId,
          dateCreated: new Date(vote.dateCreated.toString()).toLocaleString(),
          electionTitle: election?.description,
          userId: vote.userId,
          voteId: voteId,
        };
        setVoteReceipt(voteReceipt);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [router, voteId]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const handleDownloadImage = () => {
    if (voteReceiptRef.current) {
      voteReceiptRef.current.handleDownloadImage();
    }
  };

  return (
    <div className='flex flex-1 flex-col bg-[#F2F2F7]'>
      <div className='px-10 md:px-5 mt-10'>
        <Link
          href={"/vote"}
          className='hover:text-slate-500 text-slate-600 rounded-full flex flex-1 border h-10 w-10 justify-center items-center bg-white'>
          <ChevronLeft className='h-6 w-6' />
        </Link>
      </div>
      <div className='flex flex-1 flex-col md:flex-row justify-between py-8 md:py-10 md:px-5 text-center md:text-start'>
        <div className='mb-10 md:mb-0'>
          <div className='text-4xl font-extrabold text-slate-700'>
            Vote Submitted 🥳
          </div>
          <div className='text-base font-semibold text-slate-700 md:mb-10'>
            Thank you for participating!
          </div>
          <div className='text-sm text-slate-500 '>
            Download your vote receipt
            <span
              onClick={() => handleDownloadImage()}
              className='text-blue-500 ml-1 cursor-pointer'>
              here
            </span>
            .
          </div>
        </div>
        <VoteReceipt
          ref={voteReceiptRef}
          loading={loading}
          voiceReceipt={voteReceipt}
        />
      </div>
    </div>
  );
}

export default function VerifyPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPage />
    </Suspense>
  );
}
