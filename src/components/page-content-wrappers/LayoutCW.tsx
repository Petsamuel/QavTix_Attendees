import { DEFAULT_LOCATION } from "@/components-data/settings.data"
import { GET_PROFILE_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"
import { getOrDetectLocation } from "@/lib/location-utils"
import AppSettings from "@/persistors/AppSettings"
import AuthPersistor from "@/persistors/AuthPersistor"

export default async function LayoutCW() {
    const axiosInstance = await getServerAxios()

    const [locationResult, profileResult] = await Promise.allSettled([
        getOrDetectLocation(),
        axiosInstance.get(GET_PROFILE_ENDPOINT).then(r => r.data),
    ])

    const locationData = locationResult.status === "fulfilled"
        ? locationResult.value
        : DEFAULT_LOCATION

    const profileData = profileResult.status === "fulfilled"
        ? profileResult.value?.data as UserProfile
        : null

    return (
        <>
            <AppSettings currency={locationData.currency} region={locationData.region} />
            <AuthPersistor userData={profileData} />
        </>
    )
}