"use client";

import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import FullscreenLoader from "@/components/custom/fullscreen-loader";
import { handleLogout } from "@/lib/firebase/functions";

function Logout() {
  const router = useRouter();

  const handleOnLogout = useCallback(() => {
    auth
      .signOut()
      .then(async () => {
        await handleLogout();
      })
      .finally(() => router.push("/signin"));
  }, [router]);

  useEffect(() => {
    handleOnLogout();
  }, [handleOnLogout]);

  return <FullscreenLoader />;
}

export default Logout;
