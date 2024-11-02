"use client";

import { useState, useEffect } from "react";
import { sendEmailVerification, signOut } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";
import { auth } from "@/lib/firebase";
import { Mail, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

function EmailVerificationSheet() {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const userEmail = auth.currentUser?.email;
  const [isVisible, setIsVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cookie helper functions
  const setCooldownCookie = () => {
    const expires = new Date(Date.now() + 86400000).toUTCString(); // 24 hours
    document.cookie = `lastVerificationSent=${Date.now()};expires=${expires};path=/`;
  };

  const getCooldownCookie = () => {
    const match = document.cookie.match(/lastVerificationSent=(\d+)/);
    return match ? Number(match[1]) : 0;
  };

  // Check cooldown on mount and start timer if needed
  useEffect(() => {
    const updateCooldown = () => {
      const lastSent = getCooldownCookie();
      const now = Date.now();
      const remaining = Math.max(0, lastSent + 300000 - now); // 300000ms = 5 minutes
      setCooldownRemaining(Math.ceil(remaining / 1000));
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Add new useEffect for delayed visibility
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  const handleVerifyEmail = async () => {
    console.log(isResending, cooldownRemaining);
    if (isResending || cooldownRemaining > 0) return;

    try {
      setIsResending(true);
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No user is currently signed in",
        });
        return;
      }

      await sendEmailVerification(currentUser);
      setCooldownCookie();

      toast({
        title: "Email Sent",
        description: "Please check your inbox for the verification link",
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to send verification email. Please try again later",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsDeleting(true);
      // Delete account
      await axios.delete("/api/user/delete-account");

      // If deletion is successful, redirect to logout
      router.push("/logout");
    } catch (error) {
      console.error("Error during logout/deletion:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to format remaining time
  const formatRemainingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Sheet open={isVisible} modal={true}>
      <style jsx global>{`
        [data-overlay-wrapper] {
          background: linear-gradient(
            to bottom,
            transparent,
            white 50%
          ) !important;
          backdrop-filter: blur(8px) !important;
        }

        .dark [data-overlay-wrapper] {
          background: linear-gradient(
            to bottom,
            transparent,
            rgb(17, 24, 39) 50%
          ) !important;
        }
      `}</style>
      <SheetContent
        side='bottom'
        className='h-auto border-t-0 px-4 pb-8 sm:px-6 md:max-w-4xl md:mx-auto md:rounded-t-3xl'
        style={{
          animation: "slideUp 0.3s ease-out",
        }}>
        {/* Pull indicator */}
        <div className='mx-auto mt-2 h-1.5 w-12 shrink-0 rounded-full bg-muted' />

        {/* Content Container */}
        <div className='mx-auto mt-6 sm:mt-8 max-w-md'>
          <div className='flex flex-col items-center text-center'>
            {/* Icon */}
            <div className='rounded-full bg-primary/10 p-3 sm:p-4 text-primary'>
              <Mail className='h-6 w-6 sm:h-8 sm:w-8' />
            </div>

            {/* Title & Description */}
            <SheetTitle className='mt-4 text-lg sm:text-xl font-semibold'>
              Verify your email address
            </SheetTitle>
            <SheetDescription className='mt-2 text-sm sm:text-base leading-normal text-muted-foreground max-w-sm'>
              We&apos;ve sent a verification link to{" "}
              <span className='font-medium text-foreground'>
                {userEmail || "your email address"}
              </span>
              . Please check your inbox and verify your account to unlock all
              features.
            </SheetDescription>

            {/* Actions */}
            <div className='mt-6 flex w-full flex-col gap-3'>
              <Button
                size='lg'
                className='w-full'
                onClick={handleVerifyEmail}
                disabled={isResending || cooldownRemaining > 0}>
                {isResending
                  ? "Sending..."
                  : cooldownRemaining > 0
                  ? `Resend available in ${formatRemainingTime(
                      cooldownRemaining
                    )}`
                  : "Resend verification email"}
              </Button>
              <Button
                variant='outline'
                size='lg'
                className='w-full'
                onClick={() => window.location.reload()}>
                I&apos;ve verified my email
              </Button>
              <Button
                variant='ghost'
                size='lg'
                className='w-full text-destructive hover:text-destructive'
                onClick={() => handleLogout()}
                disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Loading...
                  </>
                ) : (
                  "This email is incorrect"
                )}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default EmailVerificationSheet;
