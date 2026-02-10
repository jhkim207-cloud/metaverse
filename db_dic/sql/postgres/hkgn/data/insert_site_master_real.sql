-- ============================================
-- 현장 마스터 실제 데이터 INSERT (site_master)
-- ============================================
-- 설명: 다른 테이블(production_plan, sales_order_header, site_price,
--       cutting_daily_report, subcontract_order, container_inventory,
--       purchase_order, work_request)에 현장명으로 존재하지만
--       site_master에 누락된 현장을 일괄 등록
-- 생성일시: 2026-02-10
-- 데이터 수: 33건
-- 주의: 기존 가짜 샘플(SITE001~010) 제거 후 실행 권장
-- ============================================

SET search_path TO hkgn, public;

-- (선택) 기존 가짜 샘플 데이터 제거
-- DELETE FROM hkgn.site_master WHERE site_cd IN ('SITE001','SITE002','SITE003','SITE004','SITE005','SITE006','SITE007','SITE008','SITE009','SITE010');

INSERT INTO hkgn.site_master (site_cd, site_nm, constructor_nm, bp_cd, address, remark, is_active) VALUES

-- ============================================
-- 출처: production_plan (7건)
-- ============================================
('SITE011', '평택브레인시티1BL(1공구)', '중흥토건', NULL, NULL, '출처: production_plan', TRUE),
('SITE012', 'e편한세상 검단웰카운티', '디엘이앤씨㈜', NULL, NULL, '출처: production_plan', TRUE),
('SITE013', '대전역 센텀비스타', '디엘건설㈜', NULL, NULL, '출처: production_plan', TRUE),
('SITE014', '광주송정공원', '중흥토건', NULL, NULL, '출처: production_plan', TRUE),
('SITE015', '청주 개신2지구', '㈜동일토건', NULL, NULL, '출처: production_plan, cutting_daily_report', TRUE),
('SITE016', '천안 쌍용3구역', '동원건설산업㈜', NULL, NULL, '출처: production_plan', TRUE),
('SITE017', '양주동두천금오', '동부건설㈜', NULL, NULL, '출처: production_plan', TRUE),

-- ============================================
-- 출처: sales_order_header (4건)
-- ============================================
('SITE019', '서초동ABC타워', NULL, NULL, NULL, '출처: sales_order_header (샘플)', TRUE),
('SITE020', '강남DEF빌딩', NULL, NULL, NULL, '출처: sales_order_header (샘플)', TRUE),
('SITE021', '송파GHI타워', NULL, NULL, NULL, '출처: sales_order_header (샘플)', TRUE),

-- ============================================
-- 출처: site_price (5건)
-- ============================================
('SITE022', '파주운정3지구 A-9BL', '중흥토건㈜', NULL, NULL, '출처: site_price', TRUE),
('SITE023', '파주운정3지구 A-11BL', '중흥토건㈜', NULL, NULL, '출처: site_price', TRUE),
('SITE024', '마곡 글로벌 R&D 센터', '㈜이랜드건설', NULL, NULL, '출처: site_price', TRUE),
('SITE025', '송도SM7', '㈜포스코건설', NULL, NULL, '출처: site_price', TRUE),

-- ============================================
-- 출처: cutting_daily_report (1건)
-- ============================================
('SITE027', '대전기초과학연구소', '동부건설', NULL, NULL, '출처: cutting_daily_report', TRUE),

-- ============================================
-- 출처: subcontract_order (3건)
-- ============================================
('SITE028', '일신건영 - 이천 마장지구', '일신건영', NULL, NULL, '출처: subcontract_order, purchase_order', TRUE),
('SITE029', '중흥토건 - 천호 1지구', '중흥토건', NULL, NULL, '출처: subcontract_order, purchase_order', TRUE),
('SITE030', 'LX하우시스 - GS음성자이센트럴시티', NULL, NULL, NULL, '출처: subcontract_order', TRUE),

-- ============================================
-- 출처: container_inventory (5건)
-- ============================================
('SITE031', 'GS 아산 현장', NULL, NULL, NULL, '출처: container_inventory', TRUE),
('SITE033', '포스코건설 의정부', '포스코건설', NULL, NULL, '출처: container_inventory', TRUE),
('SITE034', '디엘이앤씨 인천검단', '디엘이앤씨', NULL, NULL, '출처: container_inventory', TRUE),
('SITE035', '중흥토건 전남광주', '중흥토건', NULL, NULL, '출처: container_inventory', TRUE),

-- ============================================
-- 출처: purchase_order (1건)
-- ============================================
('SITE036', '중흥 평택', '중흥토건', NULL, NULL, '출처: purchase_order', TRUE),

-- ============================================
-- 사용자 요청 추가 (7건) - 데이터 파일에 미존재
-- ============================================
('SITE037', '의정부시 캠프라과디아', NULL, NULL, NULL, '사용자 요청 추가', TRUE),
('SITE038', '송암공원', NULL, NULL, NULL, '사용자 요청 추가', TRUE),
('SITE039', '평택브레인시티공동3BL', NULL, NULL, NULL, '사용자 요청 추가', TRUE),
('SITE040', '용산 유엔사', NULL, NULL, NULL, '사용자 요청 추가', TRUE),
('SITE041', '아산탕정자이퍼스트시티', NULL, NULL, NULL, '사용자 요청 추가', TRUE),
('SITE042', '롯데바이오로직스', NULL, NULL, NULL, '사용자 요청 추가', TRUE),
('SITE043', '인천검단AA-21BL(7공구)', NULL, NULL, NULL, '사용자 요청 추가', TRUE);

-- 완료 메시지
SELECT '신규 현장 마스터 ' || COUNT(*) || '건 INSERT 완료' AS result
FROM hkgn.site_master
WHERE site_cd BETWEEN 'SITE011' AND 'SITE043';

-- ============================================
-- 참고: 유사 현장명 매핑
-- ============================================
-- | site_master site_nm               | 유사 현장명 (다른 테이블)     |
-- |----------------------------------|-----------------------------|
-- | 서초동JK타워 (SITE018)            | 서초동 JK타워 (work_request) |
-- | 서초동JK타워 (SITE018)            | LX 서초 (JK 현장) (SITE032)  |
-- | 천호1구역 (SITE026)               | 중흥토건 - 천호 1지구 (SITE029) |
-- | 광주송정공원 (SITE014)             | 중흥토건 전남광주 (SITE035)    |
-- | e편한세상 검단웰카운티 (SITE012)     | 디엘이앤씨 인천검단 (SITE034) |
-- | 포스코건설 의정부 (SITE033)         | 의정부시 캠프라과디아 (SITE037)? |
-- ============================================
