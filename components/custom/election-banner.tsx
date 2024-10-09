import { ElectionWithVoteStatus } from "@/lib/definitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CalendarIcon, BarChart2Icon } from "lucide-react";

type ElectionBannerProps = {
  election: ElectionWithVoteStatus;
  userId: string;
};

function ElectionBanner({ election, userId }: ElectionBannerProps) {
  const isInactive = election.status === "inactive";
  const buttonHref = isInactive
    ? "#"
    : election.isVoted
    ? `/results/${election.id}`
    : `/vote/${election.id}`;

  return (
    <Card className='w-full overflow-hidden relative flex flex-col h-full bg-gradient-to-br from-background to-background dark:from-gray-800 dark:to-gray-900'>
      <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/5 dark:to-secondary/5' />
      <CardHeader className='relative'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-2xl font-bold capitalize'>
            {election.electionType}
          </CardTitle>
          <Badge
            variant='outline'
            className={`${
              isInactive
                ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800"
                : election.isVoted
                ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-800"
                : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800"
            }`}>
            {isInactive ? "Inactive" : election.isVoted ? "Voted" : "Active"}
          </Badge>
        </div>
        <CardDescription className='flex items-center text-sm text-muted-foreground'>
          <CalendarIcon className='mr-2 h-4 w-4' />
          {new Date(election.startDate).toLocaleDateString()} -{" "}
          {new Date(election.endDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className='relative flex-grow'>
        <p className='text-sm text-foreground/80'>{election.description}</p>
      </CardContent>
      <CardFooter className='relative mt-auto'>
        <Link href={buttonHref} className='w-full'>
          <Button
            disabled={isInactive}
            className='w-full'
            variant={
              election.isVoted
                ? "secondary"
                : isInactive
                ? "secondary"
                : "default"
            }>
            {isInactive ? (
              "Election Inactive"
            ) : election.isVoted ? (
              <>
                <BarChart2Icon className='mr-2 h-4 w-4' />
                View Results
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ElectionBanner;
