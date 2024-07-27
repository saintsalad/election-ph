"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { navigation } from "@/lib/app-settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import type { User as FirebaseUser } from "@firebase/auth";

// Define the User type based on Firebase User properties
type User = {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
};

type NavigationItem = {
  route: string;
  label: string;
};

const MobileNav: React.FC<{ user: User | null }> = ({ user }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size={"icon"}>
          <HamburgerMenuIcon className='h-5 w-5' />
        </Button>
      </SheetTrigger>
      <SheetContent className='w-64 pt-12'>
        <SheetTitle hidden></SheetTitle>
        <SheetDescription hidden></SheetDescription>
        {user && (
          <div className='flex flex-1 flex-col items-center bg-slate-50 mb-3 py-3.5 rounded-lg'>
            <Avatar className='border h-11 w-11'>
              <AvatarImage src={user.photoURL || ""} alt='user picture 🤣' />
              <AvatarFallback>
                {user.displayName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='text-base font-semibold mt-2'>
              {user.displayName}
            </div>
            <div className='text-xs'>{user.email}</div>
          </div>
        )}
        <div className='flex flex-1 flex-col items-end gap-y-1'>
          {navigation.map((item, i) => (
            <SheetTrigger key={i} asChild>
              <Link
                href={item.route}
                className={`${
                  item.route === "/logout" ? "text-red-500" : "text-slate-500 "
                } text-right pr-3 text-base font-base w-full p-1 rounded-md hover:bg-slate-100`}>
                {item.label}
              </Link>
            </SheetTrigger>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const DesktopNav: React.FC<{ user: User | null; desiredPath: string }> = ({
  user,
  desiredPath,
}) => (
  <nav className='justify-around items-center h-14 gap-x-9 hidden sm:flex'>
    {navigation.map((item, i) =>
      item.route !== "/logout" ? (
        <Link
          key={i}
          href={item.route}
          className={`${
            desiredPath === item.route && "text-slate-800 font-semibold"
          } flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground`}>
          {item.label}
        </Link>
      ) : (
        user && (
          <Link key={i} href='/logout'>
            <Avatar className='border h-6 w-6'>
              <AvatarImage src={user.photoURL || ""} alt='user picture 🤣' />
              <AvatarFallback>
                {user.displayName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        )
      )
    )}
  </nav>
);

function MainHeader() {
  const user = useAuthStore((state) => state.user) as FirebaseUser | null;
  const pathname = usePathname();
  const pathParts = pathname?.split("/");
  const desiredPath = pathParts ? `/${pathParts[1]}` : "";

  // Ensure user matches the defined User type
  const userProps: User | null = user
    ? {
        photoURL: user.photoURL,
        displayName: user.displayName,
        email: user.email,
      }
    : null;

  return (
    <div className='fixed top-0 left-0 z-50 w-full border-b sm:border-0 px-3 border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-11 items-center justify-between px-0 max-w-5xl'>
        <Link href='/' className='flex items-center gap-2' prefetch={false}>
          <span className='text-base font-medium'>Election PH</span>
        </Link>
        <DesktopNav user={userProps} desiredPath={desiredPath} />
        <nav className='sm:hidden'>
          <MobileNav user={userProps} />
        </nav>
      </div>
    </div>
  );
}

export default MainHeader;
