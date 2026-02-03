type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json'

interface FilterValues {
    dateRange?: DateRange
    status: StatusOption["value"] | null
    categories: Category["value"][]
    ticketType: string[],
    purchaseDate?: Date | null
}