"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"


const BRAND_LOGO: Record<string, string> = {
    visa:       "/images/vectors/visa.svg",
    mastercard: "/images/vectors/mastercard.svg",
    verve:      "/images/vectors/verve.svg",
    amex:       "/images/vectors/amex.svg",
    discover:   "/images/vectors/discover.svg",
}

const getBrandLogo = (brand: string): string | null => {
    return BRAND_LOGO[brand.toLowerCase().trim()] ?? null
}

// Chip SVG — matches the real EMV chip look
function ChipIcon() {
    return (
        <svg width="42" height="34" viewBox="0 0 42 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="41" height="33" rx="5.5" fill="#E8C96A" stroke="#C9A84C"/>
            <line x1="14" y1="1" x2="14" y2="33" stroke="#C9A84C" strokeWidth="1"/>
            <line x1="28" y1="1" x2="28" y2="33" stroke="#C9A84C" strokeWidth="1"/>
            <line x1="1" y1="11" x2="41" y2="11" stroke="#C9A84C" strokeWidth="1"/>
            <line x1="1" y1="23" x2="41" y2="23" stroke="#C9A84C" strokeWidth="1"/>
            <rect x="14" y="11" width="14" height="12" fill="#D4A843"/>
        </svg>
    )
}

interface Props {
    method:    PaymentMethod
    variant?:  "default" | "other"    // default = vibrant, other = greyscale
    className?: string
}

export default function PaymentCard({ method, variant = "default", className }: Props) {

    const isDefault = variant === "default"
    const logo      = getBrandLogo(method.brand)
    const expiry    = `${String(method.exp_month).padStart(2, "0")}/${method.exp_year}`

    return (
        <div className={cn(
            "relative w-full rounded-2xl overflow-hidden select-none",
            // Maintain 16:10 card aspect ratio
            "aspect-[16/10]",
            className
        )}>
            {/* Background */}
            {isDefault ? (
                // Vibrant gradient — matches the orange/coral reference
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B47] via-[#FF8C5A] to-[#FFB347]" />
            ) : (
                // Greyscale for non-default
                <div className="absolute inset-0 bg-gradient-to-br from-[#C8C8C8] via-[#D8D8D8] to-[#E8E8E8]" />
            )}

            {/* Decorative circles — subtle depth */}
            <div className={cn(
                "absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20",
                isDefault ? "bg-white" : "bg-white"
            )} />
            <div className={cn(
                "absolute -bottom-12 -right-4 w-52 h-52 rounded-full opacity-10",
                isDefault ? "bg-white" : "bg-white"
            )} />

            {/* Card content */}
            <div className="relative h-full flex flex-col justify-between p-[6%]">

                {/* Top row — brand logo + chip */}
                <div className="flex items-start justify-between">
                    <div className="h-8 w-12 flex items-center">
                        {logo ? (
                            <Image
                                src={logo}
                                alt={method.brand}
                                width={48}
                                height={32}
                                className="object-contain h-full w-auto"
                            />
                        ) : (
                            <span className={cn(
                                "text-xs font-bold uppercase tracking-wider",
                                isDefault ? "text-white" : "text-white/70"
                            )}>
                                {method.brand}
                            </span>
                        )}
                    </div>
                    <ChipIcon />
                </div>

                {/* Card number */}
                <div className={cn(
                    "flex items-center gap-[0.5em] font-mono text-[clamp(10px,3.2vw,18px)] tracking-[0.15em]",
                    isDefault ? "text-white" : "text-white/80"
                )}>
                    <span>••••</span>
                    <span>••••</span>
                    <span>••••</span>
                    <span className="font-bold">{method.last4}</span>
                </div>

                {/* Bottom row — cardholder + expiry */}
                <div className="flex items-end justify-between">
                    <div>
                        <p className={cn(
                            "text-[clamp(7px,1.8vw,10px)] uppercase tracking-widest mb-0.5",
                            isDefault ? "text-white/70" : "text-white/50"
                        )}>
                            Card Holder
                        </p>
                        <p className={cn(
                            "font-bold text-[clamp(9px,2.4vw,14px)] truncate max-w-[12ch]",
                            isDefault ? "text-white" : "text-white/80"
                        )}>
                            {/* Name comes from account — show provider as fallback */}
                            {method.provider.charAt(0).toUpperCase() + method.provider.slice(1)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className={cn(
                            "text-[clamp(7px,1.8vw,10px)] uppercase tracking-widest mb-0.5",
                            isDefault ? "text-white/70" : "text-white/50"
                        )}>
                            Valid Till
                        </p>
                        <p className={cn(
                            "font-bold text-[clamp(9px,2.4vw,14px)]",
                            isDefault ? "text-white" : "text-white/80"
                        )}>
                            {expiry}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}