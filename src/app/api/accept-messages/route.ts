import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


// route will handle the toggle functionality - on/off

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    console.log("sessnion in accepoting messages",session)
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


  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      {email:user.email},
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          succes: false,
          message: "failed to update user status to accept messages",
        },
        {
          status: 401,
        }
      );
    }

     // Successfully updated message acceptance status
    return Response.json(
      {
        succes: true,
        message: "message acceptance status updated successfully",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages");

    return Response.json(
      {
        succes: false,
        message: "failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}




// route to get status of accepting message
export async function GET(request: Request) {
  dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  console.log("|user value i aceept meesages",user)
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

 

  try {
    
    const email = user.email;


    const foundUser = await UserModel.findOne({email});
    console.log("user value:" ,user)

    console.log("Founduser value:" ,foundUser)
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to update user status to accept messages han ji");

    return Response.json(
      {
        succes: false,
        message: "Error in getting message acceptance status ji ",
      },
      {
        status: 500,
      }
    );
  }
}
