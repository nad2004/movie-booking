import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwt } from 'jose'

// Define các path constants để dễ quản lý
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password']
const ADMIN_PATHS = ['/admin']
const STAFF_PATHS = ['/staff']
const CUSTOMER_PATHS = ['/profile', '/order-history', '/bookings', '/movies', '/showtimes']

// Helper function để refresh token
async function refreshAccessToken(request: NextRequest): Promise<string | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
    })

    if (response.ok) {
      const data = await response.json()
      return data.data.accessToken
    }
    return null
  } catch (error) {
    console.error('Refresh token error:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('authToken')?.value

  // --- CASE 1: Đã Login nhưng cố vào trang Public (Login/Register) ---
  if (token && PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    try {
      const payload = decodeJwt(token)

      // Kiểm tra token hết hạn
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        // Thử refresh token
        const newToken = await refreshAccessToken(request)
        if (newToken) {
          const newPayload = decodeJwt(newToken)
          const role = (newPayload.role as string)?.toLowerCase() || 'user'

          const response = getRedirectByRole(role, request)
          response.cookies.set('authToken', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60, // 1 giờ
          })
          return response
        } else {
          // Refresh thất bại, cho phép vào trang public
          const response = NextResponse.next()
          response.cookies.delete('authToken')
          return response
        }
      }

      const role = (payload.role as string)?.toLowerCase() || 'user'
      return getRedirectByRole(role, request)
    } catch {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // --- CASE 2: Chưa Login nhưng cố vào trang Protected ---
  const isProtectedPath =
    ADMIN_PATHS.some(path => pathname.startsWith(path)) ||
    STAFF_PATHS.some(path => pathname.startsWith(path)) ||
    CUSTOMER_PATHS.some(path => pathname.startsWith(path))

  if (!token && isProtectedPath) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // --- CASE 3: Có token - Kiểm tra hết hạn và role ---
  if (token) {
    try {
      const payload = decodeJwt(token)

      // Kiểm tra token hết hạn
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        // Thử refresh token
        const newToken = await refreshAccessToken(request)

        if (newToken) {
          // Refresh thành công
          const newPayload = decodeJwt(newToken)
          const role = (newPayload.role as string)?.toLowerCase() || 'user'

          // Kiểm tra quyền truy cập với role mới
          const accessResponse = checkRoleAccess(role, pathname, request)
          if (accessResponse) {
            accessResponse.cookies.set('authToken', newToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 60 * 60, // 1 giờ
            })
            return accessResponse
          }

          // Cho phép truy cập, set token mới
          const response = NextResponse.next()
          response.cookies.set('authToken', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60,
          })
          return response
        } else {
          // Refresh thất bại, redirect về login
          const response = NextResponse.redirect(new URL('/login', request.url))
          response.cookies.delete('authToken')
          return response
        }
      }

      // Token còn hạn, kiểm tra role access
      const role = (payload.role as string)?.toLowerCase() || 'user'
      const accessResponse = checkRoleAccess(role, pathname, request)
      if (accessResponse) {
        return accessResponse
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('authToken')
      return response
    }
  }

  return NextResponse.next()
}

// Helper function để redirect theo role
function getRedirectByRole(role: string, request: NextRequest): NextResponse {
  if (role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url))
  } else if (role === 'staff') {
    return NextResponse.redirect(new URL('/staff', request.url))
  } else {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// Helper function để kiểm tra quyền truy cập theo role
function checkRoleAccess(
  role: string,
  pathname: string,
  request: NextRequest
): NextResponse | null {
  if (role === 'admin') {
    if (STAFF_PATHS.some(path => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    if (CUSTOMER_PATHS.some(path => pathname.startsWith(path)) || pathname === '/') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  if (role === 'staff') {
    if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
      return NextResponse.rewrite(new URL('/404', request.url))
    }
    if (CUSTOMER_PATHS.some(path => pathname.startsWith(path)) || pathname === '/') {
      return NextResponse.redirect(new URL('/staff', request.url))
    }
  }

  if (role === 'customer' || role === 'user') {
    if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
      return NextResponse.rewrite(new URL('/404', request.url))
    }
    if (STAFF_PATHS.some(path => pathname.startsWith(path))) {
      return NextResponse.rewrite(new URL('/404', request.url))
    }
  }

  return null
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
