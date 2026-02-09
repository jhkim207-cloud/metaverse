-- ============================================
-- 생산 계획 상세 데이터 INSERT (샘플)
-- ============================================
-- 출처: ref/생산계획.xlsx
-- 생성일시: 2026-02-08
-- 설명: 공정별 체크리스트 데이터
-- ============================================

-- production_plan 테이블에서 plan_id를 조회하여 INSERT
-- plan_no를 기준으로 매핑

-- 25-2124: 재단1, 재단2, 아와, 라벨
INSERT INTO hkgn.production_plan_detail (plan_id, process_type, is_checked)
SELECT id, '재단1', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2124'
UNION ALL
SELECT id, '재단2', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2124'
UNION ALL
SELECT id, '아와', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2124'
UNION ALL
SELECT id, '라벨', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2124';

-- 25-2295: 재단1, 재단2, 아와, 라벨
INSERT INTO hkgn.production_plan_detail (plan_id, process_type, is_checked)
SELECT id, '재단1', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2295'
UNION ALL
SELECT id, '재단2', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2295'
UNION ALL
SELECT id, '아와', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2295'
UNION ALL
SELECT id, '라벨', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2295';

-- 25-2296: 재단1, 재단2, 아와, 라벨
INSERT INTO hkgn.production_plan_detail (plan_id, process_type, is_checked)
SELECT id, '재단1', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2296'
UNION ALL
SELECT id, '재단2', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2296'
UNION ALL
SELECT id, '아와', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2296'
UNION ALL
SELECT id, '라벨', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2296';

-- 25-2293: 재단1, 재단2, 라벨
INSERT INTO hkgn.production_plan_detail (plan_id, process_type, is_checked)
SELECT id, '재단1', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2293'
UNION ALL
SELECT id, '재단2', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2293'
UNION ALL
SELECT id, '라벨', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2293';

-- 25-2368: 재단1, 재단2, 라벨
INSERT INTO hkgn.production_plan_detail (plan_id, process_type, is_checked)
SELECT id, '재단1', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2368'
UNION ALL
SELECT id, '재단2', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2368'
UNION ALL
SELECT id, '라벨', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2368';

-- 25-2368-2: 재단1, 재단2, 라벨
INSERT INTO hkgn.production_plan_detail (plan_id, process_type, is_checked)
SELECT id, '재단1', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2368-2'
UNION ALL
SELECT id, '재단2', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2368-2'
UNION ALL
SELECT id, '라벨', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2368-2';

-- 25-2371: 재단1, 재단2, 라벨
INSERT INTO hkgn.production_plan_detail (plan_id, process_type, is_checked)
SELECT id, '재단1', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2371'
UNION ALL
SELECT id, '재단2', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2371'
UNION ALL
SELECT id, '라벨', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2371';

-- 25-2264: 재단2, 아와, 강화, 라벨
INSERT INTO hkgn.production_plan_detail (plan_id, process_type, is_checked)
SELECT id, '재단2', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2264'
UNION ALL
SELECT id, '아와', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2264'
UNION ALL
SELECT id, '강화', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2264'
UNION ALL
SELECT id, '라벨', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2264';

-- 25-2264-2: 재단2, 아와, 강화, 라벨
INSERT INTO hkgn.production_plan_detail (plan_id, process_type, is_checked)
SELECT id, '재단2', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2264-2'
UNION ALL
SELECT id, '아와', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2264-2'
UNION ALL
SELECT id, '강화', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2264-2'
UNION ALL
SELECT id, '라벨', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2264-2';

-- 25-2173: 재단2, 아와, 강화, 라벨
INSERT INTO hkgn.production_plan_detail (plan_id, process_type, is_checked)
SELECT id, '재단2', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2173'
UNION ALL
SELECT id, '아와', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2173'
UNION ALL
SELECT id, '강화', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2173'
UNION ALL
SELECT id, '라벨', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2173';

-- 25-2173-2: 재단2, 아와, 강화, 라벨
INSERT INTO hkgn.production_plan_detail (plan_id, process_type, is_checked)
SELECT id, '재단2', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2173-2'
UNION ALL
SELECT id, '아와', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2173-2'
UNION ALL
SELECT id, '강화', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2173-2'
UNION ALL
SELECT id, '라벨', TRUE FROM hkgn.production_plan WHERE plan_no = '25-2173-2';

-- 완료 메시지
SELECT '생산 계획 상세 데이터 ' || COUNT(*) || '건 INSERT 완료' AS result
FROM hkgn.production_plan_detail;
