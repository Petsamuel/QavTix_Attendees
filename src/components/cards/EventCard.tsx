'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { copyToClipboard } from "@/helper-fns/copyToClipboard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { space_grotesk } from "@/lib/fonts"
import { getAvatarColor } from "@/helper-fns/getAvatarColor"
import { getInitialsFromName } from "@/helper-fns/getInitialFromName"
import { Skeleton } from '@/components/ui/skeleton'
import { statusStyles, StatusStylesRecord } from './resources/event-status-styles'
import { EventIconActionButton } from '../buttons/EventIconActionButton'
import ShareEventModal from '@/components/modals/ShareEventModal'
import { EventCardProps } from './resources/event-card-adapter'
import { formatPrice, parsePrice } from '@/helper-fns/formatPrice'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { useFavourite } from '@/custom-hooks/UseFavourite'
import { usePathname } from 'next/navigation'
import { formatEventDate } from '@/helper-fns/date-utils'
import { delistTicket } from '@/actions/marketplace/client'
import { openSuccessModal } from '@/lib/redux/slices/successModalSlice'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import { mockAttendees } from '@/components-data/mock-attendees'
import { EVENT_DETAILS_LINK, MARKETPLACE_EVENT_DETAILS_LINK } from '@/enums/navigation'
import Link from 'next/link'
import { useFormatPrice } from '@/custom-hooks/UseFormatPrice'
import { useRevalidate } from '@/custom-hooks/UseRevalidate'
import { generateAffiliateLink } from '@/actions/affiliates/enroll'

export default function EventsCard(card: EventCardProps & { eventCardFor?: "marketplace" | "global" | "affiliate" }) {

    const { user } = useAppSelector(store => store.authUser)
    const dispatch = useAppDispatch()
    const format = useFormatPrice()

    const [imageError, setImageError] = useState(false)
    const [showShare, setShowShare] = useState(false)
    const [isDelisting, setIsDelisting] = useState(false)
    const [isGeneratingLink, setIsGeneratingLink] = useState(false)
    const [affiliateLink, setAffiliateLink] = useState<string | null>(null)
    const pathName = usePathname()

    const { trigger } = useRevalidate("marketplace")

    const displayCount = Math.min(card.attendees || 0, 3)

    const { isFavourite, toggle: toggleFavourite } = useFavourite(
        card.id,
        card.isFavourite,
        { refreshOnRemove: card.refreshOnRemove ?? false },
    )

    const baseEventUrl = process.env.NEXT_PUBLIC_WEBSITE_URL 
        ? `${process.env.NEXT_PUBLIC_WEBSITE_URL}${EVENT_DETAILS_LINK.replace("[event_id]", card?.id)}`
        : EVENT_DETAILS_LINK.replace("[event_id]", card?.id)

    const eventUrl = affiliateLink || baseEventUrl

    const handleAffiliateAction = async (actionCallback: (url: string) => void) => {
        if (affiliateLink) {
            actionCallback(affiliateLink)
            return
        }

        setIsGeneratingLink(true)
        const res = await generateAffiliateLink(card.id)
        setIsGeneratingLink(false)

        if (res.success && res.data) {
            // Build the affiliate URL with ?ref=code
            const url = new URL(baseEventUrl, window.location.origin)
            url.searchParams.set("ref", res.data.code)
            const finalUrl = url.toString()
            
            setAffiliateLink(finalUrl)
            actionCallback(finalUrl)
        } else {
            dispatch(showAlert({
                title: "Failed to generate link",
                description: res.message || "Could not generate affiliate link. Please try again.",
                variant: "destructive"
            }))
        }
    }

    const handleShare = () => {
        if (card.eventCardFor === "affiliate") {
            handleAffiliateAction(() => setShowShare(true))
        } else {
            setShowShare(true)
        }
    }

    const handleCopy = () => {
        if (card.eventCardFor === "affiliate") {
            handleAffiliateAction((url) => copyToClipboard(url))
        } else {
            copyToClipboard(eventUrl)
        }
    }

    const handleDelist = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isDelisting) return
        setIsDelisting(true)
        const res = await delistTicket(card.marketplace_id!)
        if (res.success) {
            trigger()
            dispatch(openSuccessModal({
                title: "Event successfully delisted",
                description: "Your ticket has been removed from the marketplace.",
                variant: 'success',
                autoClose: true
            }))
        }
        setIsDelisting(false)
    }

    return (
        <>
            <Link
                href={(card.eventCardFor === "marketplace" ? MARKETPLACE_EVENT_DETAILS_LINK.replace("[event_id]", card.marketplace_id || "") : EVENT_DETAILS_LINK)
                    .replace("[event_id]", card.eventCardFor === "marketplace" ? (card.marketplace_id || "") : card.id)}
                target="_blank"
                className="block w-full max-w-72 p-3 relative min-h-[25em] rounded-[32px] border border-brand-neutral-6 bg-white hover:bg-brand-secondary-1 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-[1.5px] focus:ring-brand-accent-5 focus:ring-offset-[1.5px] group"
                aria-label={`View event: ${card.title}`}
            >
                <div className="flex flex-col h-full">
                    <div className="relative shrink-0">
                        {!pathName.includes("marketplace") ?
                            (
                                card.status &&
                                <span className={cn(
                                    "absolute top-2 shadow-sm left-2 z-10 py-1 px-2 rounded-2xl text-center text-xs font-medium capitalize inline-flex items-center justify-center gap-1",
                                    statusStyles[card.status as keyof StatusStylesRecord]?.bg,
                                    statusStyles[card.status as keyof StatusStylesRecord]?.text,
                                    ['fast_filling', 'filling_fast', 'selling_fast', 'Fast-Selling', 'fast-selling'].includes(card.status) ? "border border-[#3D4149]! text-[#3D4149] bg-white/90 backdrop-blur-sm" : ""
                                )}>
                                    {['fast_filling', 'filling_fast', 'selling_fast', 'Fast-Selling', 'fast-selling'].includes(card.status) && (
                                        <Image src="/Fire.svg" alt="Fire Icon" width={16} height={16}/>
                                    )}
                                    {statusStyles[card.status as keyof StatusStylesRecord]?.label || card.status}
                                </span>
                            )
                            :
                            (
                                card.is_mine &&
                                <button
                                    onClick={handleDelist}
                                    disabled={isDelisting}
                                    className="absolute top-3 shadow-sm left-3 z-10 flex justify-center rounded-lg items-center p-2 h-9.5 bg-white text-xs gap-1.5 font-medium text-brand-secondary-9 disabled:opacity-70 disabled:cursor-not-allowed transition-opacity"
                                >
                                    <span className="flex justify-center items-center rounded-full aspect-square size-7 bg-brand-primary-2">
                                        {isDelisting
                                            ? <Icon icon="eos-icons:three-dots-loading" width="22" height="22" className="text-brand-primary-6" />
                                            : <Icon icon="bytesize:trash" width="18" height="18" className="text-brand-primary-6" />
                                        }
                                    </span>
                                    <span>{isDelisting ? "Delisting..." : "Delist Ticket"}</span>
                                </button>
                            )
                        }

                        <figure className="relative w-full aspect-4/3 h-40 rounded-4xl overflow-hidden">
                            {!imageError && card.image ? (
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz4KPC9zdmc+"
                                    onError={() => setImageError(true)}
                                    priority={false}
                                />
                            ) : (
                                <Skeleton className="w-full h-full bg-linear-to-br from-brand-neutral-4 to-brand-neutral-5" />
                            )}
                        </figure>

                        <div
                            className="flex text-white justify-end gap-3 items-center absolute bottom-3 right-3"
                            onClick={(e) => e.preventDefault()}
                        >
                            <EventIconActionButton
                                icon={isGeneratingLink ? "eos-icons:loading" : "hugeicons:share-08"}
                                onClick={handleShare}
                                feedback={isGeneratingLink ? "Generating..." : "Opening share..."}
                            />
                            <EventIconActionButton
                                icon={isGeneratingLink ? "eos-icons:loading" : "ph:link-bold"}
                                onClick={handleCopy}
                                feedback={isGeneratingLink ? "Generating..." : "Link copied!"}
                            />
                            <EventIconActionButton
                                icon={isFavourite ? "teenyicons:heart-solid" : "hugeicons:favourite"}
                                onClick={toggleFavourite}
                                feedback=""
                                iconStyles={isFavourite ? "text-brand-primary-5" : ""}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between flex-1 mt-1">
                        <div>
                            <span className="bg-brand-accent-1 capitalize w-fit block text-brand-accent-9 font-medium py-1 px-2 mt-2 rounded-2xl text-center text-xs">
                                {card.category}
                            </span>
                            <span className="text-[11px] block mt-1 w-fit text-brand-neutral-7 truncate max-w-full">
                                Hosted by {card.host}
                            </span>
                            <p className="text-sm text-secondary-9 font-medium mt-1 mb-3 line-clamp-2">
                                {card.title}
                            </p>

                            <div className="space-y-2 mb-2">
                                <div className="flex items-center gap-1">
                                    <div className="flex items-center gap-0.5">
                                        <Icon icon="hugeicons:calendar-04" className="size-4 shrink-0 text-brand-accent-6" />
                                        <hr className="w-px h-2 border border-brand-neutral-6" />
                                        <Icon icon="hugeicons:clock-01" className="size-4 shrink-0 text-brand-accent-6" />
                                    </div>
                                    <span className="text-brand-neutral-7 text-[11px] truncate flex-1">{formatEventDate(card.date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Icon icon="hugeicons:location-01" className="size-4 shrink-0 text-brand-accent-6" />
                                    <span className="text-brand-neutral-7 text-[11px] truncate flex-1">{card.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center flex-wrap justify-between pt-2 gap-2">
                            {(card.attendees ?? 0) > 0 && (
                                <div className="flex -space-x-1.5 shrink-0">
                                    {mockAttendees.slice(displayCount).map((user) => (
                                        <Avatar key={user.id} className="ring-2 ring-background size-8">
                                            {user.profile_picture && <AvatarImage src={user.profile_picture} alt={user.full_name} />}
                                            <AvatarFallback className={`${getAvatarColor(user.id.toString())} text-white font-medium text-[10px]`}>
                                                {getInitialsFromName(user.full_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {card.attendees && card.attendees > 3 && (
                                        <Avatar className="ring-2 ring-background size-8">
                                            <AvatarFallback className="bg-primary-1 font-medium text-secondary-7 text-xs">
                                                +{card.attendees - 3}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            )}

                            <div className="text-right shrink-0 ml-auto">
                                {card.originalPrice && parsePrice(card.originalPrice) != null && (
                                    <p className="text-xs text-neutral-6 line-through">
                                        {format(parsePrice(card.originalPrice)!, user?.currency)}
                                    </p>
                                )}
                                {card.price && parsePrice(card.price) != null && (
                                    <p className={`${space_grotesk.className} font-semibold text-lg text-secondary-9`}>
                                        {format(parsePrice(card.price)!, user?.currency)}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <ShareEventModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                shareUrl={eventUrl}
                title={card.title}
            />
        </>
    )
}