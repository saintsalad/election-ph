"use client";

import { cn } from "@/lib/utils";

function HomeDisclaimerCard() {
  return (
    <div className='relative flex flex-col w-full px-5 my-28'>
      <div className='max-w-6xl mx-auto w-full overflow-hidden'>
        {/* Card Container */}
        <div className='relative backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
          {/* Background with gradient */}
          <div
            className={cn(
              "absolute inset-0",
              "bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30",
              "dark:from-blue-400/40 dark:via-purple-400/40 dark:to-pink-400/40",
              "animate-gradient-x"
            )}
          />

          {/* Grainy overlay */}
          <div className='absolute inset-0 grainy rounded-2xl opacity-20' />

          {/* Glass effect overlay */}
          <div className='absolute inset-0 bg-white/30 dark:bg-black/20 backdrop-blur-sm' />

          {/* Content */}
          <div className='relative p-8 sm:p-10'>
            {/* Header */}
            <h2 className='text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6'>
              Disclaimer
            </h2>

            {/* Content sections with improved typography */}
            <div className='space-y-4 text-sm leading-relaxed'>
              <p className='text-slate-700 dark:text-slate-200'>
                Election PH is an independent, non-official online survey
                platform. The surveys conducted on this website are solely for
                the purpose of gathering public opinion and do not reflect or
                influence the official electoral process. The results presented
                here are based on voluntary participation and are not intended
                to represent the views of the entire electorate.
              </p>

              <p className='text-slate-700 dark:text-slate-200'>
                This platform is not affiliated with the Commission on Elections
                (COMELEC) or any other government entity. All data collected is
                anonymized and used solely for the purpose of the survey.
              </p>

              <div className='pt-4 border-t border-slate-200/30 dark:border-slate-700/30'>
                <p className='text-slate-600 dark:text-slate-300'>
                  Election PH encourages respectful and responsible
                  participation. Users are fully responsible for any comments,
                  posts, or submissions they make on the platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeDisclaimerCard;
