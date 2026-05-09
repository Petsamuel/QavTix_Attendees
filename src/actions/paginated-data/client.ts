"use server"

import { getServerAxios } from "@/lib/axios"
import { FetchParams, FetchResult } from "./index"

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

        return {
            success: true,
            results: d?.results ?? [],
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
