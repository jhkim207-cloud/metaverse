-- ============================================
-- 현장 마스터 누락분 보충 INSERT (site_master)
-- ============================================
-- 설명: 모든 INSERT 스크립트에서 추출한 현장명 중
--       site_master에 누락된 현장을 일괄 등록
-- 생성일시: 2026-02-10
-- 데이터 수: 48건
-- ============================================

SET search_path TO hkgn, public;

INSERT INTO hkgn.site_master (site_cd, site_nm, constructor_nm, bp_cd, address, remark, is_active) VALUES
('SITE044', '가산동 아스크타워', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE045', '가산동 지식산업센터', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE046', '강릉회산동 공동주택', NULL, NULL, NULL, '출처: insert_sales_order_from_migration4.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration4.sql', TRUE),
('SITE047', '강일어반', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE048', '경기도주택도시공사 융복합센터(GH)', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE049', '경서북청라', NULL, NULL, NULL, '출처: insert_sales_order_from_migration.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration.sql', TRUE),
('SITE050', '광명2R', NULL, NULL, NULL, '출처: insert_sales_order_from_migration3.sql, insert_site_price_from_migration.sql', TRUE),
('SITE051', '구리 교문동', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE052', '김포구래물류시설', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql, insert_work_request_from_migration.sql', TRUE),
('SITE053', '남양주 도곡2 주택재개발', NULL, NULL, NULL, '출처: insert_sales_order_from_migration.sql, insert_sales_order_from_migration2.sql, insert_sales_order_from_migration3.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration2.sql, insert_work_request_from_migration3.sql', TRUE),
('SITE054', '다산진건A5BL', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE055', '대광건영-평택브레인', NULL, NULL, NULL, '출처: insert_sales_order_from_migration3.sql', TRUE),
('SITE056', '대전 선화동', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE057', '대전도안푸르지오', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE058', '대전둔산 업무시설', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE059', '동탄 94BL', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE060', '마곡지구CP4(SITE1)', NULL, NULL, NULL, '출처: insert_sales_order_from_migration.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration.sql', TRUE),
('SITE061', '마곡지구CP4(SITE2)', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE062', '문정동136(자체계약분)', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE063', '문정동136(LX계약)', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE064', '병점역 스카이팰리스', NULL, NULL, NULL, '출처: insert_sales_order_from_migration2.sql, insert_site_price_from_migration.sql', TRUE),
('SITE065', '삼성동 홍실아파트', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE066', '세종건설 평택', NULL, NULL, NULL, '출처: insert_sales_order_from_migration.sql', TRUE),
('SITE067', '송도 YMT', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE068', '수원제115-10구역', NULL, NULL, NULL, '출처: insert_sales_order_from_migration.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration2.sql', TRUE),
('SITE069', '시흥장현지구 업무시설', NULL, NULL, NULL, '출처: insert_sales_order_from_migration.sql, insert_sales_order_from_migration2.sql, insert_sales_order_from_migration3.sql, insert_sales_order_from_migration4.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration.sql, insert_work_request_from_migration2.sql, insert_work_request_from_migration3.sql, insert_work_request_from_migration4.sql', TRUE),
('SITE070', '아산탕정자이', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE071', '안성 방초2지구 물류센터', NULL, NULL, NULL, '출처: insert_sales_order_from_migration2.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration2.sql', TRUE),
('SITE072', '안암2구역', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE073', '양주회천 A-18BL', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE074', '영종 오피스텔', NULL, NULL, NULL, '출처: insert_work_request_from_migration3.sql', TRUE),
('SITE075', '오산세교아파트', NULL, NULL, NULL, '출처: insert_sales_order_from_migration.sql, insert_sales_order_from_migration3.sql, insert_site_price_from_migration.sql', TRUE),
('SITE076', '운정3지구A-8BL', NULL, NULL, NULL, '출처: insert_sales_order_from_migration3.sql, insert_sales_order_from_migration4.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration3.sql, insert_work_request_from_migration4.sql', TRUE),
('SITE077', '원주 태장2지구', NULL, NULL, NULL, '출처: insert_work_request_from_migration3.sql', TRUE),
('SITE078', '음성자이 센트럴시티', NULL, NULL, NULL, '출처: insert_sales_order_from_migration.sql, insert_sales_order_from_migration2.sql, insert_sales_order_from_migration4.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration.sql', TRUE),
('SITE079', '이천마장지구', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE080', '천호1구역', NULL, NULL, NULL, '출처: insert_sales_order_from_migration2.sql, insert_site_price.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration.sql', TRUE),
('SITE081', '천호1구역-2획지', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE082', '천호4구역', NULL, NULL, NULL, '출처: insert_sales_order_from_migration.sql, insert_sales_order_from_migration2.sql, insert_sales_order_from_migration3.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration.sql, insert_work_request_from_migration3.sql', TRUE),
('SITE083', '청주 복대2구역 재개발사업', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql, insert_work_request_from_migration3.sql', TRUE),
('SITE084', '춘천근화', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE085', '판교G2업무시설 1공구', NULL, NULL, NULL, '출처: insert_sales_order_from_migration.sql, insert_sales_order_from_migration2.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration.sql, insert_work_request_from_migration2.sql', TRUE),
('SITE086', '평택브레인시티1BL(2공구)', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE087', '평택포승지식산업센터', NULL, NULL, NULL, '출처: insert_sales_order_from_migration2.sql, insert_site_price_from_migration.sql, insert_work_request_from_migration2.sql', TRUE),
('SITE088', '평택화양지구7-1BL', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql, insert_work_request_from_migration4.sql', TRUE),
('SITE089', '현대 하이테크센터', NULL, NULL, NULL, '출처: insert_work_request_from_migration4.sql', TRUE),
('SITE090', '화성향남 상신지구 A1-1BL', NULL, NULL, NULL, '출처: insert_site_price_from_migration.sql', TRUE),
('SITE091', 'e편한세상 부평그랑힐스', NULL, NULL, NULL, '출처: insert_sales_order_from_migration3.sql, insert_site_price_from_migration.sql', TRUE)
;

-- 완료 메시지
SELECT '현장 마스터 누락분 ' || COUNT(*) || '건 INSERT 완료' AS result
FROM hkgn.site_master
WHERE site_cd >= 'SITE044';
