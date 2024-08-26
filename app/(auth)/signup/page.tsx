"use client";

import Google from "@/components/custom/icon/google";
import { Button } from "@/components/ui/button";
import { auth, db, signInWithGooglePopup } from "@/lib/firebase";
import { useAuthStore } from "@/lib/store";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import banner from "@/public/images/banner.jpg";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleLogin, isUnique } from "@/lib/firebase/functions";

// Validation functions
const isValidUsername = (str: string) => /^(?!.*[_.]{3})[\w.]*$/.test(str);

const isValidPassword = (str: string) =>
  /[a-zA-Z]/.test(str) && /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);

// Form schema
const FormSchema = z
  .object({
    username: z
      .string()
      .min(2, "Username must be at least 2 characters.")
      .max(16, "Username has maximum of 16 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
  })
  .refine((data) => isValidPassword(data.password), {
    message: "Password does not meet the requirements. Please try again.",
    path: ["password"],
  })
  .refine((data) => isValidUsername(data.username), {
    message:
      "The username is invalid. Please use only letters, numbers, dots, and underscores.",
    path: ["username"],
  });

const SignUp = () => {
  const [toggle, setToggle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const { toast } = useToast();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setIsSubmitting(true);
      const result = await isUnique("users", "username", data.username);
      if (!result) {
        form.setError("username", {
          type: "manual",
          message: "Username is already taken.",
        });
        return;
      }

      await registerUser(data.username, data.email, data.password);
    } catch {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Error occurred, try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsSubmitting(true);
      const userCredential = await signInWithGooglePopup();
      const { uid, email } = userCredential.user;
      const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);
      const username = `${email?.split("@")[0]}${random4DigitNumber}`;
      await setDoc(doc(db, "users", uid), { username, email });

      // set session cookies
      await handleLogin(userCredential.user).then((res) => {
        if (!res.success) console.log("SIGN UP, SETTING SESSION ❌❌❌");
        router.push("/");
      });
    } catch (error) {
      console.log("SIGN UP ❌❌❌", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerUser = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user) {
        throw new Error("Error occurred, try again later.");
      }

      await setDoc(doc(db, "users", user.uid), { username, email });
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          form.setError("email", {
            type: "manual",
            message: "Email is already in use, try another one.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Error occurred, try again later.",
          });
        }
      }
    }
  };

  return (
    <div className='flex flex-1'>
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
      <section className='flex flex-1 flex-col'>
        {toggle && (
          <div className='p-10'>
            <Button
              onClick={() => setToggle(false)}
              className='rounded-full'
              variant='outline'
              size='icon'>
              <ChevronLeft className='h-4 w-4' />
            </Button>
          </div>
        )}

        <div className='flex flex-1 items-center justify-center md:justify-start'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='w-full max-w-[416px] mx-5 sm:mx-20 lg:mx-36'>
              <h1 className='text-xl sm:text-2xl font-semibold mb-10'>
                Sign up to Election PH
              </h1>

              {!toggle ? (
                <>
                  <Button
                    disabled={isSubmitting}
                    onClick={handleGoogleSignup}
                    type='button'
                    className='rounded-full h-14 text-sm w-full flex flex-1 gap-x-4 mb-8'
                    variant='default'>
                    {isSubmitting ? (
                      <LoaderCircle size={20} className='animate-spin' />
                    ) : (
                      <Google />
                    )}
                    Sign up with Google
                  </Button>
                  <Separator />
                  <div className='flex flex-1 justify-center bottom-3 relative mb-5'>
                    <span className='text-sm font-light bg-white px-4 text-gray-400'>
                      or
                    </span>
                  </div>

                  <Button
                    disabled={isSubmitting}
                    onClick={() => setToggle(true)}
                    variant='outline'
                    type='button'
                    className='rounded-full w-full h-14 text-sm mb-12'>
                    Continue with email
                  </Button>

                  <div className='flex flex-1 justify-center items-center text-center mb-5'>
                    <div className='text-xs'>
                      By creating an account you agree with our{" "}
                      <Link className='underline text-xs' href='#'>
                        Terms of Service
                      </Link>
                      , Privacy Policy, and our default{" "}
                      <Link className='underline text-xs' href='#'>
                        Notification Settings.
                      </Link>
                    </div>
                  </div>

                  <div className='flex flex-1 justify-center items-center'>
                    <div className='text-sm'>
                      Already have an account?
                      <Link className='underline text-sm ml-1' href='/signin'>
                        Sign In
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem className='mb-6'>
                        <FormLabel className='text-lg font-semibold'>
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            type='text'
                            className='h-14 rounded-xl'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='mb-6'>
                        <FormLabel className='text-lg font-semibold'>
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            required
                            type='email'
                            className='h-14 rounded-xl'
                            {...field}
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
                      <FormItem className='mb-6'>
                        <FormLabel className='text-lg font-semibold'>
                          Password
                        </FormLabel>
                        <FormDescription className='text-xs'>
                          Password must be at least 6 characters long, include
                          both letters and at least one number or symbol (e.g.,{" "}
                          <code>abc123</code>, <code>abc!@#</code>).
                        </FormDescription>
                        <FormControl>
                          <Input
                            required
                            type='password'
                            className='h-14 rounded-xl'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='flex space-x-2 mb-6'>
                    <Checkbox id='terms' required />
                    <label
                      htmlFor='terms'
                      className='text-sm relative bottom-1 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                      By creating an account you agree with our
                      <Link className='underline text-sm ml-1' href='#'>
                        Terms of Service
                      </Link>
                      , Privacy Policy, and our default
                      <Link className='underline text-sm ml-1' href='#'>
                        Notification Settings.
                      </Link>
                    </label>
                  </div>

                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='rounded-full w-full h-14 text-sm mb-12'>
                    {isSubmitting && (
                      <LoaderCircle size={20} className='mr-2 animate-spin' />
                    )}
                    Create Account
                  </Button>
                </>
              )}
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
