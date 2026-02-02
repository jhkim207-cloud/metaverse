-- ============================================
-- 테이블: role_menus
-- 설명: 역할-메뉴 매핑 (M:N 관계)
-- 작성일: 2026-02-01
-- ============================================

CREATE TABLE role_menus (
    -- 복합 PK
    role_id BIGINT NOT NULL REFERENCES roles(id),
                                            -- [역할ID] 메뉴 접근 권한을 가진 역할 FK
    menu_id BIGINT NOT NULL REFERENCES menus(id),
                                            -- [메뉴ID] 접근 허용된 메뉴 FK

    -- 복합 기본키
    PRIMARY KEY (role_id, menu_id)
);

-- 인덱스
CREATE INDEX idx_role_menus_role ON role_menus(role_id);
CREATE INDEX idx_role_menus_menu ON role_menus(menu_id);

-- 코멘트
COMMENT ON TABLE role_menus IS '역할-메뉴 매핑 (M:N 관계)';
COMMENT ON COLUMN role_menus.role_id IS '역할ID - 메뉴 접근 권한을 가진 역할 FK';
COMMENT ON COLUMN role_menus.menu_id IS '메뉴ID - 접근 허용된 메뉴 FK';
