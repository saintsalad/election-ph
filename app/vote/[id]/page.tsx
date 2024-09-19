"use client";

import { useState } from "react";
import { ElectionNext, Vote } from "@/lib/definitions";
import SingleVoteListView from "@/components/custom/single-vote-listview";
import { useAuthStore } from "@/lib/store";
import Image from "next/image";
import VoteConfirmation from "@/components/custom/vote-confirmation";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "react-query";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

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
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid || "";
  const [showAlertBanner, setShowAlertBanner] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    data: election,
    isError,
    isFetching,
    refetch,
  } = useElection(electionId);

  return (
    <div className='flex flex-1 flex-col pt-11 lg:pt-16 min-w-[340px]'>
      {!isFetching ? (
        <>
          <Alert
            hidden={!showAlertBanner}
            className='relative rounded-none lg:rounded mb-5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white'>
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

          {/* success dialog */}
          <Dialog open={isSubmitted} onOpenChange={() => setIsSubmitted(false)}>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <div className='flex flex-1 justify-center pt-8 pb-3'>
                  <CircleCheck
                    className='h-20 w-20 mr-2 '
                    strokeWidth={2.5}
                    fill='#16a34a'
                    color='#FFF'
                  />
                </div>

                <DialogTitle className='text-2xl font-bold text-green-600 flex justify-center'>
                  {/* <CircleCheckBig className='w-6 h-6 mr-2' /> */}
                  Submitted Successfully
                </DialogTitle>
                <DialogDescription className='text-gray-600 text-center'>
                  Your participation in this online survey is greatly
                  appreciated. Your vote has been safely stored. Thank you for
                  participating.
                </DialogDescription>
              </DialogHeader>
              <div className='mt-6 space-y-2'>
                <Button asChild className='w-full'>
                  <Link href='/dashboard'>View Election Dashboard</Link>
                </Button>
                <Button asChild variant='outline' className='w-full'>
                  <Link href='/'>Return to Home</Link>
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {election && election.candidates.length > 0 && userId ? (
            <div className='px-5'>
              <div className='mt-10 flex flex-1 flex-col items-center '>
                <div className='text-2xl sm:text-4xl font-bold capitalize items-center text-slate-800'>
                  {election.electionType} Election
                </div>
                <div className='text-slate-800 text-center text-sm sm:text-base'>
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
                  <div className=' flex flex-1 flex-wrap gap-x-5 gap-y-10 justify-center'>
                    {election.candidates &&
                      election.candidates.map((item, i) => (
                        <VoteConfirmation
                          onVoteSubmitted={() => {
                            setIsSubmitted(true);
                          }}
                          key={i}
                          election={election}
                          candidate={item}
                          electionId={electionId}>
                          <div className='bg-slate-50 border border-slate-200 h-56  max-w-52 rounded-lg flex flex-1 justify-center flex-col items-center p-5 shadow-sm cursor-pointer transition duration-500 relative overflow-hidden group'>
                            <Image
                              src={item.displayPhoto}
                              alt='candidate image'
                              fill
                              className='h-50 w-50 aspect-square object-cover group-hover:scale-110 transition-all duration-500'
                            />
                            <div className='flex w-full pb-3 pt-10 text-center flex-col absolute bottom-0 bg-gradient-to-t from-black/80 to-transparent '>
                              <div className='text-center mt-2 text-base font-bold text-white'>
                                {item.balotNumber}. {item.displayName}
                              </div>
                              <div className='uppercase text-white text-xs'>
                                {item.party}
                              </div>
                            </div>
                          </div>
                        </VoteConfirmation>
                      ))}
                  </div>
                </div>
              </div>
            </div>
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
  );
}

export default VotingPage;
