"use client";

import { Button } from "@/components/ui/button";
import { Election } from "@/lib/definitions";
import { fetchFromFirebase } from "@/lib/firebase/functions";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Vote() {
  const [elections, setElections] = useState<Election[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    <div className='p-3 flex-1 space-y-5 w-full'>
      {elections &&
        elections.map((item, i) => (
          <div
            key={item.id}
            className={`${
              item.status === "active"
                ? "bg-slate-100"
                : "bg-slate-200 opacity-80 pointer-events-none"
            } rounded-lg p-5 min-h-44 flex flex-col justify-center items-center`}>
            <h2 className='text-3xl font-bold tracking-tight capitalize'>
              {item.electionType}
            </h2>
            <div className='pb-3 text-sm font-sans'>{item.description}</div>
            <Link prefetch={true} href={`/vote/${item.id}`}>
              <Button>Get Started</Button>
            </Link>
          </div>
        ))}
    </div>
  );
}
