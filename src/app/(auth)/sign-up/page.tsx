"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
//if you only need z
// import { z } from "zod"

//if you want everything from the module
import * as z from "zod";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts"; // because we want to handle setvalue not value

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";

function SignUpPage ()  {
  const [username, setUserName] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //Debouncing using  usehook-ts
  const debounced = useDebounceCallback(setUserName, 500);
  const { toast } = useToast();
  const router = useRouter();

  //zod Implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  console.log("checkUsernameUnique function called outside console");
  //Check username Unique
  const checkUsernameUnique = async () => {
    console.log("checkUsernameUnique function called inside");

    if (username) {
      console.log("this is username",username);
      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await axios.get(`/api/check-username-unique?username=${username}`);
        console.log("Printing Rsponse of chechUsername Unique in page.tsx",response);
        setUsernameMessage(response.data.message);
      } catch (error) {
        console.log("Inside errror");
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error Checking Username"
        );
      } finally {
        setIsCheckingUsername(false);
      }
    }
  };

  useEffect(() => {
    checkUsernameUnique()
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/sign-up`,data);
      console.log("printing data signup:", data);
      console.log("response of signup page.tsx",response)
      toast({ title: "success", description: response.data.message });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in SignUp of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r dark:from-slate-900 ">
      <div className="w-full max-w-md p-8 space-y-8 dark:text-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Confessly
          </h1>
          <p className="mb-4">Sign-up to start Your anonymous adventure </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                    
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);

                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>

                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p
                    className={`text-sm ${
                      usernameMessage === "Username is unique"
                        ? "text-green-500"
                        : "text-red-500"
                    } `}
                  >
                    {usernameMessage}
                  </p>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w04 animate-spin"></Loader2>{" "}
                  Please Wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="flex items-center gap-4 ">
                <div className="border flex-1"></div>
                <div>Or</div>
                <div className="border flex-1"></div>
              </div>
              <div className="flex flex-col sm:flex-row items-center -mt-4 gap-4 justify-center ">
                
                <Button
                  className="font-semibold flex-1 w-full"
                  type="button"
                  onClick={() => signIn("google")}
                >
                  SignIn with Google
                  <Image
                    className="ml-2"
                    height={30}
                    width={30}
                    src={"/Google.png"}
                    alt="logo"
                  />
                </Button>
              </div>

        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link
              href={"/sign-in"}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
