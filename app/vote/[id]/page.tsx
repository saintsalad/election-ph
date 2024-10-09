"use client";

import { useState } from "react";
import { ElectionNext } from "@/lib/definitions";
import SingleVoteListView from "@/components/custom/single-vote-listview";
import MultipleVoteListView from "@/components/custom/multiple-vote-listview";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { CircleCheck, Fingerprint, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { triggerConfettiFireworks } from "@/lib/functions/triggerConfettiFireworks";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import { useTheme } from "next-themes";

function useElection(electionId: string) {
  return useQuery<ElectionNext>(`election-${electionId}`, async () => {
    const { data } = await axios.get<ElectionNext>(
      `/api/election/${electionId}`
    );
    return data;
  });
}

function VotingPage({ params }: { params: { id: string } }) {
  const { theme } = useTheme();
  const electionId = params.id;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
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
    refetch();
    triggerConfettiFireworks();
  };

  // const ballotStyle = `
  //   relative bg-white border-[12px] border-black border-dashed
  //   rounded-lg shadow-md p-6 md:p-12
  //   before:content-[''] before:absolute before:top-[-24px] before:left-[-24px] before:w-12 before:h-12 before:bg-black
  //   after:content-[''] after:absolute after:bottom-[-24px] after:right-[-24px] before:w-12 before:h-12 before:bg-black
  //   [&>*:first-child]:before:content-[''] [&>*:first-child]:before:absolute [&>*:first-child]:before:top-[-24px] [&>*:first-child]:before:right-[-24px] [&>*:first-child]:before:w-12 [&>*:first-child]:before:h-12 [&>*:first-child]:before:bg-black
  //   [&>*:last-child]:after:content-[''] [&>*:last-child]:after:absolute [&>*:last-child]:after:bottom-[-24px] [&>*:last-child]:after:left-[-24px] [&>*:last-child]:after:w-12 [&>*:last-child]:after:h-12 [&>*:last-child]:after:bg-black
  // `;

  const contentStyle = "max-w-3xl mx-auto";

  // Loading state
  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto text-center pt-24'>
        <h2 className='text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2'>
          Loading Election Data...
        </h2>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          Please wait while we fetch the latest election information.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 px-5'>
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
      <div className={`max-w-4xl mx-auto text-center pt-24`}>
        <h2 className='text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4'>
          No Election Data Found
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          There are currently no active elections or candidates available.
        </p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={`max-w-4xl mx-auto text-center pt-24`}>
        <h2 className='text-2xl font-bold text-red-600 dark:text-red-400 mb-4'>
          Error Loading Election Data
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          We&apos;re experiencing technical difficulties. Please try again
          later.
        </p>
      </div>
    );
  }

  // Already voted state
  if (election.isVoted && !isSubmitted) {
    return (
      <div className='max-w-5xl mx-auto mt-32 px-4 sm:px-6 lg:px-8'>
        <div className={contentStyle}>
          <Fingerprint className='h-12 w-12 text-blue-500 mx-auto mb-4 sm:h-16 sm:w-16' />
          <h2 className='text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 text-center sm:text-2xl'>
            You&apos;ve Already Cast Your Vote
          </h2>
          <p className='text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md mx-auto text-sm sm:text-base'>
            Thank you for participating in this election. Your vote has been
            recorded and is contributing to the democratic process.
          </p>
          <div className='flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center'>
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
      <div className='max-w-5xl mx-auto pt-24 px-4 sm:px-6 lg:px-8'>
        <div
          className={`${contentStyle} bg-gradient-to-br from-green-50/90 to-emerald-50/90 dark:from-green-900/60 dark:to-emerald-900/60 backdrop-blur-sm border border-green-200/50 dark:border-green-700/30 rounded-lg p-8 shadow-lg`}>
          <CircleCheck
            className='h-16 w-16 mb-6 mx-auto sm:h-20 sm:w-20'
            strokeWidth={2.5}
            fill={theme === "dark" ? "#22c55e" : "#16a34a"}
            color={theme === "dark" ? "#dcfce7" : "#ffffff"}
          />
          <h2 className='text-2xl font-bold text-green-700 dark:text-green-300 text-center mb-4 sm:text-3xl'>
            Vote Submitted Successfully
          </h2>
          <p className='text-green-600 dark:text-green-200 text-center mb-8 max-w-md mx-auto text-base sm:text-lg'>
            Thank you for participating in this election. Your vote has been
            securely recorded and is contributing to the democratic process.
          </p>
          <div className='flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center'>
            <Button
              asChild
              className='bg-green-600 hover:bg-green-700 text-white'>
              <Link href='/results'>View Election Dashboard</Link>
            </Button>
            <Button
              asChild
              variant='outline'
              className='border-green-600 text-green-600 hover:bg-green-100 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/50'>
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
              <h2 className='text-lg font-bold text-blue-600 dark:text-blue-400'>
                Election PH
              </h2>
              <p className='text-xs text-gray-600 dark:text-gray-400'>
                Choose Wisely
              </p>
            </div>
          </div>
          <div className='text-center md:text-right'>
            <h1 className='text-2xl capitalize font-bold text-slate-800 dark:text-slate-200'>
              {election.electionType} Election
            </h1>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              {election.description}
            </p>
          </div>
        </div>

        {showInstructions && (
          <div className='bg-gradient-to-br from-blue-50/90 to-indigo-50/90 dark:from-blue-900/60 dark:to-indigo-900/60 backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/30 rounded-lg p-4 mb-6 relative shadow-md'>
            <Button
              variant='ghost'
              size='icon'
              className='absolute top-2 right-2 text-blue-600 dark:text-blue-300 hover:bg-blue-100/50 dark:hover:bg-blue-800/50 rounded-full transition-colors'
              onClick={() => setShowInstructions(false)}>
              <X className='h-4 w-4' />
              <span className='sr-only'>Close</span>
            </Button>
            <h3 className='font-semibold text-blue-800 dark:text-blue-100 mb-2 text-sm'>
              Voting Instructions
            </h3>
            <ol className='list-decimal list-inside text-xs text-blue-700 dark:text-blue-200 space-y-1'>
              <li>
                <strong>Select</strong> up to{" "}
                <strong>{election.numberOfVotes}</strong> candidate(s)
              </li>
              <li>
                <strong>Submit</strong> your choices
              </li>
              <li>
                <strong>Double check</strong> the selected candidates
              </li>
              <li>
                <strong>Swipe to confirm</strong> your vote
              </li>
            </ol>
          </div>
        )}

        <MultipleVoteListView
          onVoteSubmitted={handleIsVoted}
          election={election}
        />
      </div>
    </div>
  );
}

export default VotingPage;
