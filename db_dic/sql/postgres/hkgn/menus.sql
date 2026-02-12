-- ============================================
-- 테이블: menus (메뉴 구조)
-- 설명: 메뉴 구조
-- 스키마: hkgn
-- 작성일: 2026-02-01 (원본), 2026-02-12 (hkgn 스키마 동기화)
-- ============================================

CREATE TABLE hkgn.menus (
    -- PK
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                            -- [메뉴ID] 시스템 자동 생성 PK

    -- 비즈니스 컬럼
    code VARCHAR(50) NOT NULL UNIQUE,       -- [메뉴코드] 시스템 식별용 고유 코드
    name VARCHAR(100) NOT NULL,             -- [메뉴명] 화면에 표시되는 메뉴 이름
    parent_id BIGINT REFERENCES hkgn.menus(id),
                                            -- [상위메뉴ID] 부모 메뉴 FK (NULL=최상위)
    path VARCHAR(255),                      -- [계층경로] 라우팅 경로 (예: /sales/orders)
    icon VARCHAR(50),                       -- [아이콘] 메뉴 아이콘 클래스명
    menu_type VARCHAR(20) NOT NULL,         -- [메뉴유형] 메뉴 종류
                                            -- 제한값: 'GROUP'(그룹), 'MENU'(메뉴), 'LINK'(외부링크)
    sort_order INTEGER NOT NULL DEFAULT 0,  -- [정렬순서] 같은 레벨 내 표시 순서 (오름차순)
    is_active BOOLEAN NOT NULL DEFAULT TRUE,-- [활성여부] true=활성, false=비활성
    depth INTEGER NOT NULL DEFAULT 0,       -- [계층깊이] 메뉴 계층 깊이 (0=최상위)

    -- 감사(audit) 컬럼
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,

    -- 제약조건
    CONSTRAINT chk_menus_type CHECK (menu_type IN ('GROUP', 'MENU', 'LINK'))
);

-- 인덱스
CREATE UNIQUE INDEX idx_menus_code ON hkgn.menus(code);
CREATE INDEX idx_menus_parent ON hkgn.menus(parent_id);
CREATE INDEX idx_menus_sort ON hkgn.menus(parent_id, sort_order);
CREATE INDEX idx_menus_is_active ON hkgn.menus(is_active);

-- 코멘트
COMMENT ON TABLE hkgn.menus IS '메뉴 구조';
COMMENT ON COLUMN hkgn.menus.id IS '메뉴ID - 시스템 자동 생성 PK';
COMMENT ON COLUMN hkgn.menus.code IS '메뉴코드 - 시스템 식별용 고유 코드';
COMMENT ON COLUMN hkgn.menus.name IS '메뉴명 - 화면에 표시되는 메뉴 이름';
COMMENT ON COLUMN hkgn.menus.parent_id IS '상위메뉴ID - 부모 메뉴 FK (NULL=최상위)';
COMMENT ON COLUMN hkgn.menus.path IS '계층경로 - 라우팅 경로 (예: /sales/orders)';
COMMENT ON COLUMN hkgn.menus.icon IS '아이콘 - 메뉴 아이콘 클래스명';
COMMENT ON COLUMN hkgn.menus.menu_type IS '메뉴유형 - GROUP(그룹), MENU(메뉴), LINK(외부링크)';
COMMENT ON COLUMN hkgn.menus.sort_order IS '정렬순서 - 같은 레벨 내 표시 순서 (오름차순)';
COMMENT ON COLUMN hkgn.menus.is_active IS '활성여부 - true=활성, false=비활성';
COMMENT ON COLUMN hkgn.menus.depth IS '계층깊이 - 메뉴 계층 깊이 (0=최상위)';
COMMENT ON COLUMN hkgn.menus.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.menus.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.menus.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.menus.updated_by IS '수정자 - 레코드 최종 수정자';
