"use client";

import Google from "@/components/custom/icon/google";
import { Button } from "@/components/ui/button";
import { signInWithGooglePopup } from "@/lib/firebase";
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
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Home, LoaderCircle, LogOut } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { handleLogin } from "@/lib/firebase/functions";
import { useMutation } from "react-query";
import axios from "axios";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";

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
  const user = useAuthStore((state) => state.user);
  const [toggle, setToggle] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (data: z.infer<typeof FormSchema>) =>
      axios.post("/api/signup", data),
    onSuccess: (res) => {
      toast({
        title: "Account created successfully",
        description: "You can now sign in with your new account.",
      });
      router.push(`/signin`);
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        const { code, details } = error.response.data;

        switch (code) {
          case "VALIDATION_FAILED":
            if (Array.isArray(details)) {
              details.forEach((detail) => {
                const [field, message] = detail.split(": ");
                form.setError(field as "username" | "email" | "password", {
                  type: "manual",
                  message,
                });
              });
            }
            break;
          case "USERNAME_EXISTS":
            form.setError("username", {
              type: "manual",
              message: "This username is already taken.",
            });
            break;
          case "AUTH_FAILED":
            toast({
              variant: "destructive",
              title: "Sign up failed",
              description:
                details || "Authentication failed. Please try again.",
            });
            break;
          default:
            toast({
              variant: "destructive",
              title: "Sign up failed",
              description: "An unexpected error occurred. Please try again.",
            });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    signUpMutation.mutate(data);
  };

  const handleGoogleSignup = async () => {
    const userCredential = await signInWithGooglePopup();
    try {
      if (userCredential.user) {
        const userId = userCredential.user.uid;
        const response = await axios.post(
          `/api/signup?userId=${userId}`,
          null,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.code === "SIGNUP_SUCCESS") {
          toast({
            title: "Account created successfully",
            description: "You can now sign in with your Google account.",
          });
          router.push("/");
        } else {
          throw new Error("Signup failed");
        }
      }
    } catch (error: any) {
      const { code } = error.response.data;
      if (code === "EMAIL_EXISTS") {
        await handleLogin(userCredential.user);
        router.push("/");
      } else {
        toast({
          variant: "destructive",
          title: "Google sign up failed",
          description: "An error occurred during Google sign up",
        });
      }
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
          {user ? (
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
                      disabled={signUpMutation.isLoading}
                      onClick={handleGoogleSignup}
                      type='button'
                      className='rounded-full h-14 text-sm w-full flex flex-1 gap-x-4 mb-8'
                      variant='default'>
                      {signUpMutation.isLoading ? (
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
                      disabled={signUpMutation.isLoading}
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
                            both letters and at least one number or symbol
                            (e.g., <code>abc123</code>, <code>abc!@#</code>).
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

                    {/* ... (checkbox for terms) ... */}

                    <Button
                      type='submit'
                      disabled={signUpMutation.isLoading}
                      className='rounded-full w-full h-14 text-sm mb-12'>
                      {signUpMutation.isLoading && (
                        <LoaderCircle size={20} className='mr-2 animate-spin' />
                      )}
                      Create Account
                    </Button>
                  </>
                )}
              </form>
            </Form>
          )}
        </div>
      </section>
    </div>
  );
};

export default SignUp;
