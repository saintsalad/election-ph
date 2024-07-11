"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store"; // Adjust the import path

// Define the type for the props of the wrapped component
type WithGuestRedirectProps = {
  // Define additional props if needed
};

// Define the HOC
const withGuestRedirect = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  redirectPath: string = "/"
) => {
  const WithGuestRedirect: React.FC<P> = (props) => {
    const user = useAuthStore((state) => state.user);
    const setisLoading = useAuthStore((state) => state.setLoading);
    const router = useRouter();

    useEffect(() => {
      setisLoading(true);

      if (user) {
        router.push(redirectPath);
      }
    }, [user, router, setisLoading]);

    // If user is authenticated, render nothing or a loading spinner, etc.
    if (user) {
      return null; // Or a loading spinner, etc.
    }

    // Otherwise, render the wrapped component
    return <WrappedComponent {...(props as P)} />;
  };

  return WithGuestRedirect;
};

export default withGuestRedirect;
