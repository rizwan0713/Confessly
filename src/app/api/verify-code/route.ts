import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);  //optional hai
    const user = await UserModel.findOne({ username: decodedUsername });
    if(!user){
        return Response.json({
            success:false,
            messsage:"user not found"
        },{
            status:500
        })
    }

    const isCodeValid = user.verifyCode === code
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    if(isCodeValid && isCodeNotExpired){
        user.isVerified = true
        await user.save()


        return Response.json({
            success:true,
            messsage:"Account Verified successfully"
        },{
            status:200
        })

    }else if(!isCodeNotExpired){
        return Response.json({
            success:false,
            messsage:"verification cpde has expired,please sign up again to get a new code"
        },{
            status:500
        })
    }else{
        return Response.json({
            success:false,
            messsage:"Incorrect Verification Code"
        },{
            status:500
        })
    }





  } catch (error) {
    console.error("Error while verifing User", error);
    return Response.json(
      {
        success: false,
        messsage: "Error while verifing User",
      },
      {
        status: 500,
      }
    );
  }
}
