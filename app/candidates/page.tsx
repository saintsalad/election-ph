"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { CandidateNext } from "@/lib/definitions";
import Link from "next/link";
import defaultImage from "@/public/images/default.png";
import { useQuery } from "react-query";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { SlidersHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function useCandidates() {
  return useQuery<CandidateNext[]>("candidates", async () => {
    const { data } = await axios.get<{ candidates: CandidateNext[] }>(
      "/api/candidate"
    );
    return data.candidates;
  });
}

function Candidates() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data: candidates, isLoading } = useCandidates();

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  const filteredCandidates =
    searchQuery && candidates
      ? candidates.filter(
          (candidate) =>
            candidate.displayName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            candidate.party.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : candidates;

  return (
    <div className='container mx-auto px-4 pt-24'>
      <div className='flex justify-center mb-3'>
        <div className='relative w-full max-w-2xl'>
          <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground' />
          <Input
            onChange={handleSearch}
            type='search'
            placeholder='Search candidates'
            className='pl-12 pr-14 py-2 md:py-6 text-base md:text-lg rounded-full 
                       bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700 
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent
                       dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700'
          />
          <div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='rounded-full' variant='ghost' size='icon'>
                  <SlidersHorizontal className='h-4 w-4 md:h-5 md:w-5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem>Filter Option 1</DropdownMenuItem>
                <DropdownMenuItem>Filter Option 2</DropdownMenuItem>
                {/* Add more filter options as needed */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4'>
        {!isLoading ? (
          filteredCandidates && filteredCandidates.length > 0 ? (
            filteredCandidates.map((item) => (
              <CandidateCard key={item.id} candidate={item} />
            ))
          ) : (
            <div className='col-span-full text-center text-muted-foreground'>
              No candidates found.
            </div>
          )
        ) : (
          Array.from({ length: 8 }).map((_, index) => (
            <CandidateCardSkeleton key={index} />
          ))
        )}
      </div>
    </div>
  );
}

type CandidateCardProps = {
  candidate: CandidateNext;
};

function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Link href={`/candidates/${candidate.id}`} passHref>
      <Card className='relative overflow-hidden aspect-[3/4] sm:aspect-square group cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg'>
        <Image
          src={candidate.displayPhoto || defaultImage}
          alt={candidate.displayName || "Candidate"}
          fill
          sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
          className='object-cover transition-transform duration-300 group-hover:scale-105'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-90 transition-opacity duration-300' />

        {/* Ballot Number */}
        <div className='absolute top-1 left-1 sm:top-2 sm:left-2 bg-white/90 text-blue-600 font-bold rounded-full w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center shadow-md text-xs'>
          {candidate.ballotNumber}
        </div>

        <div className='absolute inset-x-0 bottom-0 p-2 sm:p-3 flex flex-col justify-end'>
          <div className='space-y-0.5'>
            <h2 className='text-sm sm:text-base font-semibold text-white leading-tight line-clamp-2'>
              {candidate.displayName}
            </h2>
            <div className='flex items-center justify-between'>
              <p className='text-[10px] sm:text-xs text-gray-300'>
                {candidate.party}
              </p>
              {candidate.election && candidate.election.electionType && (
                <span className='text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider'>
                  {candidate.election.electionType}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function CandidateCardSkeleton() {
  return (
    <Card className='relative overflow-hidden aspect-[3/4] sm:aspect-square'>
      <div className='absolute inset-0 bg-gray-200 dark:bg-gray-700' />
      <div className='absolute top-1 right-1 sm:top-2 sm:right-2 bg-gray-300 dark:bg-gray-600 rounded-full w-6 h-6 sm:w-8 sm:h-8' />
      <div className='absolute inset-x-0 bottom-0 p-2 sm:p-3'>
        <Skeleton className='h-4 sm:h-5 w-3/4 mb-1 sm:mb-2' />
        <Skeleton className='h-3 sm:h-4 w-1/2 mb-1' />
        <Skeleton className='h-3 sm:h-4 w-1/3' />
      </div>
    </Card>
  );
}

export default Candidates;
