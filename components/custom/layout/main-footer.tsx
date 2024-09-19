import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo2.png";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const SOCIAL_LINKS = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://twitter.com", label: "Twitter" },
  { href: "https://instagram.com", label: "Instagram" },
];

const FooterSection = ({ title, links }: { title: string; links: any[] }) => (
  <div className='mb-8 md:mb-0'>
    <h4 className='text-lg font-semibold mb-3'>{title}</h4>
    <ul className='text-sm'>
      {links.map(({ href, label }) => (
        <li key={label} className='mb-2'>
          <Link href={href} className='hover:underline'>
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

function MainFooter() {
  return (
    <div className='w-full bg-primary footer-wave-clip'>
      <div className='max-w-5xl mx-auto w-full px-5 sm:px-20 pt-20'>
        <footer className='flex flex-col'>
          <div className='text-white flex flex-col md:flex-row justify-between mb-20'>
            <div className='mb-8 md:mb-0 md:w-1/3'>
              <div className='flex items-center gap-x-2 mb-2'>
                <Image
                  src={logo}
                  alt='Election PH Logo'
                  width={30}
                  height={30}
                  className='rounded-full mr-1'
                />
                <h3 className='text-xl font-bold'>Election PH</h3>
              </div>
            </div>

            <FooterSection title='Quick Links' links={LINKS} />
            <FooterSection title='Connect With Us' links={SOCIAL_LINKS} />
          </div>

          <div className='text-white text-sm text-center pb-8'>
            © {new Date().getFullYear()} Election PH. All rights reserved.
            Someone has to do it.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default MainFooter;
