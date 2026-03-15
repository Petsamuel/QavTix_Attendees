import { getCategories } from "@/actions/filters"
import MyTicketsPageCW from "@/components/page-content-wrappers/MyTicketsPageCW"
import { ATTENDEE_DASHBOARD_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"

async function getDashboardData() {
  const axiosInstance = await getServerAxios()

  const [upcomingRes, pastRes, cancelledRes, categoriesRes] = await Promise.all([
    axiosInstance.get<AttendeeDashboardResponse>(`${ATTENDEE_DASHBOARD_ENDPOINT}?event_status=active`),
    axiosInstance.get<AttendeeDashboardResponse>(`${ATTENDEE_DASHBOARD_ENDPOINT}?past=true`),
    axiosInstance.get<AttendeeDashboardResponse>(`${ATTENDEE_DASHBOARD_ENDPOINT}?event_status=cancelled`),
    getCategories(),
  ])

  return {
    metrics: upcomingRes.data.data.card_data,
    categories: categoriesRes.data,

    upcoming: {
      results:  upcomingRes.data.data.results,
      count:    upcomingRes.data.data.count,
      next:     upcomingRes.data.data.next,
      previous: upcomingRes.data.data.previous,
    },
    past: {
      results:  pastRes.data.data.results,
      count:    pastRes.data.data.count,
      next:     pastRes.data.data.next,
      previous: pastRes.data.data.previous,
    },
    cancelled: {
      results:  cancelledRes.data.data.results,
      count:    cancelledRes.data.data.count,
      next:     cancelledRes.data.data.next,
      previous: cancelledRes.data.data.previous,
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