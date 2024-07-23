"use client";

import { triggerConfettiFireworks } from "@/lib/functions/triggerConfettiFireworks";
import { Download, Fingerprint } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QRCode } from "react-qrcode-logo";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";

type VoteSuccesProps = {};

function VoteReceipt() {
  const divRef = useRef<HTMLDivElement>(null);
  const [originalHTML, setOriginalHTML] = useState<string>("");

  useEffect(() => {
    if (divRef.current) {
      setOriginalHTML(divRef.current.innerHTML);
    }
  }, []);

  const handleDownloadImage = async () => {
    if (divRef.current) {
      // Perform an integrity check
      if (divRef.current.innerHTML !== originalHTML) {
        alert("Downloading failed, please try again.");
        return;
      }

      // Find and remove the element with the specific id
      const elementToRemove = document.getElementById("remove-me");
      const parentElement = elementToRemove?.parentNode;

      if (elementToRemove && parentElement) {
        parentElement.removeChild(elementToRemove);
      }

      // Capture the div as an image
      const canvas = await html2canvas(divRef.current);
      const imgData = canvas.toDataURL("image/png");

      // Re-add the removed element
      if (elementToRemove && parentElement) {
        parentElement.appendChild(elementToRemove);
      }

      // Create a link and trigger the download
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "vote-receipt.png";
      link.click();
    }
  };

  useEffect(() => {
    triggerConfettiFireworks();
  }, []);
  return (
    <div className='relative flex flex-1 flex-col items-center pt-10 '>
      <div
        ref={divRef}
        className='bg-[#F2F2F7]  flex sm:aspect-square  justify-center items-center sm:p-16'>
        <div className='vote-receipt rounded-t-2xl drop-shadow-lg relative min-h-[500px] w-[400px] py-8 px-5 bg-white text-slate-700'>
          <div className='flex flex-1 items-center font-mono flex-col'>
            <Button
              id='remove-me'
              size={"icon"}
              title='Download vote receipt'
              className='mb-2 absolute top-2 right-2 animate-shake'
              onClick={() => handleDownloadImage()}>
              <Download color='#fff' className='h-5 w-5' />
            </Button>
            <Fingerprint className='h-10 w-10 text-green-500 mb-4' />
            <div className='font-medium text-sm'>
              Thank you for participating,
            </div>
            <div className='font-medium text-sm'>your vote is protected.</div>

            <div className='my-5 text-slate-500 text-xs'>
              ───── • ° • ❀ • ° • ─────
            </div>

            <div className='flex flex-1 flex-col w-full gap-y-0.5'>
              <div className='flex flex-1 w-full justify-between'>
                <div className='font-semibold'>Voters ID:</div>
                <div>31289739oadiasd</div>
              </div>

              <div className='flex flex-1 w-full justify-between'>
                <div className='font-semibold'>Timestamp:</div>
                <div>2024-07-22 14:30:00</div>
              </div>

              <div className='flex flex-1 w-full justify-between'>
                <div className='font-semibold'>Election:</div>
                <div className='max-w-60 text-right'>
                  2024 Philippine National Election
                </div>
              </div>

              <div className='flex flex-1 w-full justify-between'>
                <div className='font-semibold'>Receipt ID:</div>
                <div>346542a35464165</div>
              </div>
            </div>

            <div className='my-5 text-slate-500 text-xs'>
              ───── • ° • ❀ • ° • ─────
            </div>

            <div className='self-start text-base font-semibold'>
              How to verify?
            </div>

            <div className='text-xs mb-5'>
              Visit
              <Link
                className='text-blue-500 hover:underline mx-1'
                href='/verify'>
                www.electionph.com/verify
              </Link>
              and enter your <b>Receipt ID</b> to confirm your vote or scan the{" "}
              <b>QR Code</b> below.
            </div>

            <QRCode
              eyeRadius={10}
              fgColor='#334155'
              eyeColor={"#22c55e"}
              value='https://github.com/gcoro/react-qrcode-logo'
              qrStyle={"dots"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoteReceipt;
