'use client'

import { MessageCard } from "@/components/MessgeCard"
import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/model/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@radix-ui/react-separator"
import { Switch } from "@radix-ui/react-switch"
import { Button } from "@react-email/components"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
 
const page = () => {
    const [messages,setMessages] = useState<Message[]>([])
    const[isLoading,setIsLoading] = useState(false)
    const [isSwitchLoading,setSwitchLoading] = useState(false)
    const {toast} = useToast()
    const handleDeleteMessage = (messageIdCustom:string) => {
        setMessages(messages.filter((messageRiz) => messageRiz._id !== messageIdCustom))
    }

    const {data:session} = useSession()
    //ZOD For is accepting MEssages
    const form = useForm({
        resolver:zodResolver(AcceptMessageSchema)
    })
     //Extracting
    const {register,watch,setValue} = form

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback( async () => {
        setSwitchLoading(true)
        try {
           const response = await axios.get<ApiResponse>('/api/accept-messages')
          //  console.log("respoonse  printing get message in dashboard",response)
            setValue('acceptMessages',response.data.isAcceptingMessages)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title:"Error",
                description:axiosError.response?.data.message || "failed to fetch Message setting",
                variant:"destructive"
            })
        }finally{
            setSwitchLoading(false)
        }

    },[setValue])

    const fetchMessages = useCallback( async (refreshRiz :boolean = false) => {
      // console.log("indide fetch Message function")

        setIsLoading(true)
        setSwitchLoading(false)
        try {
          console.log("indide fetch Message function")
          const response = await axios.get<ApiResponse>('/api/get-messages')
          // console.log("response of get messages in dashboard",response)
            setMessages(response.data.messages || [])
           
            if(refreshRiz){
                toast({
                    title:"Refreshed Message",
                    description:"Showing latest messages"
                })
            }

        } catch (error) {
            
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title:"Error",
                description:axiosError.response?.data.message || "failed to get Messages setting",
                variant:"destructive"
            })
        } finally{
            setIsLoading(false)
            setSwitchLoading(false)
        }

    },[setIsLoading,setMessages])

    useEffect(() => {
        if(!session || !session.user) return
         fetchMessages()
         fetchAcceptMessage()

    },[session,setValue,fetchMessages,fetchAcceptMessage])

    //handlen switvch change
    const handleSwitchChange = async () => {
        try {
           const response = await axios.post<ApiResponse>('/api/accept-messages',
                {acceptMessages:!acceptMessages} //for toggling
            )
            setValue('acceptMessages',!acceptMessages) //for Ui change on toggling
            toast({
                title: response.data.message,
                description:"Showing latest messages"
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title:"Error",
                description:axiosError.response?.data.message || "failed to fetch Message setting",
                variant:"destructive"
            })
            
        }
    }

    
    if(!session || !session.user){
      return <div>Please login</div>
    }

   const {username} =  session?.user as User 
  //  console.log("usernmae ki value",username)
   //TODO research on How to find baseUrl
    const baseurl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseurl}/u/${username}`


    //copytoCLipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title:"Url Copied",
            description:"Profile url has been copied to clipboard"

        })
    } 

  






  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
          placeholder="userRiz"
          
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 px-3 mr-2"
          />
           <Button  onClick={copyToClipboard}>  //variant="dark"
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        // variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}  // Assert _id as string
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default page

