import React, { useState, useCallback, useEffect } from "react";
import { CandidateNext, ElectionNext, VoteRequest } from "@/lib/definitions";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SwipeToConfirm } from "@/components/custom/swipetoconfirm-button";
import { Check, CheckCircle, RefreshCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "react-query";
import axios from "axios";
import { generateReferenceNumber } from "@/lib/functions";
import { Loader2 } from "lucide-react"; // Add this import
import { useTheme } from "next-themes";
import { encrypt } from "@/lib/light-encrypt";

type MultipleVoteListViewProps = {
  election: ElectionNext;
  onVoteSubmitted: () => void;
};

function MultipleVoteListView({
  election,
  onVoteSubmitted,
}: MultipleVoteListViewProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();

  const voteMutation = useMutation({
    mutationFn: (voteData: VoteRequest) =>
      axios.post("/api/election/vote", voteData),
    onSuccess: () => {
      setIsDialogOpen(false);
      onVoteSubmitted();
    },
    onError: (error) => {
      setIsDialogOpen(false);
      const errorObject = error as any;
      const errorMessage =
        errorObject?.response.data.message.toString() || "Please try again";
      toast({
        title: "❌ Oops something went wrong!",
        description: errorMessage,
      });
    },
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const toggleCandidate = useCallback(
    (candidateId: string) => {
      setSelectedCandidates((prev) => {
        if (prev.includes(candidateId)) {
          return prev.filter((id) => id !== candidateId);
        }
        if (prev.length < election.numberOfVotes) {
          return [...prev, candidateId];
        }
        setShowMaxSelectionToast(true);
        return prev;
      });
    },
    [election.numberOfVotes]
  );

  const [showMaxSelectionToast, setShowMaxSelectionToast] = useState(false);

  useEffect(() => {
    if (showMaxSelectionToast) {
      toast({
        title: "⚠️ Maximum Selection Reached",
        description: `Maximum of ${election.numberOfVotes} candidate${
          election.numberOfVotes > 1 ? "s" : ""
        } selected. Deselect one to choose another.`,
        duration: 2000,
      });
      setShowMaxSelectionToast(false);
    }
  }, [showMaxSelectionToast, election.numberOfVotes, toast]);

  const handleSubmit = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    const referenceId = generateReferenceNumber();

    voteMutation.mutate({
      electionId: election.id,
      referenceId,
      value: selectedCandidates.map((item) => encrypt(item)),
    });
  };

  const handleReset = () => {
    setSelectedCandidates([]);
  };

  const selectedCandidateDetails = election.candidates.filter((candidate) =>
    selectedCandidates.includes(candidate.id)
  );

  const isMaxSelected = selectedCandidates.length === election.numberOfVotes;
  const isLessThanThree = selectedCandidateDetails.length < 4;

  return (
    <div className='space-y-3 sm:space-y-6 pb-10 rounded-lg'>
      {/* Controls */}
      <div className='flex flex-row justify-between items-center gap-4 sm:gap-0 sm:bg-white dark:sm:bg-gray-900 sm:p-4 rounded-md sm:border border-blue-100 dark:border-gray-800'>
        <p
          className={`text-sm font-medium ${
            selectedCandidates.length === election.numberOfVotes
              ? "text-red-500 dark:text-red-400"
              : "text-blue-700 dark:text-gray-300"
          }`}>
          Selected: {selectedCandidates.length} / {election.numberOfVotes}
        </p>
        <div className='flex space-x-3'>
          <Button
            onClick={handleReset}
            variant='outline'
            size='sm'
            className='text-blue-600 dark:text-gray-400 border-blue-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700 dark:hover:text-gray-300 transition-colors duration-300'>
            <RefreshCcw className='w-4 h-4 mr-2' />
            Reset
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedCandidates.length === 0}
            size='sm'
            className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors duration-300'>
            <CheckCircle className='w-4 h-4 mr-2' />
            Submit
          </Button>
        </div>
      </div>

      {/* Mobile view */}
      <div className='w-full md:hidden space-y-3'>
        {election.candidates.map((item: CandidateNext, i: number) => {
          const isSelected = selectedCandidates.includes(item.id);
          return (
            <div
              key={i}
              onClick={() => toggleCandidate(item.id)}
              className={cn(
                "bg-white dark:bg-gray-800 rounded-md overflow-hidden transition-all duration-300",
                "relative border",
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                  : "border-blue-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              )}>
              <div className='flex items-center gap-4 w-full p-3 transition-all duration-300'>
                <div className='relative h-[60px] w-[60px]'>
                  <Image
                    src={item.displayPhoto}
                    alt={item.displayName}
                    fill
                    className='rounded-md object-cover'
                    priority
                  />
                </div>
                <div className='flex-grow'>
                  <h3 className='text-base font-bold text-blue-900 dark:text-blue-100'>
                    {item.ballotNumber}. {item.displayName}
                  </h3>
                  <p className='text-blue-600 dark:text-blue-400 text-xs uppercase'>
                    {item.party}
                  </p>
                </div>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
                    isSelected
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300 dark:border-gray-600"
                  )}>
                  <CheckIcon
                    className={cn(
                      "w-4 h-4 text-white transition-all duration-300",
                      isSelected ? "opacity-100 scale-100" : "opacity-0 scale-0"
                    )}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop view */}
      <div className='hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {election.candidates.map((item: CandidateNext) => {
          const isSelected = selectedCandidates.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleCandidate(item.id)}
              className={cn(
                "group relative overflow-hidden rounded-md cursor-pointer transition-all duration-300",
                isSelected
                  ? "ring-4 ring-blue-500 ring-opacity-30 dark:ring-opacity-50"
                  : "border border-blue-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
              )}>
              <div className='aspect-square relative'>
                <Image
                  src={item.displayPhoto}
                  alt={item.displayName}
                  fill
                  className={cn(
                    "object-cover transition-all duration-300",
                    isSelected ? "brightness-95" : "group-hover:brightness-98"
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t to-transparent flex flex-col justify-end p-3",
                    isSelected
                      ? "from-blue-900/80 dark:from-blue-800/90"
                      : "from-blue-900/20 dark:from-blue-900/40"
                  )}>
                  <div className='text-white text-sm font-semibold'>
                    {item.ballotNumber}. {item.displayName}
                  </div>
                  <div className='text-blue-200 dark:text-blue-300 text-xs uppercase'>
                    {item.party}
                  </div>
                </div>
                <div
                  className={cn(
                    "absolute top-2 right-2 bg-blue-500 dark:bg-blue-600 rounded-full p-1.5 transition-all duration-300",
                    isSelected ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  )}>
                  <CheckIcon className='w-5 h-5 text-white' />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog content */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-[425px] w-[95vw] h-[70vh] max-h-[90vh] sm:h-auto flex flex-col p-3 sm:p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'>
          {voteMutation.isLoading ? (
            <div className='flex flex-col flex-1 items-center justify-center min-h-[300px]'>
              <Loader2 className='w-12 h-12 text-blue-500 dark:text-blue-400 animate-spin' />
              <p className='mt-4 text-sm text-blue-700 dark:text-blue-300'>
                Processing your vote submission...
              </p>
            </div>
          ) : (
            <>
              <DialogHeader className='pb-2 space-y-1'>
                <DialogTitle className='text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100'>
                  Confirm Your Vote
                </DialogTitle>
                <DialogDescription className='text-xs sm:text-sm text-blue-700 dark:text-blue-300'>
                  {isMaxSelected
                    ? "You've made all your selections. Ready to submit your vote?"
                    : `You've selected ${selectedCandidates.length} out of ${election.numberOfVotes} possible votes.`}
                </DialogDescription>
              </DialogHeader>
              <Separator className='my-2 bg-gray-200 dark:bg-gray-700' />
              <div className='flex-grow overflow-hidden flex flex-col'>
                <h3 className='font-semibold text-blue-900 dark:text-blue-100 text-xs sm:text-sm mb-2'>
                  Selected Candidates:
                </h3>
                <ScrollArea className='flex-grow pr-2 -mr-2'>
                  <ul
                    className={`grid gap-1 sm:gap-2 ${
                      isLessThanThree
                        ? "grid-cols-1"
                        : "grid-cols-1 sm:grid-cols-2"
                    }`}>
                    {selectedCandidateDetails.map((candidate) => (
                      <li
                        key={candidate.id}
                        className='flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-2 py-1.5 rounded-md'>
                        <div className='relative h-8 w-8 flex-shrink-0'>
                          <Image
                            src={candidate.displayPhoto}
                            alt={candidate.displayName}
                            fill
                            className='rounded-full object-cover'
                          />
                        </div>
                        <div className='flex-grow min-w-0'>
                          <p className='font-medium text-sm text-blue-900 dark:text-blue-100 truncate'>
                            {candidate.displayName}
                          </p>
                          <p className='text-xs text-blue-600 dark:text-blue-400 truncate'>
                            {candidate.party}
                          </p>
                        </div>
                        <Check
                          size={16}
                          className='text-green-500 dark:text-green-400 flex-shrink-0'
                        />
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
                {!isMaxSelected && (
                  <p className='text-xs text-blue-600 dark:text-blue-400 mt-2'>
                    You can select{" "}
                    {election.numberOfVotes - selectedCandidates.length} more
                    candidate(s).
                  </p>
                )}
              </div>
              <div className='mt-3 sm:mt-4 text-center'>
                <SwipeToConfirm
                  onConfirm={handleConfirmSubmit}
                  // disabled={voteMutation.isLoading}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MultipleVoteListView;
