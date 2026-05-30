"use server"

import { getServerAxios } from "@/lib/axios"
import { FetchParams, FetchResult } from "./index"
import { FAVOURITES_ENDPOINT } from "@/endpoints"

/** Fetch attendees_count map from the public search endpoint for a list of event IDs. */
async function fetchPublicAttendeeCounts(eventIds: string[]): Promise<Record<string, number>> {
    if (eventIds.length === 0) return {}
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/public/search/`)
        url.searchParams.set("limit", "100")
        const res = await fetch(url.toString(), { cache: "no-store" })
        if (!res.ok) return {}
        const json = await res.json()
        const results: { id: string; attendees_count: number }[] = json?.data?.results ?? []
        const idSet = new Set(eventIds)
        const map: Record<string, number> = {}
        for (const event of results) {
            if (idSet.has(event.id)) map[event.id] = event.attendees_count
        }
        return map
    } catch {
        return {}
    }
}

export async function fetchPaginatedDataClient<T>(params: FetchParams): Promise<FetchResult<T>> {
    try {
        const axiosInstance = await getServerAxios()

        const requestParams: Record<string, any> = {
            ...params.staticParams,
            ...params.filterParams,
            page: params.page,
            ...(params.search ? { search: params.search } : {}),
        }

        const endpoint = params.endpoint.startsWith('/') ? params.endpoint : `/${params.endpoint}`

        const { data } = await axiosInstance.get(endpoint, { params: requestParams })

        const d = data.data ?? data
        let results: T[] = d?.results ?? []

        // Enrich attendees_count from the public search API for favourite events
        const isFavourites = params.endpoint === FAVOURITES_ENDPOINT ||
            params.endpoint === `/${FAVOURITES_ENDPOINT}`
        if (isFavourites && results.length > 0) {
            const ids = (results as any[]).map((e) => e.id).filter(Boolean)
            const countMap = await fetchPublicAttendeeCounts(ids)
            results = (results as any[]).map((e) => ({
                ...e,
                attendees_count: countMap[e.id] ?? e.attendees_count,
            })) as T[]
        }

        return {
            success: true,
            results,
            count: d?.count ?? 0,
            next: d?.next ?? null,
            total_pages: d?.total_pages ?? undefined,
        }
    } catch (err: any) {
        console.log("[fetchPaginatedDataClient] status :", err?.response?.status)
        console.log("[fetchPaginatedDataClient] url    :", err?.config?.baseURL + err?.config?.url)
        console.log("[fetchPaginatedDataClient] params :", JSON.stringify(err?.config?.params))
        console.log("[fetchPaginatedDataClient] body   :", JSON.stringify(err?.response?.data))
        return { success: false, results: [], count: 0, next: null, message: "Request failed" }
    }
}
