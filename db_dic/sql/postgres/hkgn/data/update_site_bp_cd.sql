-- ============================================
-- site_master.bp_cd 업데이트 스크립트
-- ============================================
-- 설명: site_master.constructor_nm 으로 business_partner.bp_nm 을 찾아
--       매칭되는 bp_cd 를 site_master.bp_cd 에 업데이트
-- 생성일시: 2026-02-11
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- 1. 매칭 대상 확인 (DRY RUN)
-- ============================================
SELECT
    sm.site_cd,
    sm.site_nm,
    sm.constructor_nm,
    sm.bp_cd AS current_bp_cd,
    bp.bp_cd AS matched_bp_cd,
    bp.bp_nm AS matched_bp_nm
FROM hkgn.site_master sm
JOIN hkgn.business_partner bp
    ON sm.constructor_nm = bp.bp_nm
WHERE sm.constructor_nm IS NOT NULL
  AND sm.constructor_nm <> ''
ORDER BY sm.site_cd;

-- ============================================
-- 2. 매칭되지 않는 현장 확인
-- ============================================
SELECT
    sm.site_cd,
    sm.site_nm,
    sm.constructor_nm
FROM hkgn.site_master sm
LEFT JOIN hkgn.business_partner bp
    ON sm.constructor_nm = bp.bp_nm
WHERE sm.constructor_nm IS NOT NULL
  AND sm.constructor_nm <> ''
  AND bp.bp_cd IS NULL
ORDER BY sm.site_cd;

-- ============================================
-- 3. bp_cd 업데이트 실행
-- ============================================
UPDATE hkgn.site_master sm
SET bp_cd = bp.bp_cd,
    updated_at = now()
FROM hkgn.business_partner bp
WHERE sm.constructor_nm = bp.bp_nm
  AND sm.constructor_nm IS NOT NULL
  AND sm.constructor_nm <> '';
