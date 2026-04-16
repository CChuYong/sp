import Link from 'next/link'
import { ChevronRight, TrendingUp, Clock } from 'lucide-react'
import { EVENTS } from '@/lib/mock'
import BackButton from '@/components/BackButton'
import HomeButton from '@/components/HomeButton'

const SETTLEMENTS = [
  { eventId: '3', status: '정산완료', amount: 380000, fee: 19000, net: 361000, date: '2026.03.20' },
]

export default function Settlement() {
  const pending = EVENTS.slice(2, 4)
  const totalRevenue = pending[0].price * pending[0].booked + pending[1].price * pending[1].booked
  const totalFee = Math.round(totalRevenue * 0.05)
  const totalNet = totalRevenue - totalFee

  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      {/* 탑바 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center h-14 px-2">
        <BackButton className="p-2" iconClassName="text-gray-900" />
        <span className="flex-1 text-center text-[17px] font-semibold text-gray-900">정산</span>
        <HomeButton />
      </header>

      {/* 총 수익 카드 */}
      <div className="mx-4 mt-4 bg-gradient-to-br from-carrot-500 to-carrot-600 rounded-3xl p-5 text-white">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-carrot-100" />
          <span className="text-carrot-100 text-sm">이번 달 예상 수익</span>
        </div>
        <p className="text-3xl font-bold">{totalNet.toLocaleString()}원</p>
        <p className="text-carrot-100 text-sm mt-1">수수료 5% 제외</p>

        <div className="mt-4 flex gap-4">
          <div>
            <p className="text-carrot-100 text-xs">총 예매</p>
            <p className="text-white font-semibold text-sm">{totalRevenue.toLocaleString()}원</p>
          </div>
          <div className="w-px bg-carrot-400" />
          <div>
            <p className="text-carrot-100 text-xs">수수료</p>
            <p className="text-white font-semibold text-sm">-{totalFee.toLocaleString()}원</p>
          </div>
          <div className="w-px bg-carrot-400" />
          <div>
            <p className="text-carrot-100 text-xs">정산 예정</p>
            <p className="text-white font-semibold text-sm">{totalNet.toLocaleString()}원</p>
          </div>
        </div>
      </div>

      {/* 정산 예정 공연 */}
      <section className="mx-4 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-gray-500" />
          <h2 className="text-[15px] font-bold text-gray-900">정산 예정</h2>
          <span className="text-xs text-gray-400">(공연 완료 후 3영업일)</span>
        </div>
        {pending.map(ev => {
          const gross = ev.price * ev.booked
          const fee = Math.round(gross * 0.05)
          const net = gross - fee
          return (
            <Link
              key={ev.id}
              href={`/host/events/${ev.id}`}
              className="flex gap-3 bg-white rounded-2xl p-4 mb-3 border border-gray-100"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `linear-gradient(135deg, ${ev.bg}, #374151)` }}
              >
                {ev.emoji}
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-gray-900">{ev.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{ev.date} · {ev.booked}명 예매</p>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <span className="text-xs text-gray-400">예상 정산 </span>
                    <span className="text-sm font-bold text-carrot-500">{net.toLocaleString()}원</span>
                  </div>
                  <span className="text-xs bg-yellow-50 text-yellow-600 font-medium px-2 py-0.5 rounded-full">
                    정산 예정
                  </span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 self-center shrink-0" />
            </Link>
          )
        })}
      </section>

      {/* 정산 완료 내역 */}
      <section className="mx-4 mt-2">
        <h2 className="text-[15px] font-bold text-gray-900 mb-3">정산 완료</h2>
        {SETTLEMENTS.map((s, i) => {
          const ev = EVENTS.find(e => e.id === s.eventId)!
          return (
            <div key={i} className="flex gap-3 bg-white rounded-2xl p-4 mb-3 border border-gray-100">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `linear-gradient(135deg, ${ev.bg}, #374151)` }}
              >
                {ev.emoji}
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-gray-900">{ev.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.date} 정산</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-gray-900">{s.net.toLocaleString()}원</span>
                  <span className="text-xs bg-green-50 text-green-600 font-medium px-2 py-0.5 rounded-full">
                    정산완료
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </section>

      {/* 정산 계좌 */}
      <div className="mx-4 bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">정산 계좌</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5">카카오뱅크 · 3333-**** -****</p>
          </div>
          <button className="text-xs text-carrot-500 font-semibold border border-carrot-200 px-3 py-1.5 rounded-full">
            변경
          </button>
        </div>
      </div>
    </div>
  )
}
