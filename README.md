# ☕ 커피 주문 앱 (Coffee Order App)

사용자가 커피 메뉴를 주문하고, 관리자가 주문과 재고를 관리할 수 있는 풀스택 웹 애플리케이션입니다.

## 📋 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [시작하기](#시작하기)
- [환경 변수 설정](#환경-변수-설정)
- [API 문서](#api-문서)
- [배포](#배포)
- [문서](#문서)

## ✨ 주요 기능

### 고객 기능
- 🍵 **메뉴 조회**: 커피 메뉴 목록 및 옵션 확인
- 🛒 **장바구니**: 메뉴 선택, 옵션 추가, 수량 조절
- 📦 **주문하기**: 장바구니의 메뉴 주문
- 📊 **재고 확인**: 실시간 재고 상태 확인

### 관리자 기능
- 📈 **주문 통계**: 전체 주문 통계 대시보드
- 📋 **주문 관리**: 주문 목록 조회 및 상태 변경 (대기 → 준비중 → 완료)
- 📝 **주문 이력**: 주문 상태 변경 이력 조회
- 📦 **재고 관리**: 메뉴별 재고 수량 수정

## 🛠 기술 스택

### 프론트엔드
- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구 및 개발 서버
- **Vanilla JavaScript** - TypeScript 미사용

### 백엔드
- **Node.js** - 런타임 환경
- **Express.js** - 웹 프레임워크
- **PostgreSQL** - 관계형 데이터베이스
- **pg** - PostgreSQL 클라이언트

### 배포
- **Render.com** - 호스팅 플랫폼 (PostgreSQL, Web Service, Static Site)

## 📁 프로젝트 구조

```
order-app/
├── server/                 # 백엔드 서버
│   ├── src/
│   │   ├── config/         # 설정 파일 (데이터베이스 연결 등)
│   │   ├── controllers/    # 컨트롤러 (비즈니스 로직)
│   │   ├── models/         # 데이터 모델 (DB 쿼리)
│   │   ├── routes/         # API 라우트
│   │   └── index.js        # 서버 진입점
│   ├── database/
│   │   ├── init.sql        # 데이터베이스 스키마
│   │   └── seed.sql        # 초기 데이터
│   ├── .env                # 환경 변수 (gitignore)
│   ├── package.json
│   └── README.md
│
├── ui/                     # 프론트엔드
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── utils/          # 유틸리티 함수
│   │   └── App.jsx         # 메인 앱 컴포넌트
│   ├── package.json
│   └── README.md
│
├── docs/
│   └── PRD.md              # 프로젝트 요구사항 문서
│
├── DEPLOY.md               # 배포 가이드
├── render.yaml             # Render 배포 설정
└── README.md               # 이 파일
```

## 🚀 시작하기

### 사전 요구사항

- **Node.js** (v16 이상)
- **PostgreSQL** (v12 이상)
- **npm** 또는 **yarn**

### 1. 저장소 클론

```bash
git clone <repository-url>
cd order-app
```

### 2. 백엔드 설정

```bash
# 백엔드 디렉토리로 이동
cd server

# 의존성 설치
npm install

# 환경 변수 설정 (아래 섹션 참고)
# .env 파일 생성 및 설정

# 데이터베이스 초기화
# PostgreSQL에 접속하여 init.sql과 seed.sql 실행

# 개발 서버 실행
npm run dev
```

백엔드 서버는 `http://localhost:3001`에서 실행됩니다.

자세한 내용은 [server/README.md](./server/README.md)를 참고하세요.

### 3. 프론트엔드 설정

```bash
# 새 터미널에서 프론트엔드 디렉토리로 이동
cd ui

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드 서버는 `http://localhost:3000`에서 실행됩니다.

자세한 내용은 [ui/README.md](./ui/README.md)를 참고하세요.

## ⚙️ 환경 변수 설정

### 백엔드 (server/.env)

```env
# 서버 포트
PORT=3001

# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=order_app
DB_USER=postgres
DB_PASSWORD=your_password

# 환경 설정
NODE_ENV=development

# 프론트엔드 URL (CORS 설정용)
FRONTEND_URL=http://localhost:3000
```

### 프론트엔드 (ui/.env)

로컬 개발 시에는 별도 설정이 필요 없습니다. 프로덕션 배포 시:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

## 📚 API 문서

### 메뉴 관련

- `GET /api/menus` - 메뉴 목록 조회
- `PATCH /api/menus/:menuId/stock` - 재고 수정

### 주문 관련

- `GET /api/orders` - 주문 목록 조회
- `GET /api/orders/:orderId` - 주문 상세 조회
- `POST /api/orders` - 주문 생성
- `PATCH /api/orders/:orderId/status` - 주문 상태 변경
- `GET /api/orders/:orderId/history` - 주문 상태 이력 조회
- `GET /api/orders/statistics` - 주문 통계 조회

자세한 API 문서는 [server/README.md](./server/README.md)를 참고하세요.

## 🚢 배포

이 프로젝트는 **Render.com**을 사용하여 배포됩니다.

### 배포 순서

1. **PostgreSQL 데이터베이스 배포**
2. **백엔드 서비스 배포**
3. **프론트엔드 정적 사이트 배포**

자세한 배포 가이드는 [DEPLOY.md](./DEPLOY.md)를 참고하세요.

## 📖 문서

- [프로젝트 요구사항 (PRD)](./docs/PRD.md) - 상세 기능 명세
- [배포 가이드](./DEPLOY.md) - Render.com 배포 방법
- [백엔드 README](./server/README.md) - 백엔드 개발 가이드
- [프론트엔드 README](./ui/README.md) - 프론트엔드 개발 가이드

## 📝 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.

## 👥 기여

이 프로젝트는 학습 목적의 프로젝트입니다. 개선 사항이나 버그 리포트는 이슈로 등록해주세요.

---

**Made with ☕ by CoffeeLuv**

