"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { fetchPaginatedData } from "@/actions/paginated-data"

export interface PageData<T> {
    results:      T[]
    count:        number
    next:         number | null
    previous:     number | null
    total_pages?: number
}

export interface TabSlice<T> {
    results:      T[]
    count:        number
    next:         number | null
    previous:     number | null
    total_pages?: number
}

export interface TabConfig<T> {
    key:          string
    initialData:  TabSlice<T>
    staticParams: Record<string, string>
}

export interface UseDataDisplayConfig<T> {
    endpoint:   string
    tabs:       TabConfig<T>[]
    activeTab?: string
}

type FetchStatus = "idle" | "loading" | "loadingMore" | "error" | "empty"

export interface TabState<T> {
    items:         T[]
    cachedItems:   T[]
    count:         number
    totalPages:    number
    hasNext:       boolean
    status:        FetchStatus
    isLoading:     boolean
    isLoadingMore: boolean
    isError:       boolean
    isEmpty:       boolean
    search:        string
    handleSearch:  (query: string) => void
    loadMore:      () => void
}

const buildFilterParams = (filters: Partial<FilterValues>): Record<string, string> => {
    const params: Record<string, string> = {}
    if (filters.categories?.length)                                    params.category    = filters.categories.join(',')
    if (filters.dateRange?.from)                                       params.start_date  = format(new Date(filters.dateRange.from), 'yyyy-MM-dd')
    if (filters.dateRange?.to)                                         params.end_date    = format(new Date(filters.dateRange.to),   'yyyy-MM-dd')
    if (filters.priceRange?.min != null && filters.priceRange.min > 0) params.min_price   = String(filters.priceRange.min)
    if (filters.priceRange?.max != null)                               params.max_price   = String(filters.priceRange.max)
    if (filters.status)                                                params.status      = filters.status
    if (filters.ticketType?.length)                                    params.ticket_type = filters.ticketType.join(',')
    if (filters.isMineFilter != null)                                  params.is_mine     = String(filters.isMineFilter)
    return params
}

const hasActiveFilters = (filters: Partial<FilterValues>): boolean =>
    !!(
        filters.categories?.length ||
        filters.dateRange?.from ||
        filters.dateRange?.to ||
        filters.priceRange?.min ||
        filters.priceRange?.max ||
        filters.status ||
        filters.ticketType?.length ||
        filters.isMineFilter != null
    )

const useTabState = <T>(
    config:   TabConfig<T>,
    filters:  Partial<FilterValues>,
    endpoint: string,
): TabState<T> => {

    const [items,       setItems]       = useState<T[]>(config.initialData.results)
    const [cachedItems, setCachedItems] = useState<T[]>(config.initialData.results)
    const [count,       setCount]       = useState(config.initialData.count)
    const [totalPages,  setTotalPages]  = useState(config.initialData.total_pages ?? 1)
    const [hasNext,     setHasNext]     = useState(!!config.initialData.next)
    const [search,      setSearch]      = useState("")
    const [status,      setStatus]      = useState<FetchStatus>("idle")

    const filtersRef       = useRef(filters)
    filtersRef.current     = filters

    const cachedItemsRef   = useRef(cachedItems)
    cachedItemsRef.current = cachedItems

    const searchRef        = useRef(search)
    searchRef.current      = search

    const initialized  = useRef(false)
    const isFetching   = useRef(false)
    const pageRef      = useRef(1)
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const filterKey = [
        filters.categories?.join(',')       ?? '',
        filters.dateRange?.from?.toString() ?? '',
        filters.dateRange?.to?.toString()   ?? '',
        filters.status                      ?? '',
        filters.ticketType?.join(',')       ?? '',
        String(filters.priceRange?.min      ?? ''),
        String(filters.priceRange?.max      ?? ''),
        String(filters.isMineFilter         ?? ''),
    ].join('|')

    const prevFilterKey = useRef(filterKey)

    const fetchData = useRef(async (p: number, s: string, append: boolean) => {
        if (isFetching.current) return
        isFetching.current = true

        setStatus(append ? "loadingMore" : "loading")

        const result = await fetchPaginatedData<T>({
            endpoint,
            staticParams: config.staticParams,
            filterParams: buildFilterParams(filtersRef.current),
            page:   p,
            search: s,
        })

        isFetching.current = false

        if (!result.success) {
            setItems([])
            setStatus("error")
            return
        }

        const newItems = result.results as T[]

        if (newItems.length === 0 && !append) {
            setItems([])
            setCount(0)
            setHasNext(false)
            setTotalPages(0)
            setStatus("empty")
            return
        }

        setItems(prev => append ? [...prev, ...newItems] : newItems)
        setCount(result.count)
        setHasNext(!!result.next)
        setTotalPages(result.total_pages ?? 1)
        setStatus("idle")

        if (!s && !hasActiveFilters(filtersRef.current)) {
            setCachedItems(newItems)
        }
    })

    // Filter effect with debug logs
    useEffect(() => {
        if (!initialized.current) {
            console.log("[useDataDisplay] skipping — not initialized yet")
            return
        }

        if (prevFilterKey.current === filterKey) {
            return
        }

        prevFilterKey.current = filterKey

        if (!hasActiveFilters(filters) && !searchRef.current) {
            pageRef.current = 1
            setItems(cachedItemsRef.current)
            setCount(cachedItemsRef.current.length)
            setHasNext(false)
            setTotalPages(1)
            setStatus("idle")
            return
        }

        setSearch("")
        searchRef.current = ""
        pageRef.current = 1
        fetchData.current(1, "", false)
    }, [filterKey])

    // INIT — must be LAST so filter effect sees initialized=false on mount
    useEffect(() => {
        initialized.current = true
        return () => { initialized.current = false }
    }, [])

    const handleSearch = useCallback((query: string) => {
        const trimmed = query.trim()
        if (debounceTimer.current) clearTimeout(debounceTimer.current)

        if (!trimmed) {
            setSearch("")
            searchRef.current = ""
            pageRef.current = 1
            setItems(cachedItemsRef.current)
            setCount(cachedItemsRef.current.length)
            setHasNext(false)
            setTotalPages(1)
            setStatus(cachedItemsRef.current.length === 0 ? "empty" : "idle")
            return
        }

        setSearch(trimmed)
        searchRef.current = trimmed
        debounceTimer.current = setTimeout(() => {
            pageRef.current = 1
            fetchData.current(1, trimmed, false)
        }, 400)
    }, [])

    const loadMore = useCallback(() => {
        if (!hasNext || status === "loadingMore" || isFetching.current) return
        const nextPage = pageRef.current + 1
        pageRef.current = nextPage
        fetchData.current(nextPage, searchRef.current, true)
    }, [hasNext, status])

    return {
        items, cachedItems, count, totalPages, hasNext,
        status,
        isLoading:     status === "loading",
        isLoadingMore: status === "loadingMore",
        isError:       status === "error",
        isEmpty:       status === "empty",
        search, handleSearch, loadMore,
    }
}

export function useDataDisplay<T>(
    config:  UseDataDisplayConfig<T>,
    filters: Partial<FilterValues>,
): {
    tabStates:      Record<string, TabState<T>>
    activeTabState: TabState<T>
} {
    const activeTab = config.activeTab ?? config.tabs[0].key

    const stateEntries = config.tabs.map(tab =>
        // eslint-disable-next-line react-hooks/rules-of-hooks
        [tab.key, useTabState(tab, filters, config.endpoint)] as const
    )

    const tabStates = Object.fromEntries(stateEntries) as Record<string, TabState<T>>

    return {
        tabStates,
        activeTabState: tabStates[activeTab] ?? tabStates[config.tabs[0].key],
    }
}