-- V1__init_schema.sql
-- Initial database schema for BizManagement
-- 기준: db_dic/sql/postgres/public/ DDL 원본

-- =============================================================================
-- Extension
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 공통코드 마스터 (code_master)
-- =============================================================================
CREATE TABLE IF NOT EXISTS code_master (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_code VARCHAR(50) NOT NULL,
    group_name VARCHAR(100) NOT NULL,
    code_id VARCHAR(50) NOT NULL,
    code_name VARCHAR(200) NOT NULL,
    parent_id BIGINT REFERENCES code_master(id),
    sort_order INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    extra_data JSONB,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    CONSTRAINT uk_code_master UNIQUE (group_code, code_id)
);

CREATE INDEX idx_code_master_group_code ON code_master(group_code);
CREATE INDEX idx_code_master_is_active ON code_master(is_active);
CREATE INDEX idx_code_master_group_sort ON code_master(group_code, sort_order);
CREATE INDEX idx_code_master_parent_id ON code_master(parent_id);
CREATE INDEX idx_code_master_extra_data ON code_master USING GIN(extra_data);

COMMENT ON TABLE code_master IS '공통 코드 마스터';
COMMENT ON COLUMN code_master.group_code IS '그룹코드';
COMMENT ON COLUMN code_master.group_name IS '그룹명';
COMMENT ON COLUMN code_master.code_id IS '코드ID';
COMMENT ON COLUMN code_master.code_name IS '코드명';
COMMENT ON COLUMN code_master.parent_id IS '상위ID';
COMMENT ON COLUMN code_master.sort_order IS '정렬순서';
COMMENT ON COLUMN code_master.description IS '설명';
COMMENT ON COLUMN code_master.extra_data IS '추가데이터 (JSON)';
COMMENT ON COLUMN code_master.is_active IS '활성여부';

-- =============================================================================
-- 메뉴 (menus)
-- =============================================================================
CREATE TABLE IF NOT EXISTS menus (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    parent_id BIGINT REFERENCES menus(id),
    path VARCHAR(255),
    icon VARCHAR(50),
    menu_type VARCHAR(20) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    depth INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    CONSTRAINT chk_menus_type CHECK (menu_type IN ('GROUP', 'MENU', 'LINK'))
);

CREATE INDEX idx_menus_parent ON menus(parent_id);
CREATE INDEX idx_menus_sort ON menus(parent_id, sort_order);
CREATE INDEX idx_menus_is_active ON menus(is_active);

COMMENT ON TABLE menus IS '메뉴 구조';
COMMENT ON COLUMN menus.code IS '메뉴코드';
COMMENT ON COLUMN menus.name IS '메뉴명';
COMMENT ON COLUMN menus.parent_id IS '상위메뉴ID';
COMMENT ON COLUMN menus.path IS '라우팅 경로';
COMMENT ON COLUMN menus.icon IS '아이콘';
COMMENT ON COLUMN menus.menu_type IS '메뉴유형 (GROUP/MENU/LINK)';
COMMENT ON COLUMN menus.sort_order IS '정렬순서';
COMMENT ON COLUMN menus.is_active IS '활성여부';
COMMENT ON COLUMN menus.depth IS '계층깊이';

-- =============================================================================
-- 사용자 (users) - 간소화 버전
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);

COMMENT ON TABLE users IS '사용자';
COMMENT ON COLUMN users.username IS '사용자명';
COMMENT ON COLUMN users.email IS '이메일';
COMMENT ON COLUMN users.password_hash IS '비밀번호 해시';
COMMENT ON COLUMN users.display_name IS '표시명';
COMMENT ON COLUMN users.is_active IS '활성여부';
COMMENT ON COLUMN users.last_login_at IS '최종 로그인 일시';

-- =============================================================================
-- 감사 로그 (audit_logs)
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

COMMENT ON TABLE audit_logs IS '감사 로그';
COMMENT ON COLUMN audit_logs.action IS '행위 (LOGIN, LOGOUT, CREATE, UPDATE, DELETE 등)';
COMMENT ON COLUMN audit_logs.resource_type IS '리소스 유형';
COMMENT ON COLUMN audit_logs.resource_id IS '리소스 ID';

-- =============================================================================
-- 초기 메뉴 데이터
-- =============================================================================
INSERT INTO menus (code, name, parent_id, path, icon, menu_type, sort_order, is_active, depth) VALUES
('SYSTEM', '시스템관리', NULL, NULL, 'settings', 'GROUP', 1, TRUE, 0);

INSERT INTO menus (code, name, parent_id, path, icon, menu_type, sort_order, is_active, depth) VALUES
('SYSTEM_USERS', '사용자 관리', (SELECT id FROM menus WHERE code = 'SYSTEM'), '/admin/users', 'people', 'MENU', 1, TRUE, 1),
('SYSTEM_ROLES', '역할 관리', (SELECT id FROM menus WHERE code = 'SYSTEM'), '/admin/roles', 'security', 'MENU', 2, TRUE, 1),
('SYSTEM_MENUS', '메뉴 관리', (SELECT id FROM menus WHERE code = 'SYSTEM'), '/admin/menus', 'menu', 'MENU', 3, TRUE, 1),
('SYSTEM_ORGS', '조직 관리', (SELECT id FROM menus WHERE code = 'SYSTEM'), '/admin/organizations', 'business', 'MENU', 4, TRUE, 1),
('SYSTEM_AUDIT', '감사 로그', (SELECT id FROM menus WHERE code = 'SYSTEM'), '/admin/audit-logs', 'history', 'MENU', 5, TRUE, 1);

INSERT INTO menus (code, name, parent_id, path, icon, menu_type, sort_order, is_active, depth) VALUES
('MY', '마이페이지', NULL, NULL, 'person', 'GROUP', 2, TRUE, 0);

INSERT INTO menus (code, name, parent_id, path, icon, menu_type, sort_order, is_active, depth) VALUES
('MY_PROFILE', '프로필', (SELECT id FROM menus WHERE code = 'MY'), '/my/profile', 'account_circle', 'MENU', 1, TRUE, 1),
('MY_PASSWORD', '비밀번호 변경', (SELECT id FROM menus WHERE code = 'MY'), '/my/password', 'lock', 'MENU', 2, TRUE, 1);

-- =============================================================================
-- 초기 공통코드 데이터
-- =============================================================================
INSERT INTO code_master (group_code, group_name, code_id, code_name, sort_order, description, is_active) VALUES
('USER_STATUS', '사용자상태', 'ACTIVE', '활성', 1, '정상 활성 상태', TRUE),
('USER_STATUS', '사용자상태', 'INACTIVE', '비활성', 2, '비활성 상태', TRUE),
('USER_STATUS', '사용자상태', 'SUSPENDED', '정지', 3, '계정 정지 상태', TRUE),
('YN', '예/아니오', 'Y', '예', 1, '사용함', TRUE),
('YN', '예/아니오', 'N', '아니오', 2, '사용안함', TRUE);
