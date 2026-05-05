import { getAttendeeNotifications } from "@/actions/notifications/index"
import AllNotificationsModal from "@/components/modals/AllNotificationsModal"

export default async function AllActivityModalPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const searchParams = await props.searchParams;
    const params: Record<string, any> = { page: 1 };
    if (searchParams?.notification_type) params.notification_type = searchParams.notification_type;

    const res = await getAttendeeNotifications(params)

    const notifications = res.success ? res.data?.results ?? [] : []

    return (
        <AllNotificationsModal
            initialNotifications={notifications}
            initialPage={1}
            initialHasMore={true}
        />
    )
}
