// events 
interface EventLocation {
    venue_name: string
    address: string
    city: string
    state: string
    country: string
}


type EventType = "single" | "recurring"
type EventLocationType = "physical" | "online" | "tba"
type EventStatus = "draft" | "active" | "sold_out" | "new" | "normal" | "ended" | "cancelled" | "banned" | "filling_fast" | "selling_fast" | "near_capacity" | "starts_soon" | "started"
type RefundPolicy = "no" | "partial" | "full" | "custom"

interface Tag {
    id: number
    name: string
}

interface IEvent {
    id: string  // UUID
    title: string
    category: number | null  // FK → Category.id
    tags: number[]       // M2M → Tag.id[]
    event_type: EventType
    start_datetime: string
    end_datetime: string
    location_type: EventLocationType
    short_description: string
    full_description: string
    organizer_display_name: string
    organizer_description: string
    public_email: string
    phone_number: string
    refund_policy: RefundPolicy
    refund_percentage: number | null
    qr_enabled: boolean
    age_restriction: boolean
    order_confirmation: boolean
    ticket_delivery: boolean
    reminders: boolean
    post_event_emails: boolean
    customize_sender_name: boolean
    affiliate_enabled: boolean
    commission_percentage: number | null
    affiliate_start: string | null
    affiliate_end: string | null
    host: number  // FK → Host.id
    status: EventStatus
    created_at: string
    currency: string
    updated_at: string
    views_count: number
    saves_count: number
}

interface EventLocation {
    id: number
    event: string  // FK → Event.id (UUID)
    venue_name: string
    address: string
    country: string
    state: string
    city: string
    postal_code: string
}

interface EventMedia {
    id: number
    event: string  // FK → Event.id (UUID)
    image_url: string | null
    video_url: string | null
    is_featured: boolean
}


interface EventTicket {
    sn: number
    id: string
    qrcode_token: string
    event_name: string
    event_id: string
    event_image: string
    category: string
    payment: "Completed" | "Pending" | "Failed" | "Refunded"
    event_status: "active" | "cancelled" | "postponed" | "completed" | "started"
    ticket_status: "Active" | "Used" | "Cancelled" | "Expired"
    ticket_type: string
    event_datetime: string
    original_price: string
    currency: string
    host: string
    event_location: EventLocation
}



interface TicketGroup {
    id: string  // UUID
    name: string
    owner: number  // FK → User.id
    members: number[]  // M2M through GroupMember
    created_at: string
}

interface GroupMember {
    id: number
    group: string  // FK → TicketGroup.id (UUID)
    user: number  // FK → User.id
    joined_at: string
}