'use client'
import { useState } from 'react'
import { ExternalLink, ChevronRight, Users, Camera, Megaphone, Ticket } from 'lucide-react'
import BackButton from '@/components/BackButton'
import HomeButton from '@/components/HomeButton'
import { EVENTS } from '@/lib/mock'
import { getHostedEvents } from '@/lib/storage'

const ROLES = [
  { id: 'staff',      icon: <Users size={18} className="text-blue-500" />,     label: '행사 진행 스태프', desc: '현장 안내 및 운영 보조',  pay: '시급 13,000원~' },
  { id: 'photo',      icon: <Camera size={18} className="text-purple-500" />,   label: '포토그래퍼',       desc: '공연 현장 사진·영상 촬영', pay: '건당 50,000원~' },
  { id: 'promotion',  icon: <Megaphone size={18} className="text-carrot-500" />, label: '홍보 도우미',      desc: '동네 전단지·SNS 홍보',    pay: '시급 12,000원~' },
  { id: 'ticketing',  icon: <Ticket size={18} className="text-green-500" />,    label: '매표 및 안내',     desc: '입장권 확인 및 좌석 안내', pay: '시급 12,500원~' },
]

export default function AlbaPage({ params }: { params: { id: string } }) {
  const allEvents = [...getHostedEvents(), ...EVENTS]
  const ev = allEvents.find(e => e.id === params.id) ?? EVENTS[2]

  const [selected, setSelected] = useState<string[]>([])
  const [showConfirm, setShowConfirm] = useState(false)

  const toggle = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      {/* 탑바 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center h-14 px-2">
        <BackButton className="p-2" iconClassName="text-gray-900" />
        <span className="flex-1 text-center text-[17px] font-semibold text-gray-900">당근알바 연결</span>
        <HomeButton />
      </header>

      {/* 당근알바 로고 배너 */}
      <div className="bg-white px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-carrot-500 flex items-center justify-center">
            <span className="text-white text-lg font-black">알바</span>
          </div>
          <div>
            <p className="text-[15px] font-bold text-gray-900">당근알바</p>
            <p className="text-xs text-gray-500">내 동네 알바를 바로 구해보세요</p>
          </div>
        </div>
        <div className="bg-carrot-50 rounded-xl px-3 py-2.5 flex items-start gap-2">
          <span className="text-sm mt-0.5">💡</span>
          <p className="text-xs text-gray-600 leading-relaxed">
            공연 스태프를 당근알바로 구하면 <span className="font-semibold text-carrot-500">마포구 근처 이웃</span>에게 공고가 노출돼요. 빠르고 믿을 수 있는 동네 알바!
          </p>
        </div>
      </div>

      {/* 공연 요약 */}
      <div className="bg-white mt-2 px-4 py-4 flex gap-3 border-b border-gray-100">
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

      {/* 역할 선택 */}
      <div className="bg-white mt-2 px-4 py-4">
        <p className="text-[15px] font-bold text-gray-900 mb-1">어떤 스태프가 필요하세요?</p>
        <p className="text-xs text-gray-400 mb-3">중복 선택 가능해요</p>
        <div className="flex flex-col gap-2">
          {ROLES.map(role => {
            const isSelected = selected.includes(role.id)
            return (
              <button
                key={role.id}
                onClick={() => toggle(role.id)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                  isSelected ? 'border-carrot-500 bg-carrot-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-white' : 'bg-gray-100'
                }`}>
                  {role.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${isSelected ? 'text-carrot-500' : 'text-gray-900'}`}>
                    {role.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{role.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-gray-700">{role.pay}</p>
                  <div className={`w-5 h-5 rounded-full border-2 mt-1 ml-auto flex items-center justify-center ${
                    isSelected ? 'border-carrot-500 bg-carrot-500' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 알바 공고 예시 */}
      <div className="bg-white mt-2 px-4 py-4">
        <p className="text-[15px] font-bold text-gray-900 mb-3">당근알바 공고 미리보기</p>
        <div className="border border-gray-200 rounded-2xl p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm font-bold text-gray-900">[{ev.title}] 행사 스태프 모집</p>
            <span className="text-[10px] bg-carrot-100 text-carrot-600 font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2">
              알바
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            {ev.venue} / {ev.date}<br />
            마포구 · 단기 1일 · 시급 13,000원
          </p>
          <div className="flex items-center gap-1 mt-2">
            <div className="w-4 h-4 rounded-full bg-carrot-500 flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">당</span>
            </div>
            <span className="text-xs text-gray-400">당근알바 앱에 게시됩니다</span>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-100 px-4 py-4 z-20">
        <button
          onClick={() => setShowConfirm(true)}
          disabled={selected.length === 0}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-[15px] font-bold transition ${
            selected.length > 0
              ? 'bg-carrot-500 text-white active:bg-carrot-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ExternalLink size={16} />
          당근알바 앱에서 공고 올리기
        </button>
      </div>

      {/* 이동 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-w-[390px] mx-auto rounded-t-3xl p-5">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-2xl bg-carrot-500 flex items-center justify-center">
                <span className="text-white text-xl font-black">알바</span>
              </div>
            </div>
            <p className="text-[17px] font-bold text-gray-900 text-center">당근알바 앱으로 이동해요</p>
            <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
              선택한 역할로 공고가 자동 작성돼요.<br />당근알바 앱에서 세부 내용을 수정 후 올릴 수 있어요.
            </p>

            <div className="flex flex-col gap-2 mt-5">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                <ChevronRight size={14} className="text-carrot-500 shrink-0" />
                <span className="text-sm text-gray-700">
                  선택된 역할: <span className="font-semibold text-gray-900">
                    {selected.map(id => ROLES.find(r => r.id === id)?.label).join(', ')}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false)
                  alert('당근알바 앱으로 이동합니다.\n(실제 앱 연동 시 딥링크로 연결됩니다)')
                }}
                className="flex-[2] py-3.5 rounded-xl bg-carrot-500 text-white text-sm font-bold flex items-center justify-center gap-2"
              >
                <ExternalLink size={14} />
                이동하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
