const KEY = 'my_hosted_events'

export type HostedEvent = {
  id: string
  title: string
  artist: string
  category: string
  date: string
  time: string
  runtime: string
  venue: string
  address: string
  price: number
  capacity: number
  booked: number
  description: string
  emoji: string
  bg: string
  rating: number
  reviewCount: number
}

const CATEGORY_META: Record<string, { emoji: string; bg: string }> = {
  '음악':   { emoji: '🎵', bg: '#1a1a2e' },
  '연극':   { emoji: '🎭', bg: '#2d1b69' },
  '무용':   { emoji: '💃', bg: '#0d3b2b' },
  '마술':   { emoji: '🪄', bg: '#0d3b2b' },
  '토크쇼': { emoji: '🎤', bg: '#1a1a2e' },
  '기타':   { emoji: '⭐', bg: '#374151' },
}

export function getCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? { emoji: '⭐', bg: '#374151' }
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  const days = ['일', '월', '화', '수', '목', '금', '토']
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? '오후' : '오전'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${period} ${hour}:${m.toString().padStart(2, '0')}`
}

export function getHostedEvents(): HostedEvent[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') }
  catch { return [] }
}

export function saveHostedEvent(event: HostedEvent): void {
  const events = getHostedEvents()
  localStorage.setItem(KEY, JSON.stringify([event, ...events]))
}
