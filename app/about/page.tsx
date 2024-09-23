import React from "react";
import Image from "next/image";
import defaultImage from "@/public/images/default.png";

function About() {
  return (
    <div className='min-h-screen py-11 lg:pt-16'>
      <div className='container mx-auto px-4 pt-5'>
        <h1 className='text-4xl font-bold text-gray-800 text-center mb-8'>
          About Election PH
        </h1>

        <div
          className='bg-yellow-100 border-l-4 border-yellow-400 p-4 mb-8'
          role='alert'>
          <p className='font-bold text-yellow-700'>Maintenance Notice</p>
          <p className='text-yellow-600'>
            This page is currently under maintenance. Some information may be
            incomplete or subject to change.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          <div className='bg-white rounded-lg p-8 shadow-md'>
            <h2 className='text-2xl font-semibold text-gray-700 mb-6'>
              Our Mission
            </h2>
            <p className='text-gray-600 mb-6 leading-relaxed'>
              At Election PH, we&#39;re committed to empowering voters with
              comprehensive, unbiased information about candidates and electoral
              processes. Our goal is to foster informed decision-making and
              strengthen democratic participation.
            </p>
            <div className='space-y-4'>
              {[
                { icon: "🎯", text: "Transparency" },
                { icon: "🤝", text: "Inclusivity" },
                { icon: "🔍", text: "Accuracy" },
                { icon: "🌱", text: "Civic Engagement" },
              ].map((value, index) => (
                <p key={index} className='flex items-center text-gray-700'>
                  <span className='mr-3 text-xl'>{value.icon}</span>
                  {value.text}
                </p>
              ))}
            </div>
          </div>

          <div className='bg-white rounded-lg p-8 shadow-md'>
            <h2 className='text-2xl font-semibold text-gray-700 mb-6'>
              Our Team
            </h2>
            <p className='text-gray-600 mb-6 leading-relaxed'>
              We are a diverse group of professionals passionate about politics
              and civic engagement. Our team brings together expertise from
              various fields to deliver innovative solutions for informed
              voting.
            </p>
            <div className='relative h-56 mb-6 rounded-lg overflow-hidden'>
              <Image
                src={defaultImage}
                alt='Our Team'
                fill
                sizes='(max-width: 768px) 100vw, 50vw'
                style={{ objectFit: "cover" }}
                className='rounded-lg'
              />
            </div>
            <h3 className='text-xl font-semibold text-gray-700 mb-4'>
              Connect With Us
            </h3>
            <div className='space-y-2'>
              {[
                { icon: "✉️", text: "info@electionph.com" },
                { icon: "📱", text: "+63 (2) 8123 4567" },
                { icon: "🏢", text: "123 Democracy Ave, Manila, Philippines" },
              ].map((item, index) => (
                <p key={index} className='flex items-center text-gray-600'>
                  <span className='mr-3 text-xl'>{item.icon}</span>
                  {item.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
