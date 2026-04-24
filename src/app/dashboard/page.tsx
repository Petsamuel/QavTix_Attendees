import { cookies } from "next/headers"
import { getCategories } from "@/actions/filters"
import MyTicketsPageCW from "@/components/page-content-wrappers/MyTicketsPageCW"
import { ATTENDEE_DASHBOARD_ENDPOINT } from "@/endpoints"
import { ATTENDEE_PAGE_METADATA } from "@/lib/metadata"
import { CACHE_TAGS } from "@/cache-tags"
import type { Metadata } from "next"

export const metadata: Metadata = ATTENDEE_PAGE_METADATA.MY_TICKETS

async function getToken() {
  const cookieStore = await cookies()
  return cookieStore.get("access_token")?.value
}

async function fetchDashboard(params: string, tags: string[]) {
  const token = await getToken()
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${ATTENDEE_DASHBOARD_ENDPOINT}?${params}`

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: { tags, revalidate: 120 },
  })

  if (!res.ok) return null
  const json = await res.json()
  return json?.data ?? null
}

async function getDashboardData() {
  const [upcomingData, pastData, cancelledData, categoriesRes] = await Promise.all([
    fetchDashboard("event_status=active", [CACHE_TAGS.MY_TICKETS_UPCOMING]),
    fetchDashboard("past=true", [CACHE_TAGS.MY_TICKETS_PAST]),
    fetchDashboard("event_status=cancelled", [CACHE_TAGS.MY_TICKETS_CANCELLED]),
    getCategories(),
  ])

  return {
    metrics: upcomingData?.card_data ?? null,
    categories: categoriesRes.data,
    upcoming: {
      results: upcomingData?.results ?? [],
      count: upcomingData?.count ?? 0,
      next: upcomingData?.next ?? null,
      previous: upcomingData?.previous ?? null,
    },
    past: {
      results: pastData?.results ?? [],
      count: pastData?.count ?? 0,
      next: pastData?.next ?? null,
      previous: pastData?.previous ?? null,
    },
    cancelled: {
      results: cancelledData?.results ?? [],
      count: cancelledData?.count ?? 0,
      next: cancelledData?.next ?? null,
      previous: cancelledData?.previous ?? null,
    },
  }
}

export default async function Page() {
  const dashboard = await getDashboardData()
  return (
    <MyTicketsPageCW
      metrics={dashboard.metrics}
      categories={dashboard.categories}
      upcoming={dashboard.upcoming}
      past={dashboard.past}
      cancelled={dashboard.cancelled}
    />
  )
}