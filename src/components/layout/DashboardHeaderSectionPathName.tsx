"use client"

import { space_grotesk } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const useDashboardSegment = () => {
    const pathName = usePathname()
    
    if (pathName === "/"){
        return "My Tickets"
    }
    const dashboardSegment = pathName.split("/")[1]
    
    return dashboardSegment.split("-").join(" ")
}

export function DashboardHeaderSectionPathName() {
    
    return (
        <div className="relative basis-2/6 w-2/6">
            <h1 className={cn(space_grotesk.className,'capitalize text-xl text-brand-secondary-9 font-bold')}>{useDashboardSegment()}</h1>
        </div>
    )
}