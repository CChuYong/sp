'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Megaphone, Users, Eye, TrendingUp, CheckCircle, ChevronRight, Zap } from 'lucide-react'
import BackButton from '@/components/BackButton'
import HomeButton from '@/components/HomeButton'
import { EVENTS } from '@/lib/mock'
import { getHostedEvents } from '@/lib/storage'

const RADIUS_OPTIONS = [
  {
    id: '1km',
    label: '내 동네',
    radius: '1km 이내',
    price: 2000,
    reach: 2100,
    impressions: 6300,
    ringSize: 60,
    description: '공연장 바로 근처 이웃',
  },
  {
    id: '3km',
    label: '가까운 동네',
    radius: '3km 이내',
    price: 5000,
    reach: 8400,
    impressions: 25200,
    ringSize: 110,
    description: '도보·자전거 거리 이웃',
  },
  {
    id: '5km',
    label: '넓은 범위',
    radius: '5km 이내',
    price: 10000,
    reach: 18000,
    impressions: 54000,
    ringSize: 155,
    description: '대중교통 이용 가능 범위',
  },
  {
    id: 'gu',
    label: '마포구 전체',
    radius: '구 전체',
    price: 20000,
    reach: 45000,
    impressions: 135000,
    ringSize: 190,
    description: '마포구 전체 이웃 대상',
  },
]

const DURATION_OPTIONS = [
  { days: 1, label: '1일',  discount: 0 },
  { days: 3, label: '3일',  discount: 10 },
  { days: 7, label: '7일',  discount: 20 },
  { days: 14, label: '14일', discount: 30 },
]

export default function AdvertisePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const allEvents = [
    ...getHostedEvents(),
    ...EVENTS,
  ]
  const ev = allEvents.find(e => e.id === params.id) ?? EVENTS[2]

  const [selectedRadius, setSelectedRadius] = useState(RADIUS_OPTIONS[1])
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[1])
  const [done, setDone] = useState(false)

  const basePrice = selectedRadius.price * selectedDuration.days
  const discountAmt = Math.round(basePrice * selectedDuration.discount / 100)
  const totalPrice = basePrice - discountAmt

  const estimatedReach = selectedRadius.reach
  const estimatedImpressions = selectedRadius.impressions * selectedDuration.days

  /* ── 완료 화면 ── */
  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center gap-5">
        <div className="w-20 h-20 rounded-full bg-carrot-50 flex items-center justify-center">
          <Megaphone size={36} className="text-carrot-500" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">광고가 시작됐어요! 🎉</p>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            <span className="font-semibold text-gray-800">{selectedRadius.radius}</span> 이웃{' '}
            <span className="font-semibold text-carrot-500">{estimatedReach.toLocaleString()}명</span>에게<br />
            {selectedDuration.days}일간 공연이 노출됩니다.
          </p>
        </div>

        <div className="w-full bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          <AdStat icon={<Users size={16} className="text-blue-500" />}
            label="예상 도달" value={`${estimatedReach.toLocaleString()}명`} />
          <AdStat icon={<Eye size={16} className="text-purple-500" />}
            label="예상 노출" value={`${estimatedImpressions.toLocaleString()}회`} />
          <AdStat icon={<TrendingUp size={16} className="text-green-500" />}
            label="광고 기간" value={`${selectedDuration.days}일`} />
          <AdStat icon={<Zap size={16} className="text-carrot-500" />}
            label="결제 금액" value={`${totalPrice.toLocaleString()}원`} />
        </div>

        <button
          onClick={() => router.push('/my?tab=host')}
          className="w-full py-4 bg-carrot-500 text-white rounded-xl text-[15px] font-bold"
        >
          내 공연으로 돌아가기
        </button>
      </div>
    )
  }

  /* ── 설정 화면 ── */
  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      {/* 탑바 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center h-14 px-2">
        <BackButton className="p-2" iconClassName="text-gray-900" />
        <span className="flex-1 text-center text-[17px] font-semibold text-gray-900">동네 광고</span>
        <HomeButton />
      </header>

      {/* 공연 요약 */}
      <div className="bg-white px-4 py-4 flex gap-3 border-b border-gray-100">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: `linear-gradient(135deg, ${ev.bg}, #374151)` }}
        >
          {ev.emoji}
        </div>
        <div>
          <p className="text-[15px] font-bold text-gray-900">{ev.title}</p>
          <p className="text-xs text-gray-500 mt-0.5">{ev.date} · {ev.venue}</p>
        </div>
      </div>

      {/* 반경 시각화 지도 */}
      <div className="bg-white pt-5 pb-4 px-4">
        <p className="text-[15px] font-bold text-gray-900 mb-4">광고 범위 선택</p>

        <div className="relative flex items-center justify-center" style={{ height: 220 }}>
          {/* 배경 지도 느낌 */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#e8ead5]">
            <svg className="w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
              <rect x="20%" y="0" width="3%" height="100%" fill="#bbb"/>
              <rect x="55%" y="0" width="2.5%" height="100%" fill="#bbb"/>
              <rect x="0" y="30%" width="100%" height="3%" fill="#bbb"/>
              <rect x="0" y="65%" width="100%" height="2.5%" fill="#bbb"/>
              <rect x="25%" y="5%" width="27%" height="22%" rx="4" fill="#d4d6c0"/>
              <rect x="60%" y="5%" width="28%" height="22%" rx="4" fill="#d4d6c0"/>
              <rect x="5%" y="5%" width="12%" height="22%" rx="4" fill="#d4d6c0"/>
              <rect x="5%" y="35%" width="45%" height="25%" rx="4" fill="#c8d4b0"/>
              <rect x="60%" y="35%" width="28%" height="25%" rx="4" fill="#d4d6c0"/>
            </svg>
          </div>

          {/* 반경 원들 (가장 큰 것부터 그려서 작은 게 앞에 오도록) */}
          {[...RADIUS_OPTIONS].reverse().map(opt => {
            const isSelected = selectedRadius.id === opt.id
            const isSmaller = RADIUS_OPTIONS.indexOf(opt) <= RADIUS_OPTIONS.indexOf(selectedRadius)
            return (
              <div
                key={opt.id}
                className="absolute rounded-full border-2 transition-all duration-300"
                style={{
                  width: opt.ringSize * 2,
                  height: opt.ringSize * 2,
                  borderColor: isSelected ? '#FF7E36' : isSmaller ? '#FF7E3644' : '#ddd',
                  backgroundColor: isSelected
                    ? '#FF7E3610'
                    : isSmaller
                      ? '#FF7E3606'
                      : 'transparent',
                }}
              />
            )
          })}

          {/* 반경 레이블 */}
          {RADIUS_OPTIONS.map(opt => {
            const isSelected = selectedRadius.id === opt.id
            const angle = { '1km': -45, '3km': 30, '5km': -120, 'gu': 60 }[opt.id] ?? 0
            const rad = (angle * Math.PI) / 180
            const x = Math.cos(rad) * (opt.ringSize + 14)
            const y = Math.sin(rad) * (opt.ringSize + 14)
            return (
              <div
                key={opt.id}
                className="absolute pointer-events-none"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                  isSelected ? 'bg-carrot-500 text-white' : 'bg-white/80 text-gray-500'
                }`}>
                  {opt.id === 'gu' ? '구 전체' : opt.id}
                </span>
              </div>
            )
          })}

          {/* 현재 위치 핀 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-carrot-500 border-3 border-white shadow-lg" />
            <div className="w-10 h-10 rounded-full bg-carrot-500/20 absolute animate-ping" />
          </div>
        </div>

        {/* 반경 선택 버튼들 */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {RADIUS_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelectedRadius(opt)}
              className={`flex flex-col p-3 rounded-xl border-2 text-left transition-all ${
                selectedRadius.id === opt.id
                  ? 'border-carrot-500 bg-carrot-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-bold ${
                  selectedRadius.id === opt.id ? 'text-carrot-500' : 'text-gray-900'
                }`}>
                  {opt.label}
                </span>
                {selectedRadius.id === opt.id && (
                  <CheckCircle size={14} className="text-carrot-500" />
                )}
              </div>
              <span className="text-xs text-gray-500">{opt.radius}</span>
              <span className="text-xs text-gray-400 mt-0.5">{opt.description}</span>
              <span className={`text-sm font-bold mt-2 ${
                selectedRadius.id === opt.id ? 'text-carrot-500' : 'text-gray-700'
              }`}>
                {opt.price.toLocaleString()}원 <span className="text-xs font-normal text-gray-400">/ 일</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 기간 선택 */}
      <div className="bg-white mt-2 px-4 py-4">
        <p className="text-[15px] font-bold text-gray-900 mb-3">광고 기간</p>
        <div className="flex gap-2">
          {DURATION_OPTIONS.map(d => (
            <button
              key={d.days}
              onClick={() => setSelectedDuration(d)}
              className={`flex-1 py-3 rounded-xl border-2 text-center transition-all relative ${
                selectedDuration.days === d.days
                  ? 'border-carrot-500 bg-carrot-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {d.discount > 0 && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  -{d.discount}%
                </span>
              )}
              <p className={`text-sm font-bold ${
                selectedDuration.days === d.days ? 'text-carrot-500' : 'text-gray-900'
              }`}>
                {d.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {(selectedRadius.price * d.days * (1 - d.discount / 100)).toLocaleString()}원
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 예상 효과 */}
      <div className="bg-white mt-2 px-4 py-4">
        <p className="text-[15px] font-bold text-gray-900 mb-3">예상 광고 효과</p>
        <div className="grid grid-cols-3 gap-3">
          <EffectCard
            icon={<Users size={18} className="text-blue-500" />}
            label="예상 도달"
            value={`${(estimatedReach / 1000).toFixed(1)}천명`}
            bg="bg-blue-50"
          />
          <EffectCard
            icon={<Eye size={18} className="text-purple-500" />}
            label="예상 노출"
            value={`${(estimatedImpressions * selectedDuration.days / 10000).toFixed(1)}만회`}
            bg="bg-purple-50"
          />
          <EffectCard
            icon={<TrendingUp size={18} className="text-green-500" />}
            label="기간"
            value={`${selectedDuration.days}일`}
            bg="bg-green-50"
          />
        </div>

        <div className="mt-3 bg-gray-50 rounded-xl p-3 text-xs text-gray-500 leading-relaxed">
          💡 동네 이웃의 홈 화면과 탐색 탭 상단에 공연이 노출됩니다. 예상 수치는 과거 유사 공연 기준이에요.
        </div>
      </div>

      {/* 결제 요약 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-100 px-4 py-4 z-20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-400">
              {selectedRadius.price.toLocaleString()}원/일 × {selectedDuration.days}일
              {selectedDuration.discount > 0 && (
                <span className="text-red-500 ml-1">({selectedDuration.discount}% 할인)</span>
              )}
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              {selectedDuration.discount > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  {basePrice.toLocaleString()}원
                </span>
              )}
              <span className="text-xl font-bold text-gray-900">{totalPrice.toLocaleString()}원</span>
            </div>
          </div>
          <button
            onClick={() => setDone(true)}
            className="flex items-center gap-2 bg-carrot-500 text-white px-5 py-3.5 rounded-xl font-bold text-[15px] active:bg-carrot-600 transition"
          >
            <Megaphone size={16} />
            광고 시작
          </button>
        </div>
      </div>
    </div>
  )
}

function AdStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  )
}

function EffectCard({ icon, label, value, bg }: {
  icon: React.ReactNode; label: string; value: string; bg: string
}) {
  return (
    <div className={`${bg} rounded-xl p-3 text-center`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-sm font-bold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}
