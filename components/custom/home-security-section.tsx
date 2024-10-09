import { motion } from "framer-motion";
import React from "react";
import { Lock, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import GridPattern from "@/components/magicui/grid-pattern";

function HomeSecuritySection() {
  return (
    <div className='relative py-28 px-6 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800'>
      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl sm:text-5xl font-bold text-slate-800 dark:text-white mb-4'>
            Your Vote is Secure and Anonymous
          </h2>
          <p className='text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto'>
            We use encryption to ensure your vote remains secret - even from our
            administrators. 😏
          </p>
        </div>

        <div className='flex flex-col md:flex-row justify-center items-stretch gap-8 mb-12'>
          <motion.div
            className='bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg text-center flex-1 max-w-md border border-slate-200 dark:border-slate-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}>
            <Lock className='w-16 h-16 text-blue-500 dark:text-blue-400 mx-auto mb-4' />
            <h3 className='text-2xl font-semibold text-slate-800 dark:text-white mb-2'>
              End-to-End Encryption
            </h3>
            <p className='text-slate-600 dark:text-slate-300'>
              Your vote is encrypted on your device and stays encrypted
              throughout the entire process.
            </p>
          </motion.div>

          <motion.div
            className='bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg text-center flex-1 max-w-md border border-slate-200 dark:border-slate-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}>
            <EyeOff className='w-16 h-16 text-purple-500 dark:text-purple-400 mx-auto mb-4' />
            <h3 className='text-2xl font-semibold text-slate-800 dark:text-white mb-2'>
              Enhanced Privacy
            </h3>
            <p className='text-slate-600 dark:text-slate-300'>
              Your privacy is our priority. We minimize personal data
              collection, securely store what&apos;s necessary, and never sell
              your information.
            </p>
          </motion.div>
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
