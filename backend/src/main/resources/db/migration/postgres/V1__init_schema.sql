-- V1__init_schema.sql
-- Initial database schema for BizManagement

-- =============================================================================
-- Extension
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- Common code master table
-- =============================================================================
CREATE TABLE IF NOT EXISTS code_master (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    group_code VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    code_name VARCHAR(200) NOT NULL,
    code_desc VARCHAR(500),
    sort_order INT DEFAULT 0,
    use_yn CHAR(1) DEFAULT 'Y' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    CONSTRAINT uk_code_master_group_code UNIQUE (group_code, code)
);

COMMENT ON TABLE code_master IS '공통코드 마스터';
COMMENT ON COLUMN code_master.id IS '코드 ID';
COMMENT ON COLUMN code_master.group_code IS '그룹 코드';
COMMENT ON COLUMN code_master.code IS '코드';
COMMENT ON COLUMN code_master.code_name IS '코드명';
COMMENT ON COLUMN code_master.code_desc IS '코드 설명';
COMMENT ON COLUMN code_master.sort_order IS '정렬 순서';
COMMENT ON COLUMN code_master.use_yn IS '사용 여부 (Y/N)';
COMMENT ON COLUMN code_master.created_at IS '생성일시';
COMMENT ON COLUMN code_master.updated_at IS '수정일시';
COMMENT ON COLUMN code_master.created_by IS '생성자';
COMMENT ON COLUMN code_master.updated_by IS '수정자';

-- =============================================================================
-- Users table
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER
);

COMMENT ON TABLE users IS '사용자';
COMMENT ON COLUMN users.id IS '사용자 ID';
COMMENT ON COLUMN users.email IS '이메일';
COMMENT ON COLUMN users.username IS '사용자명';
COMMENT ON COLUMN users.password_hash IS '비밀번호 해시';
COMMENT ON COLUMN users.status IS '상태 (ACTIVE, INACTIVE, SUSPENDED)';
COMMENT ON COLUMN users.last_login_at IS '최종 로그인 일시';

-- Index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

-- =============================================================================
-- Audit log table
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

COMMENT ON TABLE audit_log IS '감사 로그';
COMMENT ON COLUMN audit_log.action IS '액션 (CREATE, UPDATE, DELETE, LOGIN, LOGOUT)';
COMMENT ON COLUMN audit_log.entity_type IS '엔티티 타입';
COMMENT ON COLUMN audit_log.entity_id IS '엔티티 ID';
COMMENT ON COLUMN audit_log.old_value IS '변경 전 값 (JSON)';
COMMENT ON COLUMN audit_log.new_value IS '변경 후 값 (JSON)';

-- Index
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

-- =============================================================================
-- Initial data
-- =============================================================================
INSERT INTO code_master (group_code, code, code_name, code_desc, sort_order) VALUES
    ('USER_STATUS', 'ACTIVE', '활성', '정상 활성 상태', 1),
    ('USER_STATUS', 'INACTIVE', '비활성', '비활성 상태', 2),
    ('USER_STATUS', 'SUSPENDED', '정지', '계정 정지 상태', 3),
    ('YN', 'Y', '예', '사용함', 1),
    ('YN', 'N', '아니오', '사용안함', 2);
