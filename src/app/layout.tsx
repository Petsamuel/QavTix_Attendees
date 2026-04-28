import "./globals.css"
import type { Metadata } from "next"
import DesktopHeaderSection from "@/components/layout/DesktopHeaderSection"
import DesktopSideNav from "@/components/layout/DesktopSideNav"
import MobileHeaderSection from "@/components/layout/MobileHeaderSection"
import PopUpsRenderer from "@/components/modals"
import { inter } from "@/lib/fonts"
import ReduxStoreProvider from "@/lib/redux/ReduxStoreProvider"
import { ReactNode, Suspense } from "react"
import { attendeeSiteMetadata } from "@/lib/metadata"
import LayoutCW from "@/components/page-content-wrappers/LayoutCW"

export const metadata: Metadata = attendeeSiteMetadata

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
                <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            </head>
            <body className={`${inter.className} min-h-screen`}>
                <Suspense fallback={null}>
                    <ReduxStoreProvider>
                        <div className="flex justify-end min-h-screen bg-gray-100/80">
                            <DesktopSideNav />
                            <div className="w-full lg:w-[calc(100%-240px)]">
                                <div className="w-full">
                                    <MobileHeaderSection />
                                    <div className="relative w-full lg:pt-28 px-4 md:px-6">
                                        <DesktopHeaderSection />
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <LayoutCW />

                        <PopUpsRenderer />
                    </ReduxStoreProvider>
                </Suspense>
            </body>
        </html>
    )
}