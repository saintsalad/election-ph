"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import { Auth, onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Mail, CheckCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserResponse } from "@/lib/definitions";
import { decrypt } from "@/lib/light-encrypt";

async function fetchUserInfo(userId: string): Promise<UserResponse> {
  const response = await fetch(`/api/user/info?userId=${decrypt(userId)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }
  return response.json();
}

function SignUpSuccessContent() {
  const [isWaiting, setIsWaiting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("verificationId") || "";

  const {
    data: userInfo,
    isLoading,
    isError,
  } = useQuery<UserResponse>({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUserInfo(userId || ""),
    enabled: !!userId,
    onSuccess: async (data) => {
      if (data.email && auth.currentUser && !auth.currentUser.emailVerified) {
        try {
          await sendEmailVerification(auth.currentUser);
          setVerificationSent(true);
        } catch (error) {
          console.error("Error sending verification email:", error);
        }
      }
    },
  });

  const handleStartWaiting = async () => {
    setIsWaiting(true);
    try {
      await waitForEmailVerification(auth);
      router.push("/");
    } catch (error) {
      console.error("Error during email verification:", error);
    } finally {
      setIsWaiting(false);
    }
  };

  const waitForEmailVerification = async (auth: Auth) => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          user.reload().then(() => {
            if (user.emailVerified) {
              unsubscribe();
              resolve(true);
            }
          });
        } else {
          unsubscribe();
          reject(new Error("No user is signed in."));
        }
      });

      const intervalId = setInterval(() => {
        if (auth.currentUser) {
          auth.currentUser.reload().then(() => {
            if (auth?.currentUser?.emailVerified) {
              clearInterval(intervalId);
              unsubscribe();
              resolve(true);
            }
          });
        } else {
          clearInterval(intervalId);
          unsubscribe();
          reject(new Error("No user is signed in."));
        }
      }, 5000);
    });
  };

  if (isLoading) {
    return <div>Loading user information...</div>;
  }

  if (isError || !userId || !userInfo?.email) {
    return (
      <div>Error: Unable to verify user information. Please try again.</div>
    );
  }

  return (
    <div className='flex min-h-[100dvh] flex-col items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-lg text-center'>
        <div className='mb-8 flex justify-center'>
          <div className='rounded-full bg-primary/10 p-3'>
            <Mail className='h-12 w-12 text-primary' />
          </div>
        </div>
        <h1 className='mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
          Verify Your Email
        </h1>
        <p className='mb-8 text-lg text-gray-600'>
          {verificationSent
            ? `We've sent a verification link to ${userInfo.email}. Please check your inbox and click the link to confirm your account.`
            : "We're preparing to send you a verification email. Please wait..."}
        </p>
        <div className='space-y-4'>
          <Button
            onClick={handleStartWaiting}
            disabled={isWaiting}
            className='w-full max-w-xs'>
            {isWaiting ? (
              <>
                <LoaderCircle className='mr-2 h-5 w-5 animate-spin' />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className='mr-2 h-5 w-5' />
                I&apos;ve Verified My Email
              </>
            )}
          </Button>
          <p className='text-sm text-gray-500'>
            Didn&apos;t receive the email? Check your spam folder or try again
            later.
          </p>
          <Link
            href='/'
            className={cn(
              "inline-flex items-center justify-center text-sm font-medium text-primary transition-colors hover:text-primary/80",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}>
            Verify Later
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpSuccessContent;
