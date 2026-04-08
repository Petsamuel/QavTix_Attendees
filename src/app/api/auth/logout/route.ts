import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
    try {
        const refreshToken = req.cookies.get("refresh_token")?.value

        // Safe to fire-and-forget — we clear cookies regardless of the outcome
        if (refreshToken) {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout/`, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ refresh: refreshToken }),
            }).catch(() => {
                // Don't block logout if the server call fails
            })
        }

        const response = NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 }
        )

        response.cookies.delete("access_token")
        response.cookies.delete("refresh_token")

        return response

    } catch {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}