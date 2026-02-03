interface TicketTier {
  id: string
  name: string
  price: number
  originalPrice: number
  currency: string
  description?: string
  features?: string[]
  available: boolean
  soldOut?: boolean
}

interface Discount {
    type: 'coupon' | 'membership'
    code?: string
    percentage?: number
    amount?: number
    description?: string
}

interface CheckoutTicket extends TicketTier {
    quantity: number
}


interface PriceRange {
    min: number
    max: number
}

interface Category {
    value: string
    label: string
    count: number
}

interface Location {
    country: string
    state: string
}

interface StatusOption {
    value: string
    label: string
    color: string
    icon: string
    description: string
}



type IEventStatus = "selling-fast" | "sold-out" | "new" | "near-capacity"| "starts-soon" | "filling-fast"

interface IEvent {
    id: string
    image: string
    status?: IEventStatus
    category: string
    host: string
    title: string
    date: string //DateString
    location: string
    price: string
    originalPrice: string
    href: string
    attendees: Attendee[]
}