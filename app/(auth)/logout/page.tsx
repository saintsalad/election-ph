"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import FullscreenLoader from "@/components/custom/fullscreen-loader";
import { handleLogout } from "@/lib/firebase/functions";

function Logout() {
  const router = useRouter();

  const handleOnLogout = useCallback(() => {
    auth
      .signOut()
      .then(async () => {
        await handleLogout();
        router.push("/signin");
      })
      .catch(() => router.push("/"));
  }, [router]);

  handleOnLogout();

  return <FullscreenLoader />;
}

export default Logout;
