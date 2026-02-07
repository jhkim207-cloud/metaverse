-- ============================================
-- V3: 생산관리 메뉴를 Main 다음 순서로 이동
-- 작성일: 2026-02-07
-- ============================================

-- 생산관리: sort_order 2 (Main 바로 다음)
UPDATE menus SET sort_order = 2 WHERE code = 'PRODUCTION';

-- 시스템관리: sort_order 3
UPDATE menus SET sort_order = 3 WHERE code = 'SYSTEM';

-- 마이페이지: sort_order 4
UPDATE menus SET sort_order = 4 WHERE code = 'MY';
