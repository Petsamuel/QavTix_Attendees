export interface FetchParams {
    endpoint: string
    staticParams: Record<string, string>
    filterParams: Record<string, string | string[]>
    page: number
    search: string
}

export interface FetchResult<T> {
    success: boolean
    results: T[]
    count: number
    next: number | null
    total_pages?: number
    message?: string
}