-- ============================================
-- 테이블: purchase_order_detail (구매발주 상세)
-- 설명: 구매 발주 품목별 상세 (유리 규격/면적 포함)
-- 작성일: 2026-02-09
-- 스키마: hkgn
-- 고도화: 구매발주.xlsx 기반 컬럼 추가
--   - 사이즈(width_mm, height_mm): 유리 가로/세로 규격
--   - 프레임(frame_count): 원판 프레임 수
--   - 평수(area_pyeong): 면적(평) 계산값
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.purchase_order_detail CASCADE;

-- ============================================
-- purchase_order_detail (구매발주 상세)
-- ============================================
CREATE TABLE hkgn.purchase_order_detail (
    -- PK
    id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- FK
    po_no                 VARCHAR(30)   NOT NULL,                                  -- [발주번호] 발주 헤더 참조 (→ purchase_order.po_no)
    line_seq              INTEGER       NOT NULL DEFAULT 1,                        -- [라인순번] 발주 품목 순번 (1, 2, 3, ...)

    -- 자재 정보
    material_cd           VARCHAR(30),                                             -- [자재코드] 발주 자재 코드 (→ item_master.material_cd)
    material_nm           VARCHAR(200)  NOT NULL,                                  -- [품명] 자재/유리 이름 (예: 5T 투명, SWS-16m/m)

    -- 유리 규격 정보
    width_mm              NUMERIC(10,2),                                           -- [가로규격] 가로 사이즈 (mm)
    height_mm             NUMERIC(10,2),                                           -- [세로규격] 세로 사이즈 (mm)
    frame_count           INTEGER,                                                 -- [프레임수] 원판 프레임 수

    -- 수량/면적
    order_qty             NUMERIC(12,2) NOT NULL,                                  -- [발주수량] 발주 수량
    unit                  VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/매/BOX/M2/평/kg
    area_pyeong           NUMERIC(12,2),                                           -- [면적평수] 평 단위 면적

    -- 금액 정보
    unit_price            NUMERIC(12,2) DEFAULT 0,                                 -- [단가] 개당/단위당 가격
    supply_amount         NUMERIC(15,2) DEFAULT 0,                                 -- [공급가액] 수량 × 단가
    tax_amount            NUMERIC(15,2) DEFAULT 0,                                 -- [부가세] 부가세 금액

    -- 진행 상태
    received_qty          NUMERIC(12,2) DEFAULT 0,                                 -- [입고수량] 입고 완료 수량
    line_status           VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [행상태] PENDING:대기, CONFIRMED:확정, RECEIVING:입고중, COMPLETED:완료

    -- 비고
    remarks               TEXT,                                                    -- [비고] 품목별 특이사항

    -- 감사 컬럼
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),          -- [생성일시] 레코드 생성 시각
    updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),          -- [수정일시] 레코드 최종 수정 시각
    created_by            VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,              -- [생성자] 레코드 생성자
    updated_by            VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,              -- [수정자] 레코드 최종 수정자

    -- 제약조건
    CONSTRAINT uq_purchase_order_detail_line
        UNIQUE (po_no, line_seq)
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_po_detail_po_no ON hkgn.purchase_order_detail(po_no);
CREATE INDEX idx_po_detail_material ON hkgn.purchase_order_detail(material_cd);
CREATE INDEX idx_po_detail_status ON hkgn.purchase_order_detail(line_status);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.purchase_order_detail IS '구매발주 상세 - 품목별 유리/자재 발주 상세';
COMMENT ON COLUMN hkgn.purchase_order_detail.id IS '[식별자] 기본 키 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.purchase_order_detail.po_no IS '[발주번호] 발주 헤더 참조 (→ purchase_order.po_no)';
COMMENT ON COLUMN hkgn.purchase_order_detail.line_seq IS '[라인순번] 발주 품목 순번 (1, 2, 3, ...)';
COMMENT ON COLUMN hkgn.purchase_order_detail.material_cd IS '[자재코드] 발주 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.purchase_order_detail.material_nm IS '[품명] 자재/유리 이름';
COMMENT ON COLUMN hkgn.purchase_order_detail.width_mm IS '[가로규격] 가로 사이즈 (mm)';
COMMENT ON COLUMN hkgn.purchase_order_detail.height_mm IS '[세로규격] 세로 사이즈 (mm)';
COMMENT ON COLUMN hkgn.purchase_order_detail.frame_count IS '[프레임수] 원판 프레임 수';
COMMENT ON COLUMN hkgn.purchase_order_detail.order_qty IS '[발주수량] 발주 수량';
COMMENT ON COLUMN hkgn.purchase_order_detail.unit IS '[단위] EA/매/BOX/M2/평/kg';
COMMENT ON COLUMN hkgn.purchase_order_detail.area_pyeong IS '[면적평수] 평 단위 면적';
COMMENT ON COLUMN hkgn.purchase_order_detail.unit_price IS '[단가] 개당/단위당 가격';
COMMENT ON COLUMN hkgn.purchase_order_detail.supply_amount IS '[공급가액] 수량 × 단가';
COMMENT ON COLUMN hkgn.purchase_order_detail.tax_amount IS '[부가세] 부가세 금액';
COMMENT ON COLUMN hkgn.purchase_order_detail.received_qty IS '[입고수량] 입고 완료 수량';
COMMENT ON COLUMN hkgn.purchase_order_detail.line_status IS '[행상태] PENDING:대기, CONFIRMED:확정, RECEIVING:입고중, COMPLETED:완료';
COMMENT ON COLUMN hkgn.purchase_order_detail.remarks IS '[비고] 품목별 특이사항';
COMMENT ON COLUMN hkgn.purchase_order_detail.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.purchase_order_detail.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.purchase_order_detail.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.purchase_order_detail.updated_by IS '[수정자] 레코드 최종 수정자';
