import { isAppleDevice } from "./isAppleDevice"
import { toCalendarDate } from "./toCalendarDate"

export function addToCalendar(ticket: EventTicket) {
    const start   = toCalendarDate(ticket.event_datetime)
    const endDate = new Date(new Date(ticket.event_datetime).getTime() + 3 * 60 * 60 * 1000)
    const end     = toCalendarDate(endDate.toISOString())
    const location = `${ticket.event_location.venue_name}, ${ticket.event_location.address}, ${ticket.event_location.city}`

    if (isAppleDevice()) {
        // Download .ics for Apple Calendar
        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:${ticket.event_name}`,
            `DESCRIPTION:Ticket ID: ${ticket.id} | Type: ${ticket.ticket_type}`,
            `LOCATION:${location}`,
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\r\n')

        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href     = url
        a.download = `${ticket.event_name.replace(/\s+/g, '-')}.ics`
        a.click()
        URL.revokeObjectURL(url)
        return
    }

    // Google Calendar for Android / Desktop
    const params = new URLSearchParams({
        action:   'TEMPLATE',
        text:     ticket.event_name,
        dates:    `${start}/${end}`,
        details:  `Ticket ID: ${ticket.id} | Type: ${ticket.ticket_type}`,
        location,
    })
    window.open(`https://calendar.google.com/calendar/render?${params}`, '_blank')
}