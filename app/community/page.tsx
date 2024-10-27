import {
  AlertTriangle,
  Users,
  MessageSquare,
  PieChart,
  Bell,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

function Community() {
  return (
    <div className='min-h-screen px-4 sm:px-6 lg:px-8 pt-28 dark:bg-gray-900'>
      <div className='max-w-4xl mx-auto space-y-10'>
        <Alert
          variant='default'
          className='bg-gray-100 dark:bg-gray-800 border-none rounded-2xl'>
          <AlertTriangle className='h-5 w-5 text-gray-500 dark:text-gray-400' />
          <AlertTitle className='text-base font-semibold'>
            Feature Notice
          </AlertTitle>
          <AlertDescription className='text-gray-600 dark:text-gray-300'>
            Community features are soon to be available.
          </AlertDescription>
        </Alert>

        <div className='text-center space-y-3'>
          <h1 className='text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500'>
            Community Hub
          </h1>
          <p className='text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            A space for connection, discussion, and shared insights.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <FeatureCard
            icon={<MessageSquare className='h-8 w-8 text-blue-500' />}
            title='Share Opinions'
            description='Express your thoughts on various topics'
          />
          <FeatureCard
            icon={<Users className='h-8 w-8 text-green-500' />}
            title='Connect'
            description='Engage with like-minded individuals'
          />
          <FeatureCard
            icon={<PieChart className='h-8 w-8 text-purple-500' />}
            title='Participate'
            description='Join community polls and surveys'
          />
          <FeatureCard
            icon={<Bell className='h-8 w-8 text-yellow-500' />}
            title='Stay Updated'
            description='Receive notifications on hot topics'
          />
        </div>

        <div className='text-center'>
          <Button
            disabled
            className='mt-6 px-6 py-3 text-base rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'>
            Start a Discussion (Coming Soon)
          </Button>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className='bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl transition-all duration-300 hover:shadow-md'>
      <div className='flex items-center space-x-4'>
        <div className='bg-white dark:bg-gray-700 p-3 rounded-full shadow-sm'>
          {icon}
        </div>
        <div className='flex-1'>
          <h3 className='text-xl font-semibold text-gray-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500'>
            {title}
          </h3>
          <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Community;
