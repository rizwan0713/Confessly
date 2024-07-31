import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions  = {
    providers:[
        CredentialsProvider({

            id:"credentials",
            name:"credentials",
            credentials: {
                email: { label: "Email", type: "text", },
                password: { label: "Password", type: "password" }
              },

              async authorize(credentials:any):Promise<any>{
                  await  dbConnect()
                  try{
                      
                      console.log("idhar hun mein00");
                      const user =   await UserModel.findOne({
                          
                          $or:[
                              {email:credentials.identifier},
                              {username:credentials.identifier},
                            ]
                        })
                        
                        if(!user){
                            throw new Error("No user Find With This Email")
                        }
                        
                        if(!user.isVerified){
                            throw new Error("Please verify your Account before login")
                         }

                       const isPasswordCorrect =   await bcrypt.compare(credentials.password,user.password)

                       if(isPasswordCorrect){
                           return user
                       }
                       else{
                        throw new Error("Incorrect Password")
                       }
                  }
                  catch(error:any){
                     throw new Error(error)
                  }

              }

        })
    ],
    callbacks:{
        async jwt({ token, user, }) {
            if(user){
                // console.log("inside option.ts JWT callback - User:", user);
                // console.log("inside option.ts JWT callback - token", token);


                token._id = user._id?.toString();
                // console.log("token._id is:",token._id)
                token.isVerified = user.isVerified;
                // console.log(" token.isVerified  is:", token.isVerified )

                token.isAcceptingMessage = user.isAcceptingMessage;
                // console.log(" token.isAcceptingMessage  is:", token.isAcceptingMessage )

                token.username = user.username
                // console.log("token.username is:",token.username)

                // token.username = user.username
            }
            return token
        },
        async session({ session,  token }) {

            if(token){
               
                // console.log(" Inside options.ts Session callback - Token2:", session);
               


                session.user._id = token._id
                // console.log("session.user._id is:",session.user._id)
                session.user.isVerified = token.isVerified
                // console.log("session.user.isVerified is:",session.user.isVerified)
                session.user.isAcceptingMessage = token.isAcceptingMessage
                // console.log("session.user.isAcceptingMessage is:",session.user.isAcceptingMessage)

                session.user.username = token.username
                // console.log("session.user.usernameis:",session.user.username)
                // console.log("Session before return :",session)
                
            }
            return session
        }
          
    },
    pages:{
        signIn:"/sign-in"
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}