import * as React from "react";
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

type VoteConfirmationProps = {
  buttonText: string;
  buttonSize: "default" | "sm" | "lg" | "icon" | null | undefined;
  buttonClass: string;
  buttonVariant?:
    | "link"
    | "default"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost"
    | null
    | undefined;
};

export default function VoteConfirmation({
  buttonText,
  buttonSize,
  buttonClass,
  buttonVariant = "default",
}: VoteConfirmationProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size={buttonSize}
            variant={buttonVariant}
            className={buttonClass}>
            {buttonText}
          </Button>
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
        <Button
          size={buttonSize}
          variant={buttonVariant}
          className={buttonClass}>
          {buttonText}
        </Button>
      </DrawerTrigger>
      <DrawerContent className='min-h-52'>
        <div className='mx-auto w-full max-w-sm'>
          <DrawerHeader>
            {/* <DrawerTitle>Confirm Your Vote</DrawerTitle> */}
            <DrawerDescription className='font-semibold text-slate-700'>
              Are you sure? Once you vote, you can&apos;t change it. Please
              review your choice before proceeding.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button size='lg'>Confirm Vote</Button>
            <DrawerClose asChild>
              <Button size='lg' variant='outline'>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
