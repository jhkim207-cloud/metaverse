-- ============================================
-- customer_cd UPDATE 스크립트
-- ============================================
-- 설명: customer_cd가 bp_cd로 매칭되지 않는 행에 대해
--       customer_cd 값을 business_partner.bp_nm으로 조회하여
--       해당 bp_cd로 customer_cd를 교체 (이름 → 코드 정규화)
-- 대상 테이블: sales_order_header, delivery_header,
--             cutting_daily_report, sales_order_upload
-- 생성일시: 2026-02-10
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- 1. sales_order_header UPDATE
-- ============================================
UPDATE hkgn.sales_order_header t
SET customer_cd = bp.bp_cd
FROM hkgn.business_partner bp
WHERE bp.bp_nm = t.customer_cd
  AND t.customer_cd IS NOT NULL
  AND t.customer_cd <> ''
  -- 이미 유효한 bp_cd인 건은 제외
  AND NOT EXISTS (
      SELECT 1 FROM hkgn.business_partner bp2
      WHERE bp2.bp_cd = t.customer_cd
  );

DO $$ BEGIN
    RAISE NOTICE 'sales_order_header: bp_nm→bp_cd 변환 완료 (현재 유효 bp_cd: %건)',
        (SELECT COUNT(*) FROM hkgn.sales_order_header t
         WHERE EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd));
END $$;

-- ============================================
-- 2. delivery_header UPDATE
-- ============================================
UPDATE hkgn.delivery_header t
SET customer_cd = bp.bp_cd
FROM hkgn.business_partner bp
WHERE bp.bp_nm = t.customer_cd
  AND t.customer_cd IS NOT NULL
  AND t.customer_cd <> ''
  AND NOT EXISTS (
      SELECT 1 FROM hkgn.business_partner bp2
      WHERE bp2.bp_cd = t.customer_cd
  );

DO $$ BEGIN
    RAISE NOTICE 'delivery_header: bp_nm→bp_cd 변환 완료 (현재 유효 bp_cd: %건)',
        (SELECT COUNT(*) FROM hkgn.delivery_header t
         WHERE EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd));
END $$;

-- ============================================
-- 3. cutting_daily_report UPDATE
-- ============================================
UPDATE hkgn.cutting_daily_report t
SET customer_cd = bp.bp_cd
FROM hkgn.business_partner bp
WHERE bp.bp_nm = t.customer_cd
  AND t.customer_cd IS NOT NULL
  AND t.customer_cd <> ''
  AND NOT EXISTS (
      SELECT 1 FROM hkgn.business_partner bp2
      WHERE bp2.bp_cd = t.customer_cd
  );

DO $$ BEGIN
    RAISE NOTICE 'cutting_daily_report: bp_nm→bp_cd 변환 완료 (현재 유효 bp_cd: %건)',
        (SELECT COUNT(*) FROM hkgn.cutting_daily_report t
         WHERE EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd));
END $$;

-- ============================================
-- 4. sales_order_upload UPDATE
-- ============================================
UPDATE hkgn.sales_order_upload t
SET customer_cd = bp.bp_cd
FROM hkgn.business_partner bp
WHERE bp.bp_nm = t.customer_cd
  AND t.customer_cd IS NOT NULL
  AND t.customer_cd <> ''
  AND NOT EXISTS (
      SELECT 1 FROM hkgn.business_partner bp2
      WHERE bp2.bp_cd = t.customer_cd
  );

DO $$ BEGIN
    RAISE NOTICE 'sales_order_upload: bp_nm→bp_cd 변환 완료 (현재 유효 bp_cd: %건)',
        (SELECT COUNT(*) FROM hkgn.sales_order_upload t
         WHERE EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd));
END $$;

-- ============================================
-- 5. 매칭 실패 확인 (customer_cd가 bp_cd에도 bp_nm에도 없는 행)
-- ============================================
SELECT '매칭 실패 확인' AS section;

SELECT 'sales_order_header' AS table_nm, customer_cd, COUNT(*) AS cnt
FROM hkgn.sales_order_header t
WHERE t.customer_cd IS NOT NULL AND t.customer_cd <> ''
  AND NOT EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd)
GROUP BY customer_cd

UNION ALL

SELECT 'delivery_header', customer_cd, COUNT(*)
FROM hkgn.delivery_header t
WHERE t.customer_cd IS NOT NULL AND t.customer_cd <> ''
  AND NOT EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd)
GROUP BY customer_cd

UNION ALL

SELECT 'cutting_daily_report', customer_cd, COUNT(*)
FROM hkgn.cutting_daily_report t
WHERE t.customer_cd IS NOT NULL AND t.customer_cd <> ''
  AND NOT EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd)
GROUP BY customer_cd

UNION ALL

SELECT 'sales_order_upload', customer_cd, COUNT(*)
FROM hkgn.sales_order_upload t
WHERE t.customer_cd IS NOT NULL AND t.customer_cd <> ''
  AND NOT EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd)
GROUP BY customer_cd

ORDER BY table_nm, customer_cd;

-- ============================================
-- 6. 요약
-- ============================================
SELECT 'UPDATE 요약' AS section;

SELECT
    'sales_order_header' AS table_nm,
    COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd)) AS matched,
    COUNT(*) FILTER (WHERE NOT EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd)) AS unmatched,
    COUNT(*) AS total
FROM hkgn.sales_order_header t
WHERE t.customer_cd IS NOT NULL AND t.customer_cd <> ''

UNION ALL

SELECT 'delivery_header',
    COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd)),
    COUNT(*) FILTER (WHERE NOT EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd)),
    COUNT(*)
FROM hkgn.delivery_header t
WHERE t.customer_cd IS NOT NULL AND t.customer_cd <> ''

UNION ALL

SELECT 'cutting_daily_report',
    COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd)),
    COUNT(*) FILTER (WHERE NOT EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd)),
    COUNT(*)
FROM hkgn.cutting_daily_report t
WHERE t.customer_cd IS NOT NULL AND t.customer_cd <> ''

UNION ALL

SELECT 'sales_order_upload',
    COUNT(*) FILTER (WHERE EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd)),
    COUNT(*) FILTER (WHERE NOT EXISTS (SELECT 1 FROM hkgn.business_partner bp WHERE bp.bp_cd = t.customer_cd)),
    COUNT(*)
FROM hkgn.sales_order_upload t
WHERE t.customer_cd IS NOT NULL AND t.customer_cd <> ''

ORDER BY table_nm;
