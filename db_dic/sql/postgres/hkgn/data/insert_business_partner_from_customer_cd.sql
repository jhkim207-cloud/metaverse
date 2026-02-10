-- ============================================
-- 거래처 마스터 보충 INSERT (customer_cd 기준)
-- ============================================
-- 설명: customer_cd 컬럼이 있는 모든 테이블에서
--       business_partner.bp_cd에 없는 customer_cd를
--       거래처 마스터에 자동 추가
-- 대상 테이블: sales_order_header, delivery_header,
--             cutting_daily_report, sales_order_upload
-- 생성일시: 2026-02-10
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- 1. 누락 customer_cd 수집
-- ============================================
-- 4개 테이블에서 customer_cd를 UNION 후
-- business_partner.bp_cd에도, bp_nm에도 없는 건만 수집

CREATE TEMP TABLE IF NOT EXISTS _missing_customers (
    customer_cd VARCHAR(200)
);

TRUNCATE _missing_customers;

INSERT INTO _missing_customers (customer_cd)
SELECT DISTINCT customer_cd
FROM (
    SELECT customer_cd FROM hkgn.sales_order_header
    UNION
    SELECT customer_cd FROM hkgn.delivery_header
    UNION
    SELECT customer_cd FROM hkgn.cutting_daily_report
    UNION
    SELECT customer_cd FROM hkgn.sales_order_upload
) all_customers
WHERE customer_cd IS NOT NULL
  AND customer_cd <> ''
  -- bp_cd로 이미 존재하는 건 제외
  AND NOT EXISTS (
      SELECT 1 FROM hkgn.business_partner bp
      WHERE bp.bp_cd = all_customers.customer_cd
  )
  -- bp_nm으로 이미 존재하는 건도 제외 (이름 중복 방지)
  AND NOT EXISTS (
      SELECT 1 FROM hkgn.business_partner bp
      WHERE bp.bp_nm = all_customers.customer_cd
  );

-- 누락 건 확인
SELECT '누락 customer_cd 확인' AS section;

SELECT customer_cd FROM _missing_customers ORDER BY customer_cd;

SELECT '누락 건수: ' || COUNT(*) || '건' AS result FROM _missing_customers;

-- ============================================
-- 2. 누락 거래처 자동 INSERT
-- ============================================
-- bp_cd: 현재 최대 BP번호 + 1부터 순차 부여
-- bp_nm: customer_cd 값 사용
-- bp_type: SALES
-- sales_category: 유리판매

INSERT INTO hkgn.business_partner (bp_cd, bp_type, sales_category, bp_nm, is_active)
SELECT
    'BP' || LPAD((ROW_NUMBER() OVER (ORDER BY mc.customer_cd) + max_num.val)::TEXT, 4, '0'),
    'SALES',
    '유리판매',
    mc.customer_cd,
    TRUE
FROM _missing_customers mc
CROSS JOIN (
    SELECT COALESCE(MAX(SUBSTRING(bp_cd FROM 3)::INT), 0) AS val
    FROM hkgn.business_partner
    WHERE bp_cd ~ '^BP\d+$'
) max_num;

DO $$ BEGIN
    RAISE NOTICE '자동 추가된 거래처: % 건',
        (SELECT COUNT(*) FROM _missing_customers);
END $$;

-- ============================================
-- 3. 결과 확인
-- ============================================
SELECT '추가된 거래처' AS section;

SELECT bp_cd, bp_nm, bp_type, sales_category
FROM hkgn.business_partner
WHERE bp_cd > 'BP1116'
ORDER BY bp_cd;

SELECT '전체 거래처 수: ' || COUNT(*) || '건' AS result
FROM hkgn.business_partner;

-- 임시 테이블 정리
DROP TABLE IF EXISTS _missing_customers;
