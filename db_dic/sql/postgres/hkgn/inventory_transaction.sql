-- ============================================
-- 테이블: inventory_transaction (재고 이동 이력)
-- 설명: 원자재/부자재/용기 입출고 트랜잭션 로그
-- 작성일: 2026-02-09
-- 스키마: hkgn
-- 고도화: 원자재입출고현황.xlsx + 현장별용기입출고현황.xlsx 기반 컬럼 추가
--   - 유리규격(width_mm, height_mm): 원판 사이즈
--   - 면적평수(area_pyeong): 이동 수량 평수 환산
--   - 차량번호(vehicle_no): 용기 출입고 시 차량 정보
--   - 현장정보(site_cd, site_nm): 출입고 현장 정보
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.inventory_transaction CASCADE;

-- ============================================
-- inventory_transaction (재고 이동 이력)
-- ============================================
CREATE TABLE hkgn.inventory_transaction (
    -- PK
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    transaction_no    VARCHAR(30)   NOT NULL,                                  -- [전표번호] 이동 전표 번호
    transaction_date  DATE          NOT NULL,                                  -- [이동일] 이동 일자
    transaction_type  VARCHAR(20)   NOT NULL,                                  -- [이동유형] IN:입고, OUT:출고, ADJUST:조정, MOVE:이동

    -- 자재 정보
    material_cd       VARCHAR(30),                                             -- [자재코드] 이동 자재 코드 (→ item_master.material_cd)
    material_nm       VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 유리 규격 정보 (원판유리 전용)
    width_mm          NUMERIC(10,2),                                           -- [가로규격] 가로 사이즈 (mm)
    height_mm         NUMERIC(10,2),                                           -- [세로규격] 세로 사이즈 (mm)

    -- 수량
    quantity          NUMERIC(12,2) NOT NULL,                                  -- [수량] 이동 수량 (양수:입고, 음수:출고)
    unit              VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/매/M2/평/kg/BOX
    area_pyeong       NUMERIC(12,2),                                           -- [면적평수] 이동 수량 평수 환산 (원판유리 전용)

    -- 이동 전후 재고
    before_qty        NUMERIC(12,2),                                           -- [이동전재고] 이동 전 재고 수량
    after_qty         NUMERIC(12,2),                                           -- [이동후재고] 이동 후 재고 수량

    -- 위치
    from_location     VARCHAR(100),                                            -- [출발위치] 출발 창고/위치
    to_location       VARCHAR(100),                                            -- [도착위치] 도착 창고/위치

    -- 현장/운송 정보
    site_cd           VARCHAR(30),                                             -- [현장코드] 출입고 현장 코드 (→ site_master.site_cd)
    site_nm           VARCHAR(200),                                            -- [현장명] 현장 이름
    vehicle_no        VARCHAR(50),                                             -- [차량번호] 운송 차량 정보

    -- 참조 문서
    ref_doc_type      VARCHAR(20),                                             -- [참조문서유형] PO:발주, SO:수주, PROD:생산, DELIVERY:출하, GR:입고
    ref_doc_no        VARCHAR(30),                                             -- [참조문서번호] 참조 문서 번호

    -- 비고
    remarks           TEXT,                                                    -- [비고] 이동 사유/특이사항

    -- 감사 컬럼
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),          -- [생성일시] 레코드 생성 시각
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),          -- [수정일시] 레코드 최종 수정 시각
    created_by        VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,              -- [생성자] 레코드 생성자
    updated_by        VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER               -- [수정자] 레코드 최종 수정자
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_inventory_transaction_date ON hkgn.inventory_transaction(transaction_date);
CREATE INDEX idx_inventory_transaction_material ON hkgn.inventory_transaction(material_cd);
CREATE INDEX idx_inventory_transaction_type ON hkgn.inventory_transaction(transaction_type);
CREATE INDEX idx_inventory_transaction_ref ON hkgn.inventory_transaction(ref_doc_type, ref_doc_no);
CREATE INDEX idx_inventory_transaction_site ON hkgn.inventory_transaction(site_cd);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.inventory_transaction IS '재고 이동 이력 - 원자재/부자재/용기 입출고 트랜잭션 로그';
COMMENT ON COLUMN hkgn.inventory_transaction.id IS '[식별자] 기본 키 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.inventory_transaction.transaction_no IS '[전표번호] 이동 전표 번호';
COMMENT ON COLUMN hkgn.inventory_transaction.transaction_date IS '[이동일] 이동 일자';
COMMENT ON COLUMN hkgn.inventory_transaction.transaction_type IS '[이동유형] IN:입고, OUT:출고, ADJUST:조정, MOVE:이동';
COMMENT ON COLUMN hkgn.inventory_transaction.material_cd IS '[자재코드] 이동 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.inventory_transaction.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.inventory_transaction.width_mm IS '[가로규격] 가로 사이즈 (mm, 원판유리 전용)';
COMMENT ON COLUMN hkgn.inventory_transaction.height_mm IS '[세로규격] 세로 사이즈 (mm, 원판유리 전용)';
COMMENT ON COLUMN hkgn.inventory_transaction.quantity IS '[수량] 이동 수량 (양수:입고, 음수:출고)';
COMMENT ON COLUMN hkgn.inventory_transaction.unit IS '[단위] EA/매/M2/평/kg/BOX';
COMMENT ON COLUMN hkgn.inventory_transaction.area_pyeong IS '[면적평수] 이동 수량 평수 환산 (원판유리 전용)';
COMMENT ON COLUMN hkgn.inventory_transaction.before_qty IS '[이동전재고] 이동 전 재고 수량';
COMMENT ON COLUMN hkgn.inventory_transaction.after_qty IS '[이동후재고] 이동 후 재고 수량';
COMMENT ON COLUMN hkgn.inventory_transaction.from_location IS '[출발위치] 출발 창고/위치';
COMMENT ON COLUMN hkgn.inventory_transaction.to_location IS '[도착위치] 도착 창고/위치';
COMMENT ON COLUMN hkgn.inventory_transaction.site_cd IS '[현장코드] 출입고 현장 코드 (→ site_master.site_cd)';
COMMENT ON COLUMN hkgn.inventory_transaction.site_nm IS '[현장명] 현장 이름';
COMMENT ON COLUMN hkgn.inventory_transaction.vehicle_no IS '[차량번호] 운송 차량 정보';
COMMENT ON COLUMN hkgn.inventory_transaction.ref_doc_type IS '[참조문서유형] PO:발주, SO:수주, PROD:생산, DELIVERY:출하, GR:입고';
COMMENT ON COLUMN hkgn.inventory_transaction.ref_doc_no IS '[참조문서번호] 참조 문서 번호';
COMMENT ON COLUMN hkgn.inventory_transaction.remarks IS '[비고] 이동 사유/특이사항';
COMMENT ON COLUMN hkgn.inventory_transaction.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.inventory_transaction.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.inventory_transaction.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.inventory_transaction.updated_by IS '[수정자] 레코드 최종 수정자';
