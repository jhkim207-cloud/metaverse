-- ============================================
-- 테이블: container_inventory
-- 설명: 용기 재고 (운반 용기 재고 관리)
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- ============================================

CREATE TABLE hkgn.container_inventory (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 용기 정보
    container_cd    VARCHAR(30)   NOT NULL,                                  -- [용기코드] 용기 자재 코드 (→ item_master.material_cd, material_type='CONTAINER')
    container_nm    VARCHAR(200),                                            -- [용기명] 용기 이름 (참조용)

    -- 위치별 재고
    location        VARCHAR(100)  NOT NULL,                                  -- [위치] 보관 위치 (공장/고객사/현장)
    location_type   VARCHAR(20)   NOT NULL,                                  -- [위치구분] FACTORY:공장, CUSTOMER:고객사, SITE:현장
    bp_cd           VARCHAR(30),                                             -- [거래처코드] 고객사/현장 코드 (→ business_partner.bp_cd)

    -- 수량
    quantity        INTEGER       NOT NULL DEFAULT 0,                        -- [수량] 용기 수량

    -- 상태
    container_status VARCHAR(20)  NOT NULL DEFAULT 'GOOD',                   -- [상태] GOOD:양호, DAMAGED:파손, LOST:분실

    -- 비고
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [수정자] 레코드 최종 수정자

    -- 제약조건
    UNIQUE(container_cd, location)
);

-- 인덱스
CREATE INDEX idx_container_inventory_container ON hkgn.container_inventory(container_cd);
CREATE INDEX idx_container_inventory_location_type ON hkgn.container_inventory(location_type);
CREATE INDEX idx_container_inventory_bp ON hkgn.container_inventory(bp_cd);
CREATE INDEX idx_container_inventory_status ON hkgn.container_inventory(container_status);

-- 코멘트
COMMENT ON TABLE hkgn.container_inventory IS '용기 재고 - 운반 용기 재고 관리';
COMMENT ON COLUMN hkgn.container_inventory.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.container_inventory.container_cd IS '[용기코드] 용기 자재 코드 (→ item_master.material_cd, material_type=CONTAINER)';
COMMENT ON COLUMN hkgn.container_inventory.container_nm IS '[용기명] 용기 이름 (참조용)';
COMMENT ON COLUMN hkgn.container_inventory.location IS '[위치] 보관 위치 (공장/고객사/현장)';
COMMENT ON COLUMN hkgn.container_inventory.location_type IS '[위치구분] FACTORY:공장, CUSTOMER:고객사, SITE:현장';
COMMENT ON COLUMN hkgn.container_inventory.bp_cd IS '[거래처코드] 고객사/현장 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.container_inventory.quantity IS '[수량] 용기 수량';
COMMENT ON COLUMN hkgn.container_inventory.container_status IS '[상태] GOOD:양호, DAMAGED:파손, LOST:분실';
COMMENT ON COLUMN hkgn.container_inventory.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.container_inventory.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.container_inventory.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.container_inventory.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.container_inventory.updated_by IS '[수정자] 레코드 최종 수정자';
