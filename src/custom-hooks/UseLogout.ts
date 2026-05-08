"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const LOGOUT_CHANNEL_NAME = 'qavtix-logout-channel'

export function useLogOut() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const channel = new BroadcastChannel(LOGOUT_CHANNEL_NAME)
        channel.onmessage = (event) => {
            if (event.data === 'LOGOUT') {
                window.location.reload()
            }
        }
        return () => channel.close()
    }, [])

    const handleLogOut = async () => {
        if (isLoggingOut) return
        setIsLoggingOut(true)

        await fetch("/api/auth/logout", { method: "POST" })
        setIsLoggingOut(false)

        const channel = new BroadcastChannel(LOGOUT_CHANNEL_NAME)
        channel.postMessage('LOGOUT')
        channel.close()

        window.location.href = process.env.NEXT_PUBLIC_APP_DOMAIN || "https://qavtix.com"

    }

    return { handleLogOut, isLoggingOut }
}