"use client";

import Header from "@/components/custom/layout/admin-header";
import Sidebar from "@/components/custom/layout/admin-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function MasterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Header />
        <div className='flex h-screen overflow-hidden'>
          <Sidebar />
          <ScrollArea className='flex-1 pt-24 px-8'>{children}</ScrollArea>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default MasterLayout;
