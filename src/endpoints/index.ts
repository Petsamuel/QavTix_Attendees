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


export const AFFILIATE_DASHBOARD_ENDPOINT   = "attendee/affliate/dashboard"
export const AFFILIATE_LINKS_ENDPOINT       = "attendee/affliate/event"
export const AFFILIATE_EARNINGS_ENDPOINT    = "attendee/affliate/earning/history"
export const AFFILIATE_PERFORMANCE_ENDPOINT = "attendee/affliate/graph"
export const WITHDRAWAL_HISTORY_ENDPOINT = "attendee/withdrawal/history"