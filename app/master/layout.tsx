import Header from "@/components/custom/layout/admin-header";
import Sidebar from "@/components/custom/layout/admin-sidebar";
import React from "react";

function MasterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className='flex h-screen overflow-hidden'>
        <Sidebar />
        <main className='flex-1 overflow-hidden pt-24 px-8'>{children}</main>
      </div>
    </>
  );
}

export default MasterLayout;
