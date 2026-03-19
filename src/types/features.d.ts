type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json'

interface FilterValues {
    dateRange?: DateRange
    status: StatusOption["value"] | null
    categories: Category["value"][]
    ticketType: string[],
    isMineFilter: boolean,
    priceRange?: PriceRange
    purchaseDate?: Date | null
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