-- ============================================
-- 테이블: role_group_inheritance
-- 설명: 역할 그룹 상속 관계
-- 작성일: 2026-02-01
-- ============================================

CREATE TABLE role_group_inheritance (
    -- 복합 PK
    child_group_id BIGINT NOT NULL REFERENCES role_groups(id),
                                            -- [하위그룹ID] 상속받는 역할 그룹 FK
    parent_group_id BIGINT NOT NULL REFERENCES role_groups(id),
                                            -- [상위그룹ID] 상속하는 역할 그룹 FK

    -- 복합 기본키
    PRIMARY KEY (child_group_id, parent_group_id)
);

-- 인덱스
CREATE INDEX idx_role_group_inheritance_child ON role_group_inheritance(child_group_id);
CREATE INDEX idx_role_group_inheritance_parent ON role_group_inheritance(parent_group_id);

-- 코멘트
COMMENT ON TABLE role_group_inheritance IS '역할 그룹 상속 관계';
COMMENT ON COLUMN role_group_inheritance.child_group_id IS '하위그룹ID - 상속받는 역할 그룹 FK';
COMMENT ON COLUMN role_group_inheritance.parent_group_id IS '상위그룹ID - 상속하는 역할 그룹 FK';
