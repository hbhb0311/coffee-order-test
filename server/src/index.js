import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { testConnection } from './config/database.js'

// 환경 변수 로드
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// 미들웨어 설정
app.use(cors()) // CORS 설정 (프론트엔드와 통신을 위해)
app.use(express.json()) // JSON 요청 본문 파싱
app.use(express.urlencoded({ extended: true })) // URL 인코딩된 요청 본문 파싱

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: '커피 주문 앱 API 서버',
    version: '1.0.0'
  })
})

// API 라우트
import menuRoutes from './routes/menuRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

app.use('/api/menus', menuRoutes)
app.use('/api/orders', orderRoutes)

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: '요청한 리소스를 찾을 수 없습니다.'
  })
})

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('에러 발생:', err)
  res.status(500).json({
    success: false,
    error: '서버 내부 오류가 발생했습니다.'
  })
})

// 서버 시작
app.listen(PORT, async () => {
  console.log('\n🚀 서버가 시작되었습니다.')
  console.log(`   포트: ${PORT}`)
  console.log(`   URL: http://localhost:${PORT}\n`)
  
  // 데이터베이스 연결 테스트
  const connected = await testConnection()
  if (!connected) {
    console.log('\n⚠️  서버는 실행 중이지만 데이터베이스 연결에 실패했습니다.')
    console.log('   API 기능을 사용하려면 데이터베이스 연결이 필요합니다.\n')
  } else {
    console.log('')
  }
})


