
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import ClientProvider from './ClientProvider'
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'CineBooking - Đặt vé xem phim online',
  description: 'Nền tảng đặt vé xem phim hàng đầu Việt Nam',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className={`${poppins.variable}`}>
          <ClientProvider>{children}</ClientProvider>
        </div>
      </body>
    </html>
  )
}
