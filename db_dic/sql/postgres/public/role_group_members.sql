-- ============================================
-- 테이블: role_group_members
-- 설명: 역할 그룹-역할 매핑 (M:N 관계)
-- 작성일: 2026-02-01
-- ============================================

CREATE TABLE role_group_members (
    -- 복합 PK
    role_group_id BIGINT NOT NULL REFERENCES role_groups(id),
                                            -- [역할그룹ID] 역할이 속한 그룹 FK
    role_id BIGINT NOT NULL REFERENCES roles(id),
                                            -- [역할ID] 그룹에 속한 역할 FK

    -- 복합 기본키
    PRIMARY KEY (role_group_id, role_id)
);

-- 인덱스
CREATE INDEX idx_role_group_members_group ON role_group_members(role_group_id);
CREATE INDEX idx_role_group_members_role ON role_group_members(role_id);

-- 코멘트
COMMENT ON TABLE role_group_members IS '역할 그룹-역할 매핑 (M:N 관계)';
COMMENT ON COLUMN role_group_members.role_group_id IS '역할그룹ID - 역할이 속한 그룹 FK';
COMMENT ON COLUMN role_group_members.role_id IS '역할ID - 그룹에 속한 역할 FK';
