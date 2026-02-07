-- ============================================
-- 테이블: inventory
-- 설명: 재고 현황 (자재별 재고 수량 관리)
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- ============================================

CREATE TABLE hkgn.inventory (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL UNIQUE,                           -- [자재코드] 재고 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량 정보
    current_qty     NUMERIC(12,2) NOT NULL DEFAULT 0,                        -- [현재고] 현재 재고 수량
    available_qty   NUMERIC(12,2) NOT NULL DEFAULT 0,                        -- [가용재고] 가용 재고 (현재고 - 예약)
    reserved_qty    NUMERIC(12,2) DEFAULT 0,                                 -- [예약수량] 예약된 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평/kg

    -- 재고 기준
    min_qty         NUMERIC(12,2) DEFAULT 0,                                 -- [최소재고] 안전 재고 수량
    max_qty         NUMERIC(12,2) DEFAULT 0,                                 -- [최대재고] 최대 보유 수량

    -- 위치
    warehouse_cd    VARCHAR(30),                                             -- [창고코드] 보관 창고 코드
    location        VARCHAR(100),                                            -- [위치] 상세 보관 위치

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

-- 인덱스
CREATE INDEX idx_inventory_material ON hkgn.inventory(material_cd);
CREATE INDEX idx_inventory_warehouse ON hkgn.inventory(warehouse_cd);

-- 코멘트
COMMENT ON TABLE hkgn.inventory IS '재고 현황 - 자재별 재고 수량 관리';
COMMENT ON COLUMN hkgn.inventory.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.inventory.material_cd IS '[자재코드] 재고 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.inventory.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.inventory.current_qty IS '[현재고] 현재 재고 수량';
COMMENT ON COLUMN hkgn.inventory.available_qty IS '[가용재고] 가용 재고 (현재고 - 예약)';
COMMENT ON COLUMN hkgn.inventory.reserved_qty IS '[예약수량] 예약된 수량';
COMMENT ON COLUMN hkgn.inventory.unit IS '[단위] EA/M2/평/kg';
COMMENT ON COLUMN hkgn.inventory.min_qty IS '[최소재고] 안전 재고 수량';
COMMENT ON COLUMN hkgn.inventory.max_qty IS '[최대재고] 최대 보유 수량';
COMMENT ON COLUMN hkgn.inventory.warehouse_cd IS '[창고코드] 보관 창고 코드';
COMMENT ON COLUMN hkgn.inventory.location IS '[위치] 상세 보관 위치';
COMMENT ON COLUMN hkgn.inventory.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.inventory.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.inventory.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.inventory.updated_by IS '[수정자] 레코드 최종 수정자';
