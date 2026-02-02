-- ============================================
-- 테이블: organizations
-- 설명: 조직 (회사/부서/팀 계층 구조)
-- 작성일: 2026-02-01
-- ============================================

CREATE TABLE organizations (
    -- PK
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                            -- [조직ID] 시스템 자동 생성 PK

    -- 비즈니스 컬럼
    master_id VARCHAR(100),                 -- [마스터ID] 외부 시스템 Master data 참조 ID
    code VARCHAR(50) NOT NULL UNIQUE,       -- [조직코드] 시스템 식별용 고유 코드
    name VARCHAR(100) NOT NULL,             -- [조직명] 조직 이름
    org_type VARCHAR(20) NOT NULL,          -- [조직유형] 조직 종류
                                            -- 제한값: 'COMPANY'(회사), 'DEPARTMENT'(부서), 'TEAM'(팀)
    parent_id BIGINT REFERENCES organizations(id),
                                            -- [상위조직ID] 부모 조직 FK (NULL=최상위)
    depth INTEGER NOT NULL DEFAULT 0,       -- [계층깊이] 조직 계층 깊이 (0=최상위)
    path VARCHAR(500),                      -- [계층경로] Materialized Path (예: /1/3/5/)
    manager_id BIGINT,                      -- [관리자ID] 조직 책임자 FK (users 테이블 생성 후 FK 추가)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,-- [활성여부] true=활성, false=비활성

    -- 감사(audit) 컬럼
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                            -- [생성일시] 레코드 생성 시각
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                            -- [수정일시] 레코드 최종 수정 시각
    created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
                                            -- [생성자] 레코드 생성자
    updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
                                            -- [수정자] 레코드 최종 수정자

    -- 제약조건
    CONSTRAINT chk_organizations_type CHECK (org_type IN ('COMPANY', 'DEPARTMENT', 'TEAM'))
);

-- 인덱스
CREATE UNIQUE INDEX idx_organizations_code ON organizations(code);
CREATE INDEX idx_organizations_parent ON organizations(parent_id);
CREATE INDEX idx_organizations_path ON organizations(path);
CREATE INDEX idx_organizations_is_active ON organizations(is_active);

-- 코멘트
COMMENT ON TABLE organizations IS '조직 (회사/부서/팀 계층 구조)';
COMMENT ON COLUMN organizations.id IS '조직ID - 시스템 자동 생성 PK';
COMMENT ON COLUMN organizations.master_id IS '마스터ID - 외부 시스템 Master data 참조 ID';
COMMENT ON COLUMN organizations.code IS '조직코드 - 시스템 식별용 고유 코드';
COMMENT ON COLUMN organizations.name IS '조직명 - 조직 이름';
COMMENT ON COLUMN organizations.org_type IS '조직유형 - COMPANY(회사), DEPARTMENT(부서), TEAM(팀)';
COMMENT ON COLUMN organizations.parent_id IS '상위조직ID - 부모 조직 FK (NULL=최상위)';
COMMENT ON COLUMN organizations.depth IS '계층깊이 - 조직 계층 깊이 (0=최상위)';
COMMENT ON COLUMN organizations.path IS '계층경로 - Materialized Path (예: /1/3/5/)';
COMMENT ON COLUMN organizations.manager_id IS '관리자ID - 조직 책임자 FK';
COMMENT ON COLUMN organizations.is_active IS '활성여부 - true=활성, false=비활성';
COMMENT ON COLUMN organizations.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN organizations.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN organizations.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN organizations.updated_by IS '수정자 - 레코드 최종 수정자';
