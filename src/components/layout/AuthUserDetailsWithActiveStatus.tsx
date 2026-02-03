"use client"

import { getInitialsFromName } from "@/helper-fns/getInitialFromName"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useAppSelector } from "@/lib/redux/hooks"
import { useEffect, useState } from "react"

export default function AuthUserDetailsWithActiveStatus(){
    
    // Use local state to prevent hydration mismatch
    const [isMounted, setIsMounted] = useState(false)
    
    const { full_name, email, profile_img,  } = useAppSelector(store => store.authUser)
    
    useEffect(() => {
        setIsMounted(true)
    }, [])
  
    return (
        <div className="flex items-center gap-2">
            <div className="relative w-fit">
                <Avatar>
                    <AvatarImage src={profile_img || ""} />
                    <AvatarFallback className="uppercase">{full_name && getInitialsFromName(full_name)}</AvatarFallback>
                </Avatar>

                <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white animate-ping" />
                <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-green-500" />
            </div>
        </div>
    )
}