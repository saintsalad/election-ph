import { AuroraBackgroundProvider } from "@nauverse/react-aurora-background";
import React, { useState } from "react";

function HomeDisclaimerCard() {
  const [animDuration, setAnimDuration] = useState(5);

  return (
    <div className='relative flex flex-col w-full px-5 mb-28'>
      <div
        // mouse hover effect
        onMouseEnter={() => {
          setAnimDuration(0.5);
        }}
        onMouseLeave={() => {
          setAnimDuration(5);
        }}
        className='max-w-5xl mx-auto w-full border rounded-lg overflow-hidden'>
        {/* @ts-ignore */}
        <AuroraBackgroundProvider
          style={{}}
          numBubbles={5}
          useRandomness
          animDuration={animDuration}
          className=' grainy'>
          <div className='sm:p-12 p-10'>
            <div className='sm:text-5xl text-2xl font-extrabold text-slate-800'>
              Disclaimer
            </div>
            <div className='sm:text-base text-sm sm:mt-3 text-slate-800'>
              Election PH is an independent, non-official online survey
              platform. The surveys conducted on this website are solely for the
              purpose of gathering public opinion and do not reflect or
              influence the official electoral process. The results presented
              here are based on voluntary participation and are not intended to
              represent the views of the entire electorate. This platform is not
              affiliated with the Commission on Elections (COMELEC) or any other
              government entity. All data collected is anonymized and used
              solely for the purpose of the survey. Please note that
              participation in our surveys is entirely voluntary, and the
              results are unofficial.
            </div>
          </div>
        </AuroraBackgroundProvider>
      </div>
    </div>
  );
}

export default HomeDisclaimerCard;
