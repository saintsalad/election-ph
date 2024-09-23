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
import { Separator } from "@/components/ui/separator";

// Define the User type based on Firebase User properties
type User = {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
};

const MobileNav: React.FC<{ user: User | null; desiredPath: string }> = ({
  user,
  desiredPath,
}) => {
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
        <div className='flex flex-col gap-y-4'>
          {navigation
            .filter((item) => !item.isHidden && item.route !== "/logout")
            .map((item, i) => (
              <div key={i}>
                {item.children ? (
                  <div className='space-y-2'>
                    <div className='text-sm font-semibold text-slate-500'>
                      {item.label}
                    </div>
                    {item.children.map((child, childIndex) => (
                      <SheetTrigger key={childIndex} asChild>
                        <Link
                          href={child.route}
                          className={`block text-sm pl-4 ${
                            desiredPath === child.route
                              ? "font-semibold text-primary"
                              : "text-slate-700"
                          }`}>
                          {child.label}
                        </Link>
                      </SheetTrigger>
                    ))}
                  </div>
                ) : (
                  <SheetTrigger asChild>
                    <Link
                      href={item.route}
                      className={`block text-sm ${
                        desiredPath === item.route
                          ? "font-semibold text-primary"
                          : "text-slate-700"
                      }`}>
                      {item.label}
                    </Link>
                  </SheetTrigger>
                )}
              </div>
            ))}
        </div>
        {user && (
          <>
            <Separator className='my-4' />
            <div className='space-y-2'>
              <div className='text-sm font-semibold text-slate-500'>
                Account
              </div>
              <SheetTrigger asChild>
                <Link
                  href='/profile'
                  className={`block text-sm pl-4 ${
                    desiredPath === "/profile"
                      ? "font-semibold text-primary"
                      : "text-slate-700"
                  }`}>
                  Profile
                </Link>
              </SheetTrigger>
              <SheetTrigger asChild>
                <Link
                  href='/settings'
                  className={`block text-sm pl-4 ${
                    desiredPath === "/settings"
                      ? "font-semibold text-primary"
                      : "text-slate-700"
                  }`}>
                  Settings
                </Link>
              </SheetTrigger>
              <SheetTrigger asChild>
                <Link
                  href='/logout'
                  className='block text-sm pl-4 text-red-500'>
                  Logout
                </Link>
              </SheetTrigger>
            </div>
          </>
        )}
        {user && (
          <div className='absolute bottom-8 left-6 flex items-center space-x-3'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user.photoURL || ""} alt='User avatar' />
              <AvatarFallback>
                {user.displayName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='text-sm font-medium'>{user.displayName}</div>
          </div>
        )}
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
            <DropdownMenu key={i}>
              <DropdownMenuTrigger asChild>
                <Button
                  size='icon'
                  variant='ghost'
                  className='relative h-6 w-6 rounded-full'>
                  <Avatar className='h-6 w-6'>
                    <AvatarImage src={user.photoURL || ""} alt='User avatar' />
                    <AvatarFallback>
                      {user.displayName?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem asChild>
                  <Link href='/profile'>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/settings'>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href='/logout' className='text-red-500'>
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        if (item.children) {
          return (
            <DropdownMenu key={i}>
              <DropdownMenuTrigger className='flex items-center text-sm  gap-1 text-slate-950 hover:text-slate-800'>
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
            className={`flex flex-col items-center text-sm gap-1 text-slate-950 hover:text-slate-800 ${
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
          <MobileNav user={userProps} desiredPath={desiredPath} />
        </nav>
      </div>
    </div>
  );
}

export default MainHeader;
