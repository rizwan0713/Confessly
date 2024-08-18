import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";


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

        }),
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
          })
    ],
    callbacks:{

        async signIn({ user, account, profile}){
            await dbConnect();
            console.log("user through in Sign in using providers:",user)
            // user value through in Sign in using providers: {
            //     id: '100722680901598566756',
            //     name: 'Mohd Rizwan Salmani',
            //     email: 'rizwansalmanirsa@gmail.com',
            //     image: 'https://lh3.googleusercontent.com/a/ACg8ocIxTfTGf0ZmUAn03twniMmNMJP8uGTuWxxBdkxiEOieF1ytQxAd=s96-c'
            //   }



            // console.log({ user, account, profile})
            // first check the email is alreay present in database or not
            // if yes - it means details are already saved - do nothing
            // if no - save the details in the database 
            const email = user.email
            // TODO: will handle profile.login  typescript issue
            const userFound = await UserModel.findOne({email})
            if(!userFound){
              console.log('new user')
              // save it to database 
              const password = Math.floor(10000+ Math.random()*9000).toString()
              const expiryDate = new Date();
              expiryDate.setHours(expiryDate.getHours() + 1);
              const hashedPassword = await bcrypt.hash(password, 10);
              const newUser = new UserModel({
                username : user.name,
                email,
                password: hashedPassword,
                verifyCode:"not required",
                verifyCodeExpiry: expiryDate,
                isVerified: true,
                isAcceptingMessage: true,
                messages: [],
              });
              await newUser.save();
            }else{
              // already saved in database
              // console.log('already saved to database just login')
            }
            return true
          },

        async jwt({ token, user, }) {
            if(user){
                console.log("user inside jwt auth options",user)
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username
            }
            return token
        },
        async session({ session,  token }) {

            if(token){
                
                session.user._id = token._id
                console.log("token ki in session",token)

                console.log("token ki id in session",token._id)
                console.log("session.user._id ",session.user._id )
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username

                
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