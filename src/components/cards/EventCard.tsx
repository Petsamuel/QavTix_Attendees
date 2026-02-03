'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { copyToClipboard } from "@/helper-fns/copyToClipboard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { space_grotesk } from "@/lib/fonts"
import { getAvatarColor } from "@/helper-fns/getAvatarColor"
import { getInitialsFromName } from "@/helper-fns/getInitialFromName"
import { Skeleton } from '@/components/ui/skeleton'
import { DISCOVER_EVENTS } from '@/enums/navigation'
import { statusStyles, StatusStylesRecord } from './resources/event-status-styles'
import { EventIconActionButton } from '../buttons/EventIconActionButton'

export default function EventsCard(cardData: IEvent) {

    const [imageError, setImageError] = useState(false)
    const eventUrl = DISCOVER_EVENTS.DETAILS.href.replace("[event_id]",cardData.href.replace("/",""))

    return (
        <Link 
            href={eventUrl}
            className="block w-full max-w-72 sm:max-w-full p-3 relative min-h-[25em] rounded-[32px] border border-brand-neutral-6 bg-white hover:bg-brand-secondary-1 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-[1.5px] focus:ring-brand-accent-5 focus:ring-offset-[1.5px] group"
            aria-label={`View event: ${cardData.title}`}
        >
            <div className="flex flex-col h-full">
                {/* Image Container */}
                <div className="relative shrink-0">
                    {cardData.status && (
                        <span
                            className={cn(
                                "absolute top-2 left-2 z-10 py-1 px-2 rounded-2xl text-center text-sm font-medium",
                                statusStyles[cardData.status as keyof StatusStylesRecord]?.bg,
                                statusStyles[cardData.status as keyof StatusStylesRecord]?.text,
                                "capitalize"
                            )}
                            >
                            {cardData.status}
                        </span>
                    )}

                    <figure className="relative w-full aspect-4/3 h-40 rounded-4xl overflow-hidden">
                        {!imageError && cardData.image ? (
                        <Image
                            src={cardData.image}
                            alt={cardData.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            placeholder="blur"
                            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz4KPC9zdmc+"
                            onError={() => setImageError(true)}
                            priority={false}
                        />
                        ) : (
                            <Skeleton className="w-full h-full bg-linear-to-br from-brand-neutral-4 to-brand-neutral-5 flex items-center justify-center" />
                        )}
                    </figure>

                    <div 
                        className="flex text-white justify-end gap-3 items-center absolute bottom-3 right-3"
                        onClick={(e) => e.preventDefault()}
                    >
                        <EventIconActionButton 
                            icon="hugeicons:share-08" 
                            onClick={() => {
                            }} 
                            feedback="Shared"
                        />
                        <EventIconActionButton 
                            icon="ph:link-bold" 
                            onClick={() => copyToClipboard(cardData.href)} 
                            feedback="Event link copied"
                        />
                        <EventIconActionButton 
                            icon="hugeicons:favourite" 
                            onClick={() => {
                            }} 
                            feedback="Added to favourites"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-between flex-1 mt-1">
                    <div>
                        <span className="bg-brand-accent-1 w-fit block text-brand-accent-7 font-medium py-1 px-2 mt-2 rounded-2xl text-center text-xs">
                            {cardData.category}
                        </span>

                        <span className="text-[11px] block mt-1 w-fit text-brand-neutral-7 truncate max-w-full">
                            Hosted by {cardData.host}
                        </span>

                        <p className="text-sm text-secondary-9 font-medium mt-1 mb-3 line-clamp-2">
                            {cardData.title || "Learn to create visually appealing and user-friendly interfaces."}
                        </p>

                        {/* Date & Location */}
                        <div className="space-y-2 mb-2">
                            <div className="flex items-center gap-1">
                                <div className="flex items-center gap-0.5">
                                    <Icon icon="hugeicons:calendar-04" className="size-4 shrink-0 text-brand-accent-6" />
                                    <hr className="w-px h-2 border border-brand-neutral-6" />
                                    <Icon icon="hugeicons:clock-01" className="size-4 shrink-0 text-brand-accent-6" />
                                </div>
                                <span className="text-brand-neutral-7 text-[11px] truncate flex-1">
                                    {cardData.date}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Icon icon="hugeicons:location-01" className="size-4 shrink-0 text-brand-accent-6" />
                                <span className="text-brand-neutral-7 text-[11px] truncate flex-1">
                                {cardData.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        {/* Attendees */}
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {cardData.attendees.slice(0, 4).map((user) => (
                                <Avatar key={user.id} className="ring-2 ring-background size-8">
                                    {user.profile_img && <AvatarImage src={user.profile_img} alt={user.name} />}
                                    <AvatarFallback
                                    className={`${getAvatarColor(user.id.toString())} text-white font-medium text-xs`}
                                    >
                                        {getInitialsFromName(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                ))}
                                {cardData.attendees.length > 4 && (
                                <Avatar className="ring-2 ring-background size-8">
                                    <AvatarFallback className="bg-primary-1 font-medium text-secondary-7 text-xs">
                                    +{cardData.attendees.length - 4}
                                    </AvatarFallback>
                                </Avatar>
                                )}
                            </div>
                            </div>

                            {/* Price */}
                            <div className="text-right shrink-0">
                            {cardData.originalPrice && (
                                <p className="text-xs text-brand-neutral-6 line-through">
                                {cardData.originalPrice}
                                </p>
                            )}
                            <p className={`${space_grotesk.className} font-medium text-lg text-brand-secondary-9`}>
                                {cardData.price}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}