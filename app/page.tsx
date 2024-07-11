"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store";

export default function Home() {
  const setLoading = useAuthStore((state) => state.setLoading);
  return (
    <main className=''>
      <p>test</p>
      <Button onClick={() => setLoading(true)}>Click me</Button>
    </main>
  );
}
