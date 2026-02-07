-- ============================================
-- 테이블: purchase_order_detail
-- 설명: 발주 상세 (구매 발주 품목별 상세)
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- ============================================

CREATE TABLE hkgn.purchase_order_detail (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- FK
    po_no           VARCHAR(30)   NOT NULL,                                  -- [발주번호] 발주 헤더 참조 (→ purchase_order.po_no)
    line_no         INTEGER       NOT NULL,                                  -- [행번호] 발주 품목 순번

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 발주 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량/금액
    order_qty       NUMERIC(12,2) NOT NULL,                                  -- [발주수량] 발주 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평/kg
    unit_price      NUMERIC(12,2) NOT NULL,                                  -- [단가] 개당/단위당 가격
    supply_amount   NUMERIC(15,2) NOT NULL,                                  -- [공급가액] 수량 × 단가
    tax_amount      NUMERIC(15,2) DEFAULT 0,                                 -- [부가세] 부가세 금액

    -- 진행 상태
    received_qty    NUMERIC(12,2) DEFAULT 0,                                 -- [입고수량] 입고 완료 수량
    line_status     VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [행상태] PENDING:대기, CONFIRMED:확정, RECEIVING:입고중, COMPLETED:완료

    -- 비고
    remarks         TEXT,                                                    -- [비고] 품목별 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [수정자] 레코드 최종 수정자

    -- 제약조건
    UNIQUE(po_no, line_no)
);

-- 인덱스
CREATE INDEX idx_purchase_order_detail_po ON hkgn.purchase_order_detail(po_no);
CREATE INDEX idx_purchase_order_detail_material ON hkgn.purchase_order_detail(material_cd);
CREATE INDEX idx_purchase_order_detail_status ON hkgn.purchase_order_detail(line_status);

-- 코멘트
COMMENT ON TABLE hkgn.purchase_order_detail IS '발주 상세 - 구매 발주 품목별 상세';
COMMENT ON COLUMN hkgn.purchase_order_detail.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.purchase_order_detail.po_no IS '[발주번호] 발주 헤더 참조 (→ purchase_order.po_no)';
COMMENT ON COLUMN hkgn.purchase_order_detail.line_no IS '[행번호] 발주 품목 순번';
COMMENT ON COLUMN hkgn.purchase_order_detail.material_cd IS '[자재코드] 발주 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.purchase_order_detail.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.purchase_order_detail.order_qty IS '[발주수량] 발주 수량';
COMMENT ON COLUMN hkgn.purchase_order_detail.unit IS '[단위] EA/M2/평/kg';
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
