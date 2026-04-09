"use server"

import { LOGOUT_PATH } from "@/apiPaths"
import { LOGIN_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { redirect } from "next/navigation"

export const logOut = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_APP_DOMAIN}${LOGOUT_PATH}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    })
    redirect(process.env.NEXT_PUBLIC_APP_DOMAIN || "/")
}


export async function verifyPassword(
    email:    string,
    password: string,
): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(LOGIN_ENDPOINT, { email, password })
        return { success: true }
    } catch (error: any) {
        console.log("[verifyPassword] status:", error?.response?.status)
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}