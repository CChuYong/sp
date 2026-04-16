'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Send, Image, Smile, Star, MapPin } from 'lucide-react'
import { EVENTS, MESSAGES_BY_EVENT, RESTAURANTS_BY_EVENT, type Restaurant } from '@/lib/mock'
import BackButton from '@/components/BackButton'
import HomeButton from '@/components/HomeButton'

export default function ChatPage({ params }: { params: { id: string } }) {
  const ev = EVENTS.find(e => e.id === params.id) ?? EVENTS[0]
  const [messages, setMessages] = useState(MESSAGES_BY_EVENT[params.id] ?? [])
  const [input, setInput] = useState('')

  const restaurants = RESTAURANTS_BY_EVENT[params.id] ?? []
  const isPast = restaurants.length > 0  // 맛집 데이터 있는 공연 = 종료된 공연

  const send = () => {
    if (!input.trim()) return
    setMessages(m => [...m, {
      id: m.length + 1, sender: 'Me', avatar: '👤',
      text: input.trim(), time: '지금', isMe: true,
    }])
    setInput('')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 탑바 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center h-14 px-2 shrink-0">
        <BackButton className="p-2" iconClassName="text-gray-900" />
        <div className="flex-1 px-2">
          <p className="text-[15px] font-semibold text-gray-900 leading-tight">{ev.title}</p>
          <p className="text-xs text-gray-400">참여자 {ev.booked}명</p>
        </div>
        <HomeButton />
      </header>

      {/* 공연 배너 */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ background: `linear-gradient(135deg, ${ev.bg}33, ${ev.bg}11)` }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: `linear-gradient(135deg, ${ev.bg}, #374151)` }}
        >
          {ev.emoji}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500">{ev.date} {ev.time}</p>
          <p className="text-xs text-gray-500">{ev.venue}</p>
        </div>
        {isPast
          ? <span className="text-xs bg-gray-200 text-gray-500 font-medium px-2 py-1 rounded-full shrink-0">공연 종료</span>
          : <Link href={`/events/${params.id}`} className="text-xs text-carrot-500 font-semibold shrink-0">공연 보기 →</Link>
        }
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 px-4 py-4 flex flex-col gap-4 overflow-y-auto pb-24">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">오늘</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {messages.map(msg => (
          <div key={msg.id} className={`flex items-end gap-2 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
            {!msg.isMe && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-base shrink-0">
                {msg.avatar}
              </div>
            )}
            <div className={`max-w-[75%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              {!msg.isMe && <p className="text-xs text-gray-500 px-1">{msg.sender}</p>}
              <div className={`px-3.5 py-2.5 rounded-2xl text-[14px] leading-snug ${
                msg.isMe
                  ? 'bg-carrot-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-900 rounded-bl-sm border border-gray-100'
              }`}>
                {msg.text}
              </div>
              <p className="text-[10px] text-gray-400 px-1">{msg.time}</p>
            </div>
          </div>
        ))}

        {/* ── 공연 종료 후 맛집 추천 ── */}
        {isPast && (
          <>
            {/* 종료 구분선 */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">공연 종료</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* 봇 메시지 */}
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-carrot-100 flex items-center justify-center text-base shrink-0">
                🥕
              </div>
              <div className="flex flex-col gap-1 max-w-[85%]">
                <p className="text-xs text-gray-500 px-1">당근 어시스턴트</p>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <p className="text-[14px] text-gray-900 leading-snug">
                    공연 잘 즐기셨나요? 🎉<br />
                    <span className="font-semibold">{ev.venue}</span> 근처 맛집을 추천해 드릴게요!
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 px-1">방금</p>
              </div>
            </div>

            {/* 맛집 카드 리스트 */}
            <div className="flex items-end gap-2">
              <div className="w-8 shrink-0" /> {/* 아바타 자리 맞추기 */}
              <div className="flex flex-col gap-2 flex-1">
                {restaurants.map((r, i) => (
                  <RestaurantCard key={i} restaurant={r} />
                ))}
              </div>
            </div>

            {/* 후기 유도 */}
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-carrot-100 flex items-center justify-center text-base shrink-0">
                🥕
              </div>
              <div className="flex flex-col gap-1 max-w-[85%]">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <p className="text-[14px] text-gray-900 leading-snug mb-2">
                    공연 후기도 남겨주시면 주최자에게 큰 힘이 돼요 ⭐
                  </p>
                  <Link
                    href={`/events/${params.id}/reviews`}
                    className="inline-flex items-center gap-1.5 bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    <Star size={11} />
                    후기 작성하기
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 입력창 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-3 py-2 flex items-end gap-2 shrink-0">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Image size={20} className="text-gray-500" />
        </button>
        <div className="flex-1 bg-gray-100 rounded-2xl flex items-end px-3 py-2 min-h-[40px]">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="메시지를 입력하세요"
            rows={1}
            className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder-gray-400 outline-none resize-none"
          />
          <button className="p-1 ml-1">
            <Smile size={18} className="text-gray-400" />
          </button>
        </div>
        <button
          onClick={send}
          className={`p-2 rounded-full transition ${input.trim() ? 'bg-carrot-500 text-white' : 'bg-gray-200 text-gray-400'}`}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

function RestaurantCard({ restaurant: r }: { restaurant: Restaurant }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0">
        {r.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-gray-900 truncate">{r.name}</p>
        <p className="text-xs text-gray-400">{r.category} · {r.price}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-0.5 text-xs text-yellow-500 font-medium">
            <Star size={10} className="fill-yellow-400" /> {r.rating}
          </span>
          <span className="flex items-center gap-0.5 text-xs text-gray-400">
            <MapPin size={10} /> {r.distance}
          </span>
        </div>
      </div>
    </div>
  )
}
