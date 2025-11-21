import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user'
import Cookies from 'js-cookie'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  _hasHydrated: boolean // <--- 1. Thêm cờ kiểm tra
  setUser: (user: User | null) => void
  logout: () => void
  setHasHydrated: (state: boolean) => void // <--- 2. Hàm set cờ
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false, // Mặc định là chưa load xong

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      logout: () => {
        Cookies.remove('authToken')
        set({ user: null, isAuthenticated: false })
      },

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'user-storage',
      // 3. Sự kiện này chạy khi Zustand bắt đầu/kết thúc đọc localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)