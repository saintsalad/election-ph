"use client";

import { useEffect, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from "next-themes";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

import MainHeader from "@/components/custom/layout/main-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navigation } from "@/lib/app-settings";
import { useAuthStore } from "@/lib/store";
import { auth } from "@/lib/firebase";
import { NavigationProps } from "@/lib/definitions";
import EmailVerificationSheet from "@/components/custom/email-verification-sheet";

const queryClient = new QueryClient();

const publicRoutes = [
  "/",
  "/signin",
  "/signup",
  "/signup/success",
  "/about",
  "/roadmap",
];

function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { theme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const loading = useAuthStore((state) => state.loading);
  const pathname = usePathname();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const router = useRouter();

  const { currentNavItem, desiredPath } = useMemo(() => {
    const pathParts = pathname?.split("/");
    const desiredPath = pathParts ? `/${pathParts[1]}` : "";

    const currentNavItem: NavigationProps | undefined =
      navigation.find((nav) => nav.route === desiredPath) ||
      navigation
        .flatMap((nav) => nav.children || [])
        .find((child) => child.route === desiredPath);

    return { currentNavItem, desiredPath };
  }, [pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsEmailVerified(user?.emailVerified || false);

      const isPublicRoute = publicRoutes.includes(desiredPath);

      if (!user && !isPublicRoute) {
        router.push("/signin");
      } else if (user && !user.emailVerified && desiredPath !== "/") {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [setUser, desiredPath, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`flex-1 flex flex-col content-between ${
          theme === "dark" ? "bg-gray-900" : "bg-slate-50"
        } h-full`}>
        {!(
          desiredPath === "/signin" ||
          desiredPath === "/signup" ||
          desiredPath === "/logout" ||
          desiredPath === "/master"
        ) && <MainHeader />}
        <ScrollArea
          id='main-layout-scroll-area'
          className={`h-full w-full self-center ${
            currentNavItem && !currentNavItem.isFullWidth ? "max-w-5xl" : ""
          }`}>
          {!user && !publicRoutes.includes(desiredPath) ? (
            <div className='h-full w-full flex items-center justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : (
            children
          )}
        </ScrollArea>

        {user && !isEmailVerified && <EmailVerificationSheet />}
      </div>
    </QueryClientProvider>
  );
}

export default MainLayout;
