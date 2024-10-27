import React from "react";
import { Code, Lightbulb, Target } from "lucide-react";

function About() {
  return (
    <div className='min-h-screen px-4 sm:px-6 lg:px-8 pt-28  dark:bg-gray-900'>
      <div className='max-w-4xl mx-auto space-y-8 sm:space-y-12'>
        <div className='text-center space-y-3'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500'>
            About Election PH
          </h1>
          <p className='text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            An independent, non-official online survey platform for gathering
            public opinion.
          </p>
        </div>

        <div className='space-y-8 sm:space-y-12'>
          <Section
            icon={
              <Code className='h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-cyan-400' />
            }
            title='Our Team'
            content='Our team is composed of dedicated individuals who want change for the community. We are committed to providing a reliable platform for gathering public opinion and fostering democratic engagement.'
          />

          <Section
            icon={
              <Lightbulb className='h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 dark:text-yellow-400' />
            }
            title='Our Vision'
            content='We aim to provide a space for Filipinos to express their opinions on electoral matters, fostering public engagement and discussion. Our vision is to contribute to a more informed and participatory democratic process in the Philippines.'
          />

          <Section
            icon={
              <Target className='h-5 w-5 sm:h-6 sm:w-6 text-green-500 dark:text-green-400' />
            }
            title='Our Mission'
            content='To offer a user-friendly, accessible platform for conducting unofficial surveys on electoral topics, while maintaining user privacy, encouraging responsible participation, and providing clear disclaimers about the nature and limitations of our surveys.'
          />
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

function Section({ icon, title, content }: SectionProps) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center space-x-3'>
        {icon}
        <h2 className='text-xl sm:text-2xl font-semibold text-gray-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500'>
          {title}
        </h2>
      </div>
      <p className='text-sm sm:text-base text-gray-600 dark:text-gray-300 pl-8 sm:pl-9'>
        {content}
      </p>
    </div>
  );
}

export default About;
