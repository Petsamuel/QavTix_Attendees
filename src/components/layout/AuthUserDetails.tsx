"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Icon } from "@iconify/react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { useEffect, useState } from "react"
import { setAuthUser } from "@/lib/redux/slices/authUserSlice"
import { usePathname, useRouter } from "next/navigation"
import AuthUserDetailsSkeletonLoader from "../loaders/AuthUserDetailsSkeletonLoader"
import { getInitialsFromName } from "@/helper-fns/getInitialFromName"

export default function AuthUserDetails() {

    // Use local state to prevent hydration mismatch
    const [isMounted, setIsMounted] = useState(false)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathName = usePathname()
    
    const { profile_img, email, full_name, id: userID } = useAppSelector(store => store.authUser)
    
    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    if (!isMounted) {
        return <AuthUserDetailsSkeletonLoader />
    }
    
    return (
        userID ? (
        <div className="flex items-center gap-2">
            <Avatar>
                <AvatarImage src={profile_img || ""} />
                <AvatarFallback className="uppercase">{full_name && getInitialsFromName(full_name)}</AvatarFallback>
            </Avatar>
            <div className={`shrink w-3/5`}>
            <p className="truncate capitalize text-[.83rem] font-medium">{full_name}</p>
            <p className="truncate capitalize text-[.83rem] font-normal">{email}</p>
            </div>
            <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-darkbg-brand-primary-darkRed-400">
                <Icon icon="radix-icons:caret-sort" width="30" height="30" aria-label="open" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                sideOffset={5}
                align="start"
                forceMount
                className="text-brand-primary-dark_slate z-99 py-3">
                <DropdownMenuItem className="text-xs border-b pb-2">
                    <span>{full_name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-brand-primary-darkRed font-medium bg-red-50/50">
                    <Icon icon="solar:logout-2-outline" width="40" height="40" aria-hidden="true" className="text-brand-primary-darkRed block" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
        ) : (
         <AuthUserDetailsSkeletonLoader />
        )
    )
}