'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, Bell, Star, UtensilsCrossed } from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import { EVENTS, CHAT_ROOMS, REMINDERS } from '@/lib/mock'

type Tab = 'all' | 'rooms' | 'remind'

export default function ChatListPage() {
  const [tab, setTab] = useState<Tab>('all')

  const totalUnread = CHAT_ROOMS.reduce((s, r) => s + r.unread, 0)
  const pendingReminders = REMINDERS.filter(r => !r.done).length

  return (
    <div className="bg-gray-50 min-h-screen safe-bottom">
      {/* 탑바 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 pt-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">채팅</h1>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Search size={20} className="text-gray-700" />
          </button>
        </div>

        {/* 탭 */}
        <div className="flex">
          {([
            { id: 'all',    label: '전체',       badge: totalUnread + pendingReminders },
            { id: 'rooms',  label: '공연 채팅방', badge: totalUnread },
            { id: 'remind', label: '리마인드',    badge: pendingReminders },
          ] as const).map(({ id, label, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 transition relative ${
                tab === id
                  ? 'border-carrot-500 text-carrot-500'
                  : 'border-transparent text-gray-400'
              }`}
            >
              {label}
              {badge > 0 && (
                <span className="absolute top-0 right-1/4 translate-x-full -translate-y-0.5 min-w-[18px] h-[18px] px-1 bg-carrot-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col">
        {/* ─── 공연 채팅방 ─── */}
        {(tab === 'all' || tab === 'rooms') && (
          <section>
            {tab === 'all' && (
              <p className="text-xs font-semibold text-gray-400 px-4 pt-4 pb-2">공연 채팅방</p>
            )}
            <div className="bg-white">
              {CHAT_ROOMS.map((room, i) => {
                const ev = EVENTS.find(e => e.id === room.eventId)!
                return (
                  <Link
                    key={room.eventId}
                    href={`/chat/${room.eventId}`}
                    className={`flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition ${
                      i > 0 ? 'border-t border-gray-50' : ''
                    }`}
                  >
                    {/* 아바타 */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 relative"
                      style={{ background: `linear-gradient(135deg, ${ev.bg}, #374151)` }}
                    >
                      {ev.emoji}
                      {/* 온라인 닷 */}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between">
                        <p className="text-[15px] font-semibold text-gray-900 truncate mr-2">{ev.title}</p>
                        <span className="text-xs text-gray-400 shrink-0">{room.lastTime}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-sm text-gray-500 truncate mr-2">{room.lastMsg}</p>
                        {room.unread > 0 && (
                          <span className="shrink-0 min-w-[20px] h-5 px-1.5 bg-carrot-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                            {room.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{room.memberCount}명 참여 중</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ─── 리마인드 ─── */}
        {(tab === 'all' || tab === 'remind') && (
          <section className={tab === 'all' ? 'mt-3' : ''}>
            {tab === 'all' && (
              <p className="text-xs font-semibold text-gray-400 px-4 pt-1 pb-2">리마인드</p>
            )}
            <div className="flex flex-col gap-0 bg-white">
              {REMINDERS.map((rem, i) => {
                const ev = EVENTS.find(e => e.id === rem.eventId)!
                const isReview = rem.type === 'review'
                const isRestaurant = rem.type === 'restaurant'
                return (
                  <div
                    key={rem.id}
                    className={`px-4 py-4 ${i > 0 ? 'border-t border-gray-50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                        isReview ? 'bg-yellow-50' : isRestaurant ? 'bg-green-50' : 'bg-blue-50'
                      }`}>
                        {isReview ? '⭐' : isRestaurant ? '🍽' : '🔔'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                          <p className="text-[13px] font-bold text-gray-900">{rem.title}</p>
                          <span className="text-xs text-gray-400 shrink-0 ml-2">{rem.date}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed whitespace-pre-line">
                          {rem.message}
                        </p>

                        <div className="mt-3 flex items-center gap-2">
                          <Link
                            href={
                              isReview ? `/events/${rem.eventId}/reviews`
                              : isRestaurant ? `/chat/${rem.eventId}`
                              : `/events/${rem.eventId}`
                            }
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition ${
                              isReview     ? 'bg-yellow-400 text-yellow-900'
                              : isRestaurant ? 'bg-green-500 text-white'
                              : 'bg-blue-500 text-white'
                            }`}
                          >
                            {isReview && <Star size={12} />}
                            {isRestaurant && <UtensilsCrossed size={12} />}
                            {!isReview && !isRestaurant && <Bell size={12} />}
                            {rem.cta}
                          </Link>
                          <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 rounded-full text-xs text-gray-600">
                            <span>{ev.emoji}</span>
                            <span className="truncate max-w-[100px]">{ev.title}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 빈 상태 */}
        {tab === 'remind' && REMINDERS.length === 0 && (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <Bell size={40} className="mb-3 text-gray-200" />
            <p className="text-sm">리마인드 메시지가 없어요</p>
            <p className="text-xs mt-1">공연을 관람하면 후기 알림을 보내드려요</p>
          </div>
        )}
        {tab === 'rooms' && CHAT_ROOMS.length === 0 && (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <span className="text-5xl mb-3">💬</span>
            <p className="text-sm">참여 중인 채팅방이 없어요</p>
            <Link href="/" className="mt-4 text-carrot-500 text-sm font-semibold">
              공연 예매하고 채팅 참여하기 →
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
