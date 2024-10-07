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
import Image from "next/image";
import logo from "@/public/images/logo.png";

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

  const ballotStyle = `
    relative bg-white border-[12px] border-black border-dashed 
    rounded-lg shadow-md p-6 md:p-12
    before:content-[''] before:absolute before:top-[-24px] before:left-[-24px] before:w-12 before:h-12 before:bg-black
    after:content-[''] after:absolute after:bottom-[-24px] after:right-[-24px] before:w-12 before:h-12 before:bg-black
    [&>*:first-child]:before:content-[''] [&>*:first-child]:before:absolute [&>*:first-child]:before:top-[-24px] [&>*:first-child]:before:right-[-24px] [&>*:first-child]:before:w-12 [&>*:first-child]:before:h-12 [&>*:first-child]:before:bg-black
    [&>*:last-child]:after:content-[''] [&>*:last-child]:after:absolute [&>*:last-child]:after:bottom-[-24px] [&>*:last-child]:after:left-[-24px] [&>*:last-child]:after:w-12 [&>*:last-child]:after:h-12 [&>*:last-child]:after:bg-black
  `;

  const contentStyle = "max-w-3xl mx-auto";

  // Loading state
  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto pt-24 text-center'>
        <h2 className='text-2xl font-bold text-slate-800 mb-2'>
          Loading Election Data...
        </h2>
        <p className='text-gray-600 mb-6'>
          Please wait while we fetch the latest election information.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className='h-20 w-full rounded-lg' />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!election || election.candidates.length === 0) {
    return (
      <div className={`max-w-4xl mx-auto mt-8 text-center py-12`}>
        <h2 className='text-2xl font-bold text-slate-800 mb-4'>
          No Election Data Found
        </h2>
        <p className='text-gray-600'>
          There are currently no active elections or candidates available.
        </p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={`max-w-4xl mx-auto mt-8 text-center py-12`}>
        <h2 className='text-2xl font-bold text-red-600 mb-4'>
          Error Loading Election Data
        </h2>
        <p className='text-gray-600'>
          We&apos;re experiencing technical difficulties. Please try again
          later.
        </p>
      </div>
    );
  }

  // Already voted state
  if (election.isVoted && !isSubmitted) {
    return (
      <div className={`max-w-5xl mx-auto mt-32`}>
        <div className={contentStyle}>
          <Fingerprint className='h-16 w-16 text-blue-500 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-slate-800 mb-4 text-center'>
            You&apos;ve Already Cast Your Vote
          </h2>
          <p className='text-gray-600 mb-6 text-center max-w-lg mx-auto'>
            Thank you for participating in this election. Your vote has been
            recorded and is contributing to the democratic process.
          </p>
          <div className='flex justify-center space-x-4'>
            <Button asChild>
              <Link href='/results'>View Live Results</Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href='/'>Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Successfully voted state
  if (isSubmitted) {
    return (
      <div className={`max-w-5xl mx-auto pt-36`}>
        <div className={contentStyle}>
          <CircleCheck
            className='h-20 w-20 mb-4 mx-auto'
            strokeWidth={2.5}
            fill='#16a34a'
            color='#FFF'
          />
          <h2 className='text-2xl font-bold text-green-600 text-center mb-2'>
            Submitted Successfully
          </h2>
          <p className='text-gray-600 text-center mb-6 max-w-lg mx-auto'>
            Your participation in this online survey is greatly appreciated.
            Your vote has been safely stored. Thank you for participating.
          </p>
          <div className='flex justify-center space-x-4'>
            <Button asChild>
              <Link href='/results'>View Election Dashboard</Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href='/'>Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default voting state
  return (
    <div className='max-w-5xl mx-auto pt-24 px-4 sm:px-6 lg:px-8'>
      <div className={``}>
        <div className={contentStyle}>
          <div className='flex flex-col md:flex-row items-center justify-between mb-8'>
            <div className='flex items-center gap-x-3 mb-4 md:mb-0'>
              <Image
                src={logo}
                alt='Election PH Logo'
                width={40}
                height={40}
                className='object-contain'
              />
              <div className='hidden md:block'>
                <h2 className='text-lg font-bold text-blue-600'>Election PH</h2>
                <p className='text-xs text-gray-600'>Choose Wisely</p>
              </div>
            </div>
            <div className='text-center md:text-right'>
              <h1 className='text-2xl capitalize font-bold text-slate-800'>
                {election.electionType} Election
              </h1>
              <p className='text-sm text-slate-600'>{election.description}</p>
            </div>
          </div>

          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8'>
            <h3 className='font-semibold text-blue-800 mb-2'>
              Voting Instructions:
            </h3>
            <ol className='list-decimal list-inside text-xs text-blue-700 space-y-1'>
              <li>Review the candidates carefully</li>
              <li>Select up to {election.numberOfVotes} candidate(s)</li>
              <li>Double-check your choices</li>
              <li>
                Click <b>Confirm</b> to submit your vote
              </li>
            </ol>
          </div>

          <SingleVoteListView
            onVoteSubmitted={handleIsVoted}
            electionId={electionId}
            election={election}
          />
        </div>
      </div>
    </div>
  );
}

export default VotingPage;
