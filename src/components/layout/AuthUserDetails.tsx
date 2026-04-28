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
                <CustomAvatar id={user.id || ""} profileImg={user.profile_picture} name={user.full_name || ""} size="size-9" />
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
                        <DropdownMenuItem className="cursor-pointer text-brand-secondary-9 text-xs font-medium bg-red-50/50">
                            <button onClick={handleLogOut} disabled={isLoggingOut} className="flex items-center gap-2">
                                {isLoggingOut ? (
                                    <Icon icon="eos-icons:three-dots-loading" width="20" height="20" className="text-brand-primary-darkRed" />
                                ) : (
                                    <Icon icon="solar:logout-2-outline" width="40" height="40" aria-hidden="true" className="text-brand-primary-darkRed block" />
                                )}
                                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
            :
            <AuthUserDetailsSkeletonLoader />
    )
}