-- ============================================
-- 테이블: inventory (재고 현황)
-- 설명: 자재별 재고 수량 관리 (원판유리 + 부자재)
-- 작성일: 2026-02-09
-- 스키마: hkgn
-- 고도화: 원자재입출고현황.xlsx 기반 컬럼 추가
--   - 재고유형(inventory_type): 원판유리/부자재 구분
--   - 유리규격(width_mm, height_mm): 원판 사이즈
--   - 면적평수(area_pyeong): 현재고 평수 환산
--   - 공급사(supplier_cd, supplier_nm): 주 공급사 정보
--   - 기준일(snapshot_date): 재고 스냅샷 기준일
--   - material_cd: UNIQUE → NOT NULL 변경 (item_master.material_cd 참조)
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.inventory CASCADE;

-- ============================================
-- inventory (재고 현황)
-- ============================================
CREATE TABLE hkgn.inventory (
    -- PK
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 재고 구분
    inventory_type    VARCHAR(20)   NOT NULL,                                  -- [재고유형] → item_master.category 값 (원판/부자재/운반용기/강화유리/에칭유리/복층유리)

    -- 자재 정보
    material_cd       VARCHAR(30)   NOT NULL,                                  -- [자재코드] 재고 자재 코드 (→ item_master.material_cd)
    material_nm       VARCHAR(200)  NOT NULL,                                  -- [자재명] 자재 이름 (예: 투명 5T, SWS-16m/m)

    -- 유리 규격 정보 (원판유리 전용)
    width_mm          NUMERIC(10,2),                                           -- [가로규격] 가로 사이즈 (mm)
    height_mm         NUMERIC(10,2),                                           -- [세로규격] 세로 사이즈 (mm)

    -- 수량 정보
    current_qty       NUMERIC(12,2) NOT NULL DEFAULT 0,                        -- [현재고] 현재 재고 수량
    available_qty     NUMERIC(12,2) NOT NULL DEFAULT 0,                        -- [가용재고] 가용 재고 (현재고 - 예약)
    reserved_qty      NUMERIC(12,2) DEFAULT 0,                                 -- [예약수량] 예약된 수량
    unit              VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/매/M2/평/kg/BOX
    area_pyeong       NUMERIC(12,3),                                           -- [면적평수] 현재고 평수 환산 (원판유리 전용)

    -- 재고 기준
    min_qty           NUMERIC(12,2) DEFAULT 0,                                 -- [최소재고] 안전 재고 수량
    max_qty           NUMERIC(12,2) DEFAULT 0,                                 -- [최대재고] 최대 보유 수량

    -- 공급사 정보
    supplier_cd       VARCHAR(30),                                             -- [공급사코드] 주 공급사 코드 (→ business_partner.bp_cd)
    supplier_nm       VARCHAR(100),                                            -- [거래처명] 주 공급사 이름

    -- 위치
    warehouse_cd      VARCHAR(30),                                             -- [창고코드] 보관 창고 코드
    location          VARCHAR(100),                                            -- [위치] 상세 보관 위치

    -- 기준일
    snapshot_date     DATE,                                                    -- [기준일] 재고 스냅샷 기준일

    -- 감사 컬럼
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),          -- [생성일시] 레코드 생성 시각
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),          -- [수정일시] 레코드 최종 수정 시각
    created_by        VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,              -- [생성자] 레코드 생성자
    updated_by        VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER               -- [수정자] 레코드 최종 수정자
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_inventory_material ON hkgn.inventory(material_cd);
CREATE INDEX idx_inventory_type ON hkgn.inventory(inventory_type);
CREATE INDEX idx_inventory_warehouse ON hkgn.inventory(warehouse_cd);
CREATE INDEX idx_inventory_material_nm ON hkgn.inventory(material_nm);
CREATE INDEX idx_inventory_supplier ON hkgn.inventory(supplier_cd);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.inventory IS '재고 현황 - 자재별 재고 수량 관리 (원판유리 + 부자재)';
COMMENT ON COLUMN hkgn.inventory.id IS '[식별자] 기본 키 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.inventory.inventory_type IS '[재고유형] → item_master.category 값 (원판/부자재/운반용기/강화유리/에칭유리/복층유리)';
COMMENT ON COLUMN hkgn.inventory.material_cd IS '[자재코드] 재고 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.inventory.material_nm IS '[자재명] 자재 이름 (예: 투명 5T, SWS-16m/m)';
COMMENT ON COLUMN hkgn.inventory.width_mm IS '[가로규격] 가로 사이즈 (mm, 원판유리 전용)';
COMMENT ON COLUMN hkgn.inventory.height_mm IS '[세로규격] 세로 사이즈 (mm, 원판유리 전용)';
COMMENT ON COLUMN hkgn.inventory.current_qty IS '[현재고] 현재 재고 수량';
COMMENT ON COLUMN hkgn.inventory.available_qty IS '[가용재고] 가용 재고 (현재고 - 예약)';
COMMENT ON COLUMN hkgn.inventory.reserved_qty IS '[예약수량] 예약된 수량';
COMMENT ON COLUMN hkgn.inventory.unit IS '[단위] EA/매/M2/평/kg/BOX';
COMMENT ON COLUMN hkgn.inventory.area_pyeong IS '[면적평수] 현재고 평수 환산 (원판유리 전용)';
COMMENT ON COLUMN hkgn.inventory.min_qty IS '[최소재고] 안전 재고 수량';
COMMENT ON COLUMN hkgn.inventory.max_qty IS '[최대재고] 최대 보유 수량';
COMMENT ON COLUMN hkgn.inventory.supplier_cd IS '[공급사코드] 주 공급사 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.inventory.supplier_nm IS '[거래처명] 주 공급사 이름';
COMMENT ON COLUMN hkgn.inventory.warehouse_cd IS '[창고코드] 보관 창고 코드';
COMMENT ON COLUMN hkgn.inventory.location IS '[위치] 상세 보관 위치';
COMMENT ON COLUMN hkgn.inventory.snapshot_date IS '[기준일] 재고 스냅샷 기준일';
COMMENT ON COLUMN hkgn.inventory.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.inventory.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.inventory.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.inventory.updated_by IS '[수정자] 레코드 최종 수정자';
