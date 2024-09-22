import React from "react";
import Image from "next/image";

function Profile() {
  return (
    <div className='min-h-screen  py-11 lg:py-16'>
      <div className='container mx-auto px-4 py-5'>
        <h1 className='text-3xl font-bold text-gray-800 text-center mb-8'>
          About Us
        </h1>

        <div
          className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6'
          role='alert'>
          <p className='font-bold'>Maintenance Notice</p>
          <p>
            This page is currently under maintenance. Some features may be
            unavailable.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-gray-100 rounded-lg p-6'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              Our Mission
            </h2>
            <p className='text-sm text-gray-600 mb-4'>
              At Election PH, we are dedicated to providing a platform for
              voters to learn about and engage with candidates.
            </p>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              Our Values
            </h2>
            <ul className='space-y-2'>
              {[
                "Innovation",
                "Integrity",
                "Customer-focus",
                "Sustainability",
              ].map((value, index) => (
                <li
                  key={index}
                  className='flex items-center text-sm text-gray-600'>
                  <span className='mr-2'>•</span>
                  {value}
                </li>
              ))}
            </ul>
          </div>
          <div className='bg-gray-100 rounded-lg p-6'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              Our Team
            </h2>
            <p className='text-sm text-gray-600 mb-4'>
              We are a diverse group of professionals passionate about politics
              and civic engagement. Our team brings together expertise from
              various backgrounds to deliver the best solutions for our clients.
            </p>
            <div className='relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-200'>
              <Image
                src='/team-photo.jpg'
                alt='Our Team'
                fill
                style={{ objectFit: "cover" }}
                className='rounded-lg'
              />
            </div>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              Contact Us
            </h2>
            <div className='space-y-2'>
              {[
                { icon: "✉️", text: "info@company.com" },
                { icon: "📱", text: "(123) 456-7890" },
                { icon: "🏢", text: "123 Main St, City, State 12345" },
              ].map((item, index) => (
                <p
                  key={index}
                  className='flex items-center text-sm text-gray-600'>
                  <span className='mr-2'>{item.icon}</span>
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

export default Profile;
