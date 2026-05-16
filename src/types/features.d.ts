type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json'

interface FilterValues {
    dateRange?: DateRange
    status: StatusOption["value"] | null
    categories: Category["value"][]
    ticketType: string[],
    isMineFilter: boolean,
    priceRange?: PriceRange
    purchaseDate?: Date | null
    checkInStatus?: string[]
}



interface PriceRange {
    min: number
    max: number
}

interface Category {
    value: string
    label: string
    count: number
}

interface Location {
    country: string
    state: string
}

interface StatusOption {
    value: string
    label: string
    color: string
    icon: string
    description: string
}

/**
 * Targets that can be imperatively invalidated via useRevalidate / useOnRevalidate.
 * Extend this union when you add new data domains.
 */
type RevalidateTarget =
    | "favourites"
    | "tickets"
    | "marketplace"
    | "affiliates"
    | "wallet"
    | "profile"
    | "groups"