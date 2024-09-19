"use client";

import ElectionBanner from "@/components/custom/election-banner";
import type { ElectionWithVoteStatus, Vote } from "@/lib/definitions";
import { useAuthStore } from "@/lib/store";
import axios from "axios";
import { useQuery } from "react-query";

function useElections() {
  return useQuery<ElectionWithVoteStatus[]>(`elections`, async () => {
    const { data } = await axios.get<ElectionWithVoteStatus[]>(`/api/election`);
    return data;
  });
}

export default function Vote() {
  const { user } = useAuthStore();

  const { data: elections, isError, isFetching, refetch } = useElections();

  return (
    <div className='w-full pt-11 lg:pt-16'>
      <div className='px-4 pt-5 grid grid-cols-1 gap-6  lg:px-0'>
        {!isFetching &&
          elections &&
          elections.map((item, i) => (
            <ElectionBanner key={i} userId={user?.uid || ""} election={item} />
          ))}

        {/* TODO: implement skeleton */}
        {isFetching && <div>Loading...</div>}
      </div>
    </div>
  );
}
