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
import Image from "next/image";
import logo from "@/public/images/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";

// Define the User type based on Firebase User properties
type User = {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
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
    {navigation
      .filter((item) => !item.isHidden)
      .map((item, i) => {
        if (item.route === "/logout" && user) {
          return (
            <Link key={i} href='/logout'>
              <Avatar className='border h-6 w-6'>
                <AvatarImage src={user.photoURL || ""} alt='User avatar' />
                <AvatarFallback>
                  {user.displayName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          );
        }

        if (item.children) {
          return (
            <DropdownMenu key={i}>
              <DropdownMenuTrigger className='flex items-center gap-1 text-slate-950 hover:text-slate-800'>
                {item.label}
                <ChevronDownIcon className='h-4 w-4' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {item.children.map((child, childIndex) => (
                  <DropdownMenuItem key={childIndex} asChild>
                    <Link
                      href={child.route}
                      className={`w-full ${
                        desiredPath === child.route ? "font-semibold" : ""
                      }`}>
                      {child.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <Link
            key={i}
            href={item.route}
            className={`flex flex-col items-center gap-1 text-slate-950 hover:text-slate-800 ${
              desiredPath === item.route ? "font-semibold" : ""
            }`}>
            {item.label}
          </Link>
        );
      })}
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
    <div className='absolute top-0 z-50 w-full shadow-lg border-b sm:border-0 px-5 border-border/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/30 self-center lg:max-w-5xl lg:rounded-full lg:mt-3 lg:overflow-hidden'>
      <div className='container mx-auto flex h-11 items-center justify-between px-0'>
        <Link href='/' className='flex items-center gap-2'>
          <Image
            src={logo}
            alt='Election PH Logo'
            width={24}
            height={24}
            className='rounded-full mr-1'
          />
          <span className='text-base text-slate-950 font-medium'>
            Election PH
          </span>
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
