function Community() {
  return (
    // Add a container div with padding
    <div className='container mx-auto px-4 py-11 lg:py-16'>
      <div className='pt-5'>
        <div
          className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6'
          role='alert'>
          <p className='font-bold'>Maintenance Notice</p>
          <p>
            This page is currently under maintenance. Some features may be
            unavailable.
          </p>
        </div>

        {/* Add a heading for the welcome message */}
        <h1 className='text-3xl font-bold mb-4'>Welcome to Our Community</h1>

        {/* Add a brief description */}
        <p className='mb-6'>
          Join our vibrant community and connect with like-minded individuals.
        </p>

        {/* Placeholder for community content */}
        <div>Community content goes here</div>
      </div>
    </div>
  );
}

export default Community;
