"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Icon } from "@iconify/react"
import { useAppSelector } from "@/lib/redux/hooks"
import { useEffect, useState } from "react"
import AuthUserDetailsSkeletonLoader from "../loaders/AuthUserDetailsSkeletonLoader"
import CustomAvatar from "../custom-utils/avatars/CustomAvatar"
import { useLogOut } from "@/custom-hooks/UseLogout"

export default function AuthUserDetails() {

    // Use local state to prevent hydration mismatch
    const [isMounted, setIsMounted] = useState(false)
    const { handleLogOut, isLoggingOut } = useLogOut()
    const { isAuthenticated, user } = useAppSelector(store => store.authUser)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <AuthUserDetailsSkeletonLoader />
    }

    return (
        isAuthenticated && user?.id ? (
            <div className="flex items-center gap-2">
                <div className="relative p-[2px] rounded-full overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-150 shrink-0 size-9">
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7,#ef4444)] animate-[spin_3s_linear_infinite]" />
                    <CustomAvatar id={user.id || ""} profileImg={user.profile_picture} name={user.full_name || ""} size="w-full h-full relative z-10 !ring-0" />
                </div>
                <div className={`shrink w-3/5`}>
                    <p className="truncate capitalize text-xs font-medium">{user.full_name}</p>
                    <p className="truncate text-[11px] font-normal">{user.email}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-brand-primary-4">
                        <Icon icon="radix-icons:caret-sort" width="20" height="20" aria-label="open" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        sideOffset={5}
                        align="start"
                        className="text-brand-secondary-8 z-100 py-3">
                        <DropdownMenuItem className="text-xs capitalize border-b pb-2">
                            <span>{user.full_name}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="cursor-pointer text-brand-secondary-9 text-xs font-medium bg-red-50/50"
                            onSelect={(e) => {
                                e.preventDefault();
                                if (!isLoggingOut) handleLogOut();
                            }}
                        >
                            <div className="flex w-full items-center gap-2 opacity-100" aria-disabled={isLoggingOut}>
                                {isLoggingOut ? (
                                    <Icon icon="eos-icons:three-dots-loading" width="20" height="20" className="text-brand-primary-darkRed" />
                                ) : (
                                    <Icon icon="solar:logout-2-outline" width="40" height="40" aria-hidden="true" className="text-brand-primary-darkRed block" />
                                )}
                                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
            :
            <AuthUserDetailsSkeletonLoader />
    )
}