"use client";

import { useState } from "react";
import { ElectionNext } from "@/lib/definitions";
import SingleVoteListView from "@/components/custom/single-vote-listview";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleCheck, Fingerprint, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { triggerConfettiFireworks } from "@/lib/functions/triggerConfettiFireworks";

function useElection(electionId: string) {
  return useQuery<ElectionNext>(`election-${electionId}`, async () => {
    const { data } = await axios.get<ElectionNext>(
      `/api/election/${electionId}`
    );
    return data;
  });
}

function VotingPage({ params }: { params: { id: string } }) {
  const electionId = params.id;
  const [showAlertBanner, setShowAlertBanner] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: election,
    isError,
    isLoading,
    refetch,
  } = useElection(electionId);

  const invalidateElectionQuery = () => {
    queryClient.invalidateQueries<ElectionNext>([`election-${electionId}`]);
  };

  const handleIsVoted = () => {
    setIsSubmitted(true);
    invalidateElectionQuery();
    refetch({ stale: true });
    triggerConfettiFireworks();
  };

  // 1. Loading state
  if (isLoading) {
    return (
      <div className='flex flex-col gap-y-3 px-5 mt-16 md:flex-row md:gap-x-4 md:justify-center'>
        {[...Array(4)].map((_, index) => (
          <Skeleton
            key={index}
            className='w-full h-20 rounded-lg md:h-56 md:max-w-52'
          />
        ))}
      </div>
    );
  }

  // 2. Empty state
  if (!election || election.candidates.length === 0) {
    return <div className='text-center pt-16'>No election data found</div>;
  }

  // 3. Error state
  if (isError) {
    return <div className='text-center pt-16'>Error loading election data</div>;
  }

  // 4. Already voted state
  if (election.isVoted && !isSubmitted) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4'>
        <div className='bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center'>
          <Fingerprint className='h-16 w-16 text-blue-500 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-slate-800 mb-4'>
            You&#39;ve Already Cast Your Vote
          </h2>
          <p className='text-gray-600 mb-6'>
            Thank you for participating in this election. Your vote has been
            recorded and is contributing to the democratic process.
          </p>
          <div className='space-y-3'>
            <Button asChild className='w-full'>
              <Link href='/dashboard'>View Live Results</Link>
            </Button>
            <Button asChild variant='outline' className='w-full'>
              <Link href='/'>Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Successfully voted state
  if (isSubmitted) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4'>
        <div className='bg-white rounded-lg shadow-md p-8 max-w-md w-full'>
          <div className='flex flex-col items-center'>
            <CircleCheck
              className='h-20 w-20 mb-4'
              strokeWidth={2.5}
              fill='#16a34a'
              color='#FFF'
            />
            <h2 className='text-2xl font-bold text-green-600 text-center mb-2'>
              Submitted Successfully
            </h2>
            <p className='text-gray-600 text-center mb-6'>
              Your participation in this online survey is greatly appreciated.
              Your vote has been safely stored. Thank you for participating.
            </p>
          </div>
          <div className='space-y-2'>
            <Button asChild className='w-full'>
              <Link href='/dashboard'>View Election Dashboard</Link>
            </Button>
            <Button asChild variant='outline' className='w-full'>
              <Link href='/'>Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 6. Default state
  return (
    <div className='flex flex-1 flex-col pt-11 lg:pt-16 min-w-[340px]'>
      {showAlertBanner && (
        <Alert className='relative rounded-none lg:rounded mt-3 mb-5 bg-gradient-to-r from-yellow-500 to-orange-600 text-white'>
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
            <b className='mx-1'>{election.numberOfVotes} candidate(s)</b>
            according to the voting rules and submit your vote. Your
            participation matters—choose wisely! 🤗
          </AlertDescription>
        </Alert>
      )}

      <div className='px-5'>
        <div className='mt-10 flex flex-1 flex-col items-center '>
          <div className='text-2xl sm:text-4xl font-bold capitalize items-center text-slate-800'>
            {election.electionType} Election
          </div>
          <div className='text-slate-800 text-center text-sm sm:text-base'>
            {election.description}
          </div>
        </div>
        <SingleVoteListView
          onVoteSubmitted={handleIsVoted}
          electionId={electionId}
          election={election}
        />
      </div>
    </div>
  );
}

export default VotingPage;
