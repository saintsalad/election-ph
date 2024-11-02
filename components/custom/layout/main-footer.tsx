import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
import logo from "@/public/images/logo.png";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/candidates", label: "Candidates" },
  { href: "/results", label: "Results" },
];

const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://twitter.com", label: "Twitter", icon: Twitter },
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
];

const FooterSection = ({ title, links }: { title: string; links: any[] }) => (
  <div className='mb-8 md:mb-0'>
    <h4 className='text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200'>
      {title}
    </h4>
    <ul className='text-sm space-y-2'>
      {links.map(({ href, label }) => (
        <li key={label}>
          <Link
            href={href}
            className='text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors'>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

function MainFooter() {
  return (
    <div className='w-full bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200'>
      <div className='relative w-full px-6 lg:px-8 py-12 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-x-light dark:bg-gradient-x-dark animate-gradient-x'></div>
        <footer className='relative max-w-6xl mx-auto z-10 flex flex-col'>
          <div className='flex flex-col md:flex-row justify-between items-start mb-12'>
            <div className='mb-10 md:mb-0 md:w-1/3'>
              <div className='flex items-center gap-x-3 mb-4'>
                <Image
                  src={logo}
                  alt='Election PH Logo'
                  width={48}
                  height={48}
                  className='rounded-full'
                />
                <h3 className='text-2xl font-bold text-gray-800 dark:text-white'>
                  Election PH
                </h3>
              </div>
              <p className='text-sm text-gray-700 dark:text-gray-300 mb-6'>
                Empowering democracy through engagement.
              </p>
              <div className='flex space-x-4'>
                {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors'
                    aria-label={label}>
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 w-full md:w-2/3'>
              <FooterSection title='Quick Links' links={LINKS} />
              <FooterSection
                title='Resources'
                links={[
                  { href: "/faq", label: "FAQ" },
                  { href: "/roadmap", label: "Roadmap" },
                ]}
              />
              <FooterSection
                title='Legal'
                links={[
                  { href: "/#", label: "Privacy Policy" },
                  { href: "/#", label: "Terms of Service" },
                  { href: "/#", label: "Accessibility" },
                ]}
              />
            </div>
          </div>

          <div className='border-t border-gray-400 dark:border-gray-700/50 pt-8 mt-8 text-center'>
            <p className='text-gray-700 dark:text-gray-300 text-sm'>
              © {new Date().getFullYear()} Election PH. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
export default MainFooter;
