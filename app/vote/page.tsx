"use client";

import ElectionBanner from "@/components/custom/election-banner";
import type { ElectionWithVoteStatus, Vote } from "@/lib/definitions";
import { useAuthStore } from "@/lib/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

function useElections() {
  return useQuery<ElectionWithVoteStatus[]>(`elections`, async () => {
    const { data } = await axios.get<ElectionWithVoteStatus[]>(`/api/election`);
    return data;
  });
}

export default function Vote() {
  // const [elections, setElections] = useState<Election[]>([]);
  const { user } = useAuthStore();

  const { data: elections, isError, isFetching, refetch } = useElections();

  // async function loadElections(forceRefresh: boolean = false) {
  //   try {
  //     setIsLoading(true);
  //     const result = await fetchFromFirebase<Election>(
  //       "elections",
  //       {
  //         cacheKey: "elections",
  //       },
  //       forceRefresh
  //     );
  //     setElections(result);
  //   } catch (e) {
  //     console.error("Error loading elections: ", e);
  //   } finally {
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 500);
  //   }
  // }

  // useEffect(() => {
  //   loadElections();
  // }, []);

  return (
    <div className='w-full pt-11 lg:pt-16'>
      <div className='px-4 pt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:px-0'>
        {!isFetching &&
          elections &&
          elections.map((item, i) => (
            <div key={i} className='w-full'>
              <ElectionBanner userId={user?.uid || ""} election={item} />
            </div>
          ))}

        {/* TODO: implement skeleton */}
        {isFetching && <div>Loading...</div>}
      </div>
    </div>
  );
}
