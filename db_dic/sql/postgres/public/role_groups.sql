-- ============================================
-- 테이블: role_groups
-- 설명: 역할 그룹 (역할을 그룹화)
-- 작성일: 2026-02-01
-- ============================================

CREATE TABLE role_groups (
    -- PK
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                            -- [역할그룹ID] 시스템 자동 생성 PK

    -- 비즈니스 컬럼
    code VARCHAR(50) NOT NULL UNIQUE,       -- [역할그룹코드] 시스템 식별용 고유 코드
    name VARCHAR(100) NOT NULL,             -- [역할그룹명] 역할 그룹 이름
    description TEXT                        -- [설명] 역할 그룹에 대한 상세 설명
);

-- 인덱스
CREATE UNIQUE INDEX idx_role_groups_code ON role_groups(code);

-- 코멘트
COMMENT ON TABLE role_groups IS '역할 그룹 (역할을 그룹화)';
COMMENT ON COLUMN role_groups.id IS '역할그룹ID - 시스템 자동 생성 PK';
COMMENT ON COLUMN role_groups.code IS '역할그룹코드 - 시스템 식별용 고유 코드';
COMMENT ON COLUMN role_groups.name IS '역할그룹명 - 역할 그룹 이름';
COMMENT ON COLUMN role_groups.description IS '설명 - 역할 그룹에 대한 상세 설명';
