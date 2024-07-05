function NotFoundPage() {
  return (
    <>
      <div className='min-h-full px-4 py-4  sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8'>
        <div className='mx-auto max-w-max'>
          <div className='mt-5'>
            <div className='flex mt-6'>
              <p className='text-4xl font-extrabold text-blue600 sm:text-5xl'>
                404
              </p>
              <div className='ml-6'>
                <div className='pl-6 border-l border-gray500'>
                  <h2 className='text-3xl font-bold tracking-tight text-gray900 dark:text-white sm:text-4xl'>
                    Something went wrong! - Etwas ist schief gelaufen !
                  </h2>
                  <p className='mt-1 text-lg text-gray500 dark:text-white'>
                    Please select a topic from the tag cloud above or go back
                    home
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
