'use client'
import { useState } from 'react'
import Link from 'next/link'
import { QrCode, ChevronRight } from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import { EVENTS } from '@/lib/mock'

// 내가 구매한 티켓 (주최한 공연 1·2와 겹치지 않도록 event 1·2만 사용)
const MY_TICKETS = [
  { id: 'B001', eventId: '1', count: 2, date: '2026년 4월 25일 토 오후 8:00', status: 'upcoming' },
  { id: 'B003', eventId: '2', count: 2, date: '2026년 3월 10일 일 오후 3:00', status: 'past' },
]

export default function TicketsPage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const filtered = MY_TICKETS.filter(t => t.status === tab)

  return (
    <div className="bg-gray-50 min-h-screen safe-bottom">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 pt-4 pb-0">
        <h1 className="text-xl font-bold text-gray-900 mb-3">예매 내역</h1>
        <div className="flex">
          {(['upcoming', 'past'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition ${
                tab === t
                  ? 'border-carrot-500 text-carrot-500'
                  : 'border-transparent text-gray-400'
              }`}
            >
              {t === 'upcoming' ? '예정된 공연' : '지난 공연'}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-5xl mb-4">🎟</span>
            <p className="text-sm">{tab === 'upcoming' ? '예정된 공연이 없어요' : '지난 공연이 없어요'}</p>
            {tab === 'upcoming' && (
              <Link href="/" className="mt-4 text-carrot-500 text-sm font-semibold">
                공연 탐색하기 →
              </Link>
            )}
          </div>
        ) : (
          filtered.map(ticket => {
            const ev = EVENTS.find(e => e.id === ticket.eventId)!
            return (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 transition"
              >
                {/* 상단 컬러 영역 */}
                <div
                  className="h-24 flex items-center justify-center relative"
                  style={{ background: `linear-gradient(135deg, ${ev.bg}, #374151)` }}
                >
                  <span className="text-5xl">{ev.emoji}</span>
                  <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    tab === 'upcoming' ? 'bg-green-500 text-white' : 'bg-white/30 text-white'
                  }`}>
                    {tab === 'upcoming' ? '입장 전' : '관람 완료'}
                  </span>
                </div>

                {/* 점선 */}
                <div className="flex items-center">
                  <div className="w-4 h-4 -ml-2 rounded-full bg-gray-50 border border-gray-100" />
                  <div className="flex-1 border-t border-dashed border-gray-200 mx-1" />
                  <div className="w-4 h-4 -mr-2 rounded-full bg-gray-50 border border-gray-100" />
                </div>

                {/* 하단 정보 */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[15px] font-bold text-gray-900">{ev.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{ticket.date}</p>
                    <p className="text-xs text-gray-500">{ev.venue} · {ticket.count}매</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <QrCode size={18} className="text-gray-400" />
                    <ChevronRight size={14} className="text-gray-300" />
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>

      <BottomNav />
    </div>
  )
}
