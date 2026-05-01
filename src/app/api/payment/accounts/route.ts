import { NextRequest, NextResponse } from "next/server"
import { PAYMENT_ACCOUNTS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { CACHE_TAGS } from "@/cache-tags"

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("access_token")?.value

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${PAYMENT_ACCOUNTS_ENDPOINT}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.PAYMENT_ACCOUNTS], revalidate: 60 * 5 },
        })

        const json = await res.json()

        if (!res.ok) {
            return NextResponse.json({ success: false, message: handleApiError(json) }, { status: res.status })
        }

        return NextResponse.json({ success: true, data: json.data })
    } catch {
        return NextResponse.json({ success: false, message: "Failed to load payment accounts." }, { status: 500 })
    }
}
