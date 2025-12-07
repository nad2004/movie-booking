import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwt } from 'jose'

// Define các path constants để dễ quản lý
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];
const ADMIN_PATHS = ['/admin'];
const STAFF_PATHS = ['/staff'];
const CUSTOMER_PATHS = ['/profile', '/order-history', '/bookings', '/movies', '/showtimes'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('authToken')?.value

  // --- CASE 1: Đã Login nhưng cố vào trang Public (Login/Register) ---
  if (token && PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    try {
      const payload = decodeJwt(token)
      const role = (payload.role as string)?.toLowerCase() || 'user'
      
      // Redirect về trang phù hợp với role
      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (role === 'staff') {
        return NextResponse.redirect(new URL('/staff', request.url))
      } else {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // --- CASE 2: Chưa Login nhưng cố vào trang Protected ---
  const isProtectedPath = 
    ADMIN_PATHS.some(path => pathname.startsWith(path)) ||
    STAFF_PATHS.some(path => pathname.startsWith(path)) ||
    CUSTOMER_PATHS.some(path => pathname.startsWith(path));
    
  if (!token && isProtectedPath) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  if (token) {
    try {
      const payload = decodeJwt(token)
      // 3.1 Check hết hạn
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('authToken')
        return response
      }
      const role = (payload.role as string)?.toLowerCase() || 'user'

      if (role === 'admin') {
        if (STAFF_PATHS.some(path => pathname.startsWith(path))) {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
        
        // Admin cố vào customer pages -> Redirect về /admin
        if (CUSTOMER_PATHS.some(path => pathname.startsWith(path)) || pathname === '/') {
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      }
      if (role === 'staff') {
        // Staff cố vào /admin -> 404
        if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
          return NextResponse.rewrite(new URL('/404', request.url))
        }
        if (CUSTOMER_PATHS.some(path => pathname.startsWith(path)) || pathname === '/') {
          return NextResponse.redirect(new URL('/staff', request.url))
        }
      }
      if (role === 'customer' || role === 'user') {
        // Customer cố vào /admin -> 404
        if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
          return NextResponse.rewrite(new URL('/404', request.url))
        }
        
        if (STAFF_PATHS.some(path => pathname.startsWith(path))) {
          return NextResponse.rewrite(new URL('/404', request.url))
        }
      }

    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('authToken')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}