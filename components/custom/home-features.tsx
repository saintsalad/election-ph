import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  BarChart,
  BarChart3,
  ListTodo,
  Lock,
  MessageSquare,
  MonitorSmartphone,
  Newspaper,
  Share2,
  User,
  Sparkles,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const features = [
  {
    icon: ListTodo,
    title: "Election Surveys",
    description:
      "Participate in unbiased, community-driven surveys to express your opinion on various candidates.",
  },
  {
    icon: BarChart,
    title: "Voter Insights",
    description:
      "Access data-driven insights on voter trends and public sentiment for each candidate.",
  },
  {
    icon: MonitorSmartphone,
    title: "Responsive Voting System",
    description:
      "Cast your vote easily and securely through our user-friendly interface, optimized for all devices.",
  },
  {
    icon: User,
    title: "Candidate Profiles",
    description:
      "Explore detailed profiles with biographies, educational attainment, platforms, and policy stances.",
  },

  {
    icon: Newspaper,
    title: "Election News Feed",
    description:
      "Stay informed with the latest updates and news surrounding the candidates and election process.",
  },
  {
    icon: Share2,
    title: "Social Media Integration",
    description:
      "Share your views and survey results seamlessly on social media platforms.",
  },
  {
    icon: MessageSquare,
    title: "Community Discussions",
    description:
      "Engage with fellow users in thoughtful discussions and debates on political topics.",
  },
  {
    icon: Lock,
    title: "Data Privacy",
    description:
      "Your data is safe with us. We do not sell or share your data with third parties.",
  },
  {
    icon: BarChart3,
    title: "Real-time Results",
    description:
      "View live updates of election survey results on a real-time dashboard that displays collective votes and trends.",
  },
];

const HomeFeatures = () => {
  const [showAll, setShowAll] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { theme } = useTheme();

  const SHOWN_FEATURES = 6;

  return (
    <div className='relative flex flex-col w-full justify-center items-center py-16 md:py-28 px-4 md:px-5 overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
      <div className='max-w-6xl w-full flex flex-col items-center z-10'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-3 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-1 rounded-full flex items-center space-x-2'>
          <Rocket className='w-4 h-4 text-yellow-500' />
          <span>Empowering Your Voice</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='text-center text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4 md:mb-6'>
          Key Features
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className='text-center text-sm md:text-base text-slate-600 dark:text-slate-400 mb-8 md:mb-12 max-w-2xl'>
          Unleash your potential with our platform, designed to help you engage,
          learn, and make well-informed choices in the community.
        </motion.p>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8'>
          {features
            .slice(0, isDesktop || showAll ? features.length : SHOWN_FEATURES)
            .map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='p-4 md:p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300'>
                <div className='flex items-center mb-3 md:mb-4'>
                  {feature.icon && (
                    <feature.icon className='h-5 w-5 md:h-6 md:w-6 mr-3 text-blue-500 dark:text-blue-400' />
                  )}
                  <h2 className='font-bold text-base md:text-lg text-gray-800 dark:text-white'>
                    {feature.title}
                  </h2>
                </div>
                <div className='text-sm text-slate-600 dark:text-gray-400'>
                  {feature.description}
                </div>
              </motion.div>
            ))}
        </div>
        {!isDesktop && features.length > SHOWN_FEATURES && (
          <Button
            size='lg'
            onClick={() => setShowAll(!showAll)}
            className='mt-8 px-6 py-3 rounded-full text-sm font-medium transition-colors bg-blue-500 hover:bg-blue-600 text-white'>
            {showAll ? "Show Less" : "Explore More Features"}
          </Button>
        )}
      </div>
      <div className='absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 dark:from-blue-900 dark:via-slate-900 dark:to-slate-800 opacity-50' />
    </div>
  );
};

export default HomeFeatures;
