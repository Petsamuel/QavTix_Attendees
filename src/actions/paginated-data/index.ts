"use server"

import { getServerAxios } from "@/lib/axios"

export interface FetchParams {
    endpoint:     string
    staticParams: Record<string, string>
    filterParams: Record<string, string | string[]>
    page:         number
    search:       string
}

export interface FetchResult<T> {
    success:      boolean
    results:      T[]
    count:        number
    next:         number | null
    total_pages?: number
    message?:     string
}

export async function fetchPaginatedData<T>(params: FetchParams): Promise<FetchResult<T>> {
    const axiosInstance = await getServerAxios()

try {
        const requestParams: Record<string, any> = {
            ...params.staticParams,
            ...params.filterParams,
            page: params.page,
            ...(params.search ? { search: params.search } : {}),
        }

        const endpoint = params.endpoint.startsWith('/') ? params.endpoint : `/${params.endpoint}`

        const { data } = await axiosInstance.get(endpoint, { params: requestParams })

        const d = data.data ?? data

        return {
            success:     true,
            results:     d?.results    ?? [],
            count:       d?.count      ?? 0,
            next:        d?.next       ?? null,
            total_pages: d?.total_pages ?? undefined,
        }
    } catch (err: any) {
        console.log("[fetchPaginatedData] status :", err?.response?.status)
        console.log("[fetchPaginatedData] url    :", err?.config?.baseURL + err?.config?.url)
        console.log("[fetchPaginatedData] params :", JSON.stringify(err?.config?.params))
        console.log("[fetchPaginatedData] body   :", JSON.stringify(err?.response?.data))
        return { success: false, results: [], count: 0, next: null, message: "Request failed" }
    }
}