export const EVENTS = [
  {
    id: '1',
    title: '봄날의 재즈 나이트',
    artist: '김민준 트리오',
    category: '음악',
    date: '2026년 4월 25일 (토)',
    time: '오후 8:00',
    runtime: '90분',
    venue: '홍대 재즈바 블루문',
    address: '서울 마포구 서교동 123-4',
    price: 25000,
    capacity: 50,
    booked: 38,
    description:
      '봄의 향기를 담은 감성 재즈 공연입니다. 피아노, 베이스, 드럼으로 구성된 트리오가 스탠다드 재즈와 보사노바를 연주합니다. 음료 1잔이 입장권에 포함됩니다.',
    emoji: '🎷',
    bg: '#1a1a2e',
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: '2',
    title: '그날의 기억',
    artist: '마포 소극단',
    category: '연극',
    date: '2026년 4월 26일 (일)',
    time: '오후 3:00',
    runtime: '70분',
    venue: '연남동 소극장',
    address: '서울 마포구 연남동 45-6',
    price: 15000,
    capacity: 30,
    booked: 22,
    description:
      '두 사람의 엇갈린 기억 속 장면들을 무대로 풀어낸 2인극입니다. 20~30대 관객에게 큰 공감을 받은 작품입니다.',
    emoji: '🎭',
    bg: '#2d1b69',
    rating: 4.6,
    reviewCount: 18,
  },
  {
    id: '3',
    title: '마술의 밤 — 클로즈업 매직',
    artist: '매지션 K',
    category: '마술',
    date: '2026년 4월 27일 (월)',
    time: '오후 7:30',
    runtime: '60분',
    venue: '합정 버블바',
    address: '서울 마포구 합정동 88-3',
    price: 20000,
    capacity: 24,
    booked: 20,
    description:
      '관객 바로 앞에서 펼쳐지는 클로즈업 카드 마술 쇼입니다. 소수 인원만 참여하여 더욱 특별한 경험을 드립니다.',
    emoji: '🪄',
    bg: '#0d3b2b',
    rating: 4.9,
    reviewCount: 31,
  },
  {
    id: '4',
    title: '인디밴드 봄 라이브',
    artist: '서울 어쿠스틱',
    category: '음악',
    date: '2026년 5월 3일 (일)',
    time: '오후 6:00',
    runtime: '120분',
    venue: '상수 라이브클럽 루프',
    address: '서울 마포구 상수동 77-1',
    price: 18000,
    capacity: 80,
    booked: 41,
    description:
      '어쿠스틱 인디팝 밴드 서울 어쿠스틱의 봄 시즌 공연입니다. 신보 수록곡을 포함한 20곡 세트리스트로 구성됩니다.',
    emoji: '🎸',
    bg: '#3d1a00',
    rating: 4.7,
    reviewCount: 12,
  },
]

export const BOOKINGS = [
  { id: 'B001', eventId: '1', name: '이수진', phone: '010-1234-5678', count: 2, status: '입장전', bookedAt: '4월 20일' },
  { id: 'B002', eventId: '1', name: '박준호', phone: '010-2345-6789', count: 1, status: '입장완료', bookedAt: '4월 21일' },
  { id: 'B003', eventId: '1', name: '최유나', phone: '010-3456-7890', count: 2, status: '입장전', bookedAt: '4월 22일' },
  { id: 'B004', eventId: '1', name: '김태영', phone: '010-4567-8901', count: 1, status: '취소', bookedAt: '4월 18일' },
  { id: 'B005', eventId: '1', name: '정민서', phone: '010-5678-9012', count: 3, status: '입장전', bookedAt: '4월 23일' },
]

export type Message = { id: number; sender: string; avatar: string; text: string; time: string; isMe: boolean }

export const MESSAGES_BY_EVENT: Record<string, Message[]> = {
  '1': [
    { id: 1, sender: '김민준 트리오', avatar: '🎷', text: '안녕하세요! 공연 관련 문의사항이 있으시면 편하게 질문해 주세요 😊', time: '오후 6:12', isMe: false },
    { id: 2, sender: '이수진', avatar: '😊', text: '주차 가능한가요?', time: '오후 6:15', isMe: false },
    { id: 3, sender: '김민준 트리오', avatar: '🎷', text: '근처 공영주차장이 있지만 홍대 특성상 혼잡할 수 있어요. 대중교통 이용을 추천드립니다!', time: '오후 6:17', isMe: false },
    { id: 4, sender: 'Me', avatar: '👤', text: '드레스코드가 있나요?', time: '오후 7:02', isMe: true },
    { id: 5, sender: '김민준 트리오', avatar: '🎷', text: '별도 드레스코드는 없지만, 편안하고 세미캐주얼한 복장을 추천드려요 🎶', time: '오후 7:05', isMe: false },
  ],
  '3': [
    { id: 1, sender: '매지션 K', avatar: '🪄', text: '공연 오시는 분들 모두 환영합니다! 좌석이 매우 좁으니 일찍 오시는 걸 추천드려요 😄', time: '오후 5:00', isMe: false },
    { id: 2, sender: '박준호', avatar: '🙂', text: '음료 반입 가능한가요?', time: '오후 5:30', isMe: false },
    { id: 3, sender: '매지션 K', avatar: '🪄', text: '외부 음료는 반입이 어렵고 내부에서 구매 가능합니다!', time: '오후 5:33', isMe: false },
    { id: 4, sender: '최유나', avatar: '😄', text: '오늘 공연 정말 최고였어요!! 마술 진짜 신기했습니다 🪄', time: '오후 9:21', isMe: false },
    { id: 5, sender: 'Me', avatar: '👤', text: '저도 완전 놀랐어요 ㅋㅋㅋ 카드 뽑는 장면에서 소리 질렀습니다', time: '오후 9:24', isMe: true },
    { id: 6, sender: '매지션 K', avatar: '🪄', text: '감사합니다 🙏 다음 공연도 기대해주세요!', time: '오후 9:30', isMe: false },
  ],
  '4': [
    { id: 1, sender: '서울 어쿠스틱', avatar: '🎸', text: '안녕하세요! 5월 3일 공연으로 만나요 🎶 궁금한 점은 여기서 질문해 주세요', time: '3일 전', isMe: false },
    { id: 2, sender: '정민서', avatar: '🤩', text: '5월 3일 공연 기대됩니다~ 몇 시에 가시나요?', time: '3일 전', isMe: false },
    { id: 3, sender: 'Me', avatar: '👤', text: '저는 오프닝부터 볼 예정이에요!', time: '3일 전', isMe: true },
    { id: 4, sender: '김태영', avatar: '😎', text: '세트리스트 미리 알 수 있나요?', time: '2일 전', isMe: false },
    { id: 5, sender: '서울 어쿠스틱', avatar: '🎸', text: '깜짝 공개 예정이라 비밀이에요 😆 신보 수록곡 위주로 구성될 예정입니다!', time: '2일 전', isMe: false },
  ],
}

export const CHAT_ROOMS = [
  {
    eventId: '1',
    lastMsg: '별도 드레스코드는 없지만, 세미캐주얼 복장을 추천드려요 🎶',
    lastTime: '오후 7:05',
    unread: 2,
    memberCount: 38,
  },
  {
    eventId: '3',
    lastMsg: '오늘 공연 정말 최고였어요!! 마술 진짜 신기했습니다 🪄',
    lastTime: '어제',
    unread: 5,
    memberCount: 20,
  },
  {
    eventId: '4',
    lastMsg: '5월 3일 공연 기대됩니다~ 몇 시에 가시나요?',
    lastTime: '3일 전',
    unread: 0,
    memberCount: 41,
  },
]

// 리마인드: 관람 완료 후 시스템이 보내는 알림
export const REMINDERS = [
  {
    id: 'R001',
    eventId: '2',
    type: 'review' as const,
    title: '그날의 기억 · 관람 후기',
    message: '공연이 종료된 지 3일이 지났어요.\n따뜻한 후기를 남겨 주최자에게 힘을 드세요 ⭐',
    cta: '후기 작성하기',
    date: '3일 전',
    done: false,
  },
  {
    id: 'R002',
    eventId: '3',
    type: 'review' as const,
    title: '마술의 밤 · 관람 후기',
    message: '마술 공연 어떠셨나요?\n짧은 별점만 남겨도 큰 도움이 됩니다 🪄',
    cta: '후기 작성하기',
    date: '어제',
    done: false,
  },
  {
    id: 'R003',
    eventId: '1',
    type: 'remind' as const,
    title: '봄날의 재즈 나이트 · 공연 D-2',
    message: '이틀 뒤 공연이에요! 공연장 위치를 미리 확인해 보세요 🗺️',
    cta: '공연 상세 보기',
    date: '방금',
    done: false,
  },
  {
    id: 'R004',
    eventId: '3',
    type: 'restaurant' as const,
    title: '마술의 밤 · 근처 맛집 추천',
    message: '공연 잘 즐기셨나요? 합정 버블바 근처 맛집을 추천해 드려요 🍽',
    cta: '채팅방에서 보기',
    date: '어제',
    done: false,
  },
]

// 공연 종료 후 근처 맛집 (공연장 기준)
export type Restaurant = {
  name: string; category: string; distance: string
  rating: number; price: string; emoji: string
}

export const RESTAURANTS_BY_EVENT: Record<string, Restaurant[]> = {
  '2': [ // 연남동 소극장 근처
    { name: '연남동 파스타 공방', category: '이탈리안', distance: '도보 3분', rating: 4.7, price: '15,000원대', emoji: '🍝' },
    { name: '술술 이자카야',       category: '일식',     distance: '도보 5분', rating: 4.8, price: '20,000원대', emoji: '🍶' },
    { name: '카페 드 뤼미에르',   category: '카페',     distance: '도보 1분', rating: 4.5, price: '8,000원대',  emoji: '☕' },
  ],
  '3': [ // 합정 버블바 근처
    { name: '합정 화로 고기집', category: '한식 고기',   distance: '도보 2분', rating: 4.6, price: '18,000원대', emoji: '🥩' },
    { name: '버블티 팩토리',   category: '음료·디저트', distance: '도보 1분', rating: 4.4, price: '6,000원대',  emoji: '🧋' },
    { name: '나폴리 피자',     category: '이탈리안',    distance: '도보 7분', rating: 4.9, price: '22,000원대', emoji: '🍕' },
  ],
}

export const REVIEWS = [
  { id: 1, author: '이수진', avatar: '😊', rating: 5, text: '너무 좋았어요! 공간이 아담해서 연주자와 거리가 가깝고 음악에 완전히 몰입할 수 있었어요. 꼭 다시 오고 싶습니다.', date: '4일 전', eventId: '1' },
  { id: 2, author: '박준호', avatar: '🙂', rating: 5, text: '재즈를 잘 몰랐는데 이번 공연을 통해 매력에 빠졌습니다. 연주 수준도 높고 MC 멘트도 재미있어서 지루하지 않았어요.', date: '1주 전', eventId: '1' },
  { id: 3, author: '최유나', avatar: '😄', rating: 4, text: '전반적으로 좋았는데 조금 더 길었으면 했어요. 그래도 음료 포함이라 가성비 최고!', date: '2주 전', eventId: '1' },
]
