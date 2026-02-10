-- ============================================
-- production_plan site_cd UPDATE 스크립트
-- ============================================
-- 설명: production_plan.site_nm 값으로 site_master를 조회하여
--       site_cd를 UPDATE
-- 전제: alter_table.sql 섹션 6 실행 완료 (site_cd 컬럼 추가)
--       update_site_cd_from_site_master.sql 실행 완료
--       (site_master에 누락 현장 자동 INSERT + variant_map 처리 완료)
-- 대상: production_plan
-- 수정일시: 2026-02-10
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- 0. 유사 현장명 변형 매핑 (임시 테이블)
-- ============================================
-- update_site_cd_from_site_master.sql과 동일한 variant 매핑 재사용

CREATE TEMP TABLE IF NOT EXISTS _site_variant_map (
    canonical_nm VARCHAR(200),
    variant_nm   VARCHAR(200)
);

TRUNCATE _site_variant_map;

INSERT INTO _site_variant_map (canonical_nm, variant_nm) VALUES
-- 띄어쓰기 차이
('강릉회산동 공동주택',       '강릉회산동공동주택'),
('김포구래물류시설',           '김포 구래물류시설'),
('대전역 센텀비스타',          '대전역센텀비스타'),
('판교G2업무시설 1공구',      '판교G2업무시설1공구'),
-- 약어/명칭 차이
('대전기초과학연구소',         '대전기초과학연구원'),
('청주 복대2구역 재개발사업',   '청주 복대2구역'),
('천호1구역',                 '천호1지구'),
-- JK타워 관련 변형 (canonical: 서초JK타워)
('서초JK타워',                '서초동 JK타워'),
('서초JK타워',                '서초동JK타워'),
('서초JK타워',                'LX 서초 (JK 현장)');

-- ============================================
-- 1. production_plan에서 누락 현장 수집
-- ============================================
-- variant는 canonical로 변환 후 site_master에 없는 건만 수집

CREATE TEMP TABLE IF NOT EXISTS _missing_sites (
    site_nm VARCHAR(200)
);

TRUNCATE _missing_sites;

INSERT INTO _missing_sites (site_nm)
SELECT DISTINCT normalized_nm
FROM (
    SELECT COALESCE(v.canonical_nm, pp.site_nm) AS normalized_nm
    FROM hkgn.production_plan pp
    LEFT JOIN _site_variant_map v ON v.variant_nm = pp.site_nm
    WHERE pp.site_nm IS NOT NULL
      AND pp.site_nm <> ''
) normalized
WHERE NOT EXISTS (
    SELECT 1 FROM hkgn.site_master sm
    WHERE sm.site_nm = normalized.normalized_nm
);

-- 누락 현장 확인
SELECT '누락 현장 확인' AS section;

SELECT site_nm FROM _missing_sites ORDER BY site_nm;

SELECT '누락 현장: ' || COUNT(*) || '건' AS result FROM _missing_sites;

-- ============================================
-- 2. 누락 현장 자동 INSERT (canonical 이름으로)
-- ============================================
-- site_cd: 현재 최대 SITE번호 + 1부터 순차 부여

INSERT INTO hkgn.site_master (site_cd, site_nm, constructor_nm, bp_cd, address, remark, is_active)
SELECT
    'SITE' || LPAD((ROW_NUMBER() OVER (ORDER BY ms.site_nm) + max_num.val)::TEXT, 3, '0'),
    ms.site_nm,
    NULL,
    NULL,
    NULL,
    '출처: update_production_plan_site_cd 스크립트 (자동 추가)',
    TRUE
FROM _missing_sites ms
CROSS JOIN (
    SELECT COALESCE(MAX(SUBSTRING(site_cd FROM 5)::INT), 0) AS val
    FROM hkgn.site_master
    WHERE site_cd ~ '^SITE\d+$'
) max_num;

DO $$ BEGIN
    RAISE NOTICE '자동 추가된 현장: % 건',
        (SELECT COUNT(*) FROM _missing_sites);
END $$;

-- ============================================
-- 3. 전체 매핑 테이블 구성 (site_master + 변형)
-- ============================================

CREATE TEMP TABLE IF NOT EXISTS _full_site_map (
    site_cd  VARCHAR(30),
    site_nm  VARCHAR(200)
);

TRUNCATE _full_site_map;

-- 원본 매핑 (site_master 그대로)
INSERT INTO _full_site_map (site_cd, site_nm)
SELECT site_cd, site_nm FROM hkgn.site_master;

-- 변형 매핑 추가 (variant_nm → canonical의 site_cd)
INSERT INTO _full_site_map (site_cd, site_nm)
SELECT sm.site_cd, v.variant_nm
FROM _site_variant_map v
JOIN hkgn.site_master sm ON sm.site_nm = v.canonical_nm;

-- ============================================
-- 4. production_plan UPDATE
-- ============================================
UPDATE hkgn.production_plan t
SET site_cd = m.site_cd
FROM _full_site_map m
WHERE t.site_nm = m.site_nm
  AND t.site_nm IS NOT NULL
  AND t.site_nm <> '';

DO $$ BEGIN
    RAISE NOTICE 'production_plan: % rows updated',
        (SELECT COUNT(*) FROM hkgn.production_plan WHERE site_cd IS NOT NULL AND site_cd <> '');
END $$;

-- ============================================
-- 5. 매칭 실패 확인 (site_nm 있는데 site_cd 없는 행)
-- ============================================
SELECT '매칭 실패 확인' AS section;

SELECT site_nm, COUNT(*) AS cnt
FROM hkgn.production_plan
WHERE site_nm IS NOT NULL AND site_nm <> ''
  AND (site_cd IS NULL OR site_cd = '')
GROUP BY site_nm
ORDER BY site_nm;

-- ============================================
-- 6. 요약
-- ============================================
SELECT 'UPDATE 요약' AS section;

SELECT
    COUNT(*) FILTER (WHERE site_cd IS NOT NULL AND site_cd <> '') AS matched,
    COUNT(*) FILTER (WHERE site_nm IS NOT NULL AND site_nm <> '' AND (site_cd IS NULL OR site_cd = '')) AS unmatched,
    COUNT(*) FILTER (WHERE site_nm IS NOT NULL AND site_nm <> '') AS total_with_site_nm,
    COUNT(*) AS total_rows
FROM hkgn.production_plan;

-- 자동 추가된 현장 확인
SELECT '자동 추가된 현장' AS section;

SELECT site_cd, site_nm, remark
FROM hkgn.site_master
WHERE remark = '출처: update_production_plan_site_cd 스크립트 (자동 추가)'
ORDER BY site_cd;

-- 임시 테이블 정리
DROP TABLE IF EXISTS _full_site_map;
DROP TABLE IF EXISTS _missing_sites;
DROP TABLE IF EXISTS _site_variant_map;
