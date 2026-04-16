import Link from 'next/link'
import { Search, Bell, MapPin, Heart, Eye } from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import { EVENTS } from '@/lib/mock'

function getViewers(id: string) { return 7 + (parseInt(id) * 13) % 29 }

const CATEGORIES = ['전체', '음악', '연극', '마술', '토크쇼', '기타']

export default function Home() {
  const featured = EVENTS[0]
  return (
    <div className="safe-bottom">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <button className="flex items-center gap-1 text-[17px] font-bold text-gray-900">
            <MapPin size={16} className="text-carrot-500" />
            마포구
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-0.5 text-gray-500">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Search size={20} className="text-gray-700" />
            </button>
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-carrot-500 rounded-full" />
            </button>
          </div>
        </div>
        {/* 카테고리 탭 */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
          {CATEGORIES.map((c, i) => (
            <button
              key={c}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                i === 0
                  ? 'bg-carrot-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {/* 피처드 배너 */}
      <Link href={`/events/${featured.id}`}>
        <div
          className="mx-4 mt-4 rounded-2xl p-5 flex flex-col justify-between h-48 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${featured.bg} 0%, #374151 100%)` }}
        >
          <div>
            <span className="inline-block bg-carrot-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full mb-2">
              이번 주 인기
            </span>
            <p className="text-white text-xl font-bold leading-tight">{featured.title}</p>
            <p className="text-white/70 text-sm mt-1">{featured.artist}</p>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/80 text-xs">{featured.date} · {featured.venue}</p>
              <p className="text-white font-semibold mt-0.5">{featured.price.toLocaleString()}원</p>
            </div>
            <span className="text-5xl opacity-80">{featured.emoji}</span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
              잔여 {featured.capacity - featured.booked}석
            </span>
          </div>
        </div>
      </Link>

      {/* 공연 목록 */}
      <section className="mt-5 px-4">
        <h2 className="text-[17px] font-bold text-gray-900 mb-3">이번 주 공연</h2>
        <div className="flex flex-col gap-3">
          {EVENTS.map((ev) => {
            const remain = ev.capacity - ev.booked
            const pct = Math.round((ev.booked / ev.capacity) * 100)
            const viewers = getViewers(ev.id)
            return (
              <Link
                key={ev.id}
                href={`/events/${ev.id}`}
                className="flex gap-3 bg-white rounded-2xl p-3 border border-gray-100 hover:border-gray-200 transition"
              >
                {/* 썸네일 */}
                <div
                  className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-4xl"
                  style={{ background: `linear-gradient(135deg, ${ev.bg}, #374151)` }}
                >
                  {ev.emoji}
                </div>
                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-carrot-500 bg-carrot-50 px-1.5 py-0.5 rounded-md">
                        {ev.category}
                      </span>
                      <p className="text-[15px] font-semibold text-gray-900 mt-1 leading-tight">{ev.title}</p>
                    </div>
                    <button className="p-1 ml-1">
                      <Heart size={16} className="text-gray-300" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{ev.date} · {ev.venue}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-gray-900">{ev.price.toLocaleString()}원</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5 text-xs text-gray-400">
                        <Eye size={11} />
                        {viewers}
                      </span>
                      <span className={`text-xs font-medium ${remain <= 5 ? 'text-red-500' : 'text-gray-400'}`}>
                        {remain <= 5 ? `마감임박 ${remain}석` : `${pct}% 예매`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 모임글 배너 */}
      <section className="mx-4 mt-5 mb-4 bg-carrot-50 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-3xl">📢</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">공연 보러 갈 이웃 찾아요</p>
          <p className="text-xs text-gray-500 mt-0.5">모임 글에 공연을 연결해 같이 관람해요</p>
        </div>
        <button className="text-xs font-semibold text-carrot-500 shrink-0">글쓰기 →</button>
      </section>

      <BottomNav />
    </div>
  )
}
