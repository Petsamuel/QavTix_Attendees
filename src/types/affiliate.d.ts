interface AffiliateDashboardMetrics {
    total_earnings:       number
    earnings_this_week:   number
    earnings_this_month:  number
    pending_withdrawals:  number
    available_to_withdraw: number
}

// Affiliate Link Event (same shape as FavouriteEvent)

interface AffiliateEvent extends FavouriteEvent {}

// Earning History

type EarningStatus = "pending" | "paid" | "hold"

interface EarningHistoryItem {
    id:              number
    created_at:      string
    event_name:      string
    event_image:     string
    category:        string
    tickets_sold:    string
    total_sale:      string
    your_commission: string
    status:          EarningStatus
}


type PerformanceFilter = "week" | "month" | "year"

// Shared stats across all filters
interface PerformanceStats {
    total_clicks:               number
    total_clicks_change_pct:    number
    total_sales:                number
    total_sales_change_pct:     number
    conversion_rate:            number
    conversion_rate_change_pct: number
    total_earnings:             number
    total_earnings_change_pct:  number
}

// Week: day number + earning
interface WeekEarningPoint {
    day:        number
    earning:    number
    change_pct: number
}

// Month: week label + earning
interface MonthEarningPoint {
    week:       number | string
    earning:    number
    change_pct: number
}

// Year: month number + earning
interface YearEarningPoint {
    month:      number
    earning:    number
    change_pct: number
}

interface WeekPerformanceData extends PerformanceStats {
    filter:         "week"
    earnings_graph: WeekEarningPoint[]
}

interface MonthPerformanceData extends PerformanceStats {
    filter:         "month"
    earnings_graph: MonthEarningPoint[]
}

interface YearPerformanceData extends PerformanceStats {
    filter:          "year"
    earnings_graph: YearEarningPoint[]
}

type AffiliatePerformanceData =
    | WeekPerformanceData
    | MonthPerformanceData
    | YearPerformanceData

// All three filters bundled for initial server render
interface AllPerformanceData {
    week:  WeekPerformanceData  | null
    month: MonthPerformanceData | null
    year:  YearPerformanceData  | null
}


interface WithdrawalHistoryItem {
    id:             string
    created_at:     string
    amount:         string
    bank_name:      string
    bank_account:   string
    account_name:   string
    status:         string
}