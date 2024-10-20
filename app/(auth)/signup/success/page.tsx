"use client";

import { Suspense } from "react";
import SignUpSuccessContent from "@/components/custom/signup-success";

function SignUpSuccess() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpSuccessContent />
    </Suspense>
  );
}

export default SignUpSuccess;
