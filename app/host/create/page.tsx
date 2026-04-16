'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Camera, Plus, X, CheckCircle } from 'lucide-react'
import HomeButton from '@/components/HomeButton'
import { saveHostedEvent, getCategoryMeta, formatDate, formatTime } from '@/lib/storage'

const CATEGORIES = ['음악', '연극', '무용', '마술', '토크쇼', '기타']

export default function HostCreate() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    title: '', category: '', date: '', time: '', venue: '', address: '',
    price: '', capacity: '', description: '',
  })

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const canNext = step === 1
    ? form.title && form.category
    : step === 2
      ? form.date && form.time && form.venue
      : form.price && form.capacity

  const handleSubmit = () => {
    const { emoji, bg } = getCategoryMeta(form.category)
    saveHostedEvent({
      id: `custom-${Date.now()}`,
      title: form.title,
      artist: '나',
      category: form.category,
      date: formatDate(form.date),
      time: formatTime(form.time),
      runtime: '',
      venue: form.venue,
      address: form.address,
      price: Number(form.price),
      capacity: Number(form.capacity),
      booked: 0,
      description: form.description,
      emoji,
      bg,
      rating: 0,
      reviewCount: 0,
    })
    setDone(true)
  }

  /* ── 완료 화면 ── */
  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-carrot-50 flex items-center justify-center">
          <CheckCircle size={44} className="text-carrot-500" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">공연이 등록됐어요!</p>
          <p className="text-sm text-gray-500 mt-2">
            <span className="font-semibold text-gray-800">{form.title}</span>이(가)<br />
            성공적으로 개설되었습니다.
          </p>
        </div>

        {/* 등록된 공연 요약 */}
        <div className="w-full bg-white rounded-2xl p-4 text-left border border-gray-100">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-3"
            style={{ background: `linear-gradient(135deg, ${getCategoryMeta(form.category).bg}, #374151)` }}
          >
            {getCategoryMeta(form.category).emoji}
          </div>
          <p className="text-[15px] font-bold text-gray-900">{form.title}</p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(form.date)} {formatTime(form.time)}</p>
          <p className="text-xs text-gray-500">{form.venue}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm font-semibold text-carrot-500">{Number(form.price).toLocaleString()}원</span>
            <span className="text-xs text-gray-400">정원 {form.capacity}명</span>
          </div>
        </div>

        <button
          onClick={() => router.push('/my?tab=host')}
          className="w-full py-4 bg-carrot-500 text-white rounded-xl text-[15px] font-bold"
        >
          내 공연 보러가기
        </button>
        <button
          onClick={() => router.push('/')}
          className="text-sm text-gray-400"
        >
          홈으로 돌아가기
        </button>
      </div>
    )
  }

  /* ── 폼 화면 ── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 탑바 */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 flex items-center h-14 px-2">
        {step > 1 ? (
          <button onClick={() => setStep(s => s - 1)} className="p-2">
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
        ) : (
          <Link href="/my?tab=host" className="p-2">
            <X size={24} className="text-gray-900" />
          </Link>
        )}
        <span className="flex-1 text-center text-[17px] font-semibold text-gray-900">공연 개설</span>
        <HomeButton />
      </header>

      {/* 진행 단계 */}
      <div className="bg-white px-4 py-3 flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition ${
              s < step ? 'bg-carrot-500 text-white'
              : s === step ? 'bg-carrot-500 text-white ring-4 ring-carrot-100'
              : 'bg-gray-200 text-gray-400'
            }`}>
              {s < step ? '✓' : s}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${s === step ? 'text-carrot-500' : 'text-gray-400'}`}>
              {s === 1 ? '기본 정보' : s === 2 ? '일정/장소' : '가격/상세'}
            </span>
            {s < 3 && <div className={`flex-1 h-0.5 ${s < step ? 'bg-carrot-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="px-4 py-4 flex flex-col gap-3 pb-28">
        {step === 1 && (
          <>
            <div className="bg-white rounded-2xl p-4">
              <label className="block text-sm font-semibold text-gray-900 mb-3">포스터 이미지</label>
              <button className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-carrot-300 hover:text-carrot-400 transition">
                <Camera size={28} />
                <span className="text-sm">사진 추가</span>
                <span className="text-xs">최대 5장</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl p-4">
              <Field label="공연 제목" required>
                <input
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  placeholder="공연 제목을 입력하세요"
                  className="w-full text-[15px] text-gray-900 placeholder-gray-300 outline-none"
                />
              </Field>
            </div>

            <div className="bg-white rounded-2xl p-4">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                카테고리 <span className="text-carrot-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    onClick={() => update('category', c)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      form.category === c
                        ? 'bg-carrot-500 border-carrot-500 text-white'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
              <Field label="공연 날짜" required>
                <input type="date" value={form.date} onChange={e => update('date', e.target.value)}
                  className="w-full text-[15px] text-gray-900 outline-none" />
              </Field>
              <div className="h-px bg-gray-100" />
              <Field label="공연 시간" required>
                <input type="time" value={form.time} onChange={e => update('time', e.target.value)}
                  className="w-full text-[15px] text-gray-900 outline-none" />
              </Field>
            </div>

            <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
              <Field label="공연장 이름" required>
                <input value={form.venue} onChange={e => update('venue', e.target.value)}
                  placeholder="예: 홍대 재즈바 블루문"
                  className="w-full text-[15px] text-gray-900 placeholder-gray-300 outline-none" />
              </Field>
              <div className="h-px bg-gray-100" />
              <Field label="주소">
                <input value={form.address} onChange={e => update('address', e.target.value)}
                  placeholder="상세 주소"
                  className="w-full text-[15px] text-gray-900 placeholder-gray-300 outline-none" />
              </Field>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
              <Field label="티켓 가격" required>
                <div className="flex items-center gap-2">
                  <input type="number" value={form.price} onChange={e => update('price', e.target.value)}
                    placeholder="0"
                    className="flex-1 text-[15px] text-gray-900 placeholder-gray-300 outline-none text-right" />
                  <span className="text-gray-500 text-sm shrink-0">원</span>
                </div>
              </Field>
              <div className="h-px bg-gray-100" />
              <Field label="최대 정원" required>
                <div className="flex items-center gap-2">
                  <input type="number" value={form.capacity} onChange={e => update('capacity', e.target.value)}
                    placeholder="0"
                    className="flex-1 text-[15px] text-gray-900 placeholder-gray-300 outline-none text-right" />
                  <span className="text-gray-500 text-sm shrink-0">명</span>
                </div>
              </Field>
            </div>

            <div className="bg-white rounded-2xl p-4">
              <label className="block text-sm font-semibold text-gray-900 mb-3">공연 소개</label>
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                placeholder="공연에 대해 자세히 소개해 주세요."
                rows={5}
                className="w-full text-[15px] text-gray-700 placeholder-gray-300 outline-none resize-none leading-relaxed"
              />
            </div>
          </>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-100 px-4 py-4 z-20">
        <button
          disabled={!canNext}
          onClick={() => step < 3 ? setStep(s => s + 1) : handleSubmit()}
          className={`w-full py-4 rounded-xl text-[15px] font-bold transition ${
            canNext
              ? 'bg-carrot-500 text-white active:bg-carrot-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {step < 3 ? '다음' : '공연 개설하기'}
        </button>
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label} {required && <span className="text-carrot-500">*</span>}
      </label>
      {children}
    </div>
  )
}
