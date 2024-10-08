import "next-auth"
import { DefaultSession } from "next-auth";

//Predefined user ko update kr rhe hain to give more power to TOKEN

declare module 'next-auth'{
 interface User{
    _id?:string;
    isVerified?:boolean;
    isAcceptingMessage?:boolean;
    username?:string
 }
 interface Session{
    user:{
        _id?:string;
         isVerified?:boolean;
         isAcceptingMessage?:boolean;
         username?:string
    } & DefaultSession['user']
 }
}

declare module 'next-auth/jwt'{
    interface JWT {
        _id?:string;
         isVerified?:boolean;
         isAcceptingMessage?:boolean;
         username?:string
    }
}