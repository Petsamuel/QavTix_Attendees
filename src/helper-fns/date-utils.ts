import { addWeeks, format, isToday, isTomorrow, isWithinInterval } from "date-fns"

export function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

export const formatDate = (date: Date | undefined, formatStr: string = 'MM / dd / yyyy'): string => {
  if (!date) return ''
  
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  
  if (formatStr === 'MMM dd') {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[date.getMonth()]} ${day}`
  }
  
  if (formatStr === 'MMM dd, yyyy') {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[date.getMonth()]} ${day}, ${year}`
  }
  
  if (formatStr === 'full') {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }
  
  return `${month} / ${day} / ${year}`
}


export function formatDateSimple(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  })
}

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const startOfWeek = (date: Date): Date => {
  const result = new Date(date)
  const day = result.getDay()
  const diff = day === 0 ? 6 : day - 1
  result.setDate(result.getDate() - diff)
  result.setHours(0, 0, 0, 0)
  return result
}

export const endOfWeek = (date: Date): Date => {
  const result = startOfWeek(date)
  result.setDate(result.getDate() + 6)
  result.setHours(23, 59, 59, 999)
  return result
}

export const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}




export function formatDateTime(date: string | Date) {
  const dateObj = typeof date === "string" ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return ""

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(dateObj)

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(dateObj)

  return `${formattedDate} | ${formattedTime}`
}



export function formatEventDate(isoString: string): string {
  
  const date = new Date(new Date(isoString).getTime() + 60 * 60 * 1000)
  const now  = new Date()

  const timeStr = format(date, "h:mmaaa").toUpperCase() // 9AM, 2:30PM
  const dateStr = format(date, "MMMM d")                // March 22

  // Today
  if (isToday(date)) return `Today, ${dateStr}, ${timeStr} WAT`

  // Tomorrow
  if (isTomorrow(date)) return `Tomorrow, ${dateStr}, ${timeStr} WAT`

  // This weekend — Saturday or Sunday of current week
  const thisWeekStart    = startOfWeek(now) // Monday
  const thisWeekend      = {
      start: addWeeks(thisWeekStart, 0),
      end:   endOfWeek(now),        // Sunday
  }
  const thisWeekendStart = new Date(thisWeekend.end)
  thisWeekendStart.setDate(thisWeekend.end.getDate() - 1) // Saturday

  if (isWithinInterval(date, { start: thisWeekendStart, end: thisWeekend.end })) {
      return `This Weekend, ${dateStr}, ${timeStr} WAT`
  }

  // Next weekend — Saturday or Sunday of next week
  const nextWeekStart      = addWeeks(thisWeekStart, 1)
  const nextWeekEnd        = endOfWeek(nextWeekStart)
  const nextWeekendStart   = new Date(nextWeekEnd)
  nextWeekendStart.setDate(nextWeekEnd.getDate() - 1)

  if (isWithinInterval(date, { start: nextWeekendStart, end: nextWeekEnd })) {
      return `Next Weekend, ${dateStr}, ${timeStr} WAT`
  }

  // Next week — Mon to Fri of next week
  const nextWeekFriday = new Date(nextWeekStart)
  nextWeekFriday.setDate(nextWeekStart.getDate() + 4)

  if (isWithinInterval(date, { start: nextWeekStart, end: nextWeekFriday })) {
      return `Next Week, ${dateStr}, ${timeStr} WAT`
  }

  // Fallback — just the date
  return `${dateStr}, ${timeStr} WAT`
}