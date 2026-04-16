'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Star, PenLine } from 'lucide-react'
import BackButton from '@/components/BackButton'
import HomeButton from '@/components/HomeButton'
import { EVENTS, REVIEWS } from '@/lib/mock'

export default function ReviewsPage({ params }: { params: { id: string } }) {
  const ev = EVENTS.find(e => e.id === params.id) ?? EVENTS[0]
  const [reviews, setReviews] = useState(REVIEWS.filter(r => r.eventId === params.id))
  const [showWrite, setShowWrite] = useState(false)
  const [myRating, setMyRating] = useState(0)
  const [myText, setMyText] = useState('')

  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      {/* 탑바 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center h-14 px-2">
        <BackButton className="p-2" iconClassName="text-gray-900" />
        <span className="flex-1 text-center text-[17px] font-semibold text-gray-900">후기</span>
        <div className="flex items-center">
          <button onClick={() => setShowWrite(true)} className="p-2">
            <PenLine size={20} className="text-carrot-500" />
          </button>
          <HomeButton />
        </div>
      </header>

      {/* 평점 요약 */}
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <p className="text-5xl font-bold text-gray-900">{ev.rating}</p>
            <div className="flex mt-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={16}
                  className={i <= Math.floor(ev.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">총 {ev.reviewCount}개</p>
          </div>

          <div className="flex-1">
            {[5,4,3,2,1].map(n => {
              const cnt = reviews.filter(r => r.rating === n).length
              const pct = reviews.length > 0 ? (cnt / reviews.length) * 100 : 0
              return (
                <div key={n} className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500 w-3">{n}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-4">{cnt}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 후기 목록 */}
      <div className="px-4 py-4 flex flex-col gap-3">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <span className="text-4xl mb-3">⭐</span>
            <p className="text-sm">아직 후기가 없어요</p>
            <p className="text-xs mt-1">공연을 관람하셨다면 후기를 남겨주세요</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                  {review.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{review.author}</p>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={12}
                      className={i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                  ))}
                </div>
              </div>
              <p className="text-[14px] text-gray-700 leading-relaxed">{review.text}</p>
            </div>
          ))
        )}
      </div>

      {/* 후기 작성 모달 */}
      {showWrite && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full max-w-[390px] mx-auto rounded-t-3xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[17px] font-bold text-gray-900">후기 작성</h3>
              <button onClick={() => setShowWrite(false)} className="text-gray-400 text-xl">✕</button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `linear-gradient(135deg, ${ev.bg}, #374151)` }}
              >
                {ev.emoji}
              </div>
              <p className="text-sm font-semibold text-gray-900">{ev.title}</p>
            </div>

            {/* 별점 */}
            <div className="flex justify-center gap-3 mb-4">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setMyRating(n)}>
                  <Star size={32}
                    className={n <= myRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={myText}
              onChange={e => setMyText(e.target.value)}
              placeholder="공연은 어떠셨나요? 솔직한 후기를 남겨주세요."
              rows={4}
              className="w-full bg-gray-50 rounded-xl p-3 text-[14px] text-gray-700 placeholder-gray-300 outline-none resize-none"
            />

            <button
              onClick={() => {
                if (!myRating || !myText) return
                setReviews(prev => [{
                  id: Date.now(),
                  author: 'wonny',
                  avatar: '👤',
                  rating: myRating,
                  text: myText,
                  date: '방금',
                  eventId: params.id,
                }, ...prev])
                setShowWrite(false)
                setMyRating(0)
                setMyText('')
              }}
              disabled={!myRating || !myText}
              className={`w-full mt-4 py-4 rounded-xl text-[15px] font-bold transition ${
                myRating && myText
                  ? 'bg-carrot-500 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              후기 등록
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
