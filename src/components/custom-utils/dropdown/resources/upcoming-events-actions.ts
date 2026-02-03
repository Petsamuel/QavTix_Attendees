export type EventAction = {
    id: string
    label: string
    icon: string
    variant?: 'default' | 'danger'
    requiresConfirmation?: boolean
    onClick?: () => void | Promise<void>
}

export const upcomingEventActions: EventAction[] = [
    {
        id: 'download-receipt',
        label: 'Download Receipt',
        icon: 'hugeicons:download-01',
    },
    {
        id: 'add-to-calendar',
        label: 'Add to Calendar',
        icon: 'hugeicons:calendar-add-02',
    },
    {
        id: 'share',
        label: 'Share with Friends',
        icon: 'mynaui:send-solid',
    },
    {
        id: 'get-directions',
        label: 'Get Directions',
        icon: 'tabler:buildings',
    },
]