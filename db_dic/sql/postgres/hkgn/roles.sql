-- ============================================
-- 테이블: roles (역할 정의)
-- 설명: 역할 정의
-- 스키마: hkgn
-- 작성일: 2026-02-01 (원본), 2026-02-12 (hkgn 스키마 동기화)
-- ============================================

CREATE TABLE hkgn.roles (
    -- PK
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                            -- [역할ID] 시스템 자동 생성 PK

    -- 비즈니스 컬럼
    code VARCHAR(50) NOT NULL UNIQUE,       -- [역할코드] 시스템 식별용 코드 (예: ADMIN, SALES_MANAGER)
    name VARCHAR(100) NOT NULL,             -- [역할명] 화면 표시용 역할 이름
    description TEXT,                       -- [설명] 역할에 대한 상세 설명
    is_system BOOLEAN NOT NULL DEFAULT FALSE,
                                            -- [시스템역할여부] true=시스템 역할(삭제불가), false=사용자 정의
    is_active BOOLEAN NOT NULL DEFAULT TRUE,-- [활성여부] true=활성, false=비활성

    -- 감사(audit) 컬럼
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER
);

-- 인덱스
CREATE UNIQUE INDEX idx_roles_code ON hkgn.roles(code);
CREATE INDEX idx_roles_is_active ON hkgn.roles(is_active);
CREATE INDEX idx_roles_is_system ON hkgn.roles(is_system);

-- 코멘트
COMMENT ON TABLE hkgn.roles IS '역할 정의';
COMMENT ON COLUMN hkgn.roles.id IS '역할ID - 시스템 자동 생성 PK';
COMMENT ON COLUMN hkgn.roles.code IS '역할코드 - 시스템 식별용 코드 (예: ADMIN, SALES_MANAGER)';
COMMENT ON COLUMN hkgn.roles.name IS '역할명 - 화면 표시용 역할 이름';
COMMENT ON COLUMN hkgn.roles.description IS '설명 - 역할에 대한 상세 설명';
COMMENT ON COLUMN hkgn.roles.is_system IS '시스템역할여부 - true=시스템 역할(삭제불가), false=사용자 정의';
COMMENT ON COLUMN hkgn.roles.is_active IS '활성여부 - true=활성, false=비활성';
COMMENT ON COLUMN hkgn.roles.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.roles.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.roles.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.roles.updated_by IS '수정자 - 레코드 최종 수정자';

-- 초기 데이터
INSERT INTO hkgn.roles (code, name, description, is_system, is_active) VALUES
('SUPER_ADMIN', '슈퍼관리자', '시스템 전체 관리 권한', TRUE, TRUE),
('ADMIN', '관리자', '사용자/역할 관리 권한', TRUE, TRUE),
('USER', '일반사용자', '기본 사용자 권한', TRUE, TRUE),
('VIEWER', '조회자', '조회 전용 권한', TRUE, TRUE);
