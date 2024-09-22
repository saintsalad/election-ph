"use client";

import Google from "@/components/custom/icon/google";
import { Button } from "@/components/ui/button";
import { signInWithGooglePopup } from "@/lib/firebase";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import banner from "@/public/images/banner2.jpg";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/firebase/functions";

function SignIn() {
  const router = useRouter();

  const handleGoogleSignin = async () => {
    // TODO: change to google sign in redirect
    const userCredential = await signInWithGooglePopup();
    const response = await handleLogin(userCredential.user);

    if (response.success) {
      router.push("/");
    } else {
      console.log("❌❌❌");
    }
  };

  return (
    <div className='flex flex-1 w-full bg-white h-screen'>
      <section className='w-[350px] bg-red-50 hidden md:block lg:w-[450px]'>
        <Image
          className='h-full'
          alt='banner'
          placeholder='blur'
          priority={true}
          style={{ objectFit: "cover" }}
          src={banner}></Image>
      </section>
      <section className='flex flex-1 items-center justify-center md:justify-start'>
        <form className='w-full max-w-[416px] mx-5 sm:mx-20 lg:mx-36' action=''>
          <h1 className='text-xl sm:text-2xl font-semibold mb-10'>
            Sign in to Election PH
          </h1>
          <Button
            onClick={handleGoogleSignin}
            type='button'
            className='rounded-full h-14 text-sm w-full flex flex-1 gap-x-4 mb-8'
            variant={"outline"}>
            <Google />
            Sign in with Google
          </Button>
          <Separator />
          <div className=' flex flex-1 justify-center bottom-3 relative mb-5'>
            <span className='text-sm font-light bg-white px-4 text-gray-400'>
              or sign in with email
            </span>
          </div>
          <div className=' font-semibold mb-2'>Username or Email</div>
          <Input name='username' className='h-14 mb-6 rounded-xl' type='text' />

          <div className='text-base font-semibold mb-2'>Password</div>
          <Input
            name='password'
            className='h-14 rounded-xl mb-8'
            type='password'
          />

          <Button
            type='submit'
            className='rounded-full w-full h-14 text-sm mb-4'>
            Sign In
          </Button>
          <div className='flex flex-1 justify-center items-center'>
            <span className='text-sm mr-1'>Don&#39;t have an account?</span>
            <Link className='underline text-sm' href={"/signup"}>
              Sign up
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}

export default SignIn;
