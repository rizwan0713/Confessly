'use client'
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
//if you only need z
// import { z } from "zod"

//if you want everything from the module
import * as z from "zod"
import Link from "next/link"
 import { useState } from "react"
 import { useDebounceValue } from 'usehooks-ts' // because we want to handle setvalue not value

import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

const page = () => {

  const [username,setUserName] = useState('')
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername,setIsCheckingUsername] = useState(false)
  const [isSubmitting,setIsSubmitting] = useState(false)

  //Debouncing using  usehook-ts
  const debouncedUsername = useDebounceValue(username,300)
  const {toast} = useToast()
  const router = useRouter()

  //zod Implementation
  const form

  return (
    <div></div>
  )
}

export default page
