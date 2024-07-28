import { Election } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useState } from "react";
import { hasUserVoted } from "@/lib/firebase/functions";
import {
  BadgeCheck,
  CheckCheckIcon,
  CheckCircle,
  CheckCircle2Icon,
  Fingerprint,
} from "lucide-react";

type ElectionBannerProps = {
  election: Election;
  userId: string;
};

function ElectionBanner({ election, userId }: ElectionBannerProps) {
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkIfUserHasVoted = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const hasVoted = await hasUserVoted(userId, election.id, true);
      setDisable(hasVoted);
    } catch (error) {
      console.error("Error occurred while checking if user has voted", error);
    } finally {
      setLoading(false);
    }
  }, [userId, election.id]);

  useEffect(() => {
    checkIfUserHasVoted();
  }, [checkIfUserHasVoted]);

  return loading ? (
    <Skeleton className='bg-slate-300 flex flex-1 h-44' />
  ) : (
    <div
      key={election.id}
      className={` bg-white
       rounded-lg p-6  flex flex-col justify-center h-48 shadow-sm`}>
      <h2 className='text-3xl sm:text-4xl font-bold tracking-tight capitalize'>
        {election.electionType}
      </h2>

      <div className='pb-3 text-xs sm:text-sm font-sans text-slate-700 mb-5'>
        {election.description}
      </div>
      {!disable ? (
        <Link href={`/vote/${election.id}`}>
          <Button>Get Started</Button>
        </Link>
      ) : (
        <Button
          variant={"ghost"}
          className='w-28 pointer-events-none border border-slate-400 font-mono text-slate-500 font-semibold'>
          Voted <Fingerprint className='h-4 w-4 ml-1' color='green' />
        </Button>
      )}
    </div>
  );
}

export default ElectionBanner;
