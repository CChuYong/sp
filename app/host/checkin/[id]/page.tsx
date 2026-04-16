'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, CheckCircle, XCircle, Flashlight } from 'lucide-react'
import BackButton from '@/components/BackButton'
import HomeButton from '@/components/HomeButton'
import { BOOKINGS, EVENTS } from '@/lib/mock'

const RECENT = [
  { name: '박준호', time: '오후 7:52', status: 'ok' as const },
  { name: '김태영', time: '오후 7:48', status: 'fail' as const },
]

export default function CheckIn({ params }: { params: { id: string } }) {
  const ev = EVENTS.find(e => e.id === params.id) ?? EVENTS[0]
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<null | 'ok' | 'fail' | 'already'>(null)
  const checkedIn = BOOKINGS.filter(b => b.status === '입장완료').length

  const handleSearch = () => {
    if (!query) return
    const found = BOOKINGS.find(b => b.name === query || b.phone.includes(query))
    if (!found) return setResult('fail')
    if (found.status === '입장완료') return setResult('already')
    setResult('ok')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 탑바 */}
      <header className="flex items-center h-14 px-2">
        <BackButton className="p-2" iconClassName="text-white" />
        <span className="flex-1 text-center text-[17px] font-semibold text-white">입장 관리</span>
        <HomeButton iconClassName="text-white" />
      </header>

      {/* 공연 정보 배지 */}
      <div className="mx-4 mb-4 flex items-center justify-between">
        <p className="text-white/80 text-sm">{ev.title}</p>
        <div className="flex items-center gap-2">
          <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            입장 {checkedIn}명
          </span>
        </div>
      </div>

      {/* QR 스캔 뷰파인더 */}
      <div className="mx-4 aspect-square rounded-3xl bg-black overflow-hidden relative flex items-center justify-center">
        {/* 카메라 피드 시뮬레이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />

        {/* 코너 마커 */}
        {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-10 h-10`}>
            <div className={`absolute w-8 h-1 bg-carrot-500 rounded-full ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'}`} />
            <div className={`absolute h-8 w-1 bg-carrot-500 rounded-full ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'}`} />
          </div>
        ))}

        {/* 스캔 라인 */}
        <div className="absolute left-8 right-8 h-0.5 bg-carrot-500/60 animate-pulse" style={{ top: '45%' }} />

        {result === null && (
          <p className="relative text-white/50 text-sm">QR 코드를 카메라에 비춰주세요</p>
        )}

        {result === 'ok' && (
          <div className="relative flex flex-col items-center gap-2">
            <CheckCircle size={56} className="text-green-400" />
            <p className="text-white font-semibold text-lg">입장 확인</p>
            <p className="text-white/70 text-sm">이수진 · 2매</p>
          </div>
        )}

        {result === 'fail' && (
          <div className="relative flex flex-col items-center gap-2">
            <XCircle size={56} className="text-red-400" />
            <p className="text-white font-semibold text-lg">확인 실패</p>
            <p className="text-white/70 text-sm">유효하지 않은 티켓입니다</p>
          </div>
        )}

        {result === 'already' && (
          <div className="relative flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-white font-semibold text-lg">이미 입장됨</p>
            <p className="text-white/70 text-sm">오후 7:48에 입장 처리됨</p>
          </div>
        )}
      </div>

      {/* 수동 검색 */}
      <div className="mx-4 mt-4">
        <div className="bg-white/10 rounded-2xl flex items-center gap-2 px-4 py-3">
          <Search size={16} className="text-white/40" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="이름 또는 전화번호 직접 검색"
            className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
          />
          <button
            onClick={handleSearch}
            className="text-xs font-semibold text-carrot-400 px-2"
          >
            확인
          </button>
        </div>
      </div>

      {/* 최근 입장 */}
      <div className="mx-4 mt-4">
        <p className="text-white/50 text-xs font-medium mb-2">최근 입장</p>
        <div className="flex flex-col gap-2">
          {RECENT.map((r, i) => (
            <div key={i} className="bg-white/10 rounded-xl flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {r.status === 'ok'
                  ? <CheckCircle size={18} className="text-green-400" />
                  : <XCircle size={18} className="text-red-400" />
                }
                <p className="text-white text-sm font-medium">{r.name}</p>
              </div>
              <p className="text-white/40 text-xs">{r.time}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 초기화 버튼 */}
      {result !== null && (
        <div className="mx-4 mt-4">
          <button
            onClick={() => { setResult(null); setQuery('') }}
            className="w-full py-3.5 rounded-xl bg-white/10 text-white text-sm font-medium"
          >
            다음 티켓 스캔
          </button>
        </div>
      )}
    </div>
  )
}
