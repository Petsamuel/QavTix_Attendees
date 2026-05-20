// public 

interface Follow {
    id:         number
    user:       number        // FK → User.id
    host:       number        // FK → Host.id
    created_at: string
}

interface Message {
    id:        number
    full_name: string
    email:     string
    message:   string
    host:      number         // FK → Host.id
}


// auth / attendee

interface AttendeeNotification {
    id:                string  // UUID
    attendee:          number  // FK → User.id
    notification_type: "event_update" | "ticket" | "refund" | "system" | "reminder" | string
    title:             string
    message:           string
    is_read:           boolean
    created_at:        string
}

interface AttendeeNotificationsData {
    notifications?: AttendeeNotification[]
    results?: AttendeeNotification[]
    count?: number
    next?: string | null
    previous?: string | null
    unread_notifications_count: number
}

interface Attendee {
    id:                   number
    user:                 number  // FK → User.id
    full_name:            string
    phone_number:         string
    country:              string
    state:                string
    city:                 string
    categories:           number[]  // M2M → Category.id[]
    registration_date:    string
    agree_to_terms:       boolean
    role:                 "attendee"
    stripe_customer_id:   string | null
    email_verified:       boolean
    dob:                  string | null  // ISO date
    gender:               string
    profile_picture:      string | null
    show_events_attending: boolean
    show_favorites:       boolean
}

interface TwoFactorAuth {
    id:       number
    user:     number  // FK → User.id
    google:   boolean
    facebook: boolean
}



interface AffiliateLink {
    id:         number
    event:      string  // FK → Event.id (UUID)
    user:       number  // FK → User.id
    code:       string  // UUID
    created_at: string
    clicks:     number
    sales:      number
}

interface AffiliateEarnings {
    id:         number
    link:       number | null  // FK → AffiliateLink.id
    attendee:   number         // FK → Attendee.id
    status:     "pending" | "succeeded" | "failed"
    earning:    number
    created_at: string
}





interface AccountDeletionRequest {
    id:           string  // UUID
    user:         number  // FK → User.id
    status:       "pending" | "reviewed" | "deleted" | "rejected"
    requested_at: string
    reviewed_at:  string | null
    admin_notes:  string | null
}


// host

interface Host {
    id:                  number
    user:                number  // FK → User.id
    full_name:           string
    description:         string
    business_name:       string
    business_type:       string
    registration_number: string
    tax_id:              string
    phone_number:        string
    companies_email:     string
    country:             string
    state:               string
    city:                string
    postal_code:         string
    relevant_links:      string[]
    categories:          number[]  // M2M → Category.id[]
    registration_date:   string
    agree_to_terms:      boolean
    role:                "host"
    followers:           number
    stripe_customer_id:  string | null
}

interface HostLink {
    id:         number
    user:       number  // FK → User.id
    url:        string
    label:      string
    created_at: string
}

interface EmailCampaign {
    id:                 string  // UUID
    host:               number  // FK → Host.id
    event:              string  // FK → Event.id (UUID)
    campaign_name:      string
    subject:            string
    html_content:       string
    sender_name:        string
    sender_email:       string
    brevo_list_id:      number | null
    brevo_campaign_id:  number | null
    recipients_count:   number
    open_rate:          number
    click_rate:         number
    status:             "draft" | "scheduled" | "sent" | "failed"
    sent_at:            string | null
    created_at:         string
    updated_at:         string
}

interface CheckIn {
    id:             string  // UUID
    issued_ticket:  string | null  // FK → IssuedTicket.id (UUID)
    scanned_token:  string
    status:         "checked_in" | "duplicate" | "invalid"
    checked_in_at:  string
    scanned_by:     number | null  // FK → User.id
    notes:          string
}

interface HostActivity {
    id:            string  // UUID
    host:          number  // FK → User.id
    activity_type: "sale" | "checkin" | "refund" | "withdrawal" | "ticket_transfer"
    message:       string
    metadata:      Record<string, unknown>
    created_at:    string
}

interface HostNotification {
    id:                string  // UUID
    host:              number  // FK → User.id
    notification_type: "sale" | "withdrawal" | "checkin" | "system" | "refund"
    title:             string
    message:           string
    is_read:           boolean
    created_at:        string
}


interface OrganizerSocialLink {
    id:    number
    event: string  // FK → Event.id (UUID)
    url:   string
}

interface Ticket {
    id:             number
    event:          string  // FK → Event.id (UUID)
    ticket_type:    string
    description:    string
    price:          string  // DecimalField comes as string from DRF
    quantity:       number
    per_person_max: number
    sold_count:     number
    sales_start:    string
    sales_end:      string
}

interface PromoCode {
    id:                  number
    ticket:              number  // FK → Ticket.id
    code:                string
    discount_percentage: number
    maximum_users:       number
    valid_till:          string  // ISO date
}

interface EventPermission {
    id:     number
    event:  string  // FK → Event.id (UUID)
    email:  string
    role:   "host" | "collaborator" | "financial"
    status: "active" | "disabled" | "pending"
}


// transactions

type OrderStatus        = "pending" | "completed" | "cancelled" | "refunded"
type IssuedTicketStatus = "active" | "transferred" | "resold" | "used" | "cancelled"
type RefundStatus       = "pending" | "approved" | "rejected" | "processed"
type RefundReason       = "cancelled_event" | "customer_request" | "duplicate_order" | "fraud" | "other"
type WithdrawalStatus   = "pending" | "approved" | "rejected" | "paid"
type FeaturedEventStatus = "pending" | "active" | "expired" | "cancelled"

interface FeaturedEvent {
    id:             string  // UUID
    event:          string  // FK → Event.id (UUID)
    user:           number  // FK → User.id
    start_date:     string
    end_date:       string
    payment_amount: string  // Decimal
    payment_method: string | null
    status:         FeaturedEventStatus
    metadata:       Record<string, unknown> | null
}

interface Order {
    id:                  string  // UUID
    full_name:           string
    phone_number:        string
    user:                number | null  // FK → User.id
    email:               string
    event:               string  // FK → Event.id (UUID)
    total_amount:        string  // Decimal
    fees:                string  // Decimal
    discount:            string  // Decimal
    payment_method:      string | null
    status:              OrderStatus
    created_at:          string
    updated_at:          string
    metadata:            Record<string, unknown> | null
    is_split:            boolean
    marketplace_listing: string | null  // FK → MarketListing.id
}

interface OrderTicket {
    id:       number
    order:    string  // FK → Order.id (UUID)
    ticket:   number  // FK → Ticket.id
    quantity: number
    price:    string  // Decimal
}

interface IssuedTicket {
    id:             number
    order:          string  // FK → Order.id (UUID)
    order_ticket:   number  // FK → OrderTicket.id
    event:          string  // FK → Event.id (UUID)
    owner:          number  // FK → User.id
    original_owner: number | null  // FK → User.id
    status:         IssuedTicketStatus
    transferred_at: string | null
    metadata:       Record<string, unknown>
    created_at:     string
}

interface TicketTransferHistory {
    id:             number
    ticket:         number       // FK → IssuedTicket.id
    from_user:      number | null  // FK → User.id
    to_user:        number | null  // FK → User.id
    price:          string       // Decimal
    transferred_at: string
}

interface Withdrawal {
    id:              string  // UUID
    user:            number  // FK → User.id
    payout_account:  string  // FK → PayoutInformation.id (UUID)
    amount:          string  // Decimal
    status:          WithdrawalStatus
    created_at:      string
    updated_at:      string
    idempotency_key: string | null  // UUID
}

interface Refund {
    id:           string  // UUID
    order:        string  // FK → Order.id (UUID)
    amount:       string  // Decimal
    reason:       RefundReason
    notes:        string
    status:       RefundStatus
    processed_by: number | null  // FK → User.id
    created_at:   string
    processed_at: string | null
}


// marketplace─

type MarketListingStatus = "active" | "sold" | "cancelled"

interface MarketListing {
    id:         number
    ticket:     number  // FK → IssuedTicket.id (OneToOne)
    seller:     number  // FK → User.id
    price:      string  // Decimal
    status:     MarketListingStatus
    created_at: string
    expires_at: string | null
}


// payments

type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded"

interface PaymentCard {
    id:         number
    user:       number  // FK → User.id
    provider:   "stripe" | "paystack"
    token:      string
    brand:      string | null
    last4:      string | null
    exp_month:  number | null
    exp_year:   number | null
    is_default: boolean
    created_at: string
}

interface Payment {
    id:                  string  // UUID
    email:               string
    user:                number | null  // FK → User.id
    card:                number | null  // FK → PaymentCard.id
    provider:            "stripe" | "paystack"
    provider_payment_id: string
    amount:              string  // Decimal
    currency:            string
    status:              PaymentStatus
    created_at:          string
    content_type:        number | null  // FK → ContentType.id
    object_id:           string | null  // UUID of related object
    metadata:            Record<string, unknown> | null
}

interface SplitPayment {
    id:         number
    order:      string  // FK → Order.id (UUID)
    user:       number  // FK → User.id
    amount:     string  // Decimal
    percentage: number
    status:     boolean
}

interface PayoutInformation {
    id:             string  // UUID
    user:           number  // FK → User.id
    bank_name:      string
    account_name:   string
    account_number: string
    is_default:     boolean
    created_at:     string
}