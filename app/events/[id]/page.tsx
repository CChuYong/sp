import Link from 'next/link'
import { ChevronLeft, Heart, Home, MapPin, Clock, Users, Star, MessageCircle, Eye } from 'lucide-react'
import { EVENTS } from '@/lib/mock'
import BottomNav from '@/components/BottomNav'
import BackButton from '@/components/BackButton'

// 공연 ID 기반으로 결정론적 뷰어 수 계산 (실제로는 실시간 API)
function getViewerCount(id: string) {
  return 7 + (parseInt(id) * 13) % 29
}

export default function EventDetail({ params }: { params: { id: string } }) {
  const ev = EVENTS.find(e => e.id === params.id) ?? EVENTS[0]
  const remain = ev.capacity - ev.booked
  const pct = Math.round((ev.booked / ev.capacity) * 100)
  const viewers = getViewerCount(params.id)

  return (
    <div className="safe-bottom">
      {/* 히어로 이미지 */}
      <div
        className="relative h-56 flex items-center justify-center"
        style={{ background: `linear-gradient(160deg, ${ev.bg} 0%, #1f2937 100%)` }}
      >
        <span className="text-8xl">{ev.emoji}</span>
        {/* 오버레이 버튼들 */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3">
          <BackButton
            className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm"
            iconClassName="text-white"
            size={20}
          />
          <div className="flex gap-2">
            <Link href="/" className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm">
              <Home size={16} className="text-white" />
            </Link>
            <button className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm">
              <Heart size={16} className="text-white" />
            </button>
          </div>
        </div>
        {/* 카테고리 태그 */}
        <span className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
          {ev.category}
        </span>
        {/* 실시간 뷰어 수 */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <Eye size={11} />
          <span>지금 {viewers}명이 보는 중</span>
        </div>
      </div>

      {/* 본문 */}
      <div className="px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{ev.title}</h1>
        <p className="text-gray-500 mt-1">{ev.artist}</p>

        {/* 평점 */}
        <Link href={`/events/${ev.id}/reviews`} className="flex items-center gap-1.5 mt-3">
          <div className="flex">
            {[1,2,3,4,5].map(i => (
              <Star key={i} size={14} className={i <= Math.floor(ev.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-900">{ev.rating}</span>
          <span className="text-sm text-gray-400">({ev.reviewCount}개 후기)</span>
          <ChevronLeft size={14} className="text-gray-400 rotate-180" />
        </Link>

        <div className="h-px bg-gray-100 my-4" />

        {/* 공연 정보 */}
        <div className="flex flex-col gap-3">
          <InfoRow icon={<Clock size={16} className="text-gray-400" />}
            primary={`${ev.date} ${ev.time}`}
            secondary={`상영 시간 ${ev.runtime}`}
          />
          <InfoRow icon={<MapPin size={16} className="text-gray-400" />}
            primary={ev.venue}
            secondary={ev.address}
          />
          <InfoRow icon={<Users size={16} className="text-gray-400" />}
            primary={`총 ${ev.capacity}석`}
            secondary={
              <span className={remain <= 5 ? 'text-red-500 font-semibold' : ''}>
                {remain <= 5 ? `마감임박! 잔여 ${remain}석` : `잔여 ${remain}석 (${pct}% 예매됨)`}
              </span>
            }
          />
        </div>

        {/* 예매율 바 */}
        <div className="mt-3">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-carrot-500 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="h-px bg-gray-100 my-4" />

        {/* 공연 소개 */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">공연 소개</h2>
          <p className="text-[15px] text-gray-600 leading-relaxed">{ev.description}</p>
        </section>

        <div className="h-px bg-gray-100 my-4" />

        {/* 주최자 */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3">주최자</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-carrot-100 flex items-center justify-center text-xl">
                {ev.emoji}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{ev.artist}</p>
                <p className="text-xs text-gray-400">주최자</p>
              </div>
            </div>
            <Link href={`/chat/${ev.id}`}
              className="flex items-center gap-1.5 text-sm text-carrot-500 font-semibold border border-carrot-500 px-3 py-1.5 rounded-full"
            >
              <MessageCircle size={14} />
              채팅하기
            </Link>
          </div>
        </section>
      </div>

      {/* 하단 고정 CTA */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-100 px-4 py-3 z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">1인 기준</span>
          <span className="text-lg font-bold text-gray-900">{ev.price.toLocaleString()}원</span>
        </div>
        <Link
          href={remain > 0 ? `/events/${ev.id}/book` : '#'}
          className={`block w-full py-3.5 rounded-xl text-center text-[15px] font-bold transition ${
            remain > 0
              ? 'bg-carrot-500 text-white active:bg-carrot-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {remain > 0 ? '예매하기' : '매진'}
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}

function InfoRow({ icon, primary, secondary }: {
  icon: React.ReactNode
  primary: React.ReactNode
  secondary: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-[15px] font-medium text-gray-900">{primary}</p>
        <p className="text-xs text-gray-400 mt-0.5">{secondary}</p>
      </div>
    </div>
  )
}
