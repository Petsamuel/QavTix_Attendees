import { DEFAULT_LOCATION } from "@/components-data/settings.data"
import "./globals.css"
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
import { Metadata } from "next"
import { ReactNode } from "react"


type LayoutProps = {
  children: ReactNode
}

export const metadata: Metadata = {
  title: 'Qavtix Attendee - Under-development'
}


async function getLayoutData() {

  const axiosInstance = await getServerAxios()

  const [locationResult, profileResult] = await Promise.allSettled([
    getOrDetectLocation(),
    axiosInstance.get(GET_PROFILE_ENDPOINT).then(r => r.data),
  ])

  return {
    locationData: locationResult.status === "fulfilled"
      ? locationResult.value
      : DEFAULT_LOCATION,

    profileData: profileResult.status === "fulfilled"
      ? profileResult.value.data
      : null,
  }
}


export default async function Layout({ children }: LayoutProps) {

  const { locationData, profileData } = await getLayoutData()

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <ReduxStoreProvider>
          <div className="flex justify-end min-h-screen bg-gray-100/80">
            {/* Fixed Sidebar - Takes no space in flex layout */}
            <DesktopSideNav />
            
            {/* Main Content Area */}
            <div className="w-full lg:w-[calc(100%-240px)]">
              {/* Scrollable Content */}
              <div className="w-full">
                <MobileHeaderSection />
                <div className="relative w-full lg:pt-28 px-4 md:px-6">
                  {/* Desktop Header - Fixed at top */}
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