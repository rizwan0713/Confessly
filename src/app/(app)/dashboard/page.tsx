'use client'

import { useToast } from "@/components/ui/use-toast"
import { Message } from "@/model/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { useCallback, useState } from "react"
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
    },[setValue])

  return (
    <div>Dashboard</div>
  )
}

export default page