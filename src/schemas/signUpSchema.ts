import {z} from "zod"

export const usernameValidation = z
   .string()
   .min(2,"username Must be atleast 2 Characters")
   .max(20,"Username must be no more than 20")
   .regex(/^[a-zA-Z0-9_]+$/,"username must not contain special characters")



export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"invalid email address"}),
    password:z.string().min(6,{message:"Password must be at least 6 characters"})
})