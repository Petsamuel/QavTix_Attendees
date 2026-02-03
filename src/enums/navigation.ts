interface ILink {
    readonly href: string,
    label?: string,
    icon?: string
}

interface INavigationLinks {
    [key: string] : ILink
}

export const NAVIGATION_LINKS : INavigationLinks = {
    MY_TICKETS: {
        href: "/",
        icon: "hugeicons:ticket-02",
        label: "My Tickets"
    },
    FAVOURITES: {
        href: "/favourites",
        icon: "hugeicons:favourite",
        label: "Favourites"
    },
    MARKETPLACE: {
        href: "/marketplace",
        icon: "hugeicons:store-location-02",
        label: "Marketplace"
    },
    AFFLIATES: {
        href: "/affliates",
        icon: "hugeicons:target-dollar",
        label: "Affliates"
    },
    ACCOUNT_SETTINGS: {
        href: "/account-settings",
        icon: "hugeicons:account-setting-02",
        label: "Account Settings"
    }
}

export const SETTINGS_SUB_LINKS = [
    { label: "Profile Information", href: "/account-settings/profile" },
    { label: "Security", href: "/account-settings/security" },
    { label: "Notification", href: "/account-settings/notifications" },
    { label: "Group Settings", href: "/account-settings/groups" },
    { label: "Privacy", href: "/account-settings/privacy" },
    { label: "Payment Method", href: "/account-settings/payment" },
    { label: "Bank Accounts", href: "/account-settings/bank-accounts" },
]


export const DISCOVER_EVENTS = {
    MAIN: {
        href: "/events"
    },
    DETAILS: {
        href: "/events/details/[event_id]"
    }
} as const;


export const EDIT_GROUP : ILink = {
    href: `${SETTINGS_SUB_LINKS.find(v => v.href.includes(`${NAVIGATION_LINKS.ACCOUNT_SETTINGS.href}/groups`))?.href}/edit/[group_id]`
}