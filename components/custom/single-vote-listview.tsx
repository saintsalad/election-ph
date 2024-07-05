import React from "react";
import { Candidate } from "@/lib/definitions";
import Image from "next/image";
import VoteConfirmation from "@/components/custom/vote-confirmation";

type SingleVoteListViewProps = {
  candidates: Candidate[];
};

const SingleVoteListView = ({ candidates }: SingleVoteListViewProps) => {
  return (
    <div className='flex flex-1 flex-row mb-20 ios-scroll-fix'>
      <div className='flex-col flex space-y-4 flex-1'>
        {candidates.map((item, i) => (
          <div
            className='border h-32 min-w-max rounded-lg cursor-pointer flex overflow-hidden gap-x-3'
            key={i}>
            <div className='relative min-h-24 min-w-24 overflow-hidden flex self-center ml-3 '>
              <Image
                alt={item.name}
                src={item.image}
                layout='fill'
                objectFit='cover'
                className='rounded-lg'
              />
            </div>

            <div className='w-full overflow-hidden py-5 pl-3 justify-end flex flex-1 flex-col'>
              <h2 className='font-semibold text-1xl'>{item.name}</h2>
              <div className='text-xs uppercase max-w-44 sm:max-w-full truncate'>
                {item.party}
              </div>
              <VoteConfirmation
                buttonSize='sm'
                buttonClass='w-32 mt-2'
                buttonText='Vote'
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleVoteListView;
