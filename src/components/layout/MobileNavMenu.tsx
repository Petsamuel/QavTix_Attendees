"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_LINKS } from "@/enums/navigation";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import AuthUserDetails from "./AuthUserDetails";
import { useEffect } from "react";

interface MobileNavMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileNavMenu({ isOpen, onClose }: MobileNavMenuProps) {
    const pathName = usePathname()

    const isActiveRoute = (route: string) => {
        if (!pathName) return false;
        if (pathName === "/dashboard") return route === pathName;
        const routeSegment = route.split('/')[1];
        const currentSegment = pathName.split('/')[1];
        return currentSegment?.startsWith(routeSegment) ?? false;
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
        } else {
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "0px";
        }
        return () => {
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "0px";
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-99"
                    />

                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }} 
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 h-full w-70 bg-brand-accent-1 z-100 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <Logo width={100} />
                                <button 
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-brand-accent-3/50 text-brand-secondary-9"
                                >
                                    <Icon icon="lineicons:close" className="size-3" />
                                </button>
                            </div>

                            <ul className="flex flex-col gap-3">
                                {Object.values(NAVIGATION_LINKS).map((v) => {
                                    const isActive = isActiveRoute(v.href);
                                    return (
                                        <li key={v.href}>
                                            <Link
                                                href={v.href}
                                                onClick={onClose}
                                                className={cn(
                                                    "relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-[13px]",
                                                    isActive 
                                                        ? "bg-brand-accent-4 text-white font-bold" 
                                                        : "text-brand-secondary-9 hover:bg-brand-accent-3/50"
                                                )}
                                            >
                                                <Icon icon={v.icon} className="size-5" />
                                                <span>{v.label}</span>
                                                
                                                {isActive && (
                                                    <Icon 
                                                        icon="basil:caret-right-outline" 
                                                        className="absolute right-3 size-5" 
                                                    />
                                                )}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="pt-6 border-t border-brand-accent-3/30">
                            <AuthUserDetails />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}