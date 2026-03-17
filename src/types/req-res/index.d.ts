// Shared envelope

interface ApiResponse<T> {
    message: string
    status:  number
    data:    T
}

interface PaginatedResponse<T> {
    count:    number
    next:     number | null
    total_pages: number
    previous: number | null
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


interface AttendeeDashboardResponseData extends PaginatedResponse<EventTicket> {
    card_data: AttendeeDashboardMetrics
}

type AttendeeDashboardResponse = ApiResponse<AttendeeDashboardResponseData>



interface UserProfile {
    id:               number
    full_name:        string
    email:            string
    email_verified:   boolean
    phone_number:     string
    dob:              string | null
    gender:           string
    country:          string
    state:            string
    city:             string
    profile_picture:  string | null
    role:             string
}

interface UpdateProfilePayload {
    full_name?:       string
    phone_number?:    string
    dob?:             string | null
    gender?:          string
    country?:         string
    state?:           string
    city?:            string
    profile_picture?: string | null
    role?:            string
}