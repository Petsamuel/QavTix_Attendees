import { accessCookieOptions } from "@/components-data/cookie-keys"
import { decryptHandoffToken } from "@/lib/handoff"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const handoff   = req.nextUrl.searchParams.get("handoff")
    const returnTo  = req.nextUrl.searchParams.get("returnTo")

    if (!handoff) {
        return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    try {
        const { access, refresh } = decryptHandoffToken(handoff)

        // Redirect to returnTo or home, stripping the handoff token from the URL
        const destination = returnTo ?? "/"
        const response    = NextResponse.redirect(new URL(destination, req.url))

        response.cookies.set("access_token", access, accessCookieOptions)
        response.cookies.set("refresh_token", refresh, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === "production",
            sameSite: "strict",
            path:     "/api/auth",
            maxAge:   60 * 60 * 24 * 7,
        })

        return response

    } catch (err) {
        // Token was tampered with or expired
        console.error("[callback] invalid handoff token:", err)
        return NextResponse.redirect(new URL("/sign-in?error=session_expired", req.url))
    }
}