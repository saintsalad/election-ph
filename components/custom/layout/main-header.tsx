import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { navigation } from "@/lib/app-settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function MainHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className='fixed top-0 left-0 z-50 w-full bg-background border-b sm:border-0 px-3 '>
      <div className='container mx-auto flex h-11 items-center justify-between px-0 max-w-5xl sm:border-b'>
        <Link href='/' className='flex items-center gap-2' prefetch={false}>
          <span className='text-base font-medium'>Election PH</span>
        </Link>
        <nav className='justify-around items-center h-14 gap-x-9 hidden sm:flex'>
          {navigation &&
            navigation.map((item, i) => (
              <>
                {item.route !== "/logout" ? (
                  <Link
                    key={i}
                    href={item.route}
                    className='flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground'>
                    {item.label}
                  </Link>
                ) : (
                  <Link href={"/logout"}>
                    <Avatar className='border h-6 w-6'>
                      <AvatarImage
                        src={user?.photoURL || ""}
                        alt='user picture 🤣'
                      />
                      <AvatarFallback>
                        {user?.displayName
                          ?.toString()
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                )}
              </>
            ))}
        </nav>

        <nav className='sm:hidden'>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size={"icon"}>
                <HamburgerMenuIcon className='h-5 w-5 ' />
              </Button>
            </SheetTrigger>
            <SheetContent className='w-64 pt-12'>
              <SheetTitle hidden></SheetTitle>
              <SheetDescription hidden></SheetDescription>
              <div className='flex flex-1 flex-col items-center bg-slate-100 mb-3 py-3.5 rounded-lg '>
                <Avatar className='border h-11 w-11'>
                  <AvatarImage
                    src={user?.photoURL || ""}
                    alt='user picture 🤣'
                  />
                  <AvatarFallback>
                    {user?.displayName?.toString().slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='text-base font-semibold mt-2'>
                  {user?.displayName}
                </div>
                <div className='text-xs'>{user?.email}</div>
              </div>
              <div className='flex flex-1 flex-col items-end gap-y-1'>
                {navigation &&
                  navigation.map((item, i) => (
                    <SheetTrigger key={i} asChild>
                      <Link
                        href={item.route}
                        className={`${
                          item.route === "/logout"
                            ? "text-red-500 hover:bg-red-100"
                            : "text-slate-500 hover:bg-slate-100"
                        } text-right pr-3 text-base font-base  w-full p-1 rounded-md `}>
                        {item.label}
                      </Link>
                    </SheetTrigger>
                  ))}
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}

export default MainHeader;
