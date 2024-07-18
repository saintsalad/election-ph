import React from "react";
import { Candidate } from "@/lib/definitions";
import Image from "next/image";
import VoteConfirmation from "@/components/custom/vote-confirmation";
import Link from "next/link";

type SingleVoteListViewProps = {
  candidates: Candidate[];
};

const SingleVoteListView = ({ candidates }: SingleVoteListViewProps) => {
  return (
    <div className='flex flex-1 flex-row mb-20 ios-scroll-fix'>
      <div className='flex-col flex space-y-2.5 flex-1'>
        {candidates.map((item, i) => (
          // <div
          //   className='border h-32 min-w-max rounded-lg cursor-pointer flex overflow-hidden gap-x-3'
          //   key={i}>
          //   <div className='relative min-h-24 min-w-24 overflow-hidden flex self-center ml-3 '>
          //     <Image
          //       priority
          //       alt={item.name}
          //       src={item.image}
          //       fill
          //       style={{ objectFit: "fill" }}
          //       className='rounded-lg'
          //       sizes='50'
          //     />
          //   </div>

          //   <div className='w-full overflow-hidden py-5 pl-3 justify-end flex flex-1 flex-col'>
          //     <h2 className='font-semibold text-1xl'>{item.name}</h2>
          //     <div
          //       title={item.party}
          //       className='text-xs uppercase max-w-44 sm:max-w-full truncate'>
          //       {item.party}
          //     </div>
          //     <VoteConfirmation
          //       candidate={item}
          //       buttonSize='sm'
          //       buttonClass='w-32 mt-2'
          //       buttonText='Vote'
          //     />
          //   </div>
          // </div>

          <VoteConfirmation key={i} candidate={item}>
            <div
              key={i}
              className='bg-background rounded-lg overflow-hidden shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:bg-[#f0f8ff]'>
              <div className='flex items-center gap-4 w-full p-3.5 hover:bg-[#f0f8ff] active:bg-primary-foreground active:text-primary transition-colors duration-300 hover:cursor-pointer'>
                <Image
                  src={item.image}
                  alt='Candidate 1'
                  width={100}
                  height={100}
                  style={{ objectFit: "cover" }}
                  className='rounded-md h-[55px] w-[55px]'
                  priority
                />
                <div>
                  <h3 className='text-base font-semibold'>{item.name}</h3>
                  <p className='text-muted-foreground text-xs uppercase'>
                    {item.party}
                  </p>
                </div>
              </div>
            </div>
          </VoteConfirmation>
        ))}
      </div>
    </div>
  );
};

export default SingleVoteListView;
