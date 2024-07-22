import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";



export async function GET(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
  
          if (!session || !session.user) {
              return Response.json(
              {
                  success: false,
                  message: "Not Authenticated",
              },
              {
                  status: 401,
              }
              );
          }
  
        //   const userId = user._id;  // this line is okay but when we use aggregation 

        //then we have to wrote like this because we have converted user.ID into string in options.ts File

        const userId = new mongoose.Types.ObjectId(user._id)  //This is correct

        try {
            const user =  await UserModel.aggregate([
                {$match:{id:userId}},
                {$unwind:"$messages"},
                {$sort:{"messages.createdAt": -1}},
                {$group:{_id:'$_id',messages:{$push:'$messages'}}}

            ])

            if(!user || user.length === 0){
                return Response.json({
                    success:false,
                    messsage:"User not Found"
                },{status:401})
            }

            return Response.json({
                success:true,
                //Messages array  ||  Using mongodb aggregation
                messsages: user[0].messages
            },{status:401})

        } catch (error) {
            console.log("An unexpected error occured:",error)

            return Response.json({
                success:false,
                message:"user Not Found"
            },{status:500})
            
        }
}