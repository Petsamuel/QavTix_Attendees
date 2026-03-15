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
}