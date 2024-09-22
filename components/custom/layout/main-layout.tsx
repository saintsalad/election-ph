"use client";

import { useEffect, useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import MainHeader from "@/components/custom/layout/main-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navigation } from "@/lib/app-settings";
import { useAuthStore } from "@/lib/store";
import { auth } from "@/lib/firebase";
import { NavigationProps } from "@/lib/definitions";

const queryClient = new QueryClient();

function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const setUser = useAuthStore((state) => state.setUser);
  const pathname = usePathname();

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
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className='flex-1 flex flex-col content-between bg-slate-50 h-full'>
        {/* TODO: improve this */}
        {!(desiredPath === "/signin" || desiredPath === "/signup") && (
          <MainHeader />
        )}
        <ScrollArea
          id='main-layout-scroll-area'
          className={`h-full w-full self-center ${
            currentNavItem && !currentNavItem.isFullWidth ? "max-w-5xl" : ""
          }`}>
          {children}
        </ScrollArea>
      </div>
    </QueryClientProvider>
  );
}

export default MainLayout;
