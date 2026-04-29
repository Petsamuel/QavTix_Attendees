"use client"

import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { hideSnackbar } from "@/lib/redux/slices/snackbarSlice"

export default function Snackbar() {
    const dispatch = useAppDispatch()
    const { isOpen, message, variant } = useAppSelector((state) => state.snackbar)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)

            if (variant === "success" || variant === "error") {
                const timer = setTimeout(() => {
                    setIsVisible(false)
                    setTimeout(() => dispatch(hideSnackbar()), 300) // allow exit animation
                }, 3000)
                return () => clearTimeout(timer)
            }
        } else {
            setIsVisible(false)
        }
    }, [isOpen, variant, dispatch])

    if (!isOpen && !isVisible) return null

    const variantStyles = {
        default: "bg-gray-500 text-white",
        success: "bg-green-600 text-white",
        error: "bg-red-600 text-white",
        loading: "bg-gray-800 text-white",
    }

    const iconMap = {
        default: null,
        success: <Icon icon="lucide:check-circle-2" className="size-4" />,
        error: <Icon icon="lucide:alert-circle" className="size-4" />,
        loading: <Icon icon="lucide:loader-2" className="size-4 animate-spin" />,
    }

    return (
        <div
            className={cn(
                "fixed h-fit bottom-6 right-[5%] z-1000 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all duration-300 min-w-[280px] max-w-md",
                variantStyles[variant],
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
        >
            {iconMap[variant]}
            <p className="text-sm font-medium">{message}</p>
        </div>
    )
}
