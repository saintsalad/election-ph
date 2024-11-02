import React from "react";
import { Lock, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import GridPattern from "@/components/magicui/grid-pattern";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";

function HomeSecuritySection() {
  const { theme } = useTheme();

  return (
    <div className='relative py-16 sm:py-28 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-white via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800'>
      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-8 sm:mb-12'>
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4'>
            Your Vote is Secure
          </h2>
          <p className='text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto'>
            We use encryption to ensure your vote remains secret - even from our
            administrators. 😏
          </p>
        </div>

        <div className='flex flex-col sm:flex-row justify-center items-stretch gap-6 sm:gap-8'>
          <MagicCard
            className='p-6 sm:p-8 text-center flex-1 w-full sm:w-[calc(50%-1rem)] h-auto sm:h-[300px] cursor-pointer shadow-xl sm:shadow-2xl flex flex-col'
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}>
            <Lock className='w-12 h-12 sm:w-16 sm:h-16 text-blue-500 dark:text-blue-400 mx-auto mb-4 sm:mb-6' />
            <h3 className='text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white mb-2 sm:mb-4'>
              End-to-End Encryption
            </h3>
            <p className='text-sm sm:text-base text-slate-600 dark:text-slate-300 flex-grow'>
              Your vote is encrypted on your device and stays encrypted
              throughout the entire process, ensuring maximum security.
            </p>
          </MagicCard>

          <MagicCard
            className='p-6 sm:p-8 text-center flex-1 w-full sm:w-[calc(50%-1rem)] h-auto sm:h-[300px] cursor-pointer shadow-xl sm:shadow-2xl flex flex-col'
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}>
            <EyeOff className='w-12 h-12 sm:w-16 sm:h-16 text-purple-500 dark:text-purple-400 mx-auto mb-4 sm:mb-6' />
            <h3 className='text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white mb-2 sm:mb-4'>
              Enhanced Privacy
            </h3>
            <p className='text-sm sm:text-base text-slate-600 dark:text-slate-300 flex-grow'>
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

      <div className='relative flex flex-col w-full justify-center items-center pt-24 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6'>
        <div className='mb-4 sm:mb-3 text-[11px] sm:text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-3 sm:px-5 py-1 sm:py-1.5 rounded-full backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors'>
          ✉️ FEEDBACK
        </div>
        <h2 className='text-center max-w-2xl text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 z-10 mb-3 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 px-4'>
          We value your feedback!
        </h2>
        <p className='text-center max-w-xl text-sm sm:text-base text-slate-600 dark:text-slate-300 z-10 mb-8 leading-relaxed px-4'>
          Your insights and suggestions help us improve our platform. Please
          feel free to send us your feedback via email.
        </p>
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 w-full max-w-md px-4'>
          <input
            type='text'
            readOnly
            value='saintsalad000@gmail.com'
            className='flex-1 min-h-[44px] sm:h-10 text-center text-[13px] sm:text-base text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 outline-none'
          />
          <button
            onClick={() =>
              navigator.clipboard.writeText("saintsalad000@gmail.com")
            }
            className='min-h-[44px] sm:h-10 px-5 sm:px-6 text-[13px] sm:text-base text-white dark:text-white font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95'>
            Copy Email
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeSecuritySection;
