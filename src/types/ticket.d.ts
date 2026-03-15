

// Receipt API response
interface ReceiptEvent {
    id:             string
    event_name:     string
    category:       string
    event_image:    string
    event_location: {
        venue:   string
        address: string
        city:    string
        state:   string
        country: string
    }
    event_datetime: string
    end_datetime:   string
}

interface ReceiptPerson {
    full_name:    string
    email:        string
    phone_number?: string
    phone?:        string
}

interface ReceiptPayment {
    payment_date:   string
    payment_method: string
    provider:       string
    subtotal:       string
    discount:       string
    service_charge: string
    tax:            string
    total_amount:   string
    status:         string
}

interface TicketReceipt {
    event:            ReceiptEvent
    issued_ticket_id: number
    ticket_type:      string
    quantity:         number
    status:           string
    current_owner:    ReceiptPerson
    billed_to:        ReceiptPerson
    payment:          ReceiptPayment
}

interface TicketReceiptResponse {
    message: string
    status:  number
    data:    TicketReceipt
}




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