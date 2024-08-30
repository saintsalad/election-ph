"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Candidate, CandidateNext } from "@/lib/definitions";
import { fetchFromFirebase } from "@/lib/firebase/functions";
import Link from "next/link";
import defaultImage from "@/public/images/default.png";

function Candidate() {
  const [candidates, setCandidates] = useState<CandidateNext[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const loadCandidates = useCallback(async (forceRefresh: boolean = false) => {
    try {
      setLoading(true);
      const result = await fetchFromFirebase<CandidateNext>(
        "candidates",
        {
          cacheKey: "candidates",
        },
        forceRefresh
      );
      setCandidates(result);
    } catch (e) {
      console.error("Error loading elections: ", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  const filteredCandidates = searchQuery
    ? candidates.filter(
        (candidate) =>
          candidate.displayName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          candidate.party.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : candidates;

  return (
    <div className='pb-10 flex-1 flex flex-col p-3'>
      <div className='flex items-center gap-4 mb-5'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            onChange={handleSearch}
            type='search'
            placeholder='Search candidates'
            className='pl-8 rounded-full bg-gray-50 w-full'
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ios-scroll-fix'>
        {!loading ? (
          filteredCandidates.length > 0 ? (
            filteredCandidates.map((item) => (
              <CandidateCard key={item.id} candidate={item} />
            ))
          ) : (
            <div>No candidates found.</div>
          )
        ) : (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className='min-w-32 h-56 rounded-xl animate-pulse bg-slate-300'
            />
          ))
        )}
      </div>
    </div>
  );
}

type CandidateCardProps = {
  // candidate: Candidate;
  candidate: CandidateNext;
};

function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Link
      href={`/candidate/${candidate.id}`}
      className='relative overflow-hidden rounded-xl shadow-md bg-cover bg-center h-56 min-w-32 cursor-pointer border transition-transform duration-300 ease-in-out hover:-translate-y-0.5'
      style={{ paddingBottom: "75%" }}
      data-testid='candidate-card'>
      <Image
        priority
        src={candidate.displayPhoto ? candidate.displayPhoto : defaultImage}
        alt={candidate.displayName || "candidate image"}
        width={300}
        height={300}
        className='absolute w-full h-full object-cover'
      />
      <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent '>
        <div className='flex flex-col justify-end p-3 text-white'>
          <h2 className='text-sm md:text-base font-bold'>
            {candidate.displayName}
          </h2>
          <p className='text-xs uppercase'>{candidate.party}</p>
        </div>
      </div>
    </Link>
  );
}

export default Candidate;
