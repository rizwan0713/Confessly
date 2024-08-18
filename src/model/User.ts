import mongoose,{Schema,Document} from "mongoose";

//typeScript ka code
 export interface Message extends Document{
  _id:string 
 content:string
 createdAt:Date
}

//mongoose Code
const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

//type Script ka code
export interface User extends Document{
    username:string;
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMessages:boolean,
    messages:Message[]
   }
   

   
//mongoose Code
const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"Username is Required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"password is Required"],
    },
    verifyCode:{
        type:String,
        required:[true,"Verify Code is Required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify Code Expiry is Required"],
    },
    isVerified:{
        type:Boolean,
        default:false, 
   },
   isAcceptingMessages:{
    type:Boolean,
    default:true, 
    },
    //
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",UserSchema)
export default UserModel;