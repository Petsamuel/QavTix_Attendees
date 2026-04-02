type UserRole = "attendee" | "host" | "admin"

type AuthUser = {
    profile_img: string,
    full_name: string,
    id: string,
    phone_number: string
    username: string
    role: UserRole
    email: string,
    phone: string
    currency: string
    subscription_status: "active" | "inactive" | "cancelled" | "trialing" | null
    plan_expires_at: string | null
}

interface PrivacySettings {
    show_events:    boolean
    show_favorites: boolean
}