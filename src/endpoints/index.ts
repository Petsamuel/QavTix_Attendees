export const ATTENDEE_DASHBOARD_ENDPOINT = "attendee/dashboard";
export const LOGIN_ENDPOINT = "auth/login/"
export const GET_PROFILE_ENDPOINT = "attendee/profile/"
export const REFRESH_TOKEN_ENDPOINT = "auth/token/refresh/"
export const TOKEN_VERIFY_ENDPOINT = "auth/token/verify/"

export const TRANSFER_TICKET_ENDPOINT = "attendee/tickets/transfer/"
export const RESELL_TICKET_ENDPOINT = "marketplace/create/"
export const MARKETPLACE_LIST_ENDPOINT = "marketplace/list/"
export const MARKETPLACE_DELIST_ENDPOINT = "marketplace/delete/[event_id]/"


export const FAVOURITES_ENDPOINT = "attendee/favorite/list"
export const ADD_FAVOURITE_ENDPOINT = "attendee/favorite/add/"
export const REMOVE_FAVOURITE_ENDPOINT = "attendee/favorite/remove/[event_id]/"

export const CATEGORIES_ENDPOINT = "public/categories"

export const TICKET_RECEIPT_ENDPOINT = `attendee/tickets/[id]/receipt/`


export const AFFILIATE_DASHBOARD_ENDPOINT = "attendee/affliate/dashboard"
export const AFFILIATE_LINKS_ENDPOINT = "attendee/affliate/event"
export const AFFILIATE_EARNINGS_ENDPOINT = "attendee/affliate/earning/history"
export const AFFILIATE_PERFORMANCE_ENDPOINT = "attendee/affliate/graph"
export const WITHDRAWAL_HISTORY_ENDPOINT = "attendee/withdrawal/history"
export const WITHDRAWAL_REQUEST_ENDPOINT = "attendee/withdrawal/request/"


export const PAYMENT_ACCOUNTS_ENDPOINT = "attendee/payment/list"


export const UPDATE_PROFILE_ENDPOINT = "attendee/profile/update/"
export const UPDATE_TWO_FACTOR_ENDPOINT = "attendee/profile/twofactor/"
export const GET_TWO_FACTOR_ENDPOINT = "attendee/profile/twofactor/info/"
export const CHANGE_PASSWORD_ENDPOINT = "attendee/profile/change-password/"
export const NOTIFICATION_SETTINGS_ENDPOINT = "attendee/profile/notifications/settings/"


export const GET_GROUPS_ENDPOINT = "attendee/groups"
export const CREATE_GROUP_ENDPOINT = "attendee/groups/create/"
export const EDIT_GROUP_ENDPOINT = "attendee/groups/[group_id]/update/"
export const DELETE_GROUP_ENDPOINT = "attendee/groups/[group_id]/delete/"
export const DELETE_GROUP_MEMBER_ENDPOINT = "attendee/groups/[group_id]/remove-member/"



export const GET_PRIVACY_SETTINGS_ENDPOINT = "attendee/privacy/settings"
export const SET_PRIVACY_SETTINGS_ENDPOINT = "attendee/privacy/activity/sharing"
export const DOWNLOAD_DATA_ENDPOINT = "attendee/privacy/data/download/"
export const DELETE_ACCOUNT_ENDPOINT = "attendee/privacy/account/delete"
export const CANCEL_PLAN_ENDPOINT = "payments/attendee-plans/cancel/"


export const PAYOUT_ACCOUNTS_ENDPOINT = "attendee/payouts/list"
export const ADD_PAYOUT_ACCOUNT_ENDPOINT = "attendee/payouts/add/"
export const ADD_PAYMENT_CARD_CONFIRM = "payments/cards/confirm/"
export const DELETE_PAYMENT_METHOD = "attendee/payouts/remove/[id]/"


export const PAYMENT_METHODS_ENDPOINT = "payments/cards/"
export const ADD_PAYMENT_CARD = "payments/cards/initiate/"
