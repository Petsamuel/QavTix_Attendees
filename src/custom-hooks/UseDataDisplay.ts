"use client"

import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { fetchPaginatedData } from "@/actions/paginated-data"

// Types

export interface PageData<T> {
    results:  T[]
    count:    number
    next:     string | null
    previous: string | null
}

export interface TabSlice<T> {
    results:  T[]
    count:    number
    next:     string | null
    previous: string | null
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

// Single status field replaces isLoading / isLoadingMore / isError / isEmpty booleans.
// Only one status is ever true at a time — no impossible combinations, no flash.
type FetchStatus = "idle" | "loading" | "loadingMore" | "error" | "empty"

export interface TabState<T> {
    items:         T[]
    cachedItems:   T[]
    count:         number
    hasNext:       boolean
    status:        FetchStatus
    // Convenience aliases so consumers don't have to switch on status themselves
    isLoading:     boolean
    isLoadingMore: boolean
    isError:       boolean
    isEmpty:       boolean
    search:        string
    handleSearch:  (query: string) => void
    loadMore:      () => void
}

// Filter param builder

const buildFilterParams = (filters: Partial<FilterValues>): Record<string, string> => {
    const params: Record<string, string> = {}
    if (filters.categories?.length)                                    params.category    = filters.categories.join(',')
    if (filters.dateRange?.from)                                       params.start_date  = format(new Date(filters.dateRange.from), 'yyyy-MM-dd')
    if (filters.dateRange?.to)                                         params.end_date    = format(new Date(filters.dateRange.to),   'yyyy-MM-dd')
    if (filters.priceRange?.min != null && filters.priceRange.min > 0) params.min_price   = String(filters.priceRange.min)
    if (filters.priceRange?.max != null)                               params.max_price   = String(filters.priceRange.max)
    if (filters.status)                                                params.status      = filters.status
    if (filters.ticketType?.length)                                    params.ticket_type = filters.ticketType.join(',')
    return params
}

// Whether any real filter is active (not counting search — that's separate)
const hasActiveFilters = (filters: Partial<FilterValues>): boolean =>
    !!(
        filters.categories?.length ||
        filters.dateRange?.from ||
        filters.dateRange?.to ||
        filters.priceRange?.min ||
        filters.priceRange?.max ||
        filters.status ||
        filters.ticketType?.length
    )

// Single tab hook

const useTabState = <T>(
    config:   TabConfig<T>,
    filters:  Partial<FilterValues>,
    endpoint: string,
): TabState<T> => {

    const [items,       setItems]       = useState<T[]>(config.initialData.results)
    const [cachedItems, setCachedItems] = useState<T[]>(config.initialData.results)
    const [count,       setCount]       = useState(config.initialData.count)
    const [hasNext,     setHasNext]     = useState(!!config.initialData.next)
    const [search,      setSearch]      = useState("")
    const [page,        setPage]        = useState(1)
    const [status,      setStatus]      = useState<FetchStatus>("idle")

    const filtersRef = useRef(filters)
    filtersRef.current = filters

    const initialized = useRef(false)

    const filterKey = [
        filters.categories?.join(',')       ?? '',
        filters.dateRange?.from?.toString() ?? '',
        filters.dateRange?.to?.toString()   ?? '',
        filters.status                      ?? '',
        filters.ticketType?.join(',')       ?? '',
        String(filters.priceRange?.min      ?? ''),
        String(filters.priceRange?.max      ?? ''),
    ].join('|')

    const prevFilterKey = useRef(filterKey)

    // Single fetch trigger — one state drives one effect, no effect races
    const [fetchTrigger, setFetchTrigger] = useState<{
        page:   number
        search: string
        append: boolean
        nonce:  number
    }>({ page: 1, search: "", append: false, nonce: 0 })

    // Core fetch effect — single dependency, stale-fetch cancellation
    useEffect(() => {
        if (!initialized.current) return

        const { page, search, append } = fetchTrigger
        let cancelled = false

        const run = async () => {
            // Set status atomically before fetch starts — no intermediate states
            setStatus(append ? "loadingMore" : "loading")

            const result = await fetchPaginatedData<T>({
                endpoint,
                staticParams: config.staticParams,
                filterParams: buildFilterParams(filtersRef.current),
                page,
                search,
            })

            if (cancelled) return  // discard stale responses entirely

            if (!result.success) {
                // Set items and status together — one render, no flash
                setItems([])
                setStatus("error")
                return
            }

            const newItems = result.results as T[]

            if (newItems.length === 0 && !append) {
                // Set items and status together — one render, no flash
                setItems([])
                setCount(0)
                setHasNext(false)
                setStatus("empty")
                return
            }

            // Success path
            setItems(prev => append ? [...prev, ...newItems] : newItems)
            setCount(result.count)
            setHasNext(!!result.next)
            setStatus(append ? "idle" : "idle")

            // Cache only when no search and no active filters — pure unfiltered results
            if (!search && !hasActiveFilters(filtersRef.current)) {
                setCachedItems(newItems)
            }
        }

        run()
        return () => { cancelled = true }

    }, [fetchTrigger])

    // Filter changes
    useEffect(() => {
        if (!initialized.current) return
        if (prevFilterKey.current === filterKey) return
        prevFilterKey.current = filterKey

        const filtersCleared = !hasActiveFilters(filters)

        if (filtersCleared && !search) {
            // All filters removed and no search — restore cache immediately, no fetch
            setItems(cachedItems)
            setCount(cachedItems.length)
            setHasNext(false)
            setStatus("idle")
            return
        }

        setSearch("")
        setPage(1)
        setFetchTrigger({ page: 1, search: "", append: false, nonce: Date.now() })
    }, [filterKey])

    // Init — must be last so all effects above see initialized=false on first flush
    useEffect(() => {
        initialized.current = true
        return () => { initialized.current = false }
    }, [])

    // Handlers

    const handleSearch = (query: string) => {
        const trimmed = query.trim()

        if (!trimmed) {
            // Search cleared — restore cache immediately, no fetch
            setSearch("")
            setPage(1)
            setItems(cachedItems)
            setCount(cachedItems.length)
            setHasNext(false)
            setStatus(cachedItems.length === 0 ? "empty" : "idle")
            return
        }

        setSearch(trimmed)
        setPage(1)
        setFetchTrigger({ page: 1, search: trimmed, append: false, nonce: Date.now() })
    }

    const loadMore = () => {
        if (!hasNext || status === "loadingMore") return
        const nextPage = page + 1
        setPage(nextPage)
        setFetchTrigger(prev => ({ ...prev, page: nextPage, append: true }))
    }

    return {
        items, cachedItems, count, hasNext,
        status,
        isLoading:     status === "loading",
        isLoadingMore: status === "loadingMore",
        isError:       status === "error",
        isEmpty:       status === "empty",
        search, handleSearch, loadMore,
    }
}

// Main hook

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