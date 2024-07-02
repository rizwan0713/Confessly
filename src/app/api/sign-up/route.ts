import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST (request:Request){
    await  dbConnect()
    
    try{
        const {username,email,password} = await request.json()
         const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
         })

         if(existingUserVerifiedByUsername){
            return Response.json({
                success:false ,message:"Username is already Taken"}
                ,{status:400}
            )
         }

         const existingUserByEmail = await UserModel.findOne({email}) 

         const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
       

         if(existingUserByEmail){
            true
         }
         else{
            const hasedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password:hasedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })

            await newUser.save() 
         }
    }
    catch(error){
        //below line gives error in terminal
        console.log("Error Registtering user",error)
        //below lines gives error in frontend
        return Response.json(
            {
                 success:false,
                 message:"Error registering user"
            },
            {
                status:500
            }
        )
    }


}