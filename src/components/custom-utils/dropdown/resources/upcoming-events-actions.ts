import { getTicketReceipt } from "@/actions/tickets/client"
import { addToCalendar } from "@/helper-fns/addToCalendar"

export type EventAction = {
    id:                    string
    label:                 string
    icon:                  string
    variant?:              'default' | 'danger'
    requiresConfirmation?: boolean
    onClick?:              () => void | Promise<void>
}

function getDirections(ticket: EventTicket) {
    const query = encodeURIComponent(
        `${ticket.event_location.venue_name}, ${ticket.event_location.address}, ${ticket.event_location.city}, ${ticket.event_location.state}`
    )
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank')
}

async function tryNativeShare(ticket: EventTicket): Promise<boolean> {
    if (typeof navigator?.share !== 'function') return false
    try {
        await navigator.share({
            title: ticket.event_name,
            text:  `I'm attending ${ticket.event_name}! 🎉`,
            url:   `${process.env.NEXT_PUBLIC_APP_DOMAIN}/events/${ticket.id}`,
        })
    } catch {
        // User cancelled — still counts as handled
    }
    return true
}

import { getAuthToken } from "@/helper-fns/getAuthToken"

export function buildUpcomingEventActions(
    ticket:          EventTicket,
    onOpenShare:     () => void,
    onDownloadReceipt: (receipt: TicketReceipt) => void,
    onReceiptError:    (msg: string) => void,
): EventAction[] {
    return [
        {
            id:    'download-receipt',
            label: 'Download Receipt',
            icon:  'hugeicons:download-01',
            onClick: async () => {
                const token = await getAuthToken()
                const result = await getTicketReceipt(token, ticket.id)
                if (result.success && result.data) {
                    onDownloadReceipt(result.data)
                } else {
                    onReceiptError(result.message ?? "Could not load receipt. Please try again.")
                }
            },
        },
        {
            id:    'add-to-calendar',
            label: 'Add to Calendar',
            icon:  'hugeicons:calendar-add-02',
            onClick: () => addToCalendar(ticket),
        },
        {
            id:    'share',
            label: 'Share with Friends',
            icon:  'mynaui:send-solid',
            onClick: async () => {
                const handled = await tryNativeShare(ticket)
                if (!handled) onOpenShare()
            },
        },
        {
            id:    'get-directions',
            label: 'Get Directions',
            icon:  'tabler:buildings',
            onClick: () => getDirections(ticket),
        },
    ]
}