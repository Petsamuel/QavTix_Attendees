// Add fields here as the card grows. Never put raw API models in the card.

import { mockAttendees } from "@/components-data/mock-attendees"

export interface EventCardProps {
    id:            string
    title:         string
    category:      string
    host:          string
    date:          string          // pre-formatted display string
    location:      string          // pre-formatted display string
    image:         string
    price:         string | null
    originalPrice: string | null
    status:        string | null   // displayed as a badge
    attendees?:    EventCardAttendee[]
    isFavourite?:   boolean,
}

export interface EventCardAttendee {
    id:              string | number
    full_name:       string
    profile_picture: string | null
}

// Adapters
// One function per source type. Each one maps its own shape → EventCardProps.
// The card only ever receives EventCardProps — it never touches raw models.

function formatLocation(loc: EventLocation): string {
    const parts = [loc.venue_name, loc.city, loc.state].filter(Boolean)
    return parts.join(', ')
}

function formatDatetime(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    }) + ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// From FavouriteEvent
export function fromFavouriteEvent(e: FavouriteEvent): EventCardProps {
    return {
        id:            e.id,
        title:         e.event_name,
        category:      e.category,
        host:          e.host,
        date:          formatDatetime(e.event_datetime),
        location:      formatLocation(e.event_location),
        image:         e.event_image,
        price:         e.price,
        originalPrice: null,
        status:        e.event_status,
        attendees:     mockAttendees
    }
}

// From IEvent
export function fromIEvent(e: IEvent & {
    // IEvent is the host-side model — it doesn't carry display-ready price/location.
    // Caller passes resolved extras rather than duplicating lookup logic here.
    resolvedCategory?: string
    resolvedLocation?: string
    resolvedPrice?:    string
    resolvedOriginalPrice?: string
    attendees?: EventCardAttendee[]
}): EventCardProps {
    return {
        id:            e.id,
        title:         e.title ?? '',
        category:      e.resolvedCategory ?? '',
        host:          e.organizer_display_name,
        date:          formatDatetime(e.start_datetime),
        location:      e.resolvedLocation ?? '',
        image:         "",
        price:         e.resolvedPrice ?? null,
        originalPrice: e.resolvedOriginalPrice ?? null,
        status:        e.status ?? null,
        attendees:     mockAttendees,
        isFavourite:   false,
    }
}
// Add more adapters here as new models arrive, e.g.:
// export function fromMarketplaceEvent(e: MarketplaceEvent): EventCardProps { ... }
// export function fromSearchResult(e: EventSearchResult): EventCardProps { ... }