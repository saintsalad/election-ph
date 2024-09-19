import React from "react";
import { Candidate, CandidateNext, ElectionNext } from "@/lib/definitions";
import Image from "next/image";
import VoteConfirmation from "@/components/custom/vote-confirmation";
import Link from "next/link";

type SingleVoteListViewProps = {
  electionId: string;
  election: ElectionNext;
  onVoteSubmitted: () => void;
};

const SingleVoteListView = ({
  electionId,
  election,
  onVoteSubmitted,
}: SingleVoteListViewProps) => {
  return (
    <>
      <div className='w-full md:hidden flex justify-start mt-5'>
        <div className='flex flex-1 flex-row mb-20 ios-scroll-fix'>
          <div className='flex-col flex space-y-2.5 flex-1'>
            {election.candidates.map((item: CandidateNext, i: number) => (
              <VoteConfirmation
                onVoteSubmitted={() => onVoteSubmitted()}
                key={i}
                election={election}
                candidate={item}
                electionId={electionId}>
                <div
                  key={i}
                  className='bg-background rounded-lg overflow-hidden shadow-sm border border-slate-200'>
                  <div className='flex items-center gap-4 w-full p-2.5 hover:bg-[#f0f8ff] active:bg-primary-foreground active:text-primary transition-all duration-1000 hover:cursor-pointer'>
                    <Image
                      src={item.displayPhoto}
                      alt={item.displayName}
                      width={100}
                      height={100}
                      style={{ objectFit: "cover" }}
                      className='rounded-lg h-[60px] w-[60px]'
                      priority
                    />
                    <div>
                      <h3 className='text-base font-bold text-slate-800'>
                        {item.balotNumber}. {item.displayName}
                      </h3>
                      <p className='text-slate-500 text-xs uppercase'>
                        {item.party}
                      </p>
                    </div>
                  </div>
                </div>
              </VoteConfirmation>
            ))}
          </div>
        </div>
      </div>

      <div className='hidden md:block w-full mt-5'>
        <div className='flex flex-1 flex-wrap gap-x-5 gap-y-10 justify-center'>
          {election.candidates.map((item: CandidateNext, i: number) => (
            <VoteConfirmation
              onVoteSubmitted={() => onVoteSubmitted()}
              key={i}
              election={election}
              candidate={item}
              electionId={electionId}>
              <div className='bg-slate-50 border border-slate-200 h-56 max-w-52 rounded-lg flex flex-1 justify-center flex-col items-center p-5 shadow-sm cursor-pointer transition duration-500 relative overflow-hidden group'>
                <Image
                  src={item.displayPhoto}
                  alt={item.displayName}
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
    </>
  );
};

export default SingleVoteListView;
