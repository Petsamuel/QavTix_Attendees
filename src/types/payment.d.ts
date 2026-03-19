interface PaymentAccount {
    id:             string
    bank_name:      string
    account_name:   string
    account_number: string
    is_default:     boolean
    created_at:     string
}


interface PaymentMethod {
    id:         number
    provider:   string
    brand:      string
    last4:      string
    exp_month:  number
    exp_year:   number
    is_default: boolean
    created_at: string
}