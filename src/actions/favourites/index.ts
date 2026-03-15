"use server"

import { ADD_FAVOURITE_ENDPOINT, FAVOURITES_ENDPOINT, REMOVE_FAVOURITE_ENDPOINT } from "@/endpoints"
import { NAVIGATION_LINKS } from "@/enums/navigation"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidatePath } from "next/cache"

interface GetFavouritesParams {
    page?:       number
    search?:     string
    category?:   string
    start_date?: string
    end_date?:   string
    min_price?:  string
    max_price?:  string
}

interface GetFavouritesResult {
    success:  boolean
    data?:    PaginatedResponse<FavouriteEvent>
    message?: string
}

interface MutateFavouriteResult {
    success:  boolean
    message?: string
}

export async function getFavourites(params: GetFavouritesParams = {}): Promise<GetFavouritesResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(FAVOURITES_ENDPOINT, { params })
        return { success: true, data: data.data }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function addFavourite(eventId: string | number): Promise<MutateFavouriteResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(ADD_FAVOURITE_ENDPOINT, { event_id: eventId })
        revalidatePath(NAVIGATION_LINKS.FAVOURITES.href)
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function removeFavourite(eventId: string | number): Promise<MutateFavouriteResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.delete(`${REMOVE_FAVOURITE_ENDPOINT.replace("[event_id]", String(eventId))}`)

        revalidatePath(NAVIGATION_LINKS.FAVOURITES.href)
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}