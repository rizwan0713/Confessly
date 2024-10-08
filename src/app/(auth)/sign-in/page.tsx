'use client'
import React from 'react'

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

import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import Image from 'next/image';

function SignInPage ()   {


  const { toast } = useToast();
  const router = useRouter();

  //zod Implementation


  const form = useForm<z.infer<typeof signInSchema>>({
    
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    

    //using next auth for sign in
        const result =  await signIn('credentials',{
          redirect:false,
          identifier:data.identifier,
          password:data.password
        });

      console.log("Here i 2 resule:",result);

  if (result?.error) {
    if (result.error === 'CredentialsSignin') {
      toast({
        title: 'Login Failed',
        description: 'Incorrect username or password',
        variant: 'destructive',
      });
    }
    
  }

  if(result?.url){
    console.log("Here i am")
    router.replace("/dashboard")
    console.log("Here i am")

  };


};


return (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-r dark:from-slate-900 ">
    <div className="w-full max-w-md p-8 space-y-8  rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 dark:text-white">
          Join Confessly
        </h1>
        <p className="mb-4">Sign-In to start Your anonymous adventure </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          

          <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                  <Input placeholder="email/username" {...field} />
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
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit"  >
           Sign In
          </Button>
        </form>
      </Form>
     


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

      

      <div className="text-center mt-4">
        <p>
        Not a member yet?{" "}
          <Link
            href={"sign-up"}
            className="text-bluw-600 hover:text-blue-800  text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
  
);

}
export default SignInPage;


