import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const UserNameQuerySchema = z.object({
    username:usernameValidation
})


export async function GET(request:Request){

    // //
    // if(request.method !== 'GET'){
    //     return Response.json({
    //         success:false,
    //         message:"Only GET Method allowed",
    //     },{status:405})
    // }
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username:searchParams.get('username')
        }

        //validate with zod
        const result = UserNameQuerySchema.safeParse(queryParam)
        console.log(result,"result of username checking unique")

        if(!result.success){
             const usernameErrors = result.error.format().username?._errors || []
             return Response.json({
                success:false,
                message:usernameErrors?.length > 0
                ? usernameErrors.join(',')
                :'Invalid query parameters',
             },{
                status:400
             })
        }

        const {username} = result.data

       const existingVerifieduser =  await UserModel.findOne({username,isVerified:true})

       if(existingVerifieduser){

        return Response.json({
            success:false,
            message:'Username is already Taken',
         },{
            status:400
         })
       }
       
        return Response.json({
            success:true,
            message:'Username is unique',
        },{
            status:400
        })

        
    } catch (error) {
        console.error("Error while checking username",error)
        return Response.json({
            success:false,
            messsage:"Error checking username"
        },{
            status:500
        })
    }

}