'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Ticket, MessageCircle, User } from 'lucide-react'

const tabs = [
  { href: '/',        label: '홈',      Icon: Home,          match: (p: string) => p === '/' },
  { href: '/explore', label: '탐색',    Icon: Search,        match: (p: string) => p.startsWith('/explore') },
  { href: '/tickets', label: '예매내역', Icon: Ticket,        match: (p: string) => p.startsWith('/tickets') },
  { href: '/chat',    label: '채팅',    Icon: MessageCircle, match: (p: string) => p.startsWith('/chat') },
  { href: '/my',      label: '나의공연', Icon: User,          match: (p: string) => p.startsWith('/my') || p.startsWith('/host') },
]

export default function BottomNav() {
  const path = usePathname()
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-200 z-30">
      <ul className="flex h-16">
        {tabs.map(({ href, label, Icon, match }) => {
          const active = match(path)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center justify-center h-full gap-0.5 transition-colors ${
                  active ? 'text-carrot-500' : 'text-gray-400'
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
