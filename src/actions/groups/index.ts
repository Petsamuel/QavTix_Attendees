"use server"

import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CREATE_GROUP_ENDPOINT, DELETE_GROUP_ENDPOINT, EDIT_GROUP_ENDPOINT, GET_GROUPS_ENDPOINT } from "@/endpoints"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"

export interface GroupMemberItem {
    email: string
}

export interface Group {
    id:           string
    name:         string
    member_count: string
    members:      GroupMemberItem[]
}

interface GroupsResult {
    success:  boolean
    data?:    Group[]
    message?: string
}

interface MutateGroupResult {
    success:  boolean
    data?:    Group
    message?: string
}

export async function getGroups(): Promise<GroupsResult> {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_GROUPS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                next: { tags: [CACHE_TAGS.GROUPS], revalidate: 3600 },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        const raw = json.data ?? json
        const groups = Array.isArray(raw) ? raw : []

        return { success: true, data: groups }
    } catch (error: any) {
        console.log("[getGroups] error:", error)
        return { success: false, message: "Failed to load groups." }
    }
}

export async function createGroup(payload: {
    name:    string
    members: string[]
}): Promise<MutateGroupResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.post(CREATE_GROUP_ENDPOINT, {
            name:    payload.name,
            members: payload.members.map(email => ({ email })),
        })
        revalidateTag(CACHE_TAGS.GROUPS, "max")
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        console.log("[createGroup] status:", error?.response?.status)
        console.log("[createGroup] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function updateGroup(
    groupID: string,
    payload: { name: string; members: string[] },
): Promise<MutateGroupResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.patch(EDIT_GROUP_ENDPOINT.replace("[group_id]", groupID), {
            name:    payload.name,
            members: payload.members.map(email => ({ email })),
        })
        revalidateTag(CACHE_TAGS.GROUPS, "max")
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        console.log("[updateGroup] status:", error?.response?.status)
        console.log("[updateGroup] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function deleteGroup(groupID: string): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.delete(DELETE_GROUP_ENDPOINT.replace("[group_id]", groupID))
        revalidateTag(CACHE_TAGS.GROUPS, "max")
        return { success: true }
    } catch (error: any) {
        console.log("[deleteGroup] status:", error?.response?.status)
        console.log("[deleteGroup] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}