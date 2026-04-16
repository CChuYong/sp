import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '동네 공연',
  description: '내 근처 소규모 공연 티켓 예매',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="shell">{children}</div>
      </body>
    </html>
  )
}
