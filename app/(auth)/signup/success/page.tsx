"use client";

import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Auth, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import FullscreenLoader from "@/components/custom/fullscreen-loader";
import { LoaderCircle } from "lucide-react";

function SignUpSucces() {
  const user = useAuthStore((state) => state.user);
  const [isWaiting, setIsWaiting] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/signin");
  //   } else if (user?.emailVerified) {
  //     router.push("/not-found");
  //   }
  // }, [router, user]);

  const handleStartWaiting = async () => {
    setIsWaiting(true);
    try {
      await waitForEmailVerification(auth);
      router.push("/"); // Redirect to a protected route after email is verified
    } catch (error) {
      console.error(error);
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

      // Polling every 5 seconds to check if the email is verified
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

  if (!user) {
    return <FullscreenLoader />;
  }

  return (
    <>
      {!user?.emailVerified && (
        <div className='flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-md space-y-6 text-center'>
            <div className='flex items-center justify-center'>
              <CodeIcon className='h-8 w-auto' />
              <span className='sr-only'>Vercel</span>
            </div>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
                Verify your email
              </h1>
              <p className='text-muted-foreground text-base'>
                We&#39;ve sent a verification link to {user.email}. Please click
                the link to confirm your identity.
              </p>
            </div>
            <Button
              disabled={isWaiting}
              onClick={() => handleStartWaiting()}
              type='button'
              className='w-60'>
              {isWaiting ? (
                <LoaderCircle size={20} className='animate-spin mr-2' />
              ) : (
                "Sure!"
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUpSucces;

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'>
      <polyline points='16 18 22 12 16 6' />
      <polyline points='8 6 2 12 8 18' />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'>
      <path d='M18 6 6 18' />
      <path d='m6 6 12 12' />
    </svg>
  );
}
