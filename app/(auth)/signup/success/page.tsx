"use client";

import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import withGuestRedirect from "@/components/hoc/with-guess-redirect";

function SignUpSucces() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    const referrer = document.referrer;
    const expectedReferrer = "http://localhost:3000/signup";

    if (referrer !== expectedReferrer) {
      router.push("/not-found"); // or any other page you want to redirect to
    }
  }, [router]);

  return <div>SignUpSucces</div>;
}

export default withGuestRedirect(SignUpSucces);
