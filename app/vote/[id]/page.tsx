"use client";

import { useCallback, useEffect, useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Candidate, Election } from "@/lib/definitions";
import {
  fetchDocumentById,
  fetchDocumentsByIds,
} from "@/lib/firebase/functions";
import { GalleryHorizontal, Rows3 } from "lucide-react";
import SingleVoteListView from "@/components/custom/single-vote-listview";
import SingleVoteCarouselViewProps from "@/components/custom/single-vote-carouselview";

type DisplayType = "list" | "carousel" | "grid";

type DisplayTogglesType = {
  id: DisplayType;
  icon: () => JSX.Element;
};

const DisplayToggles: DisplayTogglesType[] = [
  {
    id: "carousel",
    icon: () => <GalleryHorizontal />,
  },
  {
    id: "list",
    icon: () => <Rows3 />,
  },
];

function VotingPage({ params }: { params: { id: string } }) {
  const [displayType, setDisplayType] = useState<DisplayType>("list");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCandidate = useCallback(async () => {
    await fetchDocumentById<Election>("elections", params.id)
      .then(async (election) => {
        if (election) {
          const candidateIds = election.candidates;
          const _candidates = await fetchDocumentsByIds<Candidate>(
            "candidates",
            candidateIds
          );

          setCandidates(_candidates);
        }
      })
      .catch((error: Error) => {
        console.error("Error fetching document:", error);
      });
  }, [params.id]);

  useEffect(() => {
    loadCandidate();
  }, [loadCandidate]);

  return (
    <div className='flex flex-1 flex-col p-3 min-w-[340px]'>
      <div className='justify-end flex'>
        <ToggleGroup size='lg' defaultValue={displayType} type='single'>
          {DisplayToggles.map((item: DisplayTogglesType) => (
            <ToggleGroupItem
              key={item.id}
              onClick={() => setDisplayType(item.id)}
              value={item.id}>
              {item.icon()}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {candidates.length > 0 ? (
        <div className='flex justify-start mt-5'>
          <div
            className={`${
              displayType === "carousel" ? "block" : "hidden"
            } w-full`}>
            <SingleVoteCarouselViewProps candidates={candidates} />
          </div>

          <div
            className={`${displayType === "list" ? "block" : "hidden"} w-full`}>
            <SingleVoteListView candidates={candidates} />
          </div>
        </div>
      ) : (
        <div>Loading ...</div>
      )}
    </div>
  );
}

export default VotingPage;
