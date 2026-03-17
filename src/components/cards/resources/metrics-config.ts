import { formatPrice } from "@/helper-fns/formatPrice"
import { Currency } from "@/lib/redux/slices/settingsSlice"

export interface MetricConfig {
    id:              string
    label:           string
    description:     string
    icon:            string
    iconColor:       string
    valueFormatter?: (value: number, currency: Currency) => string
}

// My Tickets

export const myTicketsMetricsConfig: Record<string, MetricConfig> = {
    'total-earnings': {
        id:             'total-earnings',
        label:          "Total Earnings",
        icon:           "/images/vectors/dollar-in.svg",
        valueFormatter: (value, currency) => formatPrice(value, currency!),
        iconColor:      "",
        description:    "",
    },
    'total-spent': {
        id:             'total-spent',
        label:          "Total Spent",
        icon:           "/images/vectors/dollar-out.svg",
        iconColor:      "",
        valueFormatter: (value, currency) => formatPrice(value, currency!),
        description:    "",
    },
    'ticket-purchased': {
        id:          'ticket-purchased',
        label:       "Ticket Purchased",
        icon:        "/images/vectors/ticket.svg",
        description: "",
        iconColor:   "",
    },
    'upcoming-events': {
        id:          'upcoming-events',
        label:       "Upcoming Events",
        icon:        "/images/vectors/upcoming-events.svg",
        description: "",
        iconColor:   "",
    }
}

// Affiliates dashboard overview

export const affilatesMetricsConfig: Record<string, MetricConfig> = {
    'total-earnings': {
        id:             'total-earnings',
        label:          "Total Earnings",
        icon:           "/images/vectors/dollar-in.svg",
        valueFormatter: (value, currency) => formatPrice(value, currency!),
        iconColor:      "",
        description:    "",
    },
    'earnings-this-month': {
        id:          'earnings-this-month',
        label:       "Earnings This Month",
        icon:        "/images/vectors/dollar-out.svg",
        iconColor:   "",
        description: "",
    },
    'pending-withdrawal': {
        id:          'pending-withdrawal',
        label:       "Pending Withdrawals",
        icon:        "/images/vectors/ticket.svg",
        description: "",
        iconColor:   "",
    },
    'available-to-withdraw': {
        id:             'available-to-withdraw',
        label:          "Available to withdraw",
        icon:           "/images/vectors/upcoming-events.svg",
        description:    "",
        iconColor:      "",
        valueFormatter: (value, currency) => formatPrice(value, currency!),
    }
}

// How It Works

export type HowItWorksCardConfig = {
    id:          string
    label:       string
    description: string
    variant:     'primary' | 'accent' | 'blue'
}

export const howItWorksCardConfig: HowItWorksCardConfig[] = [
    {
        id:          'share-event-links',
        label:       'Share Event Links',
        description: 'Browse events and create your unique links',
        variant:     'primary',
    },
    {
        id:          'earn-commission',
        label:       'Earn Commission',
        description: 'Get a % Commission on every ticket sold',
        variant:     'accent',
    },
    {
        id:          'get-paid',
        label:       'Get Paid',
        description: 'Withdraw earnings to your bank account',
        variant:     'blue',
    }
]

export const howItWorksCardsConfig2VariantStyles = {
    primary: {
        container:   'bg-brand-primary-1 border-brand-primary-2',
        value:       'text-brand-primary-4',
        label:       'text-brand-primary-4',
        description: 'text-brand-primary-4',
        icon:        "heroicons-solid:paper-clip",
        iconBg:      "bg-brand-primary-3",
        iconText:    "text-brand-primary-1",
    },
    accent: {
        container:   'bg-brand-accent-1 border-brand-accent-2',
        value:       'text-brand-accent-6',
        label:       'text-brand-accent-7',
        description: 'text-brand-accent-5',
        icon:        "hugeicons:analytics-up",
        iconText:    "text-brand-accent-1",
        iconBg:      "bg-[#FFC6A0]",
    },
    blue: {
        container:   'bg-brand-primary-4 border-brand-primary-5',
        value:       'text-white',
        label:       'text-white',
        description: 'text-white/80',
        icon:        "hugeicons:credit-card",
        iconBg:      "bg-brand-primary-2",
        iconText:    "text-brand-primary-4",
    }
}

// Affiliate performance stat cards
// Every entry MUST have a valueFormatter — called unconditionally in PerformanceTabContent

export const AFFILIATE_METRICS_CONFIG = [
    {
        id:             "clicks",
        label:          "Total Clicks",
        iconPath:       "/images/vectors/aff-mtc1.svg",
        valueFormatter: (v: number, _currency?: Currency) => v.toLocaleString(),
    },
    {
        id:             "sales",
        label:          "Total Sales",
        iconPath:       "/images/vectors/aff-mtc2.svg",
        valueFormatter: (v: number, _currency?: Currency) => v.toLocaleString(),
    },
    {
        id:             "rate",
        label:          "Conversion Rate",
        iconPath:       "/images/vectors/aff-mtc3.svg",
        valueFormatter: (v: number, _currency?: Currency) => `${v.toFixed(1)}%`,
    },
    {
        id:             "earnings",
        label:          "Total Earnings",
        iconPath:       "/images/vectors/dollar-in.svg",
        valueFormatter: (v: number, currency?: Currency) => formatPrice(v, currency!),
    },
] as const

export type AffiliateMetricId = typeof AFFILIATE_METRICS_CONFIG[number]["id"]