"use client"

import { useAppSelector } from "@/lib/redux/hooks"
import CustomAvatar from "../custom-utils/avatars/CustomAvatar"
import NeedHelpButton from "../buttons/NeedHelpButton"

export default function AuthUserDetailsWithActiveStatus() {

    const { user } = useAppSelector(store => store.authUser)

    return (
        <div className="flex items-center gap-2">
            <NeedHelpButton />
            <div className="relative w-fit">
                <div className="relative p-[2px] rounded-full overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-150 shrink-0 size-9 ring-brand-primary-5!">
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7,#ef4444)] animate-[spin_3s_linear_infinite]" />
                    <CustomAvatar id={user?.id || ""} profileImg={user?.profile_picture} name={user?.full_name || ""} size="w-full h-full relative z-10 !ring-0" />
                </div>

                <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white animate-ping z-30" />
                <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-green-500 z-30" />
            </div>
        </div>
    )
}