import Link from 'next/link'
import { EVENTS } from '@/lib/mock'
import BackButton from '@/components/BackButton'
import HomeButton from '@/components/HomeButton'

// QR 코드 시각화 컴포넌트 (CSS로 모킹)
function QRCode() {
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,0,0,1,0,1,1,0,1,0,1,1],
    [0,1,0,0,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0],
    [1,0,1,1,0,1,1,0,0,1,0,0,1,0,0,1,1,0,1],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,1,0,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,0,1,1,0,1,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,0,0,0,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,0,1,1,1,0,1,1,0],
    [1,0,0,0,0,0,1,0,1,1,0,1,0,0,1,0,0,1,1],
    [1,1,1,1,1,1,1,0,0,0,1,0,1,1,0,1,1,0,1],
  ]
  return (
    <div className="inline-grid gap-px" style={{ gridTemplateColumns: `repeat(19, 1fr)` }}>
      {pattern.flat().map((cell, i) => (
        <div key={i} className={`w-3 h-3 ${cell ? 'bg-gray-900' : 'bg-white'}`} />
      ))}
    </div>
  )
}

export default function TicketQR({ params }: { params: { id: string } }) {
  const ev = EVENTS[0] // B001 → event 1
  const isUsed = false

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 탑바 */}
      <header className="bg-white border-b border-gray-100 flex items-center h-14 px-2">
        <BackButton className="p-2" iconClassName="text-gray-900" />
        <span className="flex-1 text-center text-[17px] font-semibold text-gray-900">내 티켓</span>
        <HomeButton />
      </header>

      {/* 티켓 카드 */}
      <div className="mx-4 mt-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          {/* 상단 컬러 헤더 */}
          <div
            className="h-32 flex flex-col items-center justify-center gap-1 relative"
            style={{ background: `linear-gradient(135deg, ${ev.bg}, #1f2937)` }}
          >
            <span className="text-5xl">{ev.emoji}</span>
            <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
              isUsed ? 'bg-white/30 text-white' : 'bg-green-500 text-white'
            }`}>
              {isUsed ? '입장 완료' : '입장 전'}
            </span>
          </div>

          {/* 공연 정보 */}
          <div className="px-5 py-4 border-b border-dashed border-gray-200">
            <p className="text-xs text-gray-400 font-medium">공연명</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5">{ev.title}</p>
            <div className="grid grid-cols-2 gap-y-3 mt-4">
              <TicketInfo label="날짜" value={ev.date} />
              <TicketInfo label="시간" value={ev.time} />
              <TicketInfo label="장소" value={ev.venue} />
              <TicketInfo label="매수" value="2매" />
            </div>
          </div>

          {/* QR 코드 영역 */}
          <div className="px-5 py-5 flex flex-col items-center">
            <p className="text-xs text-gray-400 mb-4">입장 시 QR 코드를 제시해 주세요</p>
            <div className={`p-3 rounded-xl border border-gray-100 ${isUsed ? 'opacity-40 grayscale' : ''}`}>
              <QRCode />
            </div>
            <p className="text-xs text-gray-400 mt-3 font-mono">B001-2026-04-25</p>
          </div>

          {/* 하단 안내 */}
          <div className="bg-gray-50 px-5 py-3 flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <p className="text-xs text-gray-500">QR 코드는 타인에게 공유하지 마세요</p>
          </div>
        </div>
      </div>

      {/* 리마인드 버튼 */}
      <div className="mx-4 mt-3">
        <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl py-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <Bell size={16} className="text-carrot-500" />
          공연 1시간 전 리마인드 받기
        </button>
      </div>

      {/* 공연 채팅방 */}
      <div className="mx-4 mt-2">
        <Link
          href={`/chat/${ev.id}`}
          className="w-full flex items-center justify-center gap-2 bg-carrot-50 border border-carrot-100 rounded-2xl py-3.5 text-sm font-medium text-carrot-500 hover:bg-carrot-100 transition"
        >
          💬 공연 채팅방 입장하기
        </Link>
      </div>
    </div>
  )
}

function TicketInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
    </div>
  )
}
