'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Moon, Sun, Bell, Search, User as UserIcon, LogOut, ChevronDown, Ticket, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUserStore } from '@/store/userStore'
import { cn } from '@/lib/utils'
import { Skeleton } from "@/components/ui/skeleton" // 1. Import Skeleton

interface NavLink {
  href: string
  label: string
  subLinks?: { href: string; label: string }[]
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Trang chủ' },
  { label: 'Lịch Chiếu', href: '/showtimes' },
  { href: '/movies', label: 'Phim' },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  
  // 2. Lấy thêm _hasHydrated từ store
  const { user, isAuthenticated, logout, _hasHydrated } = useUserStore()

  const handleLogout = () => {
    logout() // Store sẽ tự xóa cookie và state
    router.push('/login')
    router.refresh() // Refresh để cập nhật lại các thành phần Server
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className={cn(
        'flex items-center justify-between w-full border-b border-border',
        'h-[72px] md:h-[82px] xl:h-[65px]',
        'px-[5px] py-[17px]',
        'md:px-[24px] md:py-[16px]',
        'xl:px-[86px] xl:py-[15px]'
      )}>
        {/* LEFT: logo + nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2" strokeWidth="1.5" />
                <path d="M3 10h18M10 4v16" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-lg font-semibold">CineBooking</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link =>
              link.subLinks ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger className={cn(
                    'text-sm font-medium transition-colors hover:text-[var(--primary)] flex items-center gap-1 focus-visible:outline-none',
                    pathname.startsWith(link.href) ? 'text-[var(--primary)]' : 'text-muted-foreground'
                  )}>
                    {link.label}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {link.subLinks.map(subLink => (
                      <DropdownMenuItem key={subLink.href} asChild>
                        <Link href={subLink.href}>{subLink.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-[var(--primary)]',
                    pathname === link.href ? 'text-[var(--primary)]' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
            <Search className="h-[18px] w-[18px]" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* LOGIC HIỂN THỊ USER (Đã cập nhật fix lỗi nháy) */}
          
          {/* CASE 1: Chưa load xong localStorage -> Hiện Skeleton */}
          {!_hasHydrated ? (
            <Skeleton className="h-10 w-10 rounded-full bg-muted" />
          ) : isAuthenticated && user ? (
            // CASE 2: Đã đăng nhập -> Hiện Avatar & Dropdown
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={user.profilePicture || ''} alt={user.fullName} />
                    <AvatarFallback>{user.fullName?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/order-history" className="cursor-pointer">
                    <Ticket className="mr-2 h-4 w-4" />
                    <span>Vé của tôi</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                   <DropdownMenuItem asChild>
                   <Link href="/admin" className="cursor-pointer">
                     <Settings className="mr-2 h-4 w-4" />
                     <span>Trang quản trị</span>
                   </Link>
                 </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // CASE 3: Chưa đăng nhập -> Hiện nút Login
            <Button
              asChild
              className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl px-4"
            >
              <Link href="/login">Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}