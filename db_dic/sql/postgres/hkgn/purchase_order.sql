-- ============================================
-- 테이블: purchase_order
-- 설명: 발주 헤더 (구매 발주 기본 정보)
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- ============================================

CREATE TABLE hkgn.purchase_order (
    -- PK
    po_no           VARCHAR(30)   PRIMARY KEY,                               -- [발주번호] 발주 문서 번호 (PK)

    -- 기본 정보
    po_date         DATE          NOT NULL,                                  -- [발주일] 발주 일자
    delivery_date   DATE,                                                    -- [납기일] 요청 납기일
    supplier_cd     VARCHAR(30)   NOT NULL,                                  -- [공급사코드] 공급사 코드 (→ business_partner.bp_cd)

    -- 금액 정보
    total_amount    NUMERIC(15,2) DEFAULT 0,                                 -- [총금액] 발주 총 금액
    tax_amount      NUMERIC(15,2) DEFAULT 0,                                 -- [부가세] 부가세 금액
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 상태
    po_status       VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [발주상태] PENDING:대기, CONFIRMED:확정, RECEIVING:입고중, COMPLETED:완료, CANCELLED:취소

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

-- 인덱스
CREATE INDEX idx_purchase_order_date ON hkgn.purchase_order(po_date);
CREATE INDEX idx_purchase_order_supplier ON hkgn.purchase_order(supplier_cd);
CREATE INDEX idx_purchase_order_status ON hkgn.purchase_order(po_status);
CREATE INDEX idx_purchase_order_delivery ON hkgn.purchase_order(delivery_date);

-- 코멘트
COMMENT ON TABLE hkgn.purchase_order IS '발주 헤더 - 구매 발주 기본 정보';
COMMENT ON COLUMN hkgn.purchase_order.po_no IS '[발주번호] 발주 문서 번호 (PK)';
COMMENT ON COLUMN hkgn.purchase_order.po_date IS '[발주일] 발주 일자';
COMMENT ON COLUMN hkgn.purchase_order.delivery_date IS '[납기일] 요청 납기일';
COMMENT ON COLUMN hkgn.purchase_order.supplier_cd IS '[공급사코드] 공급사 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.purchase_order.total_amount IS '[총금액] 발주 총 금액';
COMMENT ON COLUMN hkgn.purchase_order.tax_amount IS '[부가세] 부가세 금액';
COMMENT ON COLUMN hkgn.purchase_order.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.purchase_order.po_status IS '[발주상태] PENDING:대기, CONFIRMED:확정, RECEIVING:입고중, COMPLETED:완료, CANCELLED:취소';
COMMENT ON COLUMN hkgn.purchase_order.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.purchase_order.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.purchase_order.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.purchase_order.updated_by IS '[수정자] 레코드 최종 수정자';
