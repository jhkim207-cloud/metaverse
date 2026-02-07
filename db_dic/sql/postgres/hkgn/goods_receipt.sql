-- ============================================
-- 테이블: goods_receipt
-- 설명: 입고 실적 (자재 입고 기록)
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- ============================================

CREATE TABLE hkgn.goods_receipt (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    receipt_no      VARCHAR(30)   NOT NULL UNIQUE,                           -- [입고번호] 입고 문서 번호
    receipt_date    DATE          NOT NULL,                                  -- [입고일] 입고 일자

    -- FK
    po_no           VARCHAR(30),                                             -- [발주번호] 연관 발주 번호 (→ purchase_order.po_no)
    po_line_no      INTEGER,                                                 -- [발주행번호] 연관 발주 상세 행번호
    supplier_cd     VARCHAR(30)   NOT NULL,                                  -- [공급사코드] 공급사 코드 (→ business_partner.bp_cd)

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 입고 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량
    receipt_qty     NUMERIC(12,2) NOT NULL,                                  -- [입고수량] 입고 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평/kg

    -- 품질 검사
    inspected_qty   NUMERIC(12,2) DEFAULT 0,                                 -- [검사수량] 검사 수량
    passed_qty      NUMERIC(12,2) DEFAULT 0,                                 -- [합격수량] 합격 수량
    rejected_qty    NUMERIC(12,2) DEFAULT 0,                                 -- [불량수량] 불량 수량
    inspection_status VARCHAR(20) DEFAULT 'PENDING',                         -- [검사상태] PENDING:대기, PASSED:합격, REJECTED:불합격, PARTIAL:부분합격

    -- 비고
    rejection_reason TEXT,                                                   -- [불량사유] 불량 사유
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

-- 인덱스
CREATE INDEX idx_goods_receipt_date ON hkgn.goods_receipt(receipt_date);
CREATE INDEX idx_goods_receipt_po ON hkgn.goods_receipt(po_no);
CREATE INDEX idx_goods_receipt_supplier ON hkgn.goods_receipt(supplier_cd);
CREATE INDEX idx_goods_receipt_material ON hkgn.goods_receipt(material_cd);

-- 코멘트
COMMENT ON TABLE hkgn.goods_receipt IS '입고 실적 - 자재 입고 기록';
COMMENT ON COLUMN hkgn.goods_receipt.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.goods_receipt.receipt_no IS '[입고번호] 입고 문서 번호';
COMMENT ON COLUMN hkgn.goods_receipt.receipt_date IS '[입고일] 입고 일자';
COMMENT ON COLUMN hkgn.goods_receipt.po_no IS '[발주번호] 연관 발주 번호 (→ purchase_order.po_no)';
COMMENT ON COLUMN hkgn.goods_receipt.po_line_no IS '[발주행번호] 연관 발주 상세 행번호';
COMMENT ON COLUMN hkgn.goods_receipt.supplier_cd IS '[공급사코드] 공급사 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.goods_receipt.material_cd IS '[자재코드] 입고 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.goods_receipt.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.goods_receipt.receipt_qty IS '[입고수량] 입고 수량';
COMMENT ON COLUMN hkgn.goods_receipt.unit IS '[단위] EA/M2/평/kg';
COMMENT ON COLUMN hkgn.goods_receipt.inspected_qty IS '[검사수량] 검사 수량';
COMMENT ON COLUMN hkgn.goods_receipt.passed_qty IS '[합격수량] 합격 수량';
COMMENT ON COLUMN hkgn.goods_receipt.rejected_qty IS '[불량수량] 불량 수량';
COMMENT ON COLUMN hkgn.goods_receipt.inspection_status IS '[검사상태] PENDING:대기, PASSED:합격, REJECTED:불합격, PARTIAL:부분합격';
COMMENT ON COLUMN hkgn.goods_receipt.rejection_reason IS '[불량사유] 불량 사유';
COMMENT ON COLUMN hkgn.goods_receipt.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.goods_receipt.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.goods_receipt.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.goods_receipt.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.goods_receipt.updated_by IS '[수정자] 레코드 최종 수정자';
