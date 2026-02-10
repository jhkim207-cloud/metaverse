-- ============================================
-- ADMIN 역할 메뉴 권한 등록 (role_menus)
-- ============================================
-- 대상 DB: apps (hkgn 스키마)
-- 역할: ADMIN (roles.id = 2)
-- 메뉴: hkgn.menus 전체 (24건)
-- 생성일시: 2026-02-10
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- STEP 1: ADMIN 역할에 전체 메뉴 권한 부여
-- ============================================

INSERT INTO hkgn.role_menus (role_id, menu_id)
VALUES
-- ── Main ──
    (2, 10),   -- MAIN (Main) - GROUP
    (2, 11),   -- MAIN_WORKFLOW (전체 Workflow)

-- ── 생산관리 ──
    (2, 12),   -- PRODUCTION (생산관리) - GROUP
    (2, 14),   -- PROD_PROJECT (현장 관리)
    (2, 15),   -- PROD_SUBCONTRACT (임가공 관리)
    (2, 17),   -- PROD_ORDER (주문)
    (2, 18),   -- PROD_PLAN (생산계획)
    (2, 19),   -- PROD_WORK_ORDER (작업지시)
    (2, 20),   -- PROD_RESULT (생산실적)
    (2, 21),   -- PROD_PACKAGING (포장)
    (2, 22),   -- PROD_SHIPPING (출고)
    (2, 23),   -- PROD_PURCHASE (구매/원자재구매)
    (2, 24),   -- PROD_WORKER (작업자 배치)
    (2, 25),   -- PROD_DEFECT (불량관리)
    (2, 26),   -- PROD_INVENTORY (재품관리)

-- ── 시스템관리 ──
    (2, 1),    -- SYSTEM (시스템관리) - GROUP
    (2, 2),    -- SYSTEM_USERS (사용자 관리)
    (2, 3),    -- SYSTEM_ROLES (역할 관리)
    (2, 4),    -- SYSTEM_MENUS (메뉴 관리)
    (2, 5),    -- SYSTEM_ORGS (조직 관리)
    (2, 6),    -- SYSTEM_AUDIT (감사 로그)

-- ── 마이페이지 ──
    (2, 7),    -- MY (마이페이지) - GROUP
    (2, 8),    -- MY_PROFILE (프로필)
    (2, 9)     -- MY_PASSWORD (비밀번호 변경)
ON CONFLICT (role_id, menu_id) DO NOTHING;

-- ============================================
-- STEP 2: 등록 확인
-- ============================================

SELECT
    rm.role_id,
    r.code AS role_code,
    rm.menu_id,
    m.code AS menu_code,
    m.name AS menu_name,
    m.menu_type
FROM hkgn.role_menus rm
JOIN hkgn.roles r ON r.id = rm.role_id
JOIN hkgn.menus m ON m.id = rm.menu_id
WHERE rm.role_id = 2
ORDER BY m.sort_order, m.id;
