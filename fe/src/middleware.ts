import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwt } from 'jose'

// Define các path constants để dễ quản lý
const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];
const PROTECTED_PATHS = ['/admin', '/staff', '/profile', '/order-history'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('authToken')?.value

  // --- CASE 1: Đã Login nhưng cố vào trang Public (Login/Register) ---
  // Redirect về Home
  if (token && PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // --- CASE 2: Chưa Login nhưng cố vào trang Protected ---
  // Redirect về Login + kèm callbackUrl
  const isTryingToAccessProtected = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  if (!token && isTryingToAccessProtected) {
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // --- CASE 3: Logic Phân quyền & Check Token Hết hạn ---
  if (token) {
    try {
      const payload = decodeJwt(token)

      // 3.1 Check hết hạn (Quan trọng)
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        // Token hết hạn -> Xử lý như chưa login
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('authToken') // Xóa cookie cũ đi cho sạch
        return response
      }

      const role = (payload.role as string)?.toLowerCase() || 'user'

      // 3.2 Role Guard (Security through obscurity - Ẩn trang Admin)
      
      // Khách/User thường vào /admin -> 404 Not Found
      if (pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.rewrite(new URL('/404', request.url))
      }

      // Khách/User thường vào /staff -> 404 Not Found
      if (pathname.startsWith('/staff') && role !== 'admin' && role !== 'staff') {
        return NextResponse.rewrite(new URL('/404', request.url))
      }

    } catch (error) {
      // Token lỗi/fake -> Đá về login ngay
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('authToken')
      return response
    }
  }

  return NextResponse.next()
}

// Config Matcher tối ưu
export const config = {
  matcher: [
    // Bỏ qua api, static files, images, favicon
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}