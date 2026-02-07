-- ============================================
-- 테이블: subcontract_order
-- 설명: 외주 발주 (강화/에칭 등 외주 가공 발주)
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- ============================================

CREATE TABLE hkgn.subcontract_order (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    subcontract_no  VARCHAR(30)   NOT NULL UNIQUE,                           -- [외주번호] 외주 발주 문서 번호
    subcontract_date DATE         NOT NULL,                                  -- [외주일] 외주 발주일
    delivery_date   DATE,                                                    -- [납기일] 요청 납기일

    -- 외주 업체
    subcontractor_cd VARCHAR(30)  NOT NULL,                                  -- [외주업체코드] 외주 업체 코드 (→ business_partner.bp_cd)
    work_type       VARCHAR(30)   NOT NULL,                                  -- [작업구분] TEMPERED:강화, ETCHED:에칭, CUTTING:재단

    -- FK
    order_no        VARCHAR(30),                                             -- [수주번호] 연관 수주 번호 (→ sales_order_header.order_no)

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 가공 대상 자재 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량/금액
    order_qty       NUMERIC(12,2) NOT NULL,                                  -- [발주수량] 외주 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평
    unit_price      NUMERIC(12,2),                                           -- [단가] 개당/단위당 가공비
    total_amount    NUMERIC(15,2),                                           -- [총금액] 총 가공비

    -- 진행 상태
    completed_qty   NUMERIC(12,2) DEFAULT 0,                                 -- [완료수량] 가공 완료 수량
    subcontract_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',               -- [외주상태] PENDING:대기, PROCESSING:작업중, COMPLETED:완료, CANCELLED:취소

    -- 비고
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

-- 인덱스
CREATE INDEX idx_subcontract_order_date ON hkgn.subcontract_order(subcontract_date);
CREATE INDEX idx_subcontract_order_contractor ON hkgn.subcontract_order(subcontractor_cd);
CREATE INDEX idx_subcontract_order_work_type ON hkgn.subcontract_order(work_type);
CREATE INDEX idx_subcontract_order_order ON hkgn.subcontract_order(order_no);
CREATE INDEX idx_subcontract_order_status ON hkgn.subcontract_order(subcontract_status);

-- 코멘트
COMMENT ON TABLE hkgn.subcontract_order IS '외주 발주 - 강화/에칭 등 외주 가공 발주';
COMMENT ON COLUMN hkgn.subcontract_order.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.subcontract_order.subcontract_no IS '[외주번호] 외주 발주 문서 번호';
COMMENT ON COLUMN hkgn.subcontract_order.subcontract_date IS '[외주일] 외주 발주일';
COMMENT ON COLUMN hkgn.subcontract_order.delivery_date IS '[납기일] 요청 납기일';
COMMENT ON COLUMN hkgn.subcontract_order.subcontractor_cd IS '[외주업체코드] 외주 업체 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.subcontract_order.work_type IS '[작업구분] TEMPERED:강화, ETCHED:에칭, CUTTING:재단';
COMMENT ON COLUMN hkgn.subcontract_order.order_no IS '[수주번호] 연관 수주 번호 (→ sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.subcontract_order.material_cd IS '[자재코드] 가공 대상 자재 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.subcontract_order.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.subcontract_order.order_qty IS '[발주수량] 외주 수량';
COMMENT ON COLUMN hkgn.subcontract_order.unit IS '[단위] EA/M2/평';
COMMENT ON COLUMN hkgn.subcontract_order.unit_price IS '[단가] 개당/단위당 가공비';
COMMENT ON COLUMN hkgn.subcontract_order.total_amount IS '[총금액] 총 가공비';
COMMENT ON COLUMN hkgn.subcontract_order.completed_qty IS '[완료수량] 가공 완료 수량';
COMMENT ON COLUMN hkgn.subcontract_order.subcontract_status IS '[외주상태] PENDING:대기, PROCESSING:작업중, COMPLETED:완료, CANCELLED:취소';
COMMENT ON COLUMN hkgn.subcontract_order.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.subcontract_order.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.subcontract_order.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.subcontract_order.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.subcontract_order.updated_by IS '[수정자] 레코드 최종 수정자';
