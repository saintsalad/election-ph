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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "next-themes";

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
    <div className='relative flex flex-col w-full justify-center items-center py-28'>
      <div className='max-w-5xl w-full flex flex-col items-center'>
        <div className='mb-3 text-sm text-slate-500'>
          WHAT WE&#39;RE COOKING🔥
        </div>
        <h1
          className='text-center text-xl max-w-sm sm:text-4xl font-bold ${
          theme === "dark" ? "text-white" : "text-slate-900"
        } z-10 mb-5'>
          Lit Features for Informed Citizens
        </h1>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-5 lg:px-0'>
          {features
            .slice(0, isDesktop || showAll ? features.length : SHOWN_FEATURES)
            .map((feature, index) => (
              <div
                key={index}
                className={`p-4 sm:p-5 rounded-lg border hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-300"
                    : "bg-slate-100 text-slate-700"
                }`}>
                {feature.icon && (
                  <feature.icon
                    className={`h-5 w-5 ${
                      theme === "dark" ? "text-gray-400" : "text-slate-700"
                    }`}
                  />
                )}
                <h2
                  className={`font-bold mt-2 sm:mt-3 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}>
                  {feature.title}
                </h2>
                <div
                  className={`text-xs sm:text-sm ${
                    theme === "dark" ? "text-gray-500" : "text-slate-600"
                  }`}>
                  {feature.description}
                </div>
              </div>
            ))}
        </div>
        {!isDesktop && features.length > SHOWN_FEATURES && (
          <Button
            size='sm'
            onClick={() => setShowAll(!showAll)}
            className='mt-6 px-4 py-2  rounded-md text-sm font-medium  transition-colors'>
            {showAll ? "See Less" : "See More"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeFeatures;
