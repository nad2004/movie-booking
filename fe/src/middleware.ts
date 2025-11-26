// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwt } from 'jose'

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
            const payload = decodeJwt(token)
            const role = (payload.role as string)?.toLowerCase() || 'user'

            // --- LOGIC MỚI: Rewrite sang 404 để ẩn route Admin ---
            
            // User thường vào /admin -> Hiện 404
            if (pathname.startsWith('/admin') && role !== 'admin') {
                // Rewrite: Giữ nguyên URL nhưng render trang Not Found
                return NextResponse.rewrite(new URL('/404', request.url)) 
            }

            // User thường vào /staff -> Hiện 404
            if (pathname.startsWith('/staff') && role !== 'admin' && role !== 'staff') {
                return NextResponse.rewrite(new URL('/404', request.url))
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