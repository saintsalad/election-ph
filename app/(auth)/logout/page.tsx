"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

function Logout() {
  const router = useRouter();

  const handleOnLogout = useCallback(() => {
    auth
      .signOut()
      .then(() => {
        router.push("/signin");
      })
      .catch(() => router.push("/"));
  }, [router]);

  handleOnLogout();

  return <div>Logging out ...</div>;
}

export default Logout;
