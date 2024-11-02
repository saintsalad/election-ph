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
            content='Driven by a shared vision for positive change, our team brings together diverse talents, each committed to creating a platform that empowers public opinion and fosters democratic engagement. Working behind the scenes, we combine experience, innovation, and purpose to build a trusted space for meaningful civic participation. Though we stay out of the spotlight, our focus remains on amplifying the voices that matter most—yours.'
          />

          <Section
            icon={
              <Lightbulb className='h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 dark:text-yellow-400' />
            }
            title='Our Vision'
            content='We aim to create a space where Filipinos can freely share their views on electoral issues, encouraging public engagement and open conversation. Our goal is to support a more informed, inclusive, and participatory democratic process in the Philippines. By amplifying diverse voices, we hope to build a community that values thoughtful dialogue and active civic involvement.'
          />

          <Section
            icon={
              <Target className='h-5 w-5 sm:h-6 sm:w-6 text-green-500 dark:text-green-400' />
            }
            title='Our Mission'
            content='To provide an accessible and user-centered platform for conducting insightful, unofficial surveys on electoral topics, prioritizing user privacy, fostering informed participation, and promoting meaningful civic engagement. Our mission is to empower communities by amplifying diverse perspectives and encouraging constructive dialogue around elections and public issues.'
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
