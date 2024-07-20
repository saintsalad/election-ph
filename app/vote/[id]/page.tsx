"use client";

import { useCallback, useEffect, useState } from "react";
import { Candidate, Election } from "@/lib/definitions";
import {
  fetchDocumentById,
  fetchDocumentsByIds,
  hasUserVoted,
} from "@/lib/firebase/functions";
import SingleVoteListView from "@/components/custom/single-vote-listview";
import { useAuthStore } from "@/lib/store";
import emitter from "@/lib/event";

function VotingPage({ params }: { params: { id: string } }) {
  const electionId = params.id;
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voted, setVoted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid || "";

  const loadCandidates = useCallback(async () => {
    try {
      const election = await fetchDocumentById<Election>(
        "elections",
        electionId
      );
      if (election) {
        const candidateIds = election.candidates;
        // TODO: fix candidateIds has 1 item in a blank array
        if (candidateIds.length <= 1) {
          // no candidates found
          return false;
        }

        const _candidates = await fetchDocumentsByIds<Candidate>(
          "candidates",
          candidateIds
        );
        setCandidates(_candidates);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  }, [electionId]);

  const checkIfUserVoted = useCallback(
    async (forceRefresh = false) => {
      if (!userId) return;
      try {
        const hasVoted = await hasUserVoted(userId, electionId, forceRefresh);
        setVoted(hasVoted);
      } catch (error) {
        console.error("Error occurred while checking vote status:", error);
      }
    },
    [electionId, userId]
  );

  useEffect(() => {
    checkIfUserVoted();
    loadCandidates();
  }, [loadCandidates, checkIfUserVoted]);

  useEffect(() => {
    const handleVoteSubmit = () => {
      setVoted(true);
      checkIfUserVoted(true); // Force refresh
    };

    emitter.on("onVoteSubmit", handleVoteSubmit);
    return () => emitter.off("onVoteSubmit", handleVoteSubmit);
  }, [checkIfUserVoted]);

  return (
    <>
      {!voted ? (
        <div className='flex flex-1 flex-col p-3 min-w-[340px]'>
          {candidates.length > 0 && userId ? (
            <div className='flex justify-start mt-5'>
              <div className='w-full'>
                <SingleVoteListView
                  electionId={electionId}
                  candidates={candidates}
                />
              </div>
            </div>
          ) : (
            <div>No candidates found ... </div>
          )}
        </div>
      ) : (
        <div>Voted ...</div>
      )}
    </>
  );
}

export default VotingPage;
