"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, signInWithGooglePopup } from "@/lib/firebase";
import Google from "@/components/custom/icon/google";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import banner from "@/public/images/banner2.jpg";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/firebase/functions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthStore } from "@/lib/store";
import { LogOut, Home } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleSignin = async () => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithGooglePopup();
      const email = userCredential.user.email;

      if (!email) {
        throw new Error("User email not found");
      }

      // Check if email exists in Firestore users collection
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Delete the auth account since it doesn't exist in Firestore
        await userCredential.user.delete();
        setError("Account not found. Please sign up first.");
        router.push("/logout");
        return;
      }

      // Email exists, proceed with login
      const loginResponse = await handleLogin(userCredential.user);
      if (loginResponse.success) {
        router.push("/");
      } else {
        console.error("Google sign-in failed");
        setError("Google sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setError("An error occurred during Google sign-in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (values: SignInFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const response = await handleLogin(userCredential.user);

      if (response.success) {
        router.push("/");
      } else {
        setError("Sign-in failed. Please try again.");
      }
    } catch (error) {
      if (error instanceof Error && "code" in error) {
        // Provide more user-friendly error messages
        switch ((error as any).code) {
          case "auth/invalid-credential":
          case "auth/user-not-found":
          case "auth/wrong-password":
            setError("Invalid email or password. Please try again.");
            break;
          case "auth/too-many-requests":
            setError("Too many failed login attempts. Please try again later.");
            break;
          case "auth/user-disabled":
            setError("This account has been disabled. Please contact support.");
            break;
          default:
            setError("An error occurred during sign-in. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
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
          src={banner}
        />
      </section>
      <section className='flex flex-1 items-center justify-center md:justify-start'>
        {user && !isLoading ? (
          <div className='w-full max-w-[416px] mx-5 sm:mx-20 lg:mx-36 text-center'>
            <h1 className='text-xl sm:text-2xl font-semibold mb-4'>
              Currently Signed In
            </h1>
            <p className='text-gray-600 mb-8'>
              You are signed in as{" "}
              <span className='font-semibold'>{user.email}</span>
            </p>
            <div className='space-y-4'>
              <Button
                onClick={() => router.push("/")}
                variant='default'
                className='rounded-full w-full h-14 text-sm'>
                <Home className='mr-2 h-4 w-4' />
                Back to Home
              </Button>
              <Button
                onClick={() => router.push("/logout")}
                variant='outline'
                className='rounded-full w-full h-14 text-sm'>
                <LogOut className='mr-2 h-4 w-4' />
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className='w-full max-w-[416px] mx-5 sm:mx-20 lg:mx-36'>
            <h1 className='text-xl sm:text-2xl font-semibold mb-10'>
              Sign in to Election PH
            </h1>
            <Button
              onClick={handleGoogleSignin}
              type='button'
              className='rounded-full h-14 text-sm w-full flex flex-1 gap-x-4 mb-8'
              variant={"outline"}
              disabled={isLoading}>
              <Google />
              Sign in with Google
            </Button>
            <Separator />
            <div className='flex flex-1 justify-center bottom-3 relative mb-5'>
              <span className='text-sm font-light bg-white px-4 text-gray-400'>
                or sign in with email
              </span>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSignIn)}
                className='space-y-6'>
                {error && (
                  <div
                    className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
                    role='alert'>
                    <span className='block sm:inline'>{error}</span>
                  </div>
                )}
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='email'
                          className='h-14 rounded-xl'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='password'
                          className='h-14 rounded-xl'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className='rounded-full w-full h-14 text-sm'
                  disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>
            <div className='flex flex-1 justify-center items-center mt-4'>
              <span className='text-sm mr-1'>Don&#39;t have an account?</span>
              <Link className='underline text-sm' href={"/signup"}>
                Sign up
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default SignIn;
