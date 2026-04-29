"use server"

import { cacheTag } from "next/cache"
import { CATEGORIES_ENDPOINT } from "@/endpoints"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"

export interface ApiCategory {
    id: number
    name: string
}

export interface GetCategoriesResult {
    success: boolean
    data: ApiCategory[]
    message?: string
}

export async function getCategories(): Promise<GetCategoriesResult> {
    const accessToken = (await cookies()).get("access_token")?.value;
    return _getCategories(accessToken)
}

async function _getCategories(accessToken: string | undefined): Promise<GetCategoriesResult> {
    "use cache"
    cacheTag(CACHE_TAGS.CATEGORIES)
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${CATEGORIES_ENDPOINT}`, {
            headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) return { success: false, data: [] }

        const json = await res.json()
        return { success: true, data: json.data ?? [] }
    } catch {
        return { success: false, data: [] }
    }
}