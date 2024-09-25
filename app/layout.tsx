import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import MainLayout from "@/components/custom/layout/main-layout";
import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from "geist/font/sans";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/custom/theme-provider";

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
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          "bg-background antialiased theme-transition",
          GeistSans.className
        )}>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange>
          <NextTopLoader color='#ffbf00' showSpinner={false} />
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
