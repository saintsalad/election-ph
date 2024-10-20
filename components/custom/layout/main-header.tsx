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
import {
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  SunIcon,
  MoonIcon,
  LogIn,
} from "lucide-react";
import { useTheme } from "next-themes";

// Define the User type based on Firebase User properties
type User = {
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
};

const MobileNav: React.FC<{
  user: User | null;
  desiredPath: string;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}> = ({ user, desiredPath, isDarkMode, onThemeToggle }) => {
  const textColorClass = isDarkMode ? "text-gray-200" : "text-gray-800";
  const hoverTextColorClass = isDarkMode
    ? "hover:text-white"
    : "hover:text-gray-900";
  const bgColorClass = isDarkMode
    ? "bg-gradient-to-br from-gray-900/90 to-gray-800/90"
    : "bg-white/80";
  const hoverBgColorClass = isDarkMode
    ? "hover:bg-gray-700/70"
    : "hover:bg-white/90";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size={"icon"}>
          <HamburgerMenuIcon
            className={`h-5 w-5 ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          />
        </Button>
      </SheetTrigger>
      <SheetContent className={`w-64 pt-12 ${bgColorClass} backdrop-blur-xl`}>
        <SheetTitle hidden></SheetTitle>
        <SheetDescription hidden></SheetDescription>
        <div className='flex flex-col gap-y-4'>
          {navigation
            .filter((item) => !item.isHidden && item.route !== "/logout")
            .map((item, i) => (
              <div key={i}>
                {item.label === "Account" && (
                  <Separator
                    className={`mb-4 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    }`}
                  />
                )}
                {item.children ? (
                  <div className='space-y-2'>
                    <div
                      className={`text-xs uppercase font-semibold ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}>
                      {item.label}
                    </div>
                    {item.children.map((child, childIndex) => (
                      <SheetTrigger key={childIndex} asChild>
                        <Link
                          href={child.route}
                          className={`block text-base pl-4 ${
                            desiredPath === child.route
                              ? `font-semibold ${
                                  isDarkMode ? "text-blue-400" : "text-blue-600"
                                }`
                              : child.route === "/logout"
                              ? "text-red-500"
                              : textColorClass
                          } ${hoverTextColorClass}`}>
                          {child.label}
                        </Link>
                      </SheetTrigger>
                    ))}
                  </div>
                ) : (
                  <SheetTrigger asChild>
                    <Link
                      href={item.route}
                      className={`block text-base ${
                        desiredPath === item.route
                          ? `font-semibold ${
                              isDarkMode ? "text-blue-400" : "text-blue-600"
                            }`
                          : textColorClass
                      } ${hoverTextColorClass}`}>
                      {item.label}
                    </Link>
                  </SheetTrigger>
                )}
              </div>
            ))}
        </div>

        <div className='absolute bottom-8 left-6 right-6 space-y-4'>
          <Button
            size='sm'
            variant='ghost'
            onClick={onThemeToggle}
            className={`w-full justify-start ${hoverBgColorClass} ${textColorClass}`}>
            {isDarkMode ? (
              <>
                <SunIcon className='mr-2 h-4 w-4 text-yellow-200' />
                Light
              </>
            ) : (
              <>
                <MoonIcon className='mr-2 h-4 w-4 text-blue-500' />
                Dark
              </>
            )}
          </Button>

          {user && (
            <div
              className={`flex items-center space-x-3 ${
                isDarkMode ? "bg-gray-800/50" : "bg-white/90"
              } rounded-full p-2`}>
              <Avatar className='h-10 w-10 border-2 border-white shadow-sm'>
                <AvatarImage src={user.photoURL || ""} alt='User avatar' />
                <AvatarFallback
                  className={`${
                    isDarkMode ? "bg-blue-600" : "bg-blue-500"
                  } text-white`}>
                  {user.displayName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={`text-sm font-semibold ${textColorClass}`}>
                {user.displayName}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const DesktopNav: React.FC<{
  user: User | null;
  desiredPath: string;
  isHomePage: boolean;
  isDarkMode: boolean;
}> = ({ user, desiredPath, isHomePage, isDarkMode }) => {
  const textColorClass = isDarkMode ? "text-gray-300" : "text-gray-700";
  const hoverTextColorClass = isDarkMode
    ? "hover:text-white"
    : "hover:text-gray-900";
  const bgColorClass = isDarkMode ? "bg-gray-800/30" : "bg-white/10";
  const hoverBgColorClass = isDarkMode
    ? "hover:bg-gray-700/50"
    : "hover:bg-white/20";

  return (
    <nav className='hidden md:flex items-center justify-center'>
      <div
        className={`${
          isHomePage ? bgColorClass : "bg-transparent"
        } backdrop-blur-md rounded-full px-2 py-1 flex items-center space-x-1 transition-colors duration-300`}>
        {navigation
          .filter((item) => !item.isHidden && item.label !== "Account")
          .map((item, i) => {
            if (item.children) {
              return (
                <DropdownMenu key={i}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size='sm'
                      variant='ghost'
                      className={`rounded-full h-8 px-3 text-sm font-medium ${textColorClass} ${
                        isHomePage
                          ? hoverBgColorClass
                          : isDarkMode
                          ? "hover:bg-gray-700/50"
                          : "hover:bg-white/90"
                      } ${hoverTextColorClass} transition-colors`}>
                      {item.label}
                      <ChevronDownIcon className='ml-1 h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={`w-56 rounded-xl ${
                      isDarkMode ? "bg-gray-800/95" : "bg-white/95"
                    } backdrop-blur-lg`}>
                    {item.children.map((child, childIndex) => (
                      <DropdownMenuItem key={childIndex} asChild>
                        <Link
                          href={child.route}
                          className={`w-full flex items-center ${
                            desiredPath === child.route
                              ? "font-semibold text-blue-400"
                              : isDarkMode
                              ? "text-gray-300"
                              : "text-gray-700"
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
              <Button
                key={i}
                asChild
                size='sm'
                variant='ghost'
                className={`rounded-full h-8 px-3 text-sm font-medium ${
                  desiredPath === item.route
                    ? isDarkMode
                      ? `bg-gray-700/60 text-white font-semibold`
                      : `bg-white/40 text-gray-900 font-semibold`
                    : `${textColorClass} ${
                        isHomePage
                          ? hoverBgColorClass
                          : isDarkMode
                          ? "hover:bg-gray-700/50"
                          : "hover:bg-white/90"
                      } ${hoverTextColorClass}`
                } transition-colors`}>
                <Link href={item.route}>{item.label}</Link>
              </Button>
            );
          })}
      </div>
    </nav>
  );
};

function MainHeader() {
  const user = useAuthStore((state) => state.user) as FirebaseUser | null;
  const pathname = usePathname();
  const pathParts = pathname?.split("/");
  const desiredPath = pathParts ? `/${pathParts[1]}` : "";
  const { theme, setTheme } = useTheme();
  const isHomePage = desiredPath === "/" || desiredPath === "";

  const userProps: User | null = user
    ? {
        photoURL: user.photoURL,
        displayName: user.displayName,
        email: user.email,
      }
    : null;

  const isDarkMode = theme === "dark";

  const textColorClass = isDarkMode ? "text-gray-200" : "text-gray-800";
  const hoverTextColorClass = isDarkMode
    ? "hover:text-white"
    : "hover:text-gray-900";
  const bgColorClass = isDarkMode
    ? "bg-gradient-to-r from-gray-900/80 to-gray-800/80"
    : "bg-white/60";
  const hoverBgColorClass = isDarkMode
    ? "hover:bg-gray-700/70"
    : "hover:bg-white/70";

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header
      className={`fixed top-0 z-50 w-full shadow-lg border-b ${
        isDarkMode ? "border-gray-700/30" : "border-gray-200/20"
      } ${bgColorClass} backdrop-blur-xl transition-colors duration-300`}>
      <div className='container max-w-7xl mx-auto px-4 sm:px-6 lg:px-0'>
        <div className='flex h-16 items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <Image
              src={logo}
              alt='Election PH Logo'
              width={32}
              height={32}
              className='rounded-full'
            />
            <span className={`text-lg font-semibold ${textColorClass}`}>
              Election PH
            </span>
          </Link>

          <DesktopNav
            user={userProps}
            desiredPath={desiredPath}
            isHomePage={isHomePage}
            isDarkMode={isDarkMode}
          />

          <div className='flex items-center space-x-4'>
            {/* Desktop theme toggle button and user dropdown */}
            <div className='hidden md:flex items-center space-x-4'>
              <Button
                size='sm'
                variant='ghost'
                className={`rounded-full h-8 w-8 p-0 ${hoverBgColorClass}`}
                onClick={toggleTheme}>
                <SunIcon className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500' />
                <MoonIcon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500' />
                <span className='sr-only'>Toggle theme</span>
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size='sm'
                      variant='ghost'
                      className={`rounded-full h-8 px-2 text-sm font-medium ${textColorClass} ${hoverBgColorClass} ${hoverTextColorClass} transition-colors flex gap-x-2`}>
                      <Avatar className='h-6 w-6'>
                        <AvatarImage
                          src={user.photoURL || ""}
                          alt='User avatar'
                        />
                        <AvatarFallback>
                          {user.displayName?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className='hidden lg:inline'>
                        {user.displayName}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='w-56 rounded-xl bg-white/90 backdrop-blur-lg'>
                    <DropdownMenuItem asChild>
                      <Link href='/profile' className='flex items-center'>
                        <UserIcon className='mr-2 h-4 w-4' />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href='/settings' className='flex items-center'>
                        <SettingsIcon className='mr-2 h-4 w-4' />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href='/logout'
                        className='flex items-center text-red-500'>
                        <LogOutIcon className='mr-2 h-4 w-4' />
                        <span>Logout</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  size='default'
                  className={`
                    relative overflow-hidden
                    rounded-full px-6 py-2 text-base font-semibold text-white
                    transition-all duration-300 ease-out animate-gradient
                    ${
                      isDarkMode
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    }
                    shadow-lg hover:shadow-xl
                    group
                  `}>
                  <Link href='/signin' className='flex items-center'>
                    <span className='relative z-10 mr-2'>Login</span>
                    <LogIn className='relative z-10 h-5 w-5' />
                    <span className='absolute inset-0 h-full w-full scale-0 rounded-full bg-white opacity-10 transition-all duration-500 group-hover:scale-100'></span>
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile navigation */}
            <div className='md:hidden'>
              <MobileNav
                user={userProps}
                desiredPath={desiredPath}
                isDarkMode={isDarkMode}
                onThemeToggle={toggleTheme}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default MainHeader;
