"use client";

import ElectionBanner from "@/components/custom/election-banner";
import { Button } from "@/components/ui/button";
import type { Election, Vote } from "@/lib/definitions";
import { fetchFromFirebase } from "@/lib/firebase/functions";
import { useAuthStore } from "@/lib/store";
import React, { useEffect, useState } from "react";

export default function Vote() {
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, userVotes, setUserVotes, hasUserVotedZ } = useAuthStore();

  async function loadElections(forceRefresh: boolean = false) {
    try {
      setIsLoading(true);
      const result = await fetchFromFirebase<Election>(
        "elections",
        {
          cacheKey: "elections",
        },
        forceRefresh
      );
      setElections(result);
    } catch (e) {
      console.error("Error loading elections: ", e);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }

  useEffect(() => {
    loadElections();
  }, []);

  return (
    <div className='w-full'>
      <div className='p-4 grid grid-cols-1 gap-6 md:grid-cols-2 md:p-6'>
        {elections &&
          elections.map((item, i) => (
            <div key={i} className='w-full'>
              <ElectionBanner userId={user?.uid || ""} election={item} />
            </div>
          ))}
      </div>
    </div>
  );
}
