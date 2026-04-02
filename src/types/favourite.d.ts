interface FavouriteEvent {
    id:              string  // UUID
    event_name:      string
    category:        string
    event_datetime:  string
    end_datetime:    string
    event_location:  EventLocation
    event_image:     string
    host:            string
    event_status:    string
    attendees_count: number
    event_description: string
    currency :      string
    price:           string
}