"use server"

import { getServerAxios } from "@/lib/axios"

export interface FetchParams {
    endpoint:     string
    staticParams: Record<string, string>
    filterParams: Record<string, string>
    page:         number
    search:       string
}

export interface FetchResult<T> {
    success: boolean
    results: T[]
    count:   number
    next:    string | null
    message?: string
}

export async function fetchPaginatedData<T>(params: FetchParams): Promise<FetchResult<T>> {
    try {
        const axiosInstance = await getServerAxios()

        const requestParams = {
            ...params.staticParams,
            ...params.filterParams,
            page: params.page,
            ...(params.search ? { search: params.search } : {}),
        }

        // Ensure leading slash so axios baseURL joining works correctly
        const endpoint = params.endpoint.startsWith('/') ? params.endpoint : `/${params.endpoint}`

        console.log("[fetchPaginatedData] endpoint :", endpoint)
        console.log("[fetchPaginatedData] params   :", JSON.stringify(requestParams))

        const { data } = await axiosInstance.get(endpoint, {
            params: requestParams,
        })
        return {
            success: true,
            results: data.data?.results ?? data.results ?? [],
            count:   data.data?.count   ?? data.count   ?? 0,
            next:    data.data?.next    ?? data.next     ?? null,
        }
    } catch (err: any) {
        const status  = err?.response?.status
        const body    = err?.response?.data
        const url     = err?.config?.baseURL + err?.config?.url
        const sentParams = err?.config?.params

        return { success: false, results: [], count: 0, next: null, message: "Request failed" }
    }
}