// Shared envelope

interface ApiResponse<T> {
    message: string
    status:  number
    data:    T
}

interface PaginatedResponse<T> {
    count:    number
    next:     string | null
    previous: string | null
    results:  T[]
}


// Auth

interface AuthTokens {
    access:  string
    refresh: string
}


// POST /auth/login/
interface LoginRequest {
    email:    string
    password: string
}

interface LoginResponseData {
    user:   AuthUser
    tokens: AuthTokens
}

type LoginResponse = ApiResponse<LoginResponseData>

// POST /auth/register/
interface RegisterRequest {
    email:     string
    password:  string
    full_name: string
    role:      UserRole
}

// GET /auth/me/ or /auth/profile/
type ProfileResponse = ApiResponse<AuthUser>


// Events (public/listing shapes) 

// Serialized event returned in listings — nested relations resolved
interface EventListItem {
    id:                     string
    title:                  string
    category:               CategorySummary | null
    tags:                   TagSummary[]
    event_type:             EventType
    start_datetime:         string
    end_datetime:           string
    location_type:          EventLocationType
    short_description:      string
    status:                 EventStatus
    views_count:            number
    saves_count:            number
    host:                   HostSummary
    location:               EventLocation | null
    featured_image:         string | null   // resolved from EventMedia.is_featured
    ticket_price_from:      string          // cheapest ticket price
}

// Full event detail page
interface EventDetail extends EventListItem {
    full_description:        string
    organizer_display_name:  string
    organizer_description:   string
    public_email:            string
    phone_number:            string
    refund_policy:           RefundPolicy
    refund_percentage:       number | null
    qr_enabled:              boolean
    age_restriction:         boolean
    affiliate_enabled:       boolean
    commission_percentage:   number | null
    affiliate_start:         string | null
    affiliate_end:           string | null
    media:                   EventMedia[]
    social_links:            OrganizerSocialLink[]
    tickets:                 TicketSummary[]
    created_at:              string
    updated_at:              string
}

interface CategorySummary {
    id:   number
    name: string
}

interface TagSummary {
    id:   number
    name: string
}

interface HostSummary {
    id:           number
    full_name:    string
    business_name: string
    followers:    number
}

interface TicketSummary {
    id:             number
    ticket_type:    string
    description:    string
    price:          string
    quantity:       number
    sold_count:     number
    per_person_max: number
    sales_start:    string
    sales_end:      string
    is_available:   boolean  // derived: sold_count < quantity && within sale window
}


// Attendee dashboard

interface AttendeeDashboardMetrics {
    total_earnings:      number
    earnings_this_week:  number
    total_spent:         number
    spent_this_month:    number
    tickets_purchased:   number
    tickets_today:       number
    upcoming_events:     number
    next_event_datetime: string | null
}

// Each row in the attendee ticket tables
interface EventTicket {
    sn:             number
    id:             string
    qrcode_token:   string
    event_name:     string
    event_image:    string
    category:       string
    payment:        "Completed" | "Pending" | "Failed" | "Refunded"
    event_status:   "active" | "cancelled" | "postponed" | "completed"
    ticket_status:  "Active" | "Used" | "Cancelled" | "Expired"
    ticket_type:    string
    event_datetime: string
    original_price: string
    host:           string
    event_location: EventLocationSummary
}

interface EventLocationSummary {
    venue_name: string
    address:    string
    city:       string
    state:      string
    country:    string
}

interface AttendeeDashboardResponseData extends PaginatedResponse<EventTicket> {
    card_data: AttendeeDashboardMetrics
}

type AttendeeDashboardResponse = ApiResponse<AttendeeDashboardResponseData>


// Host dashboard

interface HostDashboardMetrics {
    total_revenue:        number
    revenue_this_month:   number
    total_tickets_sold:   number
    tickets_sold_today:   number
    total_events:         number
    active_events:        number
    total_attendees:      number
    upcoming_event:       string | null
}

interface HostEventListItem {
    id:           string
    title:        string
    status:       EventStatus
    start_datetime: string
    tickets_sold: number
    total_revenue: string
    featured_image: string | null
}


// Orders

interface OrderSummary {
    id:           string
    event:        string      // event title
    total_amount: string
    status:       OrderStatus
    created_at:   string
    tickets:      OrderTicketSummary[]
}

interface OrderTicketSummary {
    ticket_type: string
    quantity:    number
    price:       string
}


// Marketplace

interface MarketListingDetail {
    id:           number
    price:        string
    status:       MarketListingStatus
    created_at:   string
    expires_at:   string | null
    seller:       HostSummary
    event:        EventListItem
    ticket_type:  string
}


// Affiliate

interface AffiliateLinkDetail {
    id:           number
    code:         string
    url:          string
    event:        EventListItem
    clicks:       number
    sales:        number
    earnings:     number
    created_at:   string
}


// Notifications

type NotificationListResponse = ApiResponse<PaginatedResponse<HostNotification>>


// Filter params (sent to API)

interface AttendeeTicketFilterParams {
    event_status?: "active" | "cancelled"
    past?:         "true"
    search?:       string
    category?:     string   // comma-separated category values
    start_date?:   string   // yyyy-MM-dd
    end_date?:     string   // yyyy-MM-dd
    page?:         number
    page_size?:    number
}