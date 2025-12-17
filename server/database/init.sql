-- 커피 주문 앱 데이터베이스 초기화 스크립트 (PRD 기반)

-- 기존 테이블 삭제 (개발 환경용)
DROP TABLE IF EXISTS order_product_option CASCADE;
DROP TABLE IF EXISTS order_product CASCADE;
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS "order" CASCADE;
DROP TABLE IF EXISTS product_option CASCADE;
DROP TABLE IF EXISTS option CASCADE;
DROP TABLE IF EXISTS product CASCADE;

-- Product (상품) 테이블
CREATE TABLE product (
    prd_id SERIAL PRIMARY KEY,
    prd_nm VARCHAR(100) NOT NULL,
    prd_desc TEXT,
    prd_prc INTEGER NOT NULL CHECK (prd_prc >= 0),
    prd_img VARCHAR(255),
    prd_stk INTEGER DEFAULT 10 CHECK (prd_stk >= 0 AND prd_stk <= 999),
    crt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Option (옵션) 테이블
CREATE TABLE option (
    opt_id SERIAL PRIMARY KEY,
    opt_nm VARCHAR(100) NOT NULL,
    opt_prc INTEGER NOT NULL CHECK (opt_prc >= 0),
    crt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ProductOption (상품-옵션 관계) 테이블
CREATE TABLE product_option (
    prd_opt_id SERIAL PRIMARY KEY,
    prd_id INTEGER NOT NULL REFERENCES product(prd_id) ON DELETE CASCADE,
    opt_id INTEGER NOT NULL REFERENCES option(opt_id) ON DELETE CASCADE,
    del_yn VARCHAR(1) DEFAULT 'N',
    crt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(prd_id, opt_id)
);

-- Order (주문) 테이블
CREATE TABLE "order" (
    ord_id SERIAL PRIMARY KEY,
    ord_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ord_sts VARCHAR(20) DEFAULT 'received' CHECK (ord_sts IN ('received', 'in_progress', 'completed')),
    tot_amt INTEGER NOT NULL CHECK (tot_amt >= 0),
    crt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OrderStatusHistory (주문 상태 변경 이력) 테이블
CREATE TABLE order_status_history (
    ord_sts_hist_id SERIAL PRIMARY KEY,
    ord_id INTEGER NOT NULL REFERENCES "order"(ord_id) ON DELETE CASCADE,
    ord_sts VARCHAR(20) NOT NULL CHECK (ord_sts IN ('received', 'in_progress', 'completed')),
    crt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OrderProduct (주문 상품) 테이블
CREATE TABLE order_product (
    ord_prd_id SERIAL PRIMARY KEY,
    ord_id INTEGER NOT NULL REFERENCES "order"(ord_id) ON DELETE CASCADE,
    prd_id INTEGER NOT NULL REFERENCES product(prd_id) ON DELETE CASCADE,
    prd_cnt INTEGER NOT NULL CHECK (prd_cnt >= 1),
    unit_amt INTEGER NOT NULL CHECK (unit_amt >= 0),
    subtot_amt INTEGER NOT NULL CHECK (subtot_amt >= 0),
    crt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OrderProductOption (주문 상품 옵션) 테이블
CREATE TABLE order_product_option (
    ord_opt_id SERIAL PRIMARY KEY,
    ord_prd_id INTEGER NOT NULL REFERENCES order_product(ord_prd_id) ON DELETE CASCADE,
    opt_id INTEGER NOT NULL REFERENCES option(opt_id) ON DELETE CASCADE,
    opt_prc INTEGER NOT NULL CHECK (opt_prc >= 0),
    crt_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_product_prd_id ON product(prd_id);
CREATE INDEX idx_option_opt_id ON option(opt_id);
CREATE INDEX idx_product_option_prd_id ON product_option(prd_id);
CREATE INDEX idx_product_option_opt_id ON product_option(opt_id);
CREATE INDEX idx_order_ord_id ON "order"(ord_id);
CREATE INDEX idx_order_ord_sts ON "order"(ord_sts);
CREATE INDEX idx_order_ord_dt ON "order"(ord_dt);
CREATE INDEX idx_order_status_history_ord_id ON order_status_history(ord_id);
CREATE INDEX idx_order_status_history_crt_dt ON order_status_history(crt_dt);
CREATE INDEX idx_order_status_history_ord_id_crt_dt ON order_status_history(ord_id, crt_dt);
CREATE INDEX idx_order_product_ord_id ON order_product(ord_id);
CREATE INDEX idx_order_product_prd_id ON order_product(prd_id);
CREATE INDEX idx_order_product_option_ord_prd_id ON order_product_option(ord_prd_id);
CREATE INDEX idx_order_product_option_opt_id ON order_product_option(opt_id);

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updt_dt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 설정
CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON product
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_option_updated_at BEFORE UPDATE ON option
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_option_updated_at BEFORE UPDATE ON product_option
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_updated_at BEFORE UPDATE ON "order"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_status_history_updated_at BEFORE UPDATE ON order_status_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
