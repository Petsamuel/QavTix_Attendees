import { cn } from "@/lib/utils"
import { FilterRenderer } from "./filters/FilterRenderer"
import SearchTableInput1 from "./tools/SearchTableInput"
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";
import DataCountIndicator from "./tools/DataCountIndicator";
import { AffliatesPageFiltersNTabsData, FavouritesPageFiltersNTabsData, MyTicketsFiltersNTabsData, TableDataDisplayFilter } from "./resources/avaliable-filters";
import { usePathname } from "next/navigation";
import { NAVIGATION_LINKS } from "@/enums/navigation";
import { Icon } from "@iconify/react";
import ActiveFilterChips from "./filters/ActiveFilterChip";


interface DataDisplayTableWrapperProps {
    tabs?: typeof MyTicketsFiltersNTabsData.tabList |
        typeof FavouritesPageFiltersNTabsData.tabList |
        typeof AffliatesPageFiltersNTabsData.tabList

    activeTab?:         string
    setActiveTab?:      Dispatch<SetStateAction<string>>
    filters?:           Partial<FilterValues>
    categories?:         Category[]
    setFilters?:        Dispatch<SetStateAction<Partial<FilterValues>>>
    filterOptions?:     readonly TableDataDisplayFilter[]
    showSearch?:        boolean
    searchPlaceholder?: string
    onTabChange?:       (tab: string) => void
    onSearch?:          (query: string) => void
    onFilterChange?:    (filters: FilterValues) => void
    children:           ReactNode
    isLoading?:         boolean
    currentSearch?:     string
    className?:         string

    viewMode?:          "grid" | "list"
    setViewMode?:       Dispatch<SetStateAction<"grid" | "list">>
}

export default function DataDisplayTableWrapper({
    tabs,
    filterOptions,
    showSearch = true,
    searchPlaceholder = 'Search...',
    filters,
    activeTab,
    setActiveTab,
    onSearch,
    currentSearch,
    setFilters,
    categories = [],
    children,
    viewMode = "grid",
    setViewMode,
    className,
}: DataDisplayTableWrapperProps) {

    const pathName = usePathname()

    const wrapperRef = useRef<HTMLDivElement>(null)

    const handleTabChange = (value: string) => {
        setActiveTab?.(value)
        setTimeout(() => {
            wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }, 0)
    }

    return (
        <div ref={wrapperRef} className={cn(
            'pt-8 pb-16 bg-white rounded-3xl shadow-[0px_5.8px_23.17px_0px_#3326AE14] overflow-hidden',
            className
        )}>

            {pathName === NAVIGATION_LINKS.MARKETPLACE.href && (
                <p className="text-brand-neutral-7 text-xs mb-8 flex items-center gap-1 px-4 md:px-5">
                    <Icon icon="carbon:information" className="size-4 text-accent-6" />
                    <span>These are Tickets published for resell</span>
                </p>
            )}

            {/* Tabs */}
            {tabs && activeTab && setActiveTab && (
                <div className="px-4 md:px-5 w-full border-b border-brand-neutral-5 mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => handleTabChange(tab.value)}
                                className={cn(
                                    'relative pb-3 px-1 text-sm transition-colors whitespace-nowrap',
                                    activeTab === tab.value
                                        ? 'text-brand-primary-6 font-bold'
                                        : 'font-medium text-brand-neutral-7 hover:text-brand-neutral-8'
                                )}
                            >
                                <DataCountIndicator label={tab.label} />
                                {activeTab === tab.value && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary-6" />
                                )}
                            </button>
                        ))}
                    </div>

                    {pathName === NAVIGATION_LINKS.FAVOURITES.href && (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setViewMode && setViewMode("grid")}
                                aria-label="Grid view"
                                className={cn(viewMode === "grid" ? "bg-brand-primary-1" : "bg-brand-neutral-2 hover:bg-brand-primary-1/50 hover:shadow", "size-7 rounded-sm -mt-4 flex justify-center items-center text-black")}
                            >
                                <Icon icon="hugeicons:grid-view" width="24" height="24" className="size-5" />
                            </button>
                            <button
                                onClick={() => setViewMode && setViewMode("list")}
                                aria-label="Table view"
                                className={cn(viewMode === "list" ? "bg-brand-primary-1" : "bg-brand-neutral-2 hover:bg-brand-primary-1/50 hover:shadow", "size-7 rounded-sm -mt-4 flex justify-center items-center text-black")}
                            >
                                <Icon icon="lucide-list" width="24" height="24" className="size-5" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Search & Filters */}
            <div className="px-4 md:px-5 shrink-0">
                {showSearch && (
                    <SearchTableInput1
                        placeholder={searchPlaceholder}
                        onSearch={onSearch}
                        currentSearch={currentSearch}
                    />
                )}

                {setFilters && filters && filterOptions && filterOptions.length > 0 && (
                    <div className="flex flex-wrap gap-4 my-4">
                        {filterOptions.map((filter) => (
                            <FilterRenderer
                                key={filter.value}
                                filterKey={filter.value}
                                filter={filter}
                                filters={filters}
                                categories={categories}
                                setFilters={setFilters}
                            />
                        ))}
                    </div>
                )}

                {/* Active filter chips — only renders when a filter has a value */}
                {filters && setFilters && filterOptions && (
                    <ActiveFilterChips filters={filters} categories={categories} setFilters={setFilters} />
                )}
            </div>

            {/* Table content */}
            <div className="w-full overflow-x-auto px-4 md:px-5 mt-8">
                {children}
            </div>
        </div>
    )
}