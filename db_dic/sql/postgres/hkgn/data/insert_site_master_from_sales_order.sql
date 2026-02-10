-- ============================================
-- 현장 마스터 보충 INSERT (sales_order_header 기준)
-- ============================================
-- 설명: sales_order_header.site_nm 중 site_master에 없는
--       현장을 자동으로 site_master에 추가
-- 전제: insert_site_master.sql, insert_site_master_real.sql,
--       insert_site_master_missing.sql 이 먼저 실행된 상태
-- 생성일시: 2026-02-10
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- 1. 유사 현장명 변형 매핑
-- ============================================
CREATE TEMP TABLE IF NOT EXISTS _variant_map (
    canonical_nm VARCHAR(200),
    variant_nm   VARCHAR(200)
);
TRUNCATE _variant_map;

INSERT INTO _variant_map (canonical_nm, variant_nm) VALUES
('강릉회산동 공동주택',     '강릉회산동공동주택'),
('김포구래물류시설',         '김포 구래물류시설'),
('대전역 센텀비스타',        '대전역센텀비스타'),
('대전기초과학연구소',       '대전기초과학연구원'),
('판교G2업무시설 1공구',    '판교G2업무시설1공구'),
('청주 복대2구역 재개발사업', '청주 복대2구역'),
('천호1구역',               '천호1지구');

-- ============================================
-- 2. 누락 현장 확인
-- ============================================
-- sales_order_header에 site_nm이 있지만
-- site_master에 정확매칭도 변형매칭도 안 되는 건

SELECT '누락 현장 확인' AS section;

SELECT DISTINCT soh.site_nm, COUNT(*) AS cnt
FROM hkgn.sales_order_header soh
WHERE soh.site_nm IS NOT NULL
  AND soh.site_nm <> ''
  AND NOT EXISTS (
      SELECT 1 FROM hkgn.site_master sm WHERE sm.site_nm = soh.site_nm
  )
  AND NOT EXISTS (
      SELECT 1
      FROM _variant_map v
      JOIN hkgn.site_master sm ON sm.site_nm = v.canonical_nm
      WHERE v.variant_nm = soh.site_nm
  )
GROUP BY soh.site_nm
ORDER BY soh.site_nm;

-- ============================================
-- 3. 누락 현장 자동 INSERT
-- ============================================
-- site_cd: 현재 최대 SITE번호 + 1부터 순차 부여

INSERT INTO hkgn.site_master (site_cd, site_nm, constructor_nm, bp_cd, address, remark, is_active)
SELECT
    'SITE' || LPAD((ROW_NUMBER() OVER (ORDER BY soh.site_nm) + max_num.val)::TEXT, 3, '0'),
    soh.site_nm,
    NULL,
    NULL,
    NULL,
    '출처: sales_order_header (자동 추가)',
    TRUE
FROM (
    SELECT DISTINCT site_nm
    FROM hkgn.sales_order_header
    WHERE site_nm IS NOT NULL
      AND site_nm <> ''
      AND NOT EXISTS (
          SELECT 1 FROM hkgn.site_master sm WHERE sm.site_nm = sales_order_header.site_nm
      )
      AND NOT EXISTS (
          SELECT 1
          FROM _variant_map v
          JOIN hkgn.site_master sm ON sm.site_nm = v.canonical_nm
          WHERE v.variant_nm = sales_order_header.site_nm
      )
) soh
CROSS JOIN (
    SELECT COALESCE(MAX(SUBSTRING(site_cd FROM 5)::INT), 0) AS val
    FROM hkgn.site_master
    WHERE site_cd ~ '^SITE\d+$'
) max_num;

-- ============================================
-- 4. 결과 확인
-- ============================================
SELECT '추가된 현장' AS section;

SELECT site_cd, site_nm, remark
FROM hkgn.site_master
WHERE remark = '출처: sales_order_header (자동 추가)'
ORDER BY site_cd;

SELECT '전체 현장 수: ' || COUNT(*) || '건' AS result
FROM hkgn.site_master;

-- 정리
DROP TABLE IF EXISTS _variant_map;
