'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Ticket, ChevronRight, Plus, QrCode, BarChart2,
  Wallet, Heart, Settings, Bell, Star, MapPin, Megaphone, Briefcase,
} from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import { EVENTS } from '@/lib/mock'
import { getHostedEvents, type HostedEvent } from '@/lib/storage'

// 고정 mock 주최 공연 (event 3·4)
const MOCK_HOST_EVENTS = EVENTS.slice(2, 4)

export default function MyPage() {
  const searchParams = useSearchParams()
  const [role, setRole] = useState<'buyer' | 'host'>(
    searchParams.get('tab') === 'host' ? 'host' : 'buyer'
  )

  return (
    <div className="bg-gray-50 min-h-screen safe-bottom">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 pt-4 pb-0">
        <h1 className="text-xl font-bold text-gray-900 mb-3">나의 공연</h1>
        <div className="flex bg-gray-100 rounded-xl p-1 mb-0">
          <button
            onClick={() => setRole('buyer')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              role === 'buyer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            🎟 구매자
          </button>
          <button
            onClick={() => setRole('host')}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              role === 'host' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            🎤 주최자
          </button>
        </div>
      </header>

      {role === 'buyer' ? <BuyerView /> : <HostView />}

      <BottomNav />
    </div>
  )
}

/* ─────────────── 구매자 뷰 ─────────────── */
function BuyerView() {
  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      <div className="bg-white rounded-2xl p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-carrot-400 to-carrot-600 flex items-center justify-center text-2xl font-bold text-white">
          W
        </div>
        <div className="flex-1">
          <p className="text-[17px] font-bold text-gray-900">wonny</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={11} className="text-gray-400" />
            <span className="text-xs text-gray-400">서울 마포구</span>
          </div>
        </div>
        <button className="text-xs text-carrot-500 font-semibold border border-carrot-200 px-3 py-1.5 rounded-full">
          프로필 수정
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatBadge value="3" label="관람한 공연" />
        <StatBadge value="2" label="남긴 후기" />
        <StatBadge value="5" label="관심 공연" />
      </div>

      <Link href="/tickets" className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-carrot-50 flex items-center justify-center">
          <Ticket size={18} className="text-carrot-500" />
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-gray-900">예매 내역</p>
          <p className="text-xs text-gray-400 mt-0.5">예정된 공연 1개</p>
        </div>
        <ChevronRight size={16} className="text-gray-300" />
      </Link>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
        <MenuItem icon={<Heart size={18} className="text-red-400" />} label="관심 공연" sub="5개" />
        <MenuItem icon={<Star size={18} className="text-yellow-400" />} label="내가 쓴 후기" sub="2개" />
        <MenuItem icon={<Bell size={18} className="text-blue-400" />} label="알림 설정" />
        <MenuItem icon={<Wallet size={18} className="text-green-500" />} label="결제 수단 관리" />
        <MenuItem icon={<Settings size={18} className="text-gray-400" />} label="설정" last />
      </div>

      <div className="bg-carrot-50 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-3xl">🎤</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">공연을 직접 열고 싶으신가요?</p>
          <p className="text-xs text-gray-500 mt-0.5">주최자 탭에서 공연을 개설해 보세요</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────── 주최자 뷰 ─────────────── */
function HostView() {
  const [customEvents, setCustomEvents] = useState<HostedEvent[]>([])

  // 페이지 진입 시 localStorage에서 로드
  useEffect(() => {
    setCustomEvents(getHostedEvents())
  }, [])

  // mock + 직접 등록 공연 합산
  const allEvents = [...customEvents, ...MOCK_HOST_EVENTS]
  const totalBooked = allEvents.reduce((s, e) => s + e.booked, 0)
  const totalRevenue = allEvents.reduce((s, e) => s + e.booked * e.price, 0)

  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      {/* 요약 카드 */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl p-5 text-white">
        <p className="text-sm text-white/60 mb-3">내 공연 현황</p>
        <div className="grid grid-cols-3 gap-0 divide-x divide-white/20">
          <div className="pr-3">
            <p className="text-2xl font-bold">{allEvents.length}</p>
            <p className="text-xs text-white/60 mt-0.5">진행 중인 공연</p>
          </div>
          <div className="px-3">
            <p className="text-2xl font-bold">{totalBooked}</p>
            <p className="text-xs text-white/60 mt-0.5">총 예매</p>
          </div>
          <div className="pl-3">
            <p className="text-2xl font-bold">{(totalRevenue / 10000).toFixed(0)}만</p>
            <p className="text-xs text-white/60 mt-0.5">예상 수익</p>
          </div>
        </div>
      </div>

      {/* 개설 버튼 */}
      <Link
        href="/host/create"
        className="flex items-center justify-center gap-2 bg-carrot-500 text-white rounded-2xl py-4 font-bold text-[15px] active:bg-carrot-600 transition"
      >
        <Plus size={18} />
        새 공연 개설하기
      </Link>

      {/* 공연 목록 */}
      <h2 className="text-[15px] font-bold text-gray-900 mt-1">내 공연</h2>

      {allEvents.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <span className="text-4xl mb-3">🎭</span>
          <p className="text-sm">아직 개설한 공연이 없어요</p>
          <p className="text-xs mt-1">위 버튼으로 첫 공연을 개설해 보세요</p>
        </div>
      ) : (
        allEvents.map(ev => {
          const remain = ev.capacity - ev.booked
          const pct = ev.capacity > 0 ? Math.round((ev.booked / ev.capacity) * 100) : 0
          const isNew = String(ev.id).startsWith('custom-')
          return (
            <div key={ev.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div
                className="flex items-center gap-3 p-4"
                style={{ background: `linear-gradient(135deg, ${ev.bg}22, transparent)` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ev.bg}, #374151)` }}
                >
                  {ev.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-gray-900 truncate">{ev.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{ev.date} · {ev.venue}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                  isNew
                    ? 'bg-carrot-100 text-carrot-600'
                    : 'bg-green-100 text-green-600'
                }`}>
                  {isNew ? '새 공연' : '판매중'}
                </span>
              </div>

              <div className="px-4 pb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>예매 {ev.booked}명 / {ev.capacity}명</span>
                  <span className="font-semibold text-carrot-500">{pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-carrot-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div className="flex border-t border-gray-100">
                <HostActionBtn href={`/host/events/${ev.id}`} icon={<BarChart2 size={14} />} label="예매현황" />
                <HostActionBtn href={`/host/checkin/${ev.id}`} icon={<QrCode size={14} />} label="입장관리" />
                <HostActionBtn href="/host/settlement" icon={<Wallet size={14} />} label="정산" />
                <HostActionBtn href={`/host/advertise/${ev.id}`} icon={<Megaphone size={14} />} label="홍보" accent />
                <HostActionBtn href={`/host/alba/${ev.id}`} icon={<Briefcase size={14} />} label="당근알바" alba last />
              </div>
            </div>
          )
        })
      )}

      <Link href="/host/settlement" className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
          <Wallet size={18} className="text-green-600" />
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-gray-900">정산 관리</p>
          <p className="text-xs text-gray-400 mt-0.5">
            정산 예정 {(totalRevenue * 0.95 / 10000).toFixed(1)}만원
          </p>
        </div>
        <ChevronRight size={16} className="text-gray-300" />
      </Link>
    </div>
  )
}

/* ── 공통 컴포넌트 ── */
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white rounded-2xl p-3 text-center border border-gray-100">
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

function MenuItem({ icon, label, sub, last }: {
  icon: React.ReactNode; label: string; sub?: string; last?: boolean
}) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition ${!last ? 'border-b border-gray-50' : ''}`}>
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">{icon}</div>
      <span className="flex-1 text-[15px] text-gray-900 text-left">{label}</span>
      {sub && <span className="text-sm text-gray-400">{sub}</span>}
      <ChevronRight size={14} className="text-gray-300" />
    </button>
  )
}

function HostActionBtn({ href, icon, label, last, accent, alba }: {
  href: string; icon: React.ReactNode; label: string; last?: boolean; accent?: boolean; alba?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex-1 flex flex-col items-center gap-1 py-3 transition ${
        alba   ? 'bg-green-50 hover:bg-green-100 text-green-600'
        : accent ? 'bg-carrot-50 hover:bg-carrot-100 text-carrot-500'
        : 'text-gray-600 hover:bg-gray-50'
      } ${!last ? 'border-r border-gray-100' : ''}`}
    >
      {icon}
      <span className={`text-[11px] font-medium ${alba ? 'text-green-600' : accent ? 'text-carrot-500' : ''}`}>
        {label}
      </span>
    </Link>
  )
}
