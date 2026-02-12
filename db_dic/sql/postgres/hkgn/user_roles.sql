-- ============================================
-- 테이블: user_roles (사용자-역할 매핑)
-- 설명: 사용자-역할 매핑 (M:N 관계)
-- 스키마: hkgn
-- 작성일: 2026-02-01 (원본), 2026-02-12 (hkgn 스키마 동기화)
-- ============================================

CREATE TABLE hkgn.user_roles (
    -- 복합 PK
    user_id BIGINT NOT NULL REFERENCES hkgn.users(id),
                                            -- [사용자ID] 역할을 부여받은 사용자 FK
    role_id BIGINT NOT NULL REFERENCES hkgn.roles(id),
                                            -- [역할ID] 부여된 역할 FK

    -- 비즈니스 컬럼
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                            -- [할당일시] 역할 부여 시각
    assigned_by BIGINT REFERENCES hkgn.users(id),
                                            -- [할당자ID] 역할을 부여한 사용자 FK

    -- 복합 기본키
    PRIMARY KEY (user_id, role_id)
);

-- 인덱스
CREATE INDEX idx_user_roles_user ON hkgn.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON hkgn.user_roles(role_id);
CREATE INDEX idx_user_roles_assigned_by ON hkgn.user_roles(assigned_by);

-- 코멘트
COMMENT ON TABLE hkgn.user_roles IS '사용자-역할 매핑 (M:N 관계)';
COMMENT ON COLUMN hkgn.user_roles.user_id IS '사용자ID - 역할을 부여받은 사용자 FK';
COMMENT ON COLUMN hkgn.user_roles.role_id IS '역할ID - 부여된 역할 FK';
COMMENT ON COLUMN hkgn.user_roles.assigned_at IS '할당일시 - 역할 부여 시각';
COMMENT ON COLUMN hkgn.user_roles.assigned_by IS '할당자ID - 역할을 부여한 사용자 FK';
