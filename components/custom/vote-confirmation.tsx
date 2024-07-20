import React, { ReactNode, useRef } from "react";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

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
  DrawerOverlay,
  DrawerPortal,
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
import { Candidate, Vote } from "@/lib/definitions";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useStore } from "zustand";
import { useAuthStore } from "@/lib/store";
import { serverTimestamp } from "firebase/firestore";
import { hasUserVoted, saveDocument } from "@/lib/firebase/functions";
import type { UserVotes } from "@/lib/definitions";
import { redirect } from "next/navigation";
import emitter from "@/lib/event";

type VoteConfirmationProps = {
  candidate: Candidate;
  electionId: string;
  children: ReactNode;
};

const VoteConfirmation: React.FC<VoteConfirmationProps> = ({
  candidate,
  electionId,
  children,
}) => {
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuthStore();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { toast } = useToast();

  const handleSubmitVote = async () => {
    setIsSubmitting(true);

    const userId = user?.uid || "";
    if (!userId) {
      console.log("Error: user's credentials are missing");
    }

    const hasVoted = await hasUserVoted(userId, electionId, true);
    if (hasVoted) {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Whoa there! 🚫😤",
        description:
          "Looks like you've already cast your vote. No double-dipping allowed, buddy!",
      });
      return;
    }

    const vote = {
      electionId: electionId,
      userId: userId,
      value: candidate.id.toString(),
      dateCreated: serverTimestamp(),
    };

    const result = await saveDocument("votes", vote);

    if (result.success) {
      // const userVotes: UserVotes = {
      //   electionId: electionId,
      //   candidate: candidate.id.toString(),
      // };
      setIsDrawerOpen(false);
      setIsSubmitting(false);
      toast({
        variant: "success",
        title: "Woohoo! 🥳🥂",
        description:
          "Your vote is cast. Thank you for participating! You'll be redirected to vote page.",
      });

      // onSubmitEvent
      emitter.emit("onVoteSubmit", { data: result.data });
    } else {
      toast({
        variant: "default",
        title: "Uh ohhh! 😥",
        description: result.data?.toString(),
      });
    }
  };

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className=''>
          <DialogHeader className='mb-5'>
            <DialogTitle className='text-slate-800 mb-1'>
              Vote Confirmation ℹ️
            </DialogTitle>
            <DialogDescription className='font-semibold text-slate-700'>
              Are you sure? Once you vote, you can&apos;t change it. Please
              review your choice before proceeding.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button size='lg' variant='outline'>
                Cancel
              </Button>
            </DialogClose>
            <Button size='lg'>Confirm Vote</Button>
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
              src={candidate.image}
              alt='Candidate'
              width={500}
              height={500}
              className='h-full w-full object-cover aspect-square'
            />
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6'>
              <div className='text-2xl font-bold text-white'>
                {candidate.name}
              </div>
              <p className='text-xs uppercase text-white'>{candidate.party}</p>
              <DialogDescription className='text-xs text-white/80'>
                {candidate.shortDescription}
              </DialogDescription>
            </div>
          </div>
          <p className='text-xs font-light mb-2'>
            ☝🏻 Once you confirm, you can&apos;t change it. Please review your
            choice before proceeding.
          </p>
          <Button
            disabled={isSubmiting}
            onClick={() => handleSubmitVote()}
            className='w-full mb-2'
            size='lg'>
            {isSubmiting ? (
              <LoaderCircle size={20} className='animate-spin mr-1' />
            ) : (
              "Confirm Vote"
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
