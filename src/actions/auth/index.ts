"use server"

import { LOGOUT_PATH } from "@/apiPaths"
import { getServerAxios } from "@/lib/axios"
import { redirect } from "next/navigation"

export const logOut = async () => {

    const axiosInstance = await getServerAxios()

    await axiosInstance.post(LOGOUT_PATH)
    redirect(process.env.NEXT_PUBLIC_APP_DOMAIN || "/")
}