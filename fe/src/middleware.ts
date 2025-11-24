// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwt } from 'jose' // <--- Import từ jose

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    
    // 1. Lấy token từ Cookie
    const token = request.cookies.get('authToken')?.value

    // 2. Các route cần bảo vệ
    const publicPaths = ['/login', '/register', '/forgot-password']
    
    // --- CASE 1: Đã đăng nhập nhưng cố vào trang Login/Register ---
    if (token && publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // --- CASE 2: Chưa đăng nhập nhưng cố vào trang Admin/Staff ---
    const isProtectedRoute = 
        pathname.startsWith('/admin') || 
        pathname.startsWith('/staff') || 
        pathname.startsWith('/profile')
    
    if (!token && isProtectedRoute) {
        const url = new URL('/login', request.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
    }

    // --- CASE 3: Check Role (Phân quyền) ---
    if (token) {
        try {
            // Dùng jose để decode payload (nhanh, không verify chữ ký)
            const payload = decodeJwt(token)
            
            // Ép kiểu về string để an toàn và lowercase
            const role = (payload.role as string)?.toLowerCase() || 'user'

            // Vào /admin mà không phải admin -> Chặn
            if (pathname.startsWith('/admin') && role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url)) 
            }

            // Vào /staff mà không phải admin hoặc staff -> Chặn
            if (pathname.startsWith('/staff') && role !== 'admin' && role !== 'staff') {
                return NextResponse.redirect(new URL('/', request.url))
            }
            
        } catch (error) {
            // Nếu token lỗi (không decode được) -> Xóa cookie và đá về login
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