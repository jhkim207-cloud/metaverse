-- ============================================
-- V13: 중복 UNIQUE 인덱스 제거
-- 설명: NOT NULL UNIQUE 제약조건이 자동 생성한 인덱스와
--       수동으로 CREATE UNIQUE INDEX한 인덱스가 중복되는 6건 제거
-- 작성일: 2026-02-12
-- ============================================

DROP INDEX IF EXISTS hkgn.idx_users_username;
DROP INDEX IF EXISTS hkgn.idx_users_email;
DROP INDEX IF EXISTS hkgn.idx_menus_code;
DROP INDEX IF EXISTS hkgn.idx_roles_code;
DROP INDEX IF EXISTS hkgn.idx_organizations_code;
DROP INDEX IF EXISTS hkgn.idx_role_groups_code;
