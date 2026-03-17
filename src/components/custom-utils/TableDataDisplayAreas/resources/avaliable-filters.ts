export type TableDataDisplayFilter = {
  label: string
  icon: string
  value: FilterKey
}

export type FilterKey =
  | 'categories'
  | 'status'
  | 'ticketType'
  | 'dateRange'
  | 'purchaseDate'
  | 'performance'
  | 'sortBy'
  | 'priceRange'


export const ALL_FILTERS = {
  categories: {
    value: 'categories',
    label: 'Category',
    icon: 'tabler:triangle-square-circle'
  },
  status: {
    value: 'status',
    label: 'Status',
    icon: 'ic:round-radio-button-checked'
  },
  ticketType: {
    value: 'ticketType',
    label: 'Ticket Type',
    icon: 'hugeicons:ticket-02'
  },
  dateRange: {
    value: 'dateRange',
    label: 'Date Range',
    icon: 'solar:calendar-linear'
  },
  purchaseDate: {
    value: 'purchaseDate',
    label: 'Purchase Date',
    icon: 'solar:calendar-linear'
  },
  performance: {
    value: 'performance',
    label: 'Performance',
    icon: 'hugeicons:chart-evaluation'
  },
  sortBy: {
    value: 'sortBy',
    label: 'Sort By',
    icon: 'hugeicons:sliders-horizontal'
  },
  priceRange: {
    value: 'priceRange',
    label: 'Price Range',
    icon: "hugeicons:dollar-square"
  }
} as const satisfies Record<FilterKey, TableDataDisplayFilter>


export type TabListItem = {
  value: string
  label: string
}

export const MyTicketsFiltersNTabsData = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.dateRange
  ] as const,
  tabList: [
    { value: "upcoming", label: "Upcoming"},
    { value: "past", label: "Past"},
    { value: "cancelled", label: "Cancelled"}
  ] as const
}

export const MarketplaceFiltersNTabsData = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.dateRange,
    ALL_FILTERS.priceRange
  ] as const,
  tabList: [] as const
}

export const FavouritesPageFiltersNTabsData = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.dateRange,
    ALL_FILTERS.priceRange
  ] as const,
  tabList: [
    { value: "saved", label: "Saved"},
  ] as const
}

export const AffliatesPageFiltersNTabsData = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.dateRange,
  ] as const,
  tabList: [
    { value: "affiliate-links", label: "Affiliate Links"},
    { value: "performance-metrics", label: "Performance Metrics"},
    { value: "earnings-history", label: "Earnings History"},
    { value: "withdrawal", label: "Withdrawal"},
  ] as const
}