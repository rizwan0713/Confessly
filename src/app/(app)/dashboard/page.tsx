'use client'

import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/model/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
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

        setIsLoading(true)
        setSwitchLoading(false)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
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
                description:axiosError.response?.data.message || "failed to fetch Message setting",
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
  return (
    <div>Dashboard</div>
  )
}

export default page