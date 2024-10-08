import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";



export async function GET(request:Request){
    await dbConnect()
    // console.log("get messages route mein huin")

    const session = await getServerSession(authOptions);
    // console.log("Session in api get-messages route.ts ",session);
    const user: User = session?.user as User;
    // console.log("user in api get-messages route.ts ",user);
    console.log("inside get message route session ",session)
    console.log("inside get message route user:",user)

  
          if (!session || !session.user) {
              return Response.json(
              {
                  success: false,
                  message: "Not Authenticatedededed",
              },
              {
                  status: 401,
              }
              );
          }
  
        //   const userId = user._id;  // this line is okay but when we use aggregation 

        //then we have to wrote like this because we have converted user.ID into string in options.ts File

        const userId = new mongoose.Types.ObjectId(user._id)  //This is correct
        const email = user?.email;
        try {
            console.log("userId",userId)

            const user =  await UserModel.aggregate([
                {$match:{email:email}},
                {$unwind:"$messages"},
                {$sort:{"messages.createdAt": -1}},
                {$group:{_id:'$_id',messages:{$push:'$messages'}}}

            ]).exec()

       console.log("user ki value",user)
            if(!user || user.length === 0){
                return Response.json({
                    success:false,
                    message:"No Message to display "
                },{status:404})
            }
          console.log("here i am")

            return Response.json({
                success:true,
                //Messages array  ||  Using mongodb aggregation
                messages: user[0].messages,
            },{status:200})

        } catch (error) {
            console.log("An unexpected error occured:",error)

            return Response.json({
                success:false,
                message:"Internal server error'"
            },{status:500})
            
        }
}