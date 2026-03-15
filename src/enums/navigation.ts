interface ILink {
    readonly href: string;
    label?: string;
    icon?: string;
}


export const NAVIGATION_LINKS = {
    MY_TICKETS: {
        href: "/dashboard",
        icon: "hugeicons:ticket-02",
        label: "My Tickets"
    },
    FAVOURITES: {
        href: "/dashboard/favourites",
        icon: "hugeicons:favourite",
        label: "Favourites"
    },
    MARKETPLACE: {
        href: "/dashboard/marketplace",
        icon: "hugeicons:store-location-02",
        label: "Marketplace"
    },
    AFFLIATES: {
        href: "/dashboard/affliates",
        icon: "hugeicons:target-dollar",
        label: "Affliates"
    },
    ACCOUNT_SETTINGS: {
        href: "/dashboard/account-settings",
        icon: "hugeicons:account-setting-02",
        label: "Account Settings"
    }
} as const satisfies Record<string, ILink>;

export const SETTINGS_SUB_LINKS = [
    { label: "Profile Information", href: `${NAVIGATION_LINKS.ACCOUNT_SETTINGS.href}/profile` },
    { label: "Security", href: `${NAVIGATION_LINKS.ACCOUNT_SETTINGS.href}/security` },
    { label: "Notification", href: `${NAVIGATION_LINKS.ACCOUNT_SETTINGS.href}/notifications` },
    { label: "Group Settings", href: `${NAVIGATION_LINKS.ACCOUNT_SETTINGS.href}/groups` },
    { label: "Privacy", href: `${NAVIGATION_LINKS.ACCOUNT_SETTINGS.href}/privacy` },
    { label: "Payment Method", href: `${NAVIGATION_LINKS.ACCOUNT_SETTINGS.href}/payment` },
    { label: "Bank Accounts", href: `${NAVIGATION_LINKS.ACCOUNT_SETTINGS.href}/bank-accounts` },
] as const satisfies readonly ILink[];

const groupSettingsPath = SETTINGS_SUB_LINKS.find(v => v.label === "Group Settings")?.href;

export const EDIT_GROUP = {
    href: `${groupSettingsPath}/edit/[group_id]`
} as const satisfies ILink;

export type NavigationKey = keyof typeof NAVIGATION_LINKS;


export const HOST_PROFILE_LINK = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/host/profile/[host_id]` as const;
export const EXPLORE_EVENT_LINK = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/events` as const;