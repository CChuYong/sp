'use client'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function HomeButton({
  className = 'p-2',
  iconClassName = 'text-gray-700',
}: {
  className?: string
  iconClassName?: string
}) {
  return (
    <Link href="/" className={className}>
      <Home size={20} className={iconClassName} />
    </Link>
  )
}
