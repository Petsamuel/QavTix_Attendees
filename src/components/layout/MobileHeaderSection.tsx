"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import Logo from "./Logo";
import MobileNavMenu from "./MobileNavMenu";

export default function MobileHeaderSection() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleOpenMenu = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!isMenuOpen) {
            setIsMenuOpen(true)
        }
    }

    return (
        <header className="pt-6 px-4 bg-white md:px-8 flex lg:hidden border-b justify-center items-center">
            <div className="flex items-center justify-between flex-wrap w-full lg:hidden pb-8">
                <Logo width={90} height={90} />

                <MobileNavMenu 
                    isOpen={isMenuOpen} 
                    onClose={() => setIsMenuOpen(false)} 
                />

                <button
                    aria-label="Toggle menu"
                    onClick={handleOpenMenu}
                    className="text-brand-secondary-9 active:scale-95 transition-transform p-1"
                >
                    <Icon
                        icon="lineicons:menu-hamburger-1"
                        className="size-8"
                    />
                </button>
            </div>
        </header>
    )
}