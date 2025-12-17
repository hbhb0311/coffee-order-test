import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pkg

// 환경 변수 확인
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'order_app',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  // SSL 설정 (Render PostgreSQL은 SSL 필수)
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false // Render의 자체 서명된 인증서 허용
  } : false, // 로컬 개발 환경에서는 SSL 비활성화
  // 연결 풀 설정
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000, // 유휴 연결 타임아웃 (30초)
  connectionTimeoutMillis: 10000, // 연결 타임아웃 (10초로 증가)
}

// .env 파일 확인
if (!process.env.DB_PASSWORD) {
  console.warn('⚠️  경고: DB_PASSWORD 환경 변수가 설정되지 않았습니다.')
  console.warn('⚠️  server 폴더에 .env 파일을 생성하고 DB_PASSWORD를 설정하세요.')
}

// 연결 설정 정보 출력 (비밀번호 제외)
console.log('📋 데이터베이스 연결 설정:')
console.log(`   Host: ${dbConfig.host}`)
console.log(`   Port: ${dbConfig.port}`)
console.log(`   Database: ${dbConfig.database}`)
console.log(`   User: ${dbConfig.user}`)
console.log(`   Password: ${dbConfig.password ? '***설정됨***' : '⚠️ 설정되지 않음'}`)

// PostgreSQL 연결 풀 생성
const pool = new Pool(dbConfig)

// 연결 이벤트 핸들러
pool.on('connect', () => {
  console.log('✅ PostgreSQL 데이터베이스에 연결되었습니다.')
})

pool.on('error', (err) => {
  console.error('❌ PostgreSQL 연결 오류:', err.message)
  console.error('   상세 정보:', err)
})

// 연결 테스트 함수
export const testConnection = async () => {
  try {
    console.log('\n🔍 데이터베이스 연결 테스트 중...')
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version')
    console.log('✅ 데이터베이스 연결 테스트 성공!')
    console.log(`   현재 시간: ${result.rows[0].current_time}`)
    console.log(`   PostgreSQL 버전: ${result.rows[0].pg_version.split(' ')[0]} ${result.rows[0].pg_version.split(' ')[1]}`)
    return true
  } catch (error) {
    console.error('\n❌ 데이터베이스 연결 테스트 실패!')
    console.error(`   에러 메시지: ${error.message}`)
    
    // 일반적인 에러 원인에 대한 안내
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 해결 방법:')
      console.error('   1. PostgreSQL 서비스가 실행 중인지 확인하세요.')
      console.error('   2. 포트 번호가 올바른지 확인하세요 (기본값: 5432)')
    } else if (error.code === '28P01') {
      console.error('\n💡 해결 방법:')
      console.error('   1. 사용자명과 비밀번호가 올바른지 확인하세요.')
      console.error('   2. .env 파일에 DB_USER와 DB_PASSWORD를 설정하세요.')
    } else if (error.code === '3D000') {
      console.error('\n💡 해결 방법:')
      console.error('   1. 데이터베이스가 존재하는지 확인하세요.')
      console.error('   2. 다음 명령어로 데이터베이스를 생성하세요:')
      console.error('      CREATE DATABASE order_app;')
    } else if (error.code === 'ENOTFOUND') {
      console.error('\n💡 해결 방법:')
      console.error('   1. DB_HOST가 올바른지 확인하세요.')
    } else if (error.code === '28000' || error.message.includes('SSL/TLS')) {
      console.error('\n💡 해결 방법:')
      console.error('   1. Render PostgreSQL은 SSL 연결이 필수입니다.')
      console.error('   2. 데이터베이스 연결 설정에 SSL 옵션이 포함되어 있는지 확인하세요.')
      console.error('   3. NODE_ENV=production으로 설정되어 있는지 확인하세요.')
    } else {
      console.error(`   에러 코드: ${error.code || '알 수 없음'}`)
      console.error('   전체 에러:', error)
    }
    
    return false
  }
}

// 쿼리 실행 헬퍼 함수
export const query = (text, params) => {
  return pool.query(text, params)
}

export default pool

