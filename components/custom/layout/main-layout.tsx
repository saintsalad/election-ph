"use client";

import { useEffect } from "react";
import MainHeader from "@/components/custom/layout/main-header";
import MainNavigation from "@/components/custom/layout/main-navigation";
import { navigation } from "@/lib/app-settings";
import { useAuthStore } from "@/lib/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { usePathname } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  const pathname = usePathname();
  const pathParts = pathname?.split("/");
  const desiredPath = pathParts ? `/${pathParts[1]}` : "";
  const isNavRoute = navigation.some((nav) => nav.route === desiredPath);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (!isNavRoute) {
    return <>{children}</>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className='flex-1 flex flex-col content-between bg-[#F2F2F7] h-full'>
        <MainHeader />
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_right,white,transparent,white)] "
          )}
        />

        <ScrollArea
          id='main-layout-scroll-area'
          className={`h-full  w-full self-center ${
            desiredPath !== "/" ? "max-w-5xl" : ""
          }`}>
          {children}
        </ScrollArea>

        {/* <MainNavigation navigations={navigation} /> */}
      </div>
    </QueryClientProvider>
  );
}

export default MainLayout;
