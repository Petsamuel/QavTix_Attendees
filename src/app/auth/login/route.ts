import { LOGIN_ENDPOINT } from "@/endpoints"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${LOGIN_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body),
        })

        const json = await res.json()

        const isProd = process.env.NODE_ENV === "production"

        if (!res.ok) {
            return NextResponse.json(
                { message: json.message ?? "Login failed" },
                { status: res.status }
            )
        }

        const { user, tokens } = json.data

        const response = NextResponse.json(
            { message: json.message, user },
            { status: 200 }
        )

        // Set access token cookie
        response.cookies.set("access_token", tokens.access, {
            httpOnly: true,
            secure:   isProd,
            sameSite: "strict",
            path:     "/",
            maxAge:   60 * 60 * 10, // 10 hours
            ...(isProd && { domain: ".qavtix.com" })
        })

        // Set refresh token cookie
        response.cookies.set("refresh_token", tokens.refresh, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === "production",
            sameSite: "strict",
            path:     "/api/auth",  // scoped: browser only sends it to /api/auth/* routes
            maxAge:   60 * 60 * 24 * 7, // 7 days
        })

        return response

    } catch {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}