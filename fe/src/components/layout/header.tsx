'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, Sun, Bell, Search, User, Ticket, LogOut, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useUserStore } from '@/store/use-user-store'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/showtimes', label: 'Lịch Chiếu' },
  { href: '/movies', label: 'Phim' },
]

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated, logout } = useUserStore()

  const handleLogout = () => logout()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className={cn(
          // base style
          'flex items-center justify-between w-full border-b border-border',
          // height tương ứng từng breakpoint
          'h-[72px] md:h-[82px] xl:h-[65px]',
          // padding theo thiết kế Figma
          'px-[5px] py-[17px]', // mobile
          'md:px-[24px] md:py-[16px]', // tablet
          'xl:px-[86px] xl:py-[15px]' // desktop >=1440px
        )}
      >
        {/* LEFT: logo + nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2" strokeWidth="1.5" />
                <path d="M3 10h18M10 4v16" strokeWidth="1.5" />
              </svg>
            </div>
            <span className="text-lg font-semibold">CineBooking</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
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
            ))}
          </nav>
        </div>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
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

          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-[6px] right-[6px] h-[6px] w-[6px] rounded-full bg-[var(--accent)]" />
          </Button>

          <Button
            asChild
            className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white rounded-xl px-4"
          >
            <Link href="/auth/login">Đăng nhập</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
