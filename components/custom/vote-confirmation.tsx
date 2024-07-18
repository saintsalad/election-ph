import React, { ReactNode } from "react";
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
import { Candidate } from "@/lib/definitions";
import Image from "next/image";

// type VoteConfirmationProps = {
//   candidate: Candidate;
//   buttonText: string;
//   buttonSize: "default" | "sm" | "lg" | "icon" | null | undefined;
//   buttonClass: string;
//   buttonVariant?:
//     | "link"
//     | "default"
//     | "outline"
//     | "destructive"
//     | "secondary"
//     | "ghost"
//     | null
//     | undefined;
// };

type VoteConfirmationProps = {
  candidate: Candidate;
  children: ReactNode;
};

const VoteConfirmation: React.FC<VoteConfirmationProps> = ({
  candidate,
  children,
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {/* <Button
            size={buttonSize}
            variant={buttonVariant}
            className={buttonClass}>
            {buttonText}
          </Button> */}
          {children}
        </DialogTrigger>
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
    <Drawer>
      <DrawerTrigger asChild>
        {/* <Button
          size={buttonSize}
          variant={buttonVariant}
          className={buttonClass}>
          {buttonText}
        </Button> */}
        {children}
      </DrawerTrigger>
      <DrawerContent className='min-h-52'>
        <DrawerTitle hidden={true}>Confirm Vote</DrawerTitle>
        <div className='p-6'>
          <div className='relative overflow-hidden rounded-lg mb-5'>
            {/* <div className='bg-red-50 object-cover w-[600px] h-[400px]' /> */}
            <Image
              src={candidate.image}
              alt='Candidate'
              width={500}
              height={500}
              className='h-full w-full object-cover'
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
          <Button className='w-full mb-2' size='lg'>
            Confirm Vote
          </Button>
          <DrawerClose asChild>
            <Button className='w-full' size='lg' variant='outline'>
              Cancel
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default VoteConfirmation;
