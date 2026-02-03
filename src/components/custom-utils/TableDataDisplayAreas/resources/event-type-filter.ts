interface EventTypeOption {
    value: string
    label: string
    icon: string
    description: string
}


export const eventTypeOptions: EventTypeOption[] = [
    {
        value: 'virtual',
        label: 'Virtual',
        icon: 'mdi:monitor',
        description: 'Online events and webinars'
    },
    {
        value: 'in-person',
        label: 'In-Person',
        icon: 'mdi:map-marker',
        description: 'Physical venue events'
    },
    {
        value: 'hybrid',
        label: 'Hybrid',
        icon: 'mdi:earth',
        description: 'Both virtual and physical'
    }
]