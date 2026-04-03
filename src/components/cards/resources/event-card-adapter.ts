// Add fields here as the card grows. Never put raw API models in the card.

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
    attendees?:    number
    isFavourite?:  boolean
    is_mine?:      boolean
    currency?:     string          // ISO code e.g. "NGN", "USD", "GBP"
}

export interface EventCardAttendee {
    id:              string | number
    full_name:       string
    profile_picture: string | null
}

function formatLocation(loc: EventLocation): string {
    const parts = [loc.venue_name, loc.city, loc.state].filter(Boolean)
    return parts.join(', ')
}


export function fromFavouriteEvent(e: FavouriteEvent): EventCardProps {
    return {
        id:            e.id,
        title:         e.event_name,
        category:      e.category,
        host:          e.host,
        date:          e.event_datetime,
        location:      formatLocation(e.event_location),
        image:         e.event_image,
        price:         e.price,
        originalPrice: null,
        status:        e.event_status,
        attendees:     e.attendees_count,
        currency:      e.currency ?? undefined,
    }
}

export function fromIEvent(e: IEvent & {
    resolvedCategory?:      string
    resolvedLocation?:      string
    resolvedPrice?:         string
    resolvedOriginalPrice?: string
    attendees?:             number
}): EventCardProps {
    return {
        id:            e.id,
        title:         e.title ?? '',
        category:      e.resolvedCategory ?? '',
        host:          e.organizer_display_name,
        date:          e.start_datetime,
        location:      e.resolvedLocation ?? '',
        image:         '',
        price:         e.resolvedPrice ?? null,
        originalPrice: e.resolvedOriginalPrice ?? null,
        status:        e.status ?? null,
        attendees:     e.attendees,
        isFavourite:   false,
        currency:      e.currency ?? undefined,
    }
}

export function fromMarketplaceEvent(e: MarketplaceEvent): EventCardProps {
    return {
        id:            e.id,
        title:         e.event_name,
        category:      e.category,
        host:          e.host,
        date:          e.event_datetime,
        location:      formatLocation(e.event_location),
        image:         e.event_image ?? null,
        price:         e.price != null ? String(e.price) : null,
        originalPrice: null,
        status:        e.status,
        isFavourite:   e.is_favorite,
        is_mine:       e.is_mine,
        attendees:     e.attendees_count,
        currency:      e.currency ?? undefined,
    }
}

export function fromAffiliateEvent(e: AffiliateEvent): EventCardProps {
    return {
        id:            e.id,
        title:         e.event_name,
        category:      e.category,
        host:          e.host,
        date:          e.event_datetime,
        location:      [e.event_location?.venue_name, e.event_location?.city].filter(Boolean).join(', '),
        image:         e.event_image ?? null,
        price:         e.price != null ? String(e.price) : null,
        originalPrice: null,
        status:        e.event_status,
        isFavourite:   false,
        currency:      e.currency ?? undefined,
    }
}