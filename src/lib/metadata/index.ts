import type { Metadata } from "next"

const SITE_NAME = "QavTix"
const SITE_URL = process.env.NEXT_PUBLIC_ATTENDEE_DOMAIN ?? "https://attendee.qavtix.com"

export const attendeeSiteMetadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default: `My Dashboard | ${SITE_NAME}`,
        template: `%s | ${SITE_NAME}`,
    },

    description: "Manage your tickets, favourites, marketplace listings, and account settings on QavTix.",

    robots: {
        // Dashboard pages are private — never index
        index: false,
        follow: false,
    },

    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
            { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        ],
        apple: "/apple-touch-icon.png",
    },
}


export const ATTENDEE_PAGE_METADATA = {
    MY_TICKETS: {
        title: "My Tickets",
        description: "View and manage all your event tickets in one place.",
    },
    FAVOURITES: {
        title: "Favourites",
        description: "Events you've saved and love. Find them all here.",
    },
    MARKETPLACE: {
        title: "Marketplace",
        description: "Buy and sell tickets on the QavTix resale marketplace.",
    },
    AFFILIATES: {
        title: "Affiliates",
        description: "Track your affiliate links, earnings, and referral performance.",
    },
    ACCOUNT_SETTINGS: {
        title: "Account Settings",
        description: "Manage your profile, security, notifications, and payment methods.",
    },
    PROFILE: {
        title: "Profile Information",
        description: "Update your personal information and public profile.",
    },
    SECURITY: {
        title: "Security",
        description: "Manage your password, two-factor authentication, and login activity.",
    },
    NOTIFICATIONS: {
        title: "Notification Settings",
        description: "Control how and when QavTix sends you updates and alerts.",
    },
    GROUPS: {
        title: "Group Settings",
        description: "Manage your ticket groups and group members.",
    },
    PRIVACY: {
        title: "Privacy",
        description: "Control your privacy preferences and data settings.",
    },
    PAYMENT: {
        title: "Payment Methods",
        description: "Manage your saved cards and preferred payment methods.",
    },
    BANK_ACCOUNTS: {
        title: "Bank Accounts",
        description: "Add and manage your bank accounts for payouts.",
    },
} as const