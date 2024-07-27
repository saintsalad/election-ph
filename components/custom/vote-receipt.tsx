"use client";

import { triggerConfettiFireworks } from "@/lib/functions/triggerConfettiFireworks";
import { Download, Fingerprint } from "lucide-react";
import { forwardRef, useEffect, useRef, useImperativeHandle, Ref } from "react";
import Link from "next/link";
import { QRCode } from "react-qrcode-logo";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { VoteReceiptProps as VoiceReceipt } from "@/lib/definitions";
import { Skeleton } from "@/components/ui/skeleton";

type VoteReceiptProps = {
  voiceReceipt: VoiceReceipt | undefined;
  loading: boolean;
};

export type VoteReceiptRef = {
  handleDownloadImage: () => void;
};

// eslint-disable-next-line react/display-name
const VoteReceipt = forwardRef<VoteReceiptRef, VoteReceiptProps>(
  ({ voiceReceipt, loading }, ref) => {
    const divRef = useRef<HTMLDivElement>(null);

    const handleDownloadImage = async () => {
      if (divRef.current) {
        // Capture the div as an image

        const canvas = await html2canvas(divRef.current);
        const imgData = canvas.toDataURL("image/png");

        // Create a link and trigger the download
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "vote-receipt.png";
        link.click();
      }
    };

    useImperativeHandle(ref, () => ({
      handleDownloadImage,
    }));

    useEffect(() => {
      if (!loading && voiceReceipt) {
        triggerConfettiFireworks();
      }
    }, [loading, voiceReceipt]);

    return (
      <div className='relative flex flex-1 flex-col items-center'>
        {!loading && voiceReceipt ? (
          <div
            ref={divRef}
            className='vote-receipt rounded-t-2xl drop-shadow-lg relative min-h-[500px] w-[350px] sm:w-[400px] py-8 px-5 bg-white text-slate-700'>
            <div className='flex flex-1 items-center font-mono flex-col'>
              <Fingerprint className='h-10 w-10 text-green-500 mb-2' />
              <h1 className='text-lg mb-4 font-semibold'>Election PH</h1>

              <div className='flex flex-1 w-full justify-between items-start'>
                <div className='font-semibold text-sm'>Election:</div>
                <div className='max-w-60 text-right text-sm'>
                  {voiceReceipt.electionTitle}
                </div>
              </div>

              <div className='flex flex-1 flex-col w-full gap-y-0.5'>
                <div className='flex flex-1 w-full justify-between items-start'>
                  <div className='font-semibold text-sm'>Voters ID:</div>
                  <div className='text-sm'>{voiceReceipt.userId}</div>
                </div>

                <div className='flex flex-1 w-full justify-between items-start'>
                  <div className='font-semibold text-sm'>Timestamp:</div>
                  <div className='text-sm'>{voiceReceipt.dateCreated}</div>
                </div>

                <div className='flex flex-1 w-full justify-between items-start'>
                  <div className='font-semibold text sm'>Reference ID:</div>
                  <div className='text-sm'>{voiceReceipt.referenceId}</div>
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
                  href='/vote/verify'>
                  www.electionph.com/vote/verify
                </Link>
                and enter your <b>Receipt ID</b> to confirm your vote or scan
                the <b>QR Code</b> below.
              </div>

              <QRCode
                eyeRadius={10}
                fgColor='#334155'
                eyeColor={"#22c55e"}
                value={`${process.env.NEXT_PUBLIC_SITE_URL}/vote/verify?id=${voiceReceipt.voteId}`}
                qrStyle={"dots"}
              />
            </div>
          </div>
        ) : (
          <>
            <Skeleton className='w-[350px] sm:w-[400px] h-[550px]' />
          </>
        )}
      </div>
    );
  }
);

export default VoteReceipt;
