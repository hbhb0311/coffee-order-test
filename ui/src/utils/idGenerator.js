// 안전한 ID 생성 유틸리티
let idCounter = 0

export const generateId = () => {
  // 타임스탬프 + 카운터 조합으로 고유 ID 생성
  return `${Date.now()}-${++idCounter}-${Math.random().toString(36).substr(2, 9)}`
}

