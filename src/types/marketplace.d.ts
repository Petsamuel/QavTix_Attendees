interface MarketplaceEvent {
    id:                string
    event_name:        string
    marketplace_id:    string
    host:              string
    price:             string
    category:          string
    event_datetime:    string
    event_location:    EventLocation
    event_image:       string
    attendees_count:   number
    status:            string
    created_at:        string
    expires_at:        string
    is_mine:           boolean
    is_favorite:       boolean
    event_description: string
    currency:          string
}