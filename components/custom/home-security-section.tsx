import React from "react";
import { Lock, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import GridPattern from "@/components/magicui/grid-pattern";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";

function HomeSecuritySection() {
  const { theme } = useTheme();

  return (
    <div className='relative py-28 px-6 overflow-hidden bg-gradient-to-b from-white via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800'>
      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-4'>
            Your Vote is Secure
          </h2>
          <p className='text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto'>
            We use encryption to ensure your vote remains secret - even from our
            administrators. 😏
          </p>
        </div>

        <div className='flex flex-col md:flex-row justify-center items-stretch gap-8 mb-12'>
          <MagicCard
            className='p-8 text-center flex-1 w-full md:w-[calc(40%-1rem)] h-[300px] cursor-pointer shadow-2xl flex flex-col'
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}>
            <Lock className='w-16 h-16 text-blue-500 dark:text-blue-400 mx-auto mb-6' />
            <h3 className='text-2xl font-semibold text-slate-800 dark:text-white mb-4'>
              End-to-End Encryption
            </h3>
            <p className='text-base text-slate-600 dark:text-slate-300 flex-grow'>
              Your vote is encrypted on your device and stays encrypted
              throughout the entire process, ensuring maximum security.
            </p>
          </MagicCard>

          <MagicCard
            className='p-8 text-center flex-1 w-full md:w-[calc(50%-1rem)] h-[300px] cursor-pointer shadow-2xl flex flex-col'
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}>
            <EyeOff className='w-16 h-16 text-purple-500 dark:text-purple-400 mx-auto mb-6' />
            <h3 className='text-2xl font-semibold text-slate-800 dark:text-white mb-4'>
              Enhanced Privacy
            </h3>
            <p className='text-base text-slate-600 dark:text-slate-300 flex-grow'>
              Your privacy is our priority. We minimize personal data
              collection, securely store what&apos;s necessary, and never sell
              your information.
            </p>
          </MagicCard>
        </div>
      </div>

      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "absolute inset-0 h-full w-full",
          "opacity-50 dark:opacity-30",
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        )}
      />
    </div>
  );
}

export default HomeSecuritySection;
