-- ============================================
-- 테이블: role_group_inheritance (역할 그룹 상속 관계)
-- 설명: 역할 그룹 상속 관계
-- 스키마: hkgn
-- 작성일: 2026-02-01 (원본), 2026-02-12 (hkgn 스키마 동기화)
-- ============================================

CREATE TABLE hkgn.role_group_inheritance (
    -- 복합 PK
    child_group_id BIGINT NOT NULL REFERENCES hkgn.role_groups(id),
                                            -- [하위그룹ID] 상속받는 역할 그룹 FK
    parent_group_id BIGINT NOT NULL REFERENCES hkgn.role_groups(id),
                                            -- [상위그룹ID] 상속하는 역할 그룹 FK

    -- 복합 기본키
    PRIMARY KEY (child_group_id, parent_group_id)
);

-- 인덱스
CREATE INDEX idx_role_group_inheritance_child ON hkgn.role_group_inheritance(child_group_id);
CREATE INDEX idx_role_group_inheritance_parent ON hkgn.role_group_inheritance(parent_group_id);

-- 코멘트
COMMENT ON TABLE hkgn.role_group_inheritance IS '역할 그룹 상속 관계';
COMMENT ON COLUMN hkgn.role_group_inheritance.child_group_id IS '하위그룹ID - 상속받는 역할 그룹 FK';
COMMENT ON COLUMN hkgn.role_group_inheritance.parent_group_id IS '상위그룹ID - 상속하는 역할 그룹 FK';
