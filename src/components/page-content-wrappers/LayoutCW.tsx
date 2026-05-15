import { DEFAULT_LOCATION } from "@/components-data/settings.data"
import { GET_PROFILE_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { getOrDetectLocation } from "@/lib/location-utils"
import AppSettings from "@/persistors/AppSettings"
import AuthPersistor from "@/persistors/AuthPersistor"
import { cookies } from "next/headers"

export default async function LayoutCW() {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    // Always resolve location (fast — reads cookies/headers, no network call)
    // Only fetch profile when the user has a valid access token
    const [locationResult, profileResult] = await Promise.allSettled([
        getOrDetectLocation(),
        token
            ? getServerAxios().then(ax => ax.get(GET_PROFILE_ENDPOINT).then(r => r.data))
            : Promise.resolve(null),
    ])

    const locationData = locationResult.status === "fulfilled"
        ? locationResult.value
        : DEFAULT_LOCATION

    const profileData = profileResult.status === "fulfilled" && profileResult.value
        ? profileResult.value?.data as UserProfile
        : null

    return (
        <>
            <AppSettings currency={locationData.currency} region={locationData.region} />
            <AuthPersistor userData={profileData} />
        </>
    )
}