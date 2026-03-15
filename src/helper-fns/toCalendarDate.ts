export function toCalendarDate(dateStr: string) {
    return new Date(dateStr).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}