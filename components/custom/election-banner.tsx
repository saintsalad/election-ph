import { ElectionResponse } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ElectionBannerProps = {
  election: ElectionResponse;
  userId: string;
};

function ElectionBanner({ election, userId }: ElectionBannerProps) {
  return (
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
      {!election.isVoted ? (
        <Link href={`/vote/${election.id}`}>
          <Button>Get Started</Button>
        </Link>
      ) : (
        <Button
          variant={"secondary"}
          className='w-28 pointer-events-none border font-semibold opacity-80'>
          Voted
        </Button>
      )}
    </div>
  );
}

export default ElectionBanner;
