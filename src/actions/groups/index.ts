"use server"

import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidatePath } from "next/cache"
import { SETTINGS_SUB_LINKS } from "@/enums/navigation"
import { CREATE_GROUP_ENDPOINT, DELETE_GROUP_ENDPOINT, EDIT_GROUP_ENDPOINT, GET_GROUPS_ENDPOINT } from "@/endpoints"

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
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(GET_GROUPS_ENDPOINT)
        return { success: true, data: data.data ?? data }
    } catch (error: any) {
        console.log("[getGroups] status:", error?.response?.status)
        console.log("[getGroups] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
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
        revalidatePath(SETTINGS_SUB_LINKS[3].href)
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
        revalidatePath(SETTINGS_SUB_LINKS[3].href)
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
        revalidatePath(SETTINGS_SUB_LINKS[3].href)
        return { success: true }
    } catch (error: any) {
        console.log("[deleteGroup] status:", error?.response?.status)
        console.log("[deleteGroup] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}