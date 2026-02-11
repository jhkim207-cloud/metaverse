-- ============================================
-- 테이블 UPDATE 스크립트
-- ============================================
-- 생성일시: 2026-02-11
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- 1. sales_order_detail: area → area_pyeong 환산
--    공식: area_pyeong = ROUND(area * 10.892, 3)
-- ============================================
UPDATE hkgn.sales_order_detail
SET area_pyeong = ROUND(area * 10.892, 3),
    updated_at = now()
WHERE area IS NOT NULL
  AND area > 0;

-- ============================================
-- 2. site_price: customer_nm → customer_cd 매칭 (DRY RUN)
-- ============================================
SELECT
    sp.id, sp.site_cd, sp.customer_nm,
    sp.customer_cd AS current_cd,
    bp.bp_cd AS matched_cd
FROM hkgn.site_price sp
JOIN hkgn.business_partner bp ON sp.customer_nm = bp.bp_nm
WHERE sp.customer_nm IS NOT NULL AND sp.customer_nm <> '';

-- 2-1. customer_cd 업데이트 실행
UPDATE hkgn.site_price sp
SET customer_cd = bp.bp_cd,
    updated_at = now()
FROM hkgn.business_partner bp
WHERE sp.customer_nm = bp.bp_nm
  AND sp.customer_nm IS NOT NULL
  AND sp.customer_nm <> '';

-- ============================================
-- 3. site_price: spec → material_cd, material_nm 매칭 (DRY RUN)
-- ============================================
SELECT
    sp.id, sp.site_cd, sp.spec,
    sp.material_cd AS current_cd,
    im.material_cd AS matched_cd,
    im.material_nm AS matched_nm
FROM hkgn.site_price sp
JOIN hkgn.item_master im ON sp.spec = im.material_nm
WHERE sp.spec IS NOT NULL AND sp.spec <> '';

-- 3-1. material_cd, material_nm 업데이트 실행
UPDATE hkgn.site_price sp
SET material_cd = im.material_cd,
    material_nm = im.material_nm,
    updated_at = now()
FROM hkgn.item_master im
WHERE sp.spec = im.material_nm
  AND sp.spec IS NOT NULL
  AND sp.spec <> '';
