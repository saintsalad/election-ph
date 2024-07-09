"use client";

import { useEffect } from "react";
import MainHeader from "@/components/custom/layout/main-header";
import MainNavigation from "@/components/custom/layout/main-navigation";
import { navigation } from "@/lib/app-settings";
import { useAuthStore } from "@/lib/store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { usePathname, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/hoc/protected-route";
import { ScrollArea } from "@/components/ui/scroll-area";

function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const setLoading = useAuthStore((state) => state.setLoading);

  const router = useRouter();
  const pathname = usePathname();
  const pathParts = pathname?.split("/");
  const desiredPath = pathParts ? `/${pathParts[1]}` : "";
  const isNavRoute = navigation.some((nav) => nav.route === desiredPath);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (!isNavRoute) {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute>
      <ScrollArea>
        <div className='flex-1 flex flex-col-reverse content-between'>
          <MainHeader />

          <div className='flex flex-1 pt-11 w-full max-w-5xl self-center'>
            {children}
          </div>

          <MainNavigation navigations={navigation} />
        </div>
      </ScrollArea>
    </ProtectedRoute>
  );
}

export default MainLayout;
