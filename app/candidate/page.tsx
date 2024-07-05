"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface Candidate {
  id: number;
  name: string;
  party: string;
  image: string;
}

interface CandidateProps {
  candidate: {
    id: number;
    name: string;
    party: string;
    image: string;
  };
}

const candidates: Candidate[] = [
  {
    id: 1,
    name: "Bongbong Marcos",
    party: "Partido Federal ng Pilipinas",
    image: "https://picsum.photos/id/1015/800/600",
  },
  {
    id: 2,
    name: "Leni Robredo",
    party: "Liberal Party",
    image: "https://picsum.photos/id/1029/800/600",
  },
  {
    id: 3,
    name: "Manny Pacquiao",
    party: "PROMDI",
    image: "https://picsum.photos/id/1018/800/600",
  },
  {
    id: 4,
    name: "Isko Moreno",
    party: "Aksyon Demokratiko",
    image: "https://picsum.photos/id/1019/800/600",
  },
  {
    id: 5,
    name: "Ping Lacson",
    party: "Partido Reporma",
    image: "https://picsum.photos/id/1020/800/600",
  },
  {
    id: 6,
    name: "Leody de Guzman",
    party: "Partido Lakas ng Masa",
    image: "https://picsum.photos/id/1021/800/600",
  },
  {
    id: 7,
    name: "Norberto Gonzales",
    party: "Partido Demokratiko Sosyalista ng Pilipinas",
    image: "https://picsum.photos/id/1022/800/600",
  },
];

function Candidate() {
  return (
    <div className='pb-10 flex-1 flex flex-col p-3'>
      <div className='flex items-center gap-4 mb-5'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search candidates...'
            className='pl-8 rounded-lg bg-gray-50 w-full'
          />
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ios-scroll-fix'>
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
}

const CandidateCard: React.FC<CandidateProps> = ({ candidate }) => {
  return (
    <div
      className='relative overflow-hidden rounded-lg shadow-md bg-cover bg-center h-56 min-w-32 cursor-pointer'
      style={{ paddingBottom: "75%" }}
      data-testid='candidate-card'>
      <Image
        src={candidate.image}
        alt={candidate.name}
        layout='fill'
        objectFit='cover'
        className='absolute inset-0'
      />
      <div className='absolute inset-0 bg-black opacity-25'></div>
      <div className='absolute inset-0 flex flex-col justify-end p-4 text-white'>
        <h2 className='text-lg font-bold'>{candidate.name}</h2>
        <p className='text-sm'>{candidate.party}</p>
      </div>
    </div>
  );
};

export default Candidate;
