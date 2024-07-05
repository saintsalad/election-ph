import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Vote() {
  return (
    <div className='p-3 flex-1 space-y-5 w-full'>
      <div className='bg-red-100 rounded-lg p-5 min-h-44 flex flex-col justify-center items-center'>
        <h2 className='pb-2 text-3xl font-bold tracking-tight'>Presidential</h2>
        <Link href='/vote/presidential'>
          <Button>Get Started</Button>
        </Link>
      </div>

      <div className='bg-red-100 rounded-lg p-5 min-h-44 flex flex-col justify-center items-center'>
        <h2 className='pb-2 text-3xl font-bold tracking-tight'>Senatorial</h2>
        <Link href='/vote/senatorial'>
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
