
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader';
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
        <NextTopLoader
          color="#6c63ff"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false} 
          easing="ease"
          speed={200}
          shadow="0 0 10px #6c63ff,0 0 5px #6c63ff"
          zIndex={9999} // 2. Set z-index thật cao để đè lên Header
        />
        <div className={`${poppins.variable}`}>
          <ClientProvider>{children}</ClientProvider>
        </div>
      </body>
    </html>
  )
}