'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ChevronRight } from 'lucide-react'
import BackButton from '@/components/BackButton'
import HomeButton from '@/components/HomeButton'
import { EVENTS } from '@/lib/mock'

const DATES = [
  { label: '4월 25일', sub: '토', avail: true },
  { label: '4월 26일', sub: '일', avail: true },
  { label: '4월 27일', sub: '월', avail: false },
]

export default function BookPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const ev = EVENTS.find(e => e.id === params.id) ?? EVENTS[0]
  const [dateIdx, setDateIdx] = useState(0)
  const [count, setCount] = useState(1)
  const [payMethod] = useState('당근페이')
  const [agreed, setAgreed] = useState(false)

  const total = ev.price * count

  return (
    <div className="bg-gray-50 min-h-screen safe-bottom">
      {/* 탑바 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center h-14 px-2">
        <BackButton className="p-2" iconClassName="text-gray-900" />
        <span className="flex-1 text-center text-[17px] font-semibold text-gray-900">예매하기</span>
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
          <p className="text-[15px] font-semibold text-gray-900">{ev.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{ev.venue}</p>
          <p className="text-xs text-gray-500">{ev.time}</p>
        </div>
      </div>

      {/* 날짜 선택 */}
      <section className="bg-white mt-2 px-4 py-4">
        <h3 className="text-[15px] font-bold text-gray-900 mb-3">날짜 선택</h3>
        <div className="flex gap-2">
          {DATES.map((d, i) => (
            <button
              key={i}
              disabled={!d.avail}
              onClick={() => setDateIdx(i)}
              className={`flex-1 py-3 rounded-xl border text-center transition ${
                !d.avail
                  ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                  : dateIdx === i
                    ? 'border-carrot-500 bg-carrot-50 text-carrot-500'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <p className="text-sm font-semibold">{d.label}</p>
              <p className="text-xs mt-0.5">{d.sub}</p>
              {!d.avail && <p className="text-xs mt-0.5">매진</p>}
            </button>
          ))}
        </div>
      </section>

      {/* 매수 선택 */}
      <section className="bg-white mt-2 px-4 py-4">
        <h3 className="text-[15px] font-bold text-gray-900 mb-3">매수 선택</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">일반석</p>
            <p className="text-xs text-gray-400">{ev.price.toLocaleString()}원</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCount(Math.max(1, count - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition"
            >
              <Minus size={14} className="text-gray-700" />
            </button>
            <span className="w-6 text-center text-[15px] font-bold text-gray-900">{count}</span>
            <button
              onClick={() => setCount(Math.min(4, count + 1))}
              className="w-8 h-8 rounded-full border border-carrot-500 bg-carrot-50 flex items-center justify-center hover:bg-carrot-100 transition"
            >
              <Plus size={14} className="text-carrot-500" />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">최대 4매까지 예매 가능합니다</p>
      </section>

      {/* 결제 수단 */}
      <section className="bg-white mt-2 px-4 py-4">
        <h3 className="text-[15px] font-bold text-gray-900 mb-3">결제 수단</h3>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-carrot-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">당근</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">당근페이</p>
              <p className="text-xs text-gray-400">잔액 32,500원</p>
            </div>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-carrot-500 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-carrot-500" />
          </div>
        </div>
      </section>

      {/* 결제 금액 */}
      <section className="bg-white mt-2 px-4 py-4">
        <h3 className="text-[15px] font-bold text-gray-900 mb-3">결제 금액</h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">티켓 ({count}매)</span>
            <span className="text-gray-900">{(ev.price * count).toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">예매 수수료</span>
            <span className="text-gray-900">0원</span>
          </div>
          <div className="h-px bg-gray-100 my-1" />
          <div className="flex justify-between">
            <span className="text-[15px] font-bold text-gray-900">총 결제 금액</span>
            <span className="text-[15px] font-bold text-carrot-500">{total.toLocaleString()}원</span>
          </div>
        </div>
      </section>

      {/* 이용약관 동의 */}
      <div className="bg-white mt-2 px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => setAgreed(!agreed)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
            agreed ? 'bg-carrot-500 border-carrot-500' : 'border-gray-300'
          }`}
        >
          {agreed && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        <span className="text-sm text-gray-600">구매 조건 및 환불 정책에 동의합니다</span>
        <ChevronRight size={14} className="text-gray-400 ml-auto" />
      </div>

      {/* 결제 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-100 px-4 py-4 z-20">
        <button
          onClick={() => agreed && router.push('/tickets')}
          disabled={!agreed}
          className={`w-full py-4 rounded-xl text-[15px] font-bold transition ${
            agreed
              ? 'bg-carrot-500 text-white active:bg-carrot-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {total.toLocaleString()}원 결제하기
        </button>
      </div>
    </div>
  )
}
