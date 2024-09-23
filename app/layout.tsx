import type { Metadata } from "next";
// import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import MainLayout from "@/components/custom/layout/main-layout";
import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from "geist/font/sans";
import NextTopLoader from "nextjs-toploader";

// const fontSans = FontSans({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

export const metadata: Metadata = {
  title: "Election PH",
  description: "Election PH is doin it",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={cn("bg-background antialiased", GeistSans.className)}>
        <NextTopLoader color='#ffbf00' showSpinner={false} />
        <MainLayout>{children} </MainLayout>
        <Toaster />
      </body>
    </html>
  );
}
