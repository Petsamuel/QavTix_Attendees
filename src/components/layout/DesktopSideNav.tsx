"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon } from "@iconify/react"
import Logo from "./Logo"
import { NAVIGATION_LINKS, SETTINGS_SUB_LINKS } from "@/enums/navigation"
import AuthUserDetails from "./AuthUserDetails"
import { cn } from "@/lib/utils"

function DesktopSideNav() {
    const pathName = usePathname()
    
    // Dropdown logic: Only open if we are within the account-settings path
    const isSettingsActive = pathName?.startsWith(NAVIGATION_LINKS.ACCOUNT_SETTINGS.href)


    const isActiveRoute = (route: string) => {
        if (!pathName) return false;

        if (route === "/dashboard") {
            return pathName === "/dashboard";
        }

        return pathName === route || pathName.startsWith(`${route}/`)
    }

    return (
        <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-60 flex-col justify-between gap-8 bg-white p-4 py-6 text-sm font-medium text-brand-secondary-9 border-r border-gray-100 overflow-y-auto">
            <div>
                <Logo width={120} />
                <ul className="mt-8 flex flex-col gap-2">
                    {Object.values(NAVIGATION_LINKS).map((v) => {
                        const isActive = isActiveRoute(v.href)
                        const isSettingsLink = v.href === NAVIGATION_LINKS.ACCOUNT_SETTINGS.href

                        return (
                            <li key={v.href} className="flex flex-col">
                                <Link
                                    href={isSettingsLink ? SETTINGS_SUB_LINKS[0].href : v.href}
                                    className={cn(
                                        "relative flex items-center gap-2 text-sm px-3 min-h-12 rounded-md transition-all duration-200",
                                        isActive || (isSettingsLink && isSettingsActive)
                                            ? "bg-brand-primary-6 text-white" 
                                            : "hover:bg-brand-primary-4 hover:text-white/90 text-brand-secondary-9 font-normal"
                                    )}
                                >
                                    <Icon icon={v.icon || ""} width="20" height="20" />
                                    <span>{v.label}</span>
                                    
                                    <Icon 
                                        icon="basil:caret-right-outline" 
                                        width="24" 
                                        height="24" 
                                        className={cn(isActive && isSettingsLink && isSettingsActive && "rotate-90" , "absolute right-1")} 
                                    />
                                </Link>

                                {/* Dropdown Menu: Only renders/expands if isSettingsActive is true */}
                                {isSettingsLink && (
                                    <div className={cn(
                                        "grid transition-all duration-300 ease-in-out overflow-hidden",
                                        isSettingsActive ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                                    )}>
                                        <ul className="relative ml-3 flex flex-col min-h-0">
                                            <div className="absolute left-0 top-0 h-[88%] my-auto bottom-0 w-px bg-brand-neutral-5" />
                                            
                                            {SETTINGS_SUB_LINKS.map((sub) => {
                                                const isSubActive = pathName === sub.href
                                                return (
                                                    <li key={sub.href} className="relative flex items-center">
                                                        {/* Connecting Dot */}
                                                        <div className={cn(
                                                            "absolute -left-[3.5px] z-10 size-2 rounded-full border transition-colors border-brand-secondary-3/50 bg-brand-secondary-2"
                                                        )} />
                                                        
                                                        <Link
                                                            href={sub.href}
                                                            className={cn(
                                                                "flex-1 py-3 ml-3 pl-3 text-[13px] transition-colors",
                                                                isSubActive 
                                                                    ? "text-brand-primary-6 bg-brand-primary-1 font-semibold rounded-md" 
                                                                    : "text-brand-secondary-7 hover:text-brand-primary-6"
                                                            )}
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
            <AuthUserDetails />
        </nav>
    )
}

export default DesktopSideNav