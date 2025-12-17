# 커피 주문 앱 백엔드 서버

Express.js를 사용한 RESTful API 서버입니다.

## 설치 방법

```bash
# 의존성 설치
npm install
```

## 환경 변수 설정

`server` 폴더에 `.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
# 서버 포트 설정
PORT=3000

# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=order_app
DB_USER=postgres
DB_PASSWORD=your_password

# 환경 설정
NODE_ENV=development
```

**참고**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

### 데이터베이스 설정 방법

1. **PostgreSQL 서비스 확인**
   - Windows: 서비스 관리자에서 "postgresql" 서비스가 실행 중인지 확인
   - 또는 명령 프롬프트에서: `pg_ctl status`

2. **psql 접속 방법**
   ```bash
   # 사용자명을 명시적으로 지정해야 합니다
   psql -U postgres
   ```
   ⚠️ **주의**: `psql`만 입력하면 Windows 사용자명으로 접속을 시도하여 실패할 수 있습니다.
   반드시 `-U postgres` 옵션을 사용하세요.

3. **데이터베이스 생성**
   psql에 접속한 후 다음 명령어를 실행하세요:
   ```sql
   CREATE DATABASE order_app;
   \q  -- psql 종료
   ```
   
   또는 한 줄로 실행:
   ```bash
   psql -U postgres -c "CREATE DATABASE order_app;"
   ```

4. **환경 변수 설정**
   `server` 폴더에 `.env` 파일을 생성하고 다음 내용을 입력하세요:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=order_app
   DB_USER=postgres
   DB_PASSWORD=7946
   NODE_ENV=development
   ```
   ⚠️ **중요**: `DB_PASSWORD`에는 실제 PostgreSQL 비밀번호를 입력하세요.

4. **데이터베이스 초기화**
   ```bash
   # PostgreSQL에 접속
   psql -U postgres -d order_app
   
   # 스키마 생성
   \i server/database/init.sql
   
   # 시드 데이터 삽입
   \i server/database/seed.sql
   ```

5. **연결 테스트**
   서버를 실행하면 자동으로 데이터베이스 연결을 테스트합니다.
   연결 실패 시 콘솔에 상세한 에러 메시지와 해결 방법이 표시됩니다.

### 문제 해결

**연결 실패 시 확인 사항:**
- ✅ PostgreSQL 서비스가 실행 중인가요?
- ✅ 데이터베이스 `order_app`가 생성되었나요?
- ✅ `.env` 파일에 올바른 비밀번호가 설정되었나요?
- ✅ 포트 번호가 올바른가요? (기본값: 5432)

## 실행 방법

### 개발 모드 (nodemon 사용)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 메뉴 관련
- `GET /api/menu` - 메뉴 목록 조회

### 주문 관련
- `POST /api/order` - 주문 생성
- `GET /api/orders/:orderId` - 주문 정보 조회
- `GET /api/orders` - 주문 목록 조회
- `PATCH /api/orders/:orderId/status` - 주문 상태 변경
- `GET /api/orders/:orderId/history` - 주문 상태 이력 조회
- `GET /api/orders/statistics` - 주문 통계 조회

### 재고 관련
- `PATCH /api/menus/:prdId/stock` - 재고 수정

## 프로젝트 구조

```
server/
├── src/
│   ├── index.js          # 서버 진입점
│   ├── config/           # 설정 파일들
│   │   └── database.js   # PostgreSQL 연결 설정
│   ├── routes/           # 라우트 파일들
│   ├── controllers/      # 컨트롤러 파일들
│   ├── models/           # 데이터 모델 파일들
│   ├── middleware/       # 미들웨어 파일들
│   └── utils/            # 유틸리티 함수들
├── .env                  # 환경 변수 (gitignore)
├── .gitignore
├── package.json
└── README.md
```


