type UserRole = "attendee" | "host" | "admin"

type AuthUser = {
    profile_picture: string,
    full_name: string,
    id: string,
    phone_number: string
    username: string
    role: UserRole
    email: string,
    dob: string | null
    gender: string
    country: string
    city: string
    state: string
    phone: string
    currency: string
    subscription_status: "active" | "inactive" | "cancelled" | "trialing" | null
    plan_expires_at: string | null
    is_completed: boolean
}

interface PrivacySettings {
    show_events:    boolean
    show_favorites: boolean
}