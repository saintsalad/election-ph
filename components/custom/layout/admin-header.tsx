import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/custom/layout/admin-mobile-sidebar";
import { UserNav } from "@/components/custom/layout/admin-user-nav";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/images/logo.png";

export default function Header() {
  return (
    <div className='supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur'>
      <nav className='flex h-14 items-center justify-between px-4'>
        <div className='hidden lg:block'>
          <Link href={"#"} target='_blank'>
            <Image
              src={logo}
              alt='Election PH Logo'
              width={32}
              height={32}
              className='rounded-full'
            />
          </Link>
        </div>
        <div className={cn("block md:!hidden")}>
          <MobileSidebar />
        </div>

        <div className='flex items-center gap-2'>
          <UserNav />
        </div>
      </nav>
    </div>
  );
}
