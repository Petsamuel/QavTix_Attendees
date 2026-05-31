import { getAttendeeNotifications } from "@/actions/notifications/index"
import AllNotificationsModal from "@/components/modals/AllNotificationsModal"
import { delay } from "@/helper-fns/delay";
import { cookies } from "next/headers"

export default async function AllActivityModalPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const searchParams = await props.searchParams;
    const params: Record<string, any> = { page: 1 };
    if (searchParams?.notification_type) params.notification_type = searchParams.notification_type;

    const cookiesStore = await cookies()
    const token = cookiesStore.get("access_token")?.value

    const res = await getAttendeeNotifications(token, params)

    const notifications = res.success ? (res.data?.notifications ?? res.data?.results ?? []) : []
    const hasMore = res.success ? !!res.data?.next : false

    return (
        <AllNotificationsModal
            initialNotifications={notifications}
            initialPage={1}
            initialHasMore={hasMore}
        />
    )
}
