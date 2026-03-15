import { eventTimelineConfig } from "@/components/custom-utils/TableDataDisplayAreas/resources/status-config"

export function getEventTimelineKey(eventDatetime: string): keyof typeof eventTimelineConfig {
    const eventDate = new Date(eventDatetime)
    const now       = new Date()

    // Strip time — compare dates only
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
    const today    = new Date(now.getFullYear(),    now.getMonth(),    now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    if (eventDay.getTime() === today.getTime())    return "today"
    if (eventDay.getTime() === tomorrow.getTime()) return "tomorrow"
    return "upcoming"
}