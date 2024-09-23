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
      className='bg-white border border-slate-200 rounded-lg p-6 shadow-md flex flex-col justify-between h-44'>
      <div>
        <h2 className='text-3xl text-gray-900 font-semibold mb-1 capitalize'>
          {election.electionType}
        </h2>
        <p className='text-sm text-gray-700 mb-4'>{election.description}</p>
      </div>
      <div>
        {!election.isVoted ? (
          <Link
            className={`inline-block ${
              election.status === "inactive" ? "pointer-events-none" : ""
            }`}
            href={
              election.status === "inactive" ? "#" : `/vote/${election.id}`
            }>
            <Button disabled={election.status === "inactive"}>
              Get Started
            </Button>
          </Link>
        ) : (
          <Button
            variant='secondary'
            className='w-full pointer-events-none border font-semibold opacity-80'>
            Voted
          </Button>
        )}
      </div>
    </div>
  );
}

export default ElectionBanner;
