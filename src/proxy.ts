import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { accessCookieOptions, COOKIE_KEYS } from '@/components-data/cookie-keys'
import { DEFAULT_LOCATION, REGION_CURRENCY_MAP } from '@/components-data/settings.data'
import { REFRESH_TOKEN_ENDPOINT, TOKEN_VERIFY_ENDPOINT } from './endpoints'
import { NAVIGATION_LINKS } from './enums/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const LOGIN_URL    = process.env.NEXT_PUBLIC_AUTH_URL ?? ''

// Paths that bypass auth checks entirely
const SKIP_PATHS = ['/api/auth', '/_next', '/favicon.ico']

const isSkippedPath = (pathname: string) => {
  return SKIP_PATHS.some(p => pathname.startsWith(p))
}

const redirectToLogin = () => {
  return NextResponse.redirect(LOGIN_URL)
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Root redirect
  if (pathname === '/') {
      return NextResponse.redirect(new URL(NAVIGATION_LINKS.MY_TICKETS.href, request.url))
  }

  // Skip auth for internal/api paths
  if (isSkippedPath(pathname)) return response

  // Region / Currency
  const hasRegion   = request.cookies.has(COOKIE_KEYS.USER_REGION)
  const hasCurrency = request.cookies.has(COOKIE_KEYS.USER_CURRENCY)

  if (!hasRegion || !hasCurrency) {
    const country =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      'NG'

    const detected = REGION_CURRENCY_MAP[country] || DEFAULT_LOCATION

    const regionCookieOptions = {
      path:     '/',
      maxAge:   365 * 24 * 60 * 60,
      sameSite: 'lax' as const,
      secure:   process.env.NODE_ENV === 'production',
    }

    if (!hasRegion)   response.cookies.set(COOKIE_KEYS.USER_REGION,   JSON.stringify(detected.region),   regionCookieOptions)
    if (!hasCurrency) response.cookies.set(COOKIE_KEYS.USER_CURRENCY, JSON.stringify(detected.currency), regionCookieOptions)
  }

  const accessToken  = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  // No tokens at all — redirect immediately
  if (!accessToken && !refreshToken) {
      return redirectToLogin()
  }

  // Access token exists — verify it
  if (accessToken) {
    try {
      const verifyRes = await fetch(`${API_BASE_URL}/${TOKEN_VERIFY_ENDPOINT}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token: accessToken }),
      })

      if (verifyRes.ok) return response   // valid — continue
      // Invalid — fall through to refresh

    } catch {
      // Network error — fall through to refresh
    }
  }

  // Access token invalid — try refresh
  if (refreshToken) {
    try {
      const refreshRes = await fetch(`${API_BASE_URL}/${REFRESH_TOKEN_ENDPOINT}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ refresh: refreshToken }),
      })

      if (refreshRes.ok) {
        const { data } = await refreshRes.json()
        response.cookies.set('access_token', data.access, accessCookieOptions)
        return response
      }


      // Refresh expired — clear cookies and send to login
      const loginRedirect = redirectToLogin()
      loginRedirect.cookies.delete('access_token')
      loginRedirect.cookies.delete('refresh_token')
      return loginRedirect

    } catch {
        return redirectToLogin()
    }
  }

  // Fallback
  return redirectToLogin()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}