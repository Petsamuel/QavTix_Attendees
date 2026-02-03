export interface MetricConfig {
    id: string
    label: string
    description: string
    icon: string
    iconColor: string
    valueFormatter?: (value: any) => string
}



export const myTicketsMetricsConfig: Record<string, MetricConfig> = {
    'total-earnings': {
        id: 'total-earnings',
        label: "Total Earnings",
        icon: "/images/vectors/dollar-in.svg",
        valueFormatter: (value: number) => `₦${value.toLocaleString()}`,
        iconColor: "",
        description: "",
    },
    'tickets-spent': {
        id: 'tickets-spent',
        label: "Tickets Spent",
        icon: "/images/vectors/dollar-out.svg",
        iconColor: "",
        description: "",
    },
    'ticket-purchased': {
        id: 'ticket-purchased',
        label: "Ticket Purchased",
        icon: "/images/vectors/ticket.svg",
        description: "",
        iconColor: "",
    },
    'upcoming-events': {
        id: 'upcoming-events',
        label: "Upcoming Events",
        icon: "/images/vectors/upcoming-events.svg",
        description: "",
        iconColor: "",
        valueFormatter: (value: number) => `₦${value.toLocaleString()}`
    }
}


export const affilatesMetricsConfig: Record<string, MetricConfig> = {
    'total-earnings': {
        id: 'total-earnings',
        label: "Total Earnings",
        icon: "/images/vectors/dollar-in.svg",
        valueFormatter: (value: number) => `₦${value.toLocaleString()}`,
        iconColor: "",
        description: "",
    },
    'earnings-this-month': {
        id: 'earnings-this-month',
        label: "Earnings This Month",
        icon: "/images/vectors/dollar-out.svg",
        iconColor: "",
        description: "",
    },
    'pending-withdrawal': {
        id: 'pending-withdrawal',
        label: "Pending Withdrawals",
        icon: "/images/vectors/ticket.svg",
        description: "",
        iconColor: "",
    },
    'available-to-withdraw': {
        id: 'available-to-withdraw',
        label: "Available to withdraw",
        icon: "/images/vectors/upcoming-events.svg",
        description: "",
        iconColor: "",
        valueFormatter: (value: number) => `₦${value.toLocaleString()}`
    }
}




export type HowItWorksCardConfig = {
    id: string
    label: string
    description: string
    variant: 'primary' | 'accent' | 'blue'
}

export const howItWorksCardConfig: HowItWorksCardConfig[] = [
    {
        id: 'share-event-links',
        label: 'Share Event Links',
        description: 'Browse events and create your unique linksTraffic coming in.',
        variant: 'primary'
    },
    {
        id: 'earn-commission',
        label: 'Earn Commission',
        description: 'Get a % Commission on every ticket sold',
        variant: 'accent'
    },
    {
        id: 'get-paid',
        label: 'Get Paid',
        description: 'Withdraw earnings to your bank account',
        variant: 'blue'
    }
]


export const howItWorksCardsConfig2VariantStyles = {
    primary: {
        container: 'bg-brand-primary-1 border-brand-primary-2',
        value: 'text-brand-primary-4',
        label: 'text-brand-primary-4',
        description: 'text-brand-primary-4',
        icon: "heroicons-solid:paper-clip",
        iconBg: "bg-brand-primary-3",
        iconText: "text-brand-primary-1"
    },
    accent: {
        container: 'bg-brand-accent-1 border-brand-accent-2',
        value: 'text-brand-accent-6',
        label: 'text-brand-accent-7',
        description: 'text-brand-accent-5',
        icon: "hugeicons:analytics-up",
        iconText: "text-brand-accent-1",
        iconBg: "bg-[#FFC6A0]",
    },
    blue: {
        container: 'bg-brand-primary-4 border-brand-primary-5',
        value: 'text-white',
        label: 'text-white',
        description: 'text-white/80',
        icon: "hugeicons:credit-card" ,
        iconBg: "bg-brand-primary-2",
        iconText: "text-brand-primary-4"
    }
}



export const AFFILIATE_METRICS_CONFIG = [
    {
        id: 'clicks',
        label: 'Clicks',
        iconPath: '/images/vectors/aff-mtc1.svg',
    },
    {
        id: 'conversions',
        label: 'Conversions',
        iconPath: '/images/vectors/aff-mtc2.svg',
    },
    {
        id: 'rate',
        label: 'Rate',
        iconPath: '/images/vectors/aff-mtc3.svg',
    },
    {
        id: 'earnings',
        label: 'Earnings',
        iconPath: '/images/vectors/dollar-in.svg',
    }
]

export const mockAffiliateStats = {
    clicks: { value: "1,234", trend: "15.9%", isUp: true },
    conversions: { value: "42", trend: "11.2%", isUp: true },
    rate: { value: "3.4%", trend: "0.81%", isUp: false },
    earnings: { value: "₦18,740", trend: "15.9%", isUp: true },
}