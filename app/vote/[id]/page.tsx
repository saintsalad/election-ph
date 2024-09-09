"use client";

import { useState } from "react";
import { CandidateNext, ElectionNext, Vote } from "@/lib/definitions";
import SingleVoteListView from "@/components/custom/single-vote-listview";
import { useAuthStore } from "@/lib/store";
import emitter from "@/lib/event";
import Image from "next/image";
import VoteConfirmation from "@/components/custom/vote-confirmation";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect, useRouter } from "next/navigation";
import { useQuery } from "react-query";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Fingerprint, Rss, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function useElection(electionId: string) {
  return useQuery<ElectionNext>(`election-${electionId}`, async () => {
    const { data } = await axios.get<ElectionNext>(
      `/api/election/${electionId}`
    );
    return data;
  });
}

type VoteProps = Vote & { id: string };

function VotingPage({ params }: { params: { id: string } }) {
  const electionId = params.id;
  // const [election, setElection] = useState<Election>();
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid || "";
  const [showAlertBanner, setShowAlertBanner] = useState(true);
  const router = useRouter();

  const {
    data: election,
    isError,
    isFetching,
    refetch,
  } = useElection(electionId);

  // const loadCandidates = useCallback(async () => {
  //   try {
  //     const election = await fetchDocumentById<Election>(
  //       "elections",
  //       electionId
  //     );
  //     if (election) {
  //       setElection(election);
  //       const candidateIds = election.candidates;
  //       // TODO: fix candidateIds has 1 item in a blank array
  //       if (candidateIds.length <= 1) {
  //         // no candidates found
  //         return false;
  //       }

  //       const _candidates = await fetchDocumentsByIds<Candidate>(
  //         "candidates",
  //         candidateIds
  //       );
  //       setCandidates(_candidates);
  //     } else {
  //       console.error("no election found");
  //       router.push("/not-found");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching document:", error);
  //     router.push("/not-found");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [electionId, router]);

  // const checkIfUserVoted = useCallback(
  //   async (forceRefresh = false) => {
  //     if (!userId) return;
  //     try {
  //       const hasVoted = await hasUserVoted(userId, electionId, forceRefresh);
  //       if (hasVoted) {
  //         router.push("/vote");
  //       }
  //       // redirect to receipt page
  //     } catch (error) {
  //       console.error("Error occurred while checking vote status:", error);
  //     }
  //   },
  //   [electionId, userId, router]
  // );

  // useEffect(() => {
  //   checkIfUserVoted();
  //   loadCandidates();
  // }, [loadCandidates, checkIfUserVoted]);

  // useEffect(() => {
  //   const handleVoteSubmit = (data: any) => {
  //     checkIfUserVoted(true); // Force refresh
  //     if (data) {
  //       const { id }: VoteProps = data;
  //       router.push(`/vote/verify?id=${id}`);
  //     } else {
  //       console.error("Vote details not receive", data);
  //     }
  //   };

  //   emitter.on("onVoteSubmit", handleVoteSubmit);
  //   return () => emitter.off("onVoteSubmit", handleVoteSubmit);
  // }, [checkIfUserVoted, router]);

  return (
    <>
      <div className='flex flex-1 flex-col pt-11 lg:pt-16 min-w-[340px]'>
        {!isFetching ? (
          <>
            <Alert
              hidden={!showAlertBanner}
              className='relative rounded-none lg:rounded mb-5 bg-gradient-to-r from-yellow-500 to-orange-700 text-white'>
              {/* <Fingerprint color='white' className='h-4 w-4' /> */}
              <div
                title='Close Alert'
                onClick={() => setShowAlertBanner(false)}
                role='button'
                className='absolute top-3.5 right-3'>
                <X className='h-5 w-5' />
              </div>
              <AlertTitle className='font-bold text-base mb-0'>
                Cast Your Vote
              </AlertTitle>
              <AlertDescription>
                Select up to
                <b className='mx-1'>{election?.numberOfVotes} candidate(s)</b>
                according to the voting rules and submit your vote. Your
                participation matters—choose wisely! 🤗
              </AlertDescription>
            </Alert>

            {election && election.candidates.length > 0 && userId ? (
              <>
                <div className='mt-4 flex flex-1 flex-col items-center'>
                  <div className='text-2xl font-bold capitalize  items-center text-slate-800'>
                    {election.electionType} Election
                  </div>
                  <div className='text-slate-800 text-center'>
                    {election.description}
                  </div>
                </div>
                <div className='flex justify-start mt-5'>
                  <div className='w-full md:hidden'>
                    <SingleVoteListView
                      electionId={electionId}
                      candidates={election.candidates}
                    />
                  </div>
                  <div className='hidden md:block w-full'>
                    <div className=' flex flex-1 flex-wrap gap-3 justify-start'>
                      {election.candidates &&
                        election.candidates.map((item, i) => (
                          <VoteConfirmation
                            key={i}
                            candidate={item}
                            electionId={electionId}>
                            <div className='bg-white h-56  max-w-52 rounded-lg flex flex-1 justify-center flex-col items-center p-5 shadow-lg cursor-pointer hover:bg-slate-100 transition duration-500 hover:-translate-y-0.5'>
                              <Image
                                src={item.displayPhoto}
                                alt='candidate image'
                                width={100}
                                height={100}
                                className='h-24 w-24 object-cover rounded-full'
                              />
                              <div className='text-center mt-2 text-base font-medium'>
                                {item.displayName}
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
              </>
            ) : (
              <div>No candidates found</div>
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
