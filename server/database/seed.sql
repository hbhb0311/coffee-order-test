-- 커피 주문 앱 시드 데이터

-- 옵션 데이터 삽입
INSERT INTO option (opt_nm, opt_prc) VALUES
('샷 추가', 500),
('시럽 추가', 0),
('휘핑 크림', 500),
('사이즈 업', 1000)
ON CONFLICT DO NOTHING;

-- 상품 데이터 삽입
INSERT INTO product (prd_nm, prd_desc, prd_prc, prd_img, prd_stk) VALUES
('아메리카노(ICE)', '간단한 설명...', 4000, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop', 10),
('아메리카노(HOT)', '간단한 설명...', 4000, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop', 10),
('카페라떼', '간단한 설명...', 5000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop', 10),
('카푸치노', '간단한 설명...', 5000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop', 10),
('에스프레소', '간단한 설명...', 3000, 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop', 10),
('카라멜 마키아토', '간단한 설명...', 6000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&auto=format', 10)
ON CONFLICT DO NOTHING;

-- 상품-옵션 관계 데이터 삽입
-- 모든 상품에 "샷 추가", "시럽 추가" 옵션 연결
INSERT INTO product_option (prd_id, opt_id)
SELECT p.prd_id, o.opt_id
FROM product p
CROSS JOIN option o
WHERE o.opt_nm IN ('샷 추가', '시럽 추가')
ON CONFLICT (prd_id, opt_id) DO NOTHING;

-- 카페라떼, 카푸치노, 카라멜 마키아토에 "휘핑 크림" 옵션 추가
INSERT INTO product_option (prd_id, opt_id)
SELECT p.prd_id, o.opt_id
FROM product p
CROSS JOIN option o
WHERE p.prd_nm IN ('카페라떼', '카푸치노', '카라멜 마키아토')
AND o.opt_nm = '휘핑 크림'
ON CONFLICT (prd_id, opt_id) DO NOTHING;

-- 카라멜 마키아토에 "사이즈 업" 옵션 추가
INSERT INTO product_option (prd_id, opt_id)
SELECT p.prd_id, o.opt_id
FROM product p
CROSS JOIN option o
WHERE p.prd_nm = '카라멜 마키아토'
AND o.opt_nm = '사이즈 업'
ON CONFLICT (prd_id, opt_id) DO NOTHING;
