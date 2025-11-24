'use client' // 1. Bắt buộc phải có dòng này vì dùng hook usePathname

import {
  LayoutDashboard,
  Film,
  Users,
  MapPin,
  Tag,
  Star,
  BarChart3,
  Armchair,
  Calendar,
  Ticket,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation' // 2. Import hook lấy đường dẫn

export function Sidebar() {
  const pathname = usePathname() // 3. Lấy đường dẫn hiện tại

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tổng Quan', path: '/admin' }, // Thêm prefix /admin nếu cần
    { icon: BarChart3, label: 'Báo Cáo Thống Kê', path: '/admin/reports' },
    { icon: Film, label: 'Quản Lý Phim', path: '/admin/movies' },
    { icon: Users, label: 'Quản Lý Người Dùng', path: '/admin/users' },
    { icon: MapPin, label: 'Quản Lý Rạp', path: '/admin/theaters' },
    { icon: Armchair, label: 'Quản Lý Phòng Chiếu', path: '/admin/screening-rooms' },
    { icon: Calendar, label: 'Quản Lý Lịch Chiếu', path: '/admin/schedules' },
    { icon: Ticket, label: 'Quản Lý Vé', path: '/admin/tickets' },
    { icon: Tag, label: 'Quản Lý Thể Loại', path: '/admin/genres' },
    { icon: Star, label: 'Danh Sách Đánh Giá', path: '/admin/reviews' },
    { icon: Settings, label: 'Cấu Hình Hệ Thống', path: '/admin/settings' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-50">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#8C82FF] flex items-center justify-center shadow-lg">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-gray-900 font-bold text-lg">Cinema Admin</h2>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon

            // 4. Logic check active chuẩn xác hơn
            // Nếu path là root '/admin' thì so sánh bằng tuyệt đối
            // Các path con thì dùng startsWith để active cả khi vào trang chi tiết
            const isActive =
              item.path === '/admin' ? pathname === item.path : pathname.startsWith(item.path)

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive
                      ? 'bg-[#6C63FF] text-white shadow-md shadow-[#6c63ff]/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#6C63FF]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#8C82FF] flex items-center justify-center text-white font-bold shadow-sm">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@cinema.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
