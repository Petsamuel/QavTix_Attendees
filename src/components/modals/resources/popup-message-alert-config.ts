export const POPUP_MESSAGE_ALERT_CONFIG = {
    verification: {
        icon: "noto:hourglass-with-flowing-sand",
        bgColor: "bg-blue-50"
    },
    payout: {
        icon: "noto:money-bag",
        bgColor: "bg-green-50"
    },
    schedule_success: {
        icon: "noto:hourglass-with-flowing-sand",
        bgColor: "bg-amber-50"
    },
    success: {
        icon: "noto:check-mark-button",
        bgColor: "bg-emerald-50"
    },
    profile_incomplete: {
        icon: "noto:bust-in-silhouette",
        bgColor: "bg-orange-50"
    },
} as const;

export interface PopUpMessageAlert {
    id:           string
    type:         AlertType
    title:        string
    description:  string
    subtitle?:    string
    buttonText?:  string
    navigateTo?:  string
    actionType?:  "RETRY_PAYMENT" | "VERIFY_DOCS"
}

export const PROFILE_INCOMPLETE_ALERT: PopUpMessageAlert = {
    id:          "profile_incomplete",
    type:        "profile_incomplete",
    title:       "Complete Your Profile",
    subtitle:    "You're almost there!",
    description: "Your profile is incomplete. Add your details so others can find and connect with you easily.",
    buttonText:  "Update Profile",
    navigateTo:  `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account-settings/profile`,
}

export type AlertType = keyof typeof POPUP_MESSAGE_ALERT_CONFIG;