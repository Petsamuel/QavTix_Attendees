import "./globals.css"
import type { Metadata } from "next"
import { DEFAULT_LOCATION } from "@/components-data/settings.data"
import DesktopHeaderSection from "@/components/layout/DesktopHeaderSection"
import DesktopSideNav from "@/components/layout/DesktopSideNav"
import MobileHeaderSection from "@/components/layout/MobileHeaderSection"
import PopUpsRenderer from "@/components/modals"
import { GET_PROFILE_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { inter } from "@/lib/fonts"
import { getOrDetectLocation } from "@/lib/location-utils"
import ReduxStoreProvider from "@/lib/redux/ReduxStoreProvider"
import AppSettings from "@/persistors/AppSettings"
import AuthPersistor from "@/persistors/AuthPersistor"
import { ReactNode } from "react"
import { attendeeSiteMetadata } from "@/metadata"

export const metadata: Metadata = attendeeSiteMetadata

async function getLayoutData() {
    const axiosInstance = await getServerAxios()
    const [locationResult, profileResult] = await Promise.allSettled([
        getOrDetectLocation(),
        axiosInstance.get(GET_PROFILE_ENDPOINT).then(r => r.data),
    ])

    return {
        locationData: locationResult.status === "fulfilled" ? locationResult.value         : DEFAULT_LOCATION,
        profileData:  profileResult.status  === "fulfilled" ? profileResult.value?.data    : null,
    }
}

export default async function Layout({ children }: { children: ReactNode }) {
    const { locationData, profileData } = await getLayoutData()

    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon.png" type="image/png" />
                <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
                <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            </head>
            <body className={`${inter.className} min-h-screen`}>
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

                    <AppSettings currency={locationData.currency} region={locationData.region} />
                    <AuthPersistor userData={profileData} />
                    <PopUpsRenderer />
                </ReduxStoreProvider>
            </body>
        </html>
    )
}