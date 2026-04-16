'use client'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  title?: string
  back?: string
  right?: React.ReactNode
  transparent?: boolean
}

export default function TopBar({ title, back, right, transparent }: Props) {
  return (
    <header
      className={`sticky top-0 z-20 flex items-center h-14 px-2 ${
        transparent ? 'bg-transparent' : 'bg-white border-b border-gray-100'
      }`}
    >
      {back ? (
        <Link href={back} className="p-2 rounded-full hover:bg-gray-100 transition">
          <ChevronLeft size={24} className={transparent ? 'text-white' : 'text-gray-900'} />
        </Link>
      ) : (
        <div className="w-10" />
      )}
      {title && (
        <span className={`flex-1 text-center text-[17px] font-semibold ${transparent ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </span>
      )}
      <div className="w-10 flex justify-end">{right}</div>
    </header>
  )
}
