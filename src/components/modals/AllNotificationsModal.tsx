'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icon } from '@iconify/react'
import { AnimatedDialog } from '@/components/custom-utils/dialogs/AnimatedDialog'
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import NotificationsTab from '../slots/notifications/NotificationTabContent'
import { getAttendeeNotificationsClient } from '@/actions/notifications/client'

interface Props {
    initialNotifications?: AttendeeNotification[]
    initialPage?: number
    initialHasMore?: boolean
}

export default function AllNotificationsModal({
    initialNotifications = [],
    initialPage = 1,
    initialHasMore = false,
}: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [open, setOpen] = useState(true)
    const [notifications, setNotifications] = useState<AttendeeNotification[]>(initialNotifications)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        setNotifications(initialNotifications)
        setCurrentPage(initialPage)
        setHasMore(initialHasMore)
    }, [initialNotifications, initialPage, initialHasMore])

    const handleClose = () => {
        setOpen(false)
        setTimeout(() => router.back(), 300)
    }

    const handleLoadMore = () => {
        startTransition(async () => {
            const params: any = { page: currentPage + 1 }
            if (searchParams.get('notification_type')) params.notification_type = searchParams.get('notification_type')
            
            const res = await getAttendeeNotificationsClient(params)
            if (res.success && res.data) {
                const newNotifications = res.data.notifications ?? res.data.results ?? []
                setNotifications(prev => [...prev, ...newNotifications])
                setCurrentPage(currentPage + 1)
                if (!res.data.next || newNotifications.length === 0) {
                    setHasMore(false)
                }
            }
        })
    }

    return (
        <AnimatedDialog
            open={open}
            onOpenChange={(v) => { if (!v) handleClose() }}
            showCloseButton={false}
            className="md:max-w-md"
            childrenContainerStyles="px-0"
        >
            <div className="flex items-center justify-between px-6 pb-4 border-b border-brand-neutral-2">
                <DialogHeader>
                    <DialogTitle className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9")}>
                        All Notifications
                    </DialogTitle>
                    <DialogDescription className="text-xs text-brand-neutral-7">
                        All your recent notifications
                    </DialogDescription>
                </DialogHeader>

                <button
                    onClick={handleClose}
                    className="text-brand-neutral-7/80 hover:text-brand-neutral-6"
                    aria-label="Close modal"
                >
                    <Icon icon="line-md:close-circle-filled" className="size-6" />
                </button>
            </div>

            <div className="space-y-2 px-6 pb-2 pt-5">
                <NotificationsTab notifications={notifications} />
            </div>

            {isPending && (
                <div className="space-y-2 px-6 pb-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-16 w-full rounded-lg bg-brand-neutral-5 animate-pulse" />
                    ))}
                </div>
            )}

            {hasMore && !isPending && notifications.length > 0 && (
                <div className="px-6 pb-4 pt-1">
                    <button
                        onClick={handleLoadMore}
                        disabled={isPending}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold",
                            "border border-brand-neutral-3 text-brand-primary-6",
                            "hover:bg-brand-neutral-1 transition-colors",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        <span>Load More</span>
                        <Icon icon="hugeicons:arrow-down-01" className="w-4 h-4" />
                    </button>
                </div>
            )}
        </AnimatedDialog>
    )
}
