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
    }
} as const;

export type AlertType = keyof typeof POPUP_MESSAGE_ALERT_CONFIG;

export interface PopUpMessageAlert {
    id: string;
    type: AlertType;
    title: string;
    description: string;
    subtitle?: string;
    buttonText?: string;
    navigateTo?: string; 
    actionType?: 'RETRY_PAYMENT' | 'VERIFY_DOCS'; 
}