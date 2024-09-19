import { ElectionWithVoteStatus } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ElectionBannerProps = {
  election: ElectionWithVoteStatus;
  userId: string;
};

function ElectionBanner({ election, userId }: ElectionBannerProps) {
  return (
    <div
      key={election.id}
      className={` bg-slate-100 border border-slate-200
       rounded-lg px-4 py-3 h-36 sm:p-6  flex flex-col justify-center sm:h-48 shadow-sm overflow-hidden`}>
      <h2 className='text-2xl text-slate-800 sm:text-4xl font-bold tracking-tight capitalize'>
        {election.electionType}
      </h2>

      <div className='pb-3 text-xs sm:text-sm font-sans text-slate-700 mb-2 sm:mb-5'>
        {election.description}
      </div>
      {!election.isVoted ? (
        <Link
          className={`flex self-start ${
            election.status === "inactive" ? "pointer-events-none" : ""
          }`}
          href={election.status === "inactive" ? "#" : `/vote/${election.id}`}>
          <Button disabled={election.status === "inactive"}>Get Started</Button>
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
