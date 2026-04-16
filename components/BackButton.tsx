'use client'
import { useRouter } from 'next/navigation'
import { ChevronLeft, X } from 'lucide-react'

interface Props {
  className?: string
  iconClassName?: string
  size?: number
  variant?: 'chevron' | 'x'
}

export default function BackButton({ className, iconClassName, size = 24, variant = 'chevron' }: Props) {
  const router = useRouter()
  const Icon = variant === 'x' ? X : ChevronLeft
  return (
    <button onClick={() => router.back()} className={className}>
      <Icon size={size} className={iconClassName} />
    </button>
  )
}
