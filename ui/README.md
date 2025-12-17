# 커피 주문 앱 - 프론트엔드

React와 Vite를 사용한 커피 주문 앱의 프론트엔드입니다.

## 개발 환경 설정

### 사전 요구사항
- Node.js (v16 이상)
- npm 또는 yarn

### 설치
```bash
npm install
```

### 개발 서버 실행
```bash
npm run dev
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

### 빌드
```bash
npm run build
```

프로덕션 빌드 파일은 `dist/` 폴더에 생성됩니다.

### 빌드 미리보기
```bash
npm run preview
```

빌드된 파일을 로컬에서 미리볼 수 있습니다.

## 기술 스택
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구 및 개발 서버
- **Vanilla JavaScript** - TypeScript 미사용

## 프로젝트 구조

```
ui/
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── Header.jsx      # 헤더 컴포넌트
│   │   ├── MenuCard.jsx    # 메뉴 카드 컴포넌트
│   │   ├── ShoppingCart.jsx # 장바구니 컴포넌트
│   │   ├── InventoryStatus.jsx # 재고 상태 컴포넌트
│   │   ├── AdminDashboard.jsx # 관리자 대시보드
│   │   └── ...
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── OrderPage.jsx   # 주문하기 페이지
│   │   └── AdminPage.jsx   # 관리자 페이지
│   ├── utils/              # 유틸리티 함수
│   │   ├── api.js          # API 호출 함수
│   │   └── idGenerator.js  # ID 생성 함수
│   ├── App.jsx             # 메인 앱 컴포넌트
│   └── main.jsx            # 진입점
├── index.html
├── vite.config.js
└── package.json
```

## 주요 기능

### 주문하기 페이지
- 메뉴 목록 조회 및 표시
- 옵션 선택 (ICE/HOT, 샷 추가, 시럽 추가 등)
- 장바구니에 메뉴 추가
- 수량 조절 및 삭제
- 주문하기

### 관리자 페이지
- 주문 통계 대시보드
- 주문 목록 조회
- 주문 상태 변경 (대기 → 준비중 → 완료)
- 재고 수량 수정

## 환경 변수

로컬 개발 시에는 별도 설정이 필요 없습니다. 백엔드가 `http://localhost:3001`에서 실행된다고 가정합니다.

프로덕션 배포 시 `.env` 파일에 다음을 설정하세요:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## 백엔드 연동

프론트엔드는 `src/utils/api.js`를 통해 백엔드 API와 통신합니다.

백엔드 서버가 실행 중이어야 정상적으로 작동합니다. 백엔드 설정은 [../server/README.md](../server/README.md)를 참고하세요.

