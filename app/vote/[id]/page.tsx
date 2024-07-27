"use client";

import { useCallback, useEffect, useState } from "react";
import { Candidate, Election, Vote } from "@/lib/definitions";
import {
  fetchDocumentById,
  fetchDocumentsByIds,
  hasUserVoted,
} from "@/lib/firebase/functions";
import SingleVoteListView from "@/components/custom/single-vote-listview";
import { useAuthStore } from "@/lib/store";
import emitter from "@/lib/event";
import Image from "next/image";
import VoteConfirmation from "@/components/custom/vote-confirmation";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect, useRouter } from "next/navigation";

type VoteProps = Vote & { id: string };

function VotingPage({ params }: { params: { id: string } }) {
  const electionId = params.id;
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState<Election>();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid || "";
  const router = useRouter();

  const loadCandidates = useCallback(async () => {
    try {
      const election = await fetchDocumentById<Election>(
        "elections",
        electionId
      );
      if (election) {
        setElection(election);
        const candidateIds = election.candidates;
        // TODO: fix candidateIds has 1 item in a blank array
        if (candidateIds.length <= 1) {
          // no candidates found
          return false;
        }

        const _candidates = await fetchDocumentsByIds<Candidate>(
          "candidates",
          candidateIds
        );
        setCandidates(_candidates);
      } else {
        console.error("no election found");
        router.push("/not-found");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      router.push("/not-found");
    } finally {
      setLoading(false);
    }
  }, [electionId, router]);

  const checkIfUserVoted = useCallback(
    async (forceRefresh = false) => {
      if (!userId) return;
      try {
        const hasVoted = await hasUserVoted(userId, electionId, forceRefresh);
        if (hasVoted) {
        }
        // redirect to receipt page
      } catch (error) {
        console.error("Error occurred while checking vote status:", error);
      }
    },
    [electionId, userId]
  );

  useEffect(() => {
    checkIfUserVoted();
    loadCandidates();
  }, [loadCandidates, checkIfUserVoted]);

  useEffect(() => {
    const handleVoteSubmit = (data: any) => {
      checkIfUserVoted(true); // Force refresh
      if (data) {
        const { id }: VoteProps = data;
        router.push(`/vote/verify?id=${id}`);
      } else {
        console.error("Vote details not receive", data);
      }
    };

    emitter.on("onVoteSubmit", handleVoteSubmit);
    return () => emitter.off("onVoteSubmit", handleVoteSubmit);
  }, [checkIfUserVoted, router]);

  return (
    <>
      <div className='flex flex-1 flex-col p-3 min-w-[340px]'>
        {!loading ? (
          <>
            {candidates.length > 0 && userId ? (
              <div className='flex justify-start mt-5'>
                <div className='w-full md:hidden'>
                  <SingleVoteListView
                    electionId={electionId}
                    candidates={candidates}
                  />
                </div>
                <div className='hidden md:block w-full'>
                  <div className=' flex flex-1 flex-wrap gap-3 justify-center'>
                    {candidates &&
                      candidates.map((item, i) => (
                        <VoteConfirmation
                          key={i}
                          candidate={item}
                          electionId={electionId}>
                          <div className='bg-white h-56  max-w-52 rounded-lg flex flex-1 justify-center flex-col items-center p-5 shadow-lg cursor-pointer hover:bg-slate-100 transition duration-500 hover:-translate-y-0.5'>
                            <Image
                              src={item.image}
                              alt='candidate image'
                              width={100}
                              height={100}
                              className='h-24 w-24 object-cover rounded-full'
                            />
                            <div className='text-center mt-2 text-base font-medium'>
                              {item.name}
                            </div>
                            <div className='uppercase text-muted-foreground text-xs'>
                              {item.party}
                            </div>
                          </div>
                        </VoteConfirmation>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex flex-col gap-y-3 mt-5 md:flex-row md:gap-x-4 md:justify-center'>
                <Skeleton className='w-full h-20 rounded-lg md:h-56  md:max-w-52' />
                <Skeleton className='w-full h-20 rounded-lg md:h-56  md:max-w-52' />
                <Skeleton className='w-full h-20 rounded-lg md:h-56  md:max-w-52' />
                <Skeleton className='w-full h-20 rounded-lg md:h-56  md:max-w-52' />
              </div>
            )}
          </>
        ) : (
          <div className='flex flex-col gap-y-3 mt-5 md:flex-row md:gap-x-4 md:justify-center'>
            <Skeleton className='w-full h-20 rounded-lg md:h-56  md:max-w-52' />
            <Skeleton className='w-full h-20 rounded-lg md:h-56  md:max-w-52' />
            <Skeleton className='w-full h-20 rounded-lg md:h-56  md:max-w-52' />
            <Skeleton className='w-full h-20 rounded-lg md:h-56  md:max-w-52' />
          </div>
        )}
      </div>
    </>
  );
}

export default VotingPage;
