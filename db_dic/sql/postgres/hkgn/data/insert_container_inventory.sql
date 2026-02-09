-- ============================================
-- 테이블: container_inventory (용기 재고)
-- 설명: 공장 내부 용기 재고 + 현장 배치 용기 샘플
-- 작성일: 2026-02-09
-- 스키마: hkgn
-- 데이터 수: 20건 (공장재고 15건 + 현장배치 5건)
-- 출처: 공장내부용기현황.xlsx + 현장별용기입출고현황.xlsx 참조
-- ============================================

SET search_path TO hkgn, public;

INSERT INTO hkgn.container_inventory (
    container_cd, container_nm,
    location, location_type, bp_cd,
    site_cd, site_nm,
    quantity, shortage_qty,
    container_status, remarks
) VALUES
-- ============================================
-- 공장 내부 용기 재고 (공장내부용기현황.xlsx 기반)
-- ============================================
('G20', 'G20 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 1, 0, 'GOOD', NULL),

('G19', 'G19 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 3, 0, 'GOOD', NULL),

('G16', 'G16 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 9, 6, 'GOOD', '부족 6개'),

('G15', 'G15 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 9, 4, 'GOOD', '부족 4개'),

('G14', 'G14 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 65, 30, 'GOOD', '부족 30개'),

('G13', 'G13 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 49, 10, 'GOOD', '부족 10개'),

('G12', 'G12 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 13, 6, 'GOOD', '부족 6개'),

('K5', 'K5 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 4, 3, 'GOOD', '부족 3개'),

('K41', 'K41 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 13, 6, 'GOOD', '부족 6개'),

('K4', 'K4 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 21, 7, 'GOOD', '부족 7개'),

('K3', 'K3 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 20, 8, 'GOOD', '부족 8개'),

('HK', 'HK 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 258, 64, 'GOOD', '부족 64개'),

('F2', 'F2 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 114, 5, 'GOOD', '부족 5개'),

('F02', 'F02 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 242, 0, 'GOOD', '충분 (340→242 감소)'),

('CF2', 'CF2 용기', '공장', 'FACTORY', NULL,
 NULL, NULL,
 73, 43, 'GOOD', '부족 43개'),

-- ============================================
-- 현장 배치 용기 (현장별용기입출고현황.xlsx 기반)
-- ============================================
('HK', 'HK 용기', 'GS 아산 현장', 'SITE', NULL,
 'SITE-001', 'GS 아산 현장',
 99, 0, 'GOOD', '출고계=99, 입고계=99, 잔고=0'),

('HK', 'HK 용기', 'LX 서초 (JK 현장)', 'SITE', NULL,
 'SITE-002', 'LX 서초 (JK 현장)',
 0, 0, 'GOOD', NULL),

('HK', 'HK 용기', '포스코건설 의정부', 'SITE', NULL,
 'SITE-003', '포스코건설 의정부',
 0, 0, 'GOOD', NULL),

('HK', 'HK 용기', '디엘이앤씨 인천검단', 'SITE', NULL,
 'SITE-004', '디엘이앤씨 인천검단',
 0, 0, 'GOOD', NULL),

('HK', 'HK 용기', '중흥토건 전남광주', 'SITE', NULL,
 'SITE-005', '중흥토건 전남광주',
 0, 0, 'GOOD', NULL);
