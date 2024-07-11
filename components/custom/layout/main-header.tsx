import Link from "next/link";
import { useAuthStore } from "@/lib/store";

function MainHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className='fixed top-0 left-0 z-50 w-full bg-background border-b sm:border-0 px-3 '>
      <div className='container mx-auto flex h-11 items-center justify-between px-0 max-w-5xl sm:border-b'>
        <Link href='/' className='flex items-center gap-2' prefetch={false}>
          <span className='text-base font-medium'>Election PH</span>
        </Link>
        <nav className='justify-around items-center h-14 gap-x-10 hidden sm:flex'>
          <Link
            href='/'
            className='flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground'
            prefetch={false}>
            Home
          </Link>
          <Link
            href='/vote'
            className='flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground'
            prefetch={false}>
            Vote
          </Link>
          <Link
            href='/candidate'
            className='flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground'
            prefetch={false}>
            Candidates
          </Link>
          <Link
            href='/about'
            className='flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground'
            prefetch={false}>
            About
          </Link>

          <Link
            href='/logout'
            className='flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground'
            prefetch={false}>
            Logout
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default MainHeader;
