function Settings() {
  return (
    <div className='py-11 lg:py-16'>
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
      </div>
      {/* ... existing profile content ... */}
    </div>
  );
}

export default Settings;
