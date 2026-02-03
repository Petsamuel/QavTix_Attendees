import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { NAVIGATION_LINKS } from './enums/navigation'

export async function proxy(request: NextRequest) {
    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL(NAVIGATION_LINKS.MY_TICKETS.href, request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/',
}