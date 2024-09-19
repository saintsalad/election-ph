import React, { ReactNode, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useState } from "react";
import { CandidateNext, ElectionNext, VoteRequest } from "@/lib/definitions";
import Image from "next/image";
import { Fingerprint, LoaderCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateReferenceNumber } from "@/lib/functions";
import { useMutation } from "react-query";
import axios from "axios";

type VoteConfirmationProps = {
  candidate: CandidateNext;
  electionId: string;
  children: ReactNode;
  election: ElectionNext;
  onVoteSubmitted: () => void;
};

const VoteConfirmation: React.FC<VoteConfirmationProps> = ({
  candidate,
  electionId,
  children,
  election,
  onVoteSubmitted,
}) => {
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { toast } = useToast();

  const voteMutation = useMutation({
    mutationFn: (voteData: VoteRequest) =>
      axios.post("/api/election/vote", voteData),
    onSuccess: (res) => {
      // toast({
      //   title: "Vote submitted successfully",
      //   description: "Your vote has been recorded.",
      // });
      setIsDrawerOpen(false);
      onVoteSubmitted();
    },
    onError: (error) => {
      const errorObject = error as any;
      const errorMessage =
        errorObject?.response?.data?.message || "Please try again later.";
      const errorCode = errorObject?.response?.data?.code || "";
      toast({
        title: "Error occured!",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmitVote = async () => {
    const referenceId = generateReferenceNumber();

    voteMutation.mutate({
      electionId,
      referenceId,
      value: candidate.id,
    });
  };

  if (isDesktop) {
    return (
      <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className=''>
          <DialogHeader className='mb-5'>
            <DialogTitle className='text-gray-800 text-2xl font-extrabold'>
              Are you sure?
            </DialogTitle>
            <DialogDescription className='font-medium text-slate-700'>
              Click on &quot;Confirm&quot; to vote candidate
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button size='lg' variant='outline'>
                Cancel
              </Button>
            </DialogClose>
            <Button
              className='min-w-40'
              disabled={isSubmiting}
              onClick={() => handleSubmitVote()}
              size='lg'>
              {isSubmiting ? (
                <LoaderCircle size={20} className='animate-spin mr-1' />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      dismissible={!isSubmiting}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className='min-h-52'>
        <DrawerTitle hidden={true}>Confirm Vote</DrawerTitle>
        <div className='p-4'>
          <div className='relative overflow-hidden rounded-lg mb-5'>
            <Image
              src={candidate.displayPhoto}
              alt='Candidate'
              width={500}
              height={500}
              className='h-full w-full object-cover aspect-square'
            />
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6'>
              <div className='text-2xl font-bold text-white'>
                {candidate.balotNumber}. {candidate.displayName}
              </div>
              <p className='text-xs uppercase text-white'>{candidate.party}</p>
              <DialogDescription className='text-xs text-white/80'>
                {candidate.shortDescription}
              </DialogDescription>
            </div>
          </div>
          <p className='text-xs font-light mb-2'>
            Click on &quot;Confirm&quot; to vote candidate
          </p>
          <Button
            disabled={isSubmiting}
            onClick={() => handleSubmitVote()}
            className='w-full mb-2'
            size='lg'>
            {isSubmiting ? (
              <LoaderCircle size={20} className='animate-spin mr-1' />
            ) : (
              "Confirm"
            )}
          </Button>
          <DrawerClose asChild>
            <Button
              disabled={isSubmiting}
              className='w-full'
              size='lg'
              variant='outline'>
              Cancel
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default VoteConfirmation;
