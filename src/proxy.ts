import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { accessCookieOptions, COOKIE_KEYS } from '@/components-data/cookie-keys'
import { DEFAULT_LOCATION, REGION_CURRENCY_MAP } from '@/components-data/settings.data'
import { REFRESH_TOKEN_ENDPOINT, TOKEN_VERIFY_ENDPOINT } from './endpoints'
import { NAVIGATION_LINKS } from './enums/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const LOGIN_URL    = process.env.NEXT_PUBLIC_AUTH_URL ?? ''

const SKIP_PATHS = ['/api/auth', '/_next', '/favicon.ico']

const isSkippedPath = (pathname: string) =>
  SKIP_PATHS.some(p => pathname.startsWith(p))

const redirectToLogin = (requestUrl?: string) => {
  const loginUrl = new URL(LOGIN_URL)
  if (requestUrl) {
    loginUrl.searchParams.set('returnTo', requestUrl)
  }
  const res = NextResponse.redirect(loginUrl)
  res.cookies.delete('access_token')
  res.cookies.delete('refresh_token')
  return res
}

async function verifyToken(token: string): Promise<"valid" | "invalid" | "network_error"> {
  try {
    const res = await fetch(`${API_BASE_URL}/${TOKEN_VERIFY_ENDPOINT}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token }),
    })
    return res.ok ? "valid" : "invalid"
  } catch {
    return "network_error"
  }
}

async function refreshAccessToken(
  refreshToken: string,
): Promise<{ success: true; accessToken: string } | { success: false; networkError: boolean }> {
  try {
    const res = await fetch(`${API_BASE_URL}/${REFRESH_TOKEN_ENDPOINT}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refresh: refreshToken }),
    })

    if (res.ok) {
      const { data } = await res.json()
      return { success: true, accessToken: data.access }
    }

    return { success: false, networkError: false }
  } catch {
    return { success: false, networkError: true }
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Root redirect
  if (pathname === '/') {
    return NextResponse.redirect(new URL(NAVIGATION_LINKS.MY_TICKETS.href, request.url))
  }

  if (isSkippedPath(pathname)) return response

  // Region / Currency detection
  const hasRegion   = request.cookies.has(COOKIE_KEYS.USER_REGION)
  const hasCurrency = request.cookies.has(COOKIE_KEYS.USER_CURRENCY)

  if (!hasRegion || !hasCurrency) {
    const country =
      request.headers.get('x-vercel-ip-country') ||
      request.headers.get('cf-ipcountry') ||
      'NG'

    const detected = REGION_CURRENCY_MAP[country] || DEFAULT_LOCATION
    const opts = {
      path:     '/',
      maxAge:   365 * 24 * 60 * 60,
      sameSite: 'lax' as const,
      secure:   process.env.NODE_ENV === 'production',
    }

    if (!hasRegion)   response.cookies.set(COOKIE_KEYS.USER_REGION,   JSON.stringify(detected.region),   opts)
    if (!hasCurrency) response.cookies.set(COOKIE_KEYS.USER_CURRENCY, JSON.stringify(detected.currency), opts)
  }

  const accessToken  = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  // No tokens — definitely not authenticated
  if (!accessToken && !refreshToken) {
    return redirectToLogin(request.url)
  }

  // Verify access token
  if (accessToken) {
    const status = await verifyToken(accessToken)

    if (status === "valid")         return response
    if (status === "network_error") return response
    // status === "invalid" — fall through to refresh
  }

  // Access token confirmed invalid — try refresh
  if (refreshToken) {
    const result = await refreshAccessToken(refreshToken)

    if (result.success) {
      response.cookies.set('access_token', result.accessToken, accessCookieOptions)
      return response
    }

    if (result.networkError) return response

    // Refresh token confirmed expired by server — log out
    return redirectToLogin(request.url)
  }

  // Had an access token but no refresh token, and access was invalid
  return redirectToLogin(request.url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}