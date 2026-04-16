'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { Search, X, SlidersHorizontal, Map, List, Eye, Heart, ChevronDown } from 'lucide-react'
import BottomNav from '@/components/BottomNav'
import { EVENTS } from '@/lib/mock'

const CATEGORIES = ['전체', '음악', '연극', '마술', '토크쇼', '기타']
const SORTS = ['인기순', '최신순', '가격 낮은순', '가까운순']
const DATES = ['전체', '오늘', '이번 주', '이번 달']
const RECENT_SEARCHES = ['재즈', '홍대 공연', '소극장 연극', '마술쇼']

function getViewers(id: string) { return 7 + (parseInt(id) * 13) % 29 }

// 지도 핀 위치 (퍼센트, 목업)
const MAP_PINS = [
  { eventId: '1', x: 42, y: 38 },
  { eventId: '2', x: 55, y: 52 },
  { eventId: '3', x: 35, y: 60 },
  { eventId: '4', x: 60, y: 44 },
]

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [category, setCategory] = useState('전체')
  const [sort, setSort] = useState('인기순')
  const [dateFilter, setDateFilter] = useState('전체')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [showFilter, setShowFilter] = useState(false)
  const [activePin, setActivePin] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = EVENTS.filter(ev => {
    const matchCat = category === '전체' || ev.category === category
    const matchQ = !query || ev.title.includes(query) || ev.artist.includes(query) || ev.venue.includes(query)
    return matchCat && matchQ
  }).sort((a, b) => {
    if (sort === '가격 낮은순') return a.price - b.price
    if (sort === '인기순') return b.booked - a.booked
    return 0
  })

  const isSearching = focused || query.length > 0

  return (
    <div className="bg-gray-50 min-h-screen safe-bottom">
      {/* 탑바 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100">
        {/* 검색창 */}
        <div className="flex items-center gap-2 px-4 py-3">
          <div className={`flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all ${
            isSearching ? 'bg-gray-100 ring-2 ring-carrot-300' : 'bg-gray-100'
          }`}>
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="공연, 아티스트, 장소 검색"
              className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder-gray-400 outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>
          {isSearching ? (
            <button
              onClick={() => { setQuery(''); setFocused(false); inputRef.current?.blur() }}
              className="text-sm text-gray-600 font-medium shrink-0"
            >
              취소
            </button>
          ) : (
            <button
              onClick={() => setViewMode(v => v === 'list' ? 'map' : 'list')}
              className={`p-2 rounded-xl transition ${viewMode === 'map' ? 'bg-carrot-50 text-carrot-500' : 'text-gray-500'}`}
            >
              {viewMode === 'list' ? <Map size={20} /> : <List size={20} />}
            </button>
          )}
        </div>

        {/* 검색 중이 아닐 때: 카테고리 + 필터 */}
        {!isSearching && (
          <div className="flex items-center gap-2 px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto flex-1 no-scrollbar">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition ${
                    category === c
                      ? 'bg-carrot-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilter(true)}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium transition ${
                sort !== '인기순' || dateFilter !== '전체'
                  ? 'border-carrot-400 text-carrot-500 bg-carrot-50'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              <SlidersHorizontal size={12} />
              필터
              {(sort !== '인기순' || dateFilter !== '전체') && (
                <span className="w-1.5 h-1.5 rounded-full bg-carrot-500" />
              )}
            </button>
          </div>
        )}
      </header>

      {/* ─────── 검색 오버레이 ─────── */}
      {isSearching && (
        <div className="bg-white px-4 py-2 min-h-screen">
          {!query ? (
            <>
              <p className="text-xs font-semibold text-gray-400 mb-3">최근 검색</p>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full"
                  >
                    <Search size={11} className="text-gray-400" />
                    {s}
                  </button>
                ))}
              </div>
              <div className="h-px bg-gray-100 my-4" />
              <p className="text-xs font-semibold text-gray-400 mb-3">인기 검색어</p>
              <ol className="flex flex-col gap-2.5">
                {['홍대 재즈', '소극장 연극', '마술 공연', '인디밴드', '버스킹'].map((kw, i) => (
                  <li key={kw}>
                    <button
                      onClick={() => setQuery(kw)}
                      className="flex items-center gap-3 w-full"
                    >
                      <span className={`text-sm font-bold w-5 ${i < 3 ? 'text-carrot-500' : 'text-gray-400'}`}>
                        {i + 1}
                      </span>
                      <span className="text-[15px] text-gray-900">{kw}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-400 mb-3">
                <span className="font-semibold text-gray-900">"{query}"</span> 검색 결과 {filtered.length}개
              </p>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-gray-400">
                  <span className="text-5xl mb-4">🔍</span>
                  <p className="text-sm">검색 결과가 없어요</p>
                  <p className="text-xs mt-1">다른 키워드로 검색해 보세요</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map(ev => <EventCard key={ev.id} ev={ev} />)}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ─────── 리스트 뷰 ─────── */}
      {!isSearching && viewMode === 'list' && (
        <div className="px-4 py-4">
          {/* 정렬/날짜 칩 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {DATES.map(d => (
                <button
                  key={d}
                  onClick={() => setDateFilter(d)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    dateFilter === d
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilter(true)}
              className="shrink-0 flex items-center gap-1 text-xs text-gray-500 ml-2"
            >
              {sort} <ChevronDown size={12} />
            </button>
          </div>

          <p className="text-xs text-gray-400 mb-3">공연 {filtered.length}개</p>

          <div className="flex flex-col gap-3">
            {filtered.map(ev => <EventCard key={ev.id} ev={ev} />)}
          </div>
        </div>
      )}

      {/* ─────── 지도 뷰 ─────── */}
      {!isSearching && viewMode === 'map' && (
        <div className="relative">
          {/* 지도 배경 */}
          <div
            className="w-full bg-[#e8ead5] relative overflow-hidden"
            style={{ height: 'calc(100vh - 130px)' }}
          >
            {/* 지도 그리드 라인 (목업) */}
            <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
              {/* 세로 도로 */}
              <rect x="30%" y="0" width="3%" height="100%" fill="#ccc" />
              <rect x="55%" y="0" width="2.5%" height="100%" fill="#ccc" />
              <rect x="75%" y="0" width="2%" height="100%" fill="#bbb" />
              {/* 가로 도로 */}
              <rect x="0" y="25%" width="100%" height="2.5%" fill="#ccc" />
              <rect x="0" y="50%" width="100%" height="3%" fill="#ccc" />
              <rect x="0" y="72%" width="100%" height="2%" fill="#bbb" />
              {/* 블록들 */}
              <rect x="5%" y="5%" width="22%" height="17%" rx="4" fill="#d4d6c0" />
              <rect x="35%" y="5%" width="17%" height="17%" rx="4" fill="#d4d6c0" />
              <rect x="60%" y="5%" width="30%" height="17%" rx="4" fill="#c8d4b0" />
              <rect x="5%" y="28%" width="22%" height="19%" rx="4" fill="#d4d6c0" />
              <rect x="35%" y="28%" width="17%" height="19%" rx="4" fill="#d4d6c0" />
              <rect x="60%" y="28%" width="30%" height="19%" rx="4" fill="#d4d6c0" />
              <rect x="5%" y="53%" width="27%" height="16%" rx="4" fill="#c8d4b0" />
              <rect x="60%" y="53%" width="30%" height="16%" rx="4" fill="#d4d6c0" />
            </svg>

            {/* 현재 위치 */}
            <div className="absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}>
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
              <div className="absolute inset-0 rounded-full bg-blue-400/30 scale-[3] animate-ping" />
            </div>

            {/* 이벤트 핀들 */}
            {MAP_PINS.map(pin => {
              const ev = EVENTS.find(e => e.id === pin.eventId)!
              const isActive = activePin === pin.eventId
              return (
                <button
                  key={pin.eventId}
                  onClick={() => setActivePin(isActive ? null : pin.eventId)}
                  className="absolute"
                  style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -100%)' }}
                >
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-lg font-semibold text-xs transition-all ${
                    isActive
                      ? 'bg-carrot-500 text-white scale-110'
                      : 'bg-white text-gray-900'
                  }`}>
                    <span>{ev.emoji}</span>
                    <span>{(ev.price / 1000).toFixed(0)}천원</span>
                  </div>
                  <div className={`w-2 h-2 rotate-45 mx-auto -mt-1 ${isActive ? 'bg-carrot-500' : 'bg-white'}`} />
                </button>
              )
            })}

            {/* 선택된 핀의 공연 카드 */}
            {activePin && (() => {
              const ev = EVENTS.find(e => e.id === activePin)!
              return (
                <div className="absolute bottom-4 left-4 right-4">
                  <Link href={`/events/${ev.id}`}>
                    <div className="bg-white rounded-2xl p-3 shadow-xl flex gap-3">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0"
                        style={{ background: `linear-gradient(135deg, ${ev.bg}, #374151)` }}
                      >
                        {ev.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-gray-900 truncate">{ev.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{ev.date} {ev.time}</p>
                        <p className="text-xs text-gray-500">{ev.venue}</p>
                        <p className="text-sm font-bold text-carrot-500 mt-1">{ev.price.toLocaleString()}원</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* ─────── 필터 바텀 시트 ─────── */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
          <div className="relative bg-white w-full max-w-[390px] mx-auto rounded-t-3xl p-5 pb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[17px] font-bold text-gray-900">필터</h3>
              <button onClick={() => setShowFilter(false)} className="text-gray-400 text-xl">✕</button>
            </div>

            <p className="text-xs font-semibold text-gray-500 mb-2">정렬</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {SORTS.map(s => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                    sort === s
                      ? 'bg-gray-900 border-gray-900 text-white'
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-gray-500 mb-2">날짜</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {DATES.map(d => (
                <button
                  key={d}
                  onClick={() => setDateFilter(d)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                    dateFilter === d
                      ? 'bg-gray-900 border-gray-900 text-white'
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setSort('인기순'); setDateFilter('전체') }}
                className="flex-1 py-3.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700"
              >
                초기화
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="flex-[2] py-3.5 rounded-xl bg-carrot-500 text-white text-sm font-bold"
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

function EventCard({ ev }: { ev: typeof EVENTS[0] }) {
  const remain = ev.capacity - ev.booked
  const pct = Math.round((ev.booked / ev.capacity) * 100)
  const viewers = getViewers(ev.id)

  return (
    <Link
      href={`/events/${ev.id}`}
      className="flex gap-3 bg-white rounded-2xl p-3 border border-gray-100 hover:border-gray-200 transition"
    >
      <div
        className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-4xl"
        style={{ background: `linear-gradient(135deg, ${ev.bg}, #374151)` }}
      >
        {ev.emoji}
      </div>
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
              <Eye size={11} />{viewers}
            </span>
            <span className={`text-xs font-medium ${remain <= 5 ? 'text-red-500' : 'text-gray-400'}`}>
              {remain <= 5 ? `마감임박 ${remain}석` : `${pct}% 예매`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
