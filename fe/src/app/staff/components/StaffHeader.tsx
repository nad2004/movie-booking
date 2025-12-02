"use client"
import { Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/store/userStore'
import { LogoutButton } from '@/app/components/shared/LogoutButton' 

export function StaffHeader() {
  const { user } = useUserStore()
  const router = useRouter()

  return (
    <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-xl"></div>

      <div className="flex items-center gap-4">
        {/* Ca làm việc */}
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-[10px]">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          <span className="text-sm text-foreground font-medium">Ca 2 (14:00 - 22:00)</span>
        </div>

        {/* Thông báo */}
        <button className="relative p-2 hover:bg-card-hover rounded-[10px] transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>

        {/* Thông tin nhân viên */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          {user && <DropdownMenu>
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
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="p-0! focus:bg-transparent!" 
                onSelect={(e) => {
                  e.preventDefault() // QUAN TRỌNG: Ngăn Dropdown đóng ngay lập tức
                }}
              >
                <LogoutButton className='w-full bg-white text-gray-700 hover:bg-gray-100 hover:text-red-600  shadow-none justify-start' />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}
        </div>
      </div>
    </header>
  )
}
