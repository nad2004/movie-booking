'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Moon,
  Sun,
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Ticket,
  Settings,
  X,
  Loader2,
  Clock,
  Star,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useUserStore } from '@/store/userStore'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { useMounted } from '@/hooks/useMounted' // Import custom hook
import { useMovies } from '@/lib/api/movies'
import type { Genre } from '@/types/genre'
import Image from 'next/image'

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
  const { user, isAuthenticated, logout } = useUserStore()

  // FIX HYDRATION: Sử dụng custom hook
  const isMounted = useMounted()

  // --- SEARCH LOGIC ---
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const debouncedSearch = useDebounce(searchQuery, 500)

  const { data: movieData, isLoading: isSearching } = useMovies({
    search: debouncedSearch,
    limit: 5,
    status: '',
  })

  const movies = movieData?.movies || []

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleCloseSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div
        className={cn(
          'flex items-center justify-between w-full border-b border-border',
          'h-[72px] md:h-[82px] xl:h-[65px]',
          'px-[5px] py-[17px]',
          'md:px-6 md:py-4',
          'xl:px-[86px] xl:py-[15px]'
        )}
      >
        {/* LEFT: Logo + Nav */}
        <div
          className={cn(
            'flex items-center gap-10 transition-all duration-300',
            isSearchOpen ? 'hidden md:flex' : 'flex'
          )}
        >
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
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
            <span className="text-lg font-semibold hidden xl:block">CineBooking</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link =>
              link.subLinks ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 focus-visible:outline-none',
                      pathname.startsWith(link.href)
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
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
                    'text-sm font-medium transition-colors hover:text-primary',
                    pathname === link.href ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* RIGHT: Actions */}
        <div
          className={cn('flex items-center gap-2 relative', isSearchOpen ? 'w-full md:w-auto' : '')}
        >
          {/* --- SEARCH BOX --- */}
          <div
            ref={searchContainerRef}
            className={cn(
              'relative transition-all duration-300',
              isSearchOpen ? 'w-full md:w-[400px]' : 'w-auto'
            )}
          >
            {isSearchOpen ? (
              <div className="relative flex items-center animate-in fade-in zoom-in duration-200 z-50">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Tìm tên phim, đạo diễn, diễn viên..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-10 pl-9 pr-8 rounded-xl bg-background border-primary ring-1 ring-primary focus-visible:ring-primary w-full"
                  onKeyDown={e => e.key === 'Escape' && handleCloseSearch()}
                />
                <div className="absolute right-2 flex items-center">
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full hover:bg-muted"
                      onClick={handleCloseSearch}
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  )}
                </div>

                {/* --- SEARCH RESULTS DROPDOWN --- */}
                {searchQuery.trim() && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-60">
                    {movies.length > 0 ? (
                      <div className="max-h-[400px] overflow-y-auto py-2">
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Phim gợi ý
                        </div>
                        {movies.map(movie => (
                          <Link
                            key={movie._id}
                            href={`/movies/${movie._id}`}
                            onClick={handleCloseSearch}
                            className="flex items-start gap-3 px-3 py-2 hover:bg-muted/50 transition-colors group"
                          >
                            <div className="relative w-10 h-14 shrink-0 rounded overflow-hidden bg-gray-100 shadow-sm">
                              <Image
                                src={movie.posterUrl || '/placeholder-movie.png'}
                                alt={movie.title}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                                  {movie.title}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="text-[10px] h-5 px-1 bg-background whitespace-nowrap ml-2"
                                >
                                  {movie.status}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {movie.duration} phút
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-accent">
                                  <Star className="h-3 w-3 fill-accent" />
                                  {movie.averageRating.toFixed(1)}
                                </span>
                              </div>

                              <div className="text-[10px] text-text-secondary mt-1 truncate">
                                {movie.genres?.map((g: Genre) => g.name).join(', ')}
                              </div>
                            </div>
                          </Link>
                        ))}

                        <div className="border-t border-border mt-2 pt-2 px-2">
                          <Link
                            href={`/movies?search=${encodeURIComponent(searchQuery)}`}
                            onClick={handleCloseSearch}
                            className="block text-center text-xs text-primary hover:underline py-1"
                          >
                            Xem tất cả kết quả cho &quot;{searchQuery}&quot;
                          </Link>
                        </div>
                      </div>
                    ) : (
                      !isSearching && (
                        <div className="p-6 text-center">
                          <p className="text-sm text-muted-foreground">Không tìm thấy phim nào.</p>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-[18px] w-[18px]" />
              </Button>
            )}
          </div>

          {/* User Section & Actions */}
          <div className={cn('flex items-center gap-2', isSearchOpen ? 'hidden md:flex' : 'flex')}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* FIX: Hiển thị Skeleton cho đến khi component mount */}
            {!isMounted ? (
              <Skeleton className="h-10 w-10 rounded-full bg-muted" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={user.profilePicture || ''} alt={user.fullName} />
                      <AvatarFallback>
                        {user.fullName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4"
              >
                <Link href="/login">Đăng nhập</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}