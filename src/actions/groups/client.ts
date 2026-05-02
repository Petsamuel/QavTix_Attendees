"use server"

import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CREATE_GROUP_ENDPOINT, DELETE_GROUP_ENDPOINT, EDIT_GROUP_ENDPOINT } from "@/endpoints"
import { CACHE_TAGS } from "@/cache-tags"

export interface GroupMemberItem {
    email: string
}

export interface Group {
    id: string
    name: string
    member_count: string
    members: GroupMemberItem[]
}

interface MutateGroupResult {
    success: boolean
    data?: Group
    message?: string
    non_existing_users?: string[]
}

export async function createGroup(payload: {
    name: string
    members: string[]
}): Promise<MutateGroupResult> {
    const axiosInstance = await getServerAxios()
    try {
        const { data } = await axiosInstance.post(CREATE_GROUP_ENDPOINT, {
            name: payload.name,
            members: payload.members.map(email => ({ email })),
        })
        revalidateTag(CACHE_TAGS.GROUPS, "max")
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        return {
            success: false,
            message: handleApiError(error?.response?.data),
            non_existing_users: error?.response?.data?.data?.non_existing_users
        }
    }
}

export async function updateGroup(
    groupID: string,
    payload: { name: string; members: string[] },
): Promise<MutateGroupResult> {
    const axiosInstance = await getServerAxios()
    try {
        const { data } = await axiosInstance.patch(EDIT_GROUP_ENDPOINT.replace("[group_id]", groupID), {
            name: payload.name,
            members: payload.members.map(email => ({ email })),
        })
        revalidateTag(CACHE_TAGS.GROUPS, "max")
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        console.log("[updateGroup] error response:", JSON.stringify(error?.response?.data, null, 2))
        return {
            success: false,
            message: handleApiError(error?.response?.data),
            non_existing_users: error?.response?.data?.data?.non_existing_users
        }
    }
}

export async function deleteGroup(groupID: string): Promise<{ success: boolean; message?: string }> {
    const axiosInstance = await getServerAxios()
    try {
        await axiosInstance.delete(DELETE_GROUP_ENDPOINT.replace("[group_id]", groupID))
        revalidateTag(CACHE_TAGS.GROUPS, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}
