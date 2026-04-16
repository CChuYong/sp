'use client'
import { useState } from 'react'
import Link from 'next/link'
import { QrCode, Download, Search } from 'lucide-react'
import { EVENTS, BOOKINGS } from '@/lib/mock'
import BackButton from '@/components/BackButton'
import HomeButton from '@/components/HomeButton'

const STATUS_COLORS: Record<string, string> = {
  '입장전': 'text-blue-600 bg-blue-50',
  '입장완료': 'text-green-600 bg-green-50',
  '취소': 'text-red-500 bg-red-50',
}

export default function HostDashboard({ params }: { params: { id: string } }) {
  const ev = EVENTS.find(e => e.id === params.id) ?? EVENTS[0]
  const bookings = BOOKINGS.filter(b => b.eventId === params.id)
  const [filter, setFilter] = useState('전체')
  const [query, setQuery] = useState('')

  const totalCount = bookings.reduce((s, b) => s + b.count, 0)
  const checkedIn = bookings.filter(b => b.status === '입장완료').reduce((s, b) => s + b.count, 0)
  const cancelled = bookings.filter(b => b.status === '취소').reduce((s, b) => s + b.count, 0)
  const revenue = bookings.filter(b => b.status !== '취소').reduce((s, b) => s + b.count * ev.price, 0)

  const filtered = bookings.filter(b => {
    const matchFilter = filter === '전체' || b.status === filter
    const matchQuery = !query || b.name.includes(query) || b.phone.includes(query)
    return matchFilter && matchQuery
  })

  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      {/* 탑바 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center h-14 px-2">
        <BackButton className="p-2" iconClassName="text-gray-900" />
        <span className="flex-1 text-center text-[17px] font-semibold text-gray-900">예매 현황</span>
        <HomeButton />
      </header>

      {/* 공연 요약 */}
      <div className="bg-white px-4 py-4 flex gap-3 border-b border-gray-100">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
          style={{ background: `linear-gradient(135deg, ${ev.bg}, #374151)` }}
        >
          {ev.emoji}
        </div>
        <div>
          <p className="text-[15px] font-bold text-gray-900">{ev.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{ev.date} {ev.time}</p>
          <p className="text-xs text-gray-500">{ev.venue}</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        <StatCard label="총 예매" value={`${totalCount}/${ev.capacity}명`} sub={`잔여 ${ev.capacity - totalCount}석`} accent />
        <StatCard label="예상 수익" value={`${revenue.toLocaleString()}원`} sub="수수료 제외" />
        <StatCard label="입장 완료" value={`${checkedIn}명`} sub={`${Math.round(checkedIn/totalCount*100)||0}% 입장`} />
        <StatCard label="취소" value={`${cancelled}명`} sub={`${cancelled * ev.price.toLocaleString()}원 환불`} />
      </div>

      {/* 예매율 */}
      <div className="bg-white mx-4 rounded-2xl px-4 py-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>예매율</span>
          <span className="font-semibold text-carrot-500">{Math.round(totalCount/ev.capacity*100)}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-carrot-500 rounded-full" style={{ width: `${totalCount/ev.capacity*100}%` }} />
        </div>
      </div>

      {/* 예매자 목록 */}
      <div className="mx-4 mt-4">
        {/* 검색 */}
        <div className="bg-white rounded-xl flex items-center gap-2 px-3 py-2.5 border border-gray-200 mb-3">
          <Search size={16} className="text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="이름 또는 전화번호 검색"
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none"
          />
        </div>

        {/* 필터 */}
        <div className="flex gap-2 mb-3">
          {['전체', '입장전', '입장완료', '취소'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filter === f ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
          <button className="ml-auto flex items-center gap-1 text-xs text-gray-500">
            <Download size={12} /> 엑셀
          </button>
        </div>

        {/* 목록 */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          {filtered.map((b, i) => (
            <div key={b.id} className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                {b.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-gray-900">{b.name}</p>
                <p className="text-xs text-gray-400">{b.phone} · {b.count}매 · {b.bookedAt} 예매</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[b.status]}`}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, accent }: {
  label: string; value: string; sub: string; accent?: boolean
}) {
  return (
    <div className={`rounded-2xl p-4 ${accent ? 'bg-carrot-500' : 'bg-white border border-gray-100'}`}>
      <p className={`text-xs font-medium ${accent ? 'text-carrot-100' : 'text-gray-500'}`}>{label}</p>
      <p className={`text-xl font-bold mt-1 ${accent ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      <p className={`text-xs mt-0.5 ${accent ? 'text-carrot-100' : 'text-gray-400'}`}>{sub}</p>
    </div>
  )
}
