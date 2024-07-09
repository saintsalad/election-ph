"use client";

import { Button } from "@/components/ui/button";
import { signInWithGooglePopup } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import FullscreenLoader from "@/components/custom/fullscreen-loader";

const Signup = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);

  const router = useRouter();

  // useEffect(() => {
  //   if (user) {
  //     router.push("/");
  //   }
  // }, [user, router]);

  const handleGoogleSignin = async () => {
    const response = await signInWithGooglePopup();

    setUser(response.user);
    console.log("handleGoogleSignin", response);
  };

  // if (user) {
  //   return <FullscreenLoader />;
  // }

  return (
    <div>
      <Button onClick={() => handleGoogleSignin()}>Google Sign in</Button>
    </div>
  );
};

export default Signup;
