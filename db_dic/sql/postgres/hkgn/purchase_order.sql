-- ============================================
-- 테이블: purchase_order (구매발주)
-- 설명: 원판유리/자재 구매 발주 관리
-- 작성일: 2026-02-09
-- 스키마: hkgn
-- 고도화: 구매발주.xlsx 기반 컬럼 추가
--   - 양식구분(po_type): 원판구매품의서/자재발주서
--   - 구입처명(supplier_nm): 공급사코드 외 이름 보관
--   - 현장명(site_nm): 납품 대상 현장
--   - 수신자/발신자(receiver_nm, sender_nm, sender_dept): 문서 수발신 정보
--   - 도착지(receipt_location): 입고 위치 정보
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.purchase_order CASCADE;

-- ============================================
-- purchase_order (구매발주)
-- ============================================
CREATE TABLE hkgn.purchase_order (
    -- PK
    id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    po_no                 VARCHAR(30)   NOT NULL UNIQUE,                           -- [발주번호] 발주 문서 번호 (예: LX글라스-2602-01, 2026-0204-01)
    po_date               DATE          NOT NULL,                                  -- [발주일] 발주 일자
    po_type               VARCHAR(30)   NOT NULL DEFAULT 'RAW_GLASS',             -- [양식구분] RAW_GLASS:원판구매품의서, MATERIAL:자재발주서

    -- 공급사 정보
    supplier_cd           VARCHAR(30),                                             -- [공급사코드] 공급사 코드 (→ business_partner.bp_cd)
    supplier_nm           VARCHAR(100)  NOT NULL,                                  -- [거래처명] 구입처 이름 (예: LX글라스, 티앤티)

    -- 현장 정보
    site_nm               VARCHAR(200),                                            -- [현장명] 납품 대상 현장 (예: 중흥 평택)

    -- 문서 수발신 정보
    receiver_nm           VARCHAR(100),                                            -- [수신자명] 공급사 담당자
    sender_dept           VARCHAR(200),                                            -- [발신처] 발신 회사/부서 (예: ㈜ 에이치케이 지앤텍)
    sender_nm             VARCHAR(100),                                            -- [발신자명] 발주 담당자 (예: 조하나 과장)

    -- 납기/입고 정보
    delivery_date         DATE,                                                    -- [납기일] 입고 요청일
    receipt_location      VARCHAR(100),                                            -- [입고처] 도착지 (예: HK지앤텍 1공장)

    -- 금액 정보
    total_amount          NUMERIC(15,2) DEFAULT 0,                                 -- [총금액] 발주 총 금액
    tax_amount            NUMERIC(15,2) DEFAULT 0,                                 -- [부가세] 부가세 금액

    -- 상태
    po_status             VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [발주상태] PENDING:대기, CONFIRMED:확정, RECEIVING:입고중, COMPLETED:완료, CANCELLED:취소

    -- 비고
    remarks               TEXT,                                                    -- [비고] 특이사항

    -- 감사 컬럼
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),          -- [생성일시] 레코드 생성 시각
    updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),          -- [수정일시] 레코드 최종 수정 시각
    created_by            VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,              -- [생성자] 레코드 생성자
    updated_by            VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER               -- [수정자] 레코드 최종 수정자
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_purchase_order_po_no ON hkgn.purchase_order(po_no);
CREATE INDEX idx_purchase_order_date ON hkgn.purchase_order(po_date);
CREATE INDEX idx_purchase_order_type ON hkgn.purchase_order(po_type);
CREATE INDEX idx_purchase_order_supplier ON hkgn.purchase_order(supplier_cd);
CREATE INDEX idx_purchase_order_site ON hkgn.purchase_order(site_nm);
CREATE INDEX idx_purchase_order_status ON hkgn.purchase_order(po_status);
CREATE INDEX idx_purchase_order_delivery ON hkgn.purchase_order(delivery_date);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.purchase_order IS '구매발주 - 원판유리/자재 구매 발주 관리';
COMMENT ON COLUMN hkgn.purchase_order.id IS '[식별자] 기본 키 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.purchase_order.po_no IS '[발주번호] 발주 문서 번호 (예: LX글라스-2602-01)';
COMMENT ON COLUMN hkgn.purchase_order.po_date IS '[발주일] 발주 일자';
COMMENT ON COLUMN hkgn.purchase_order.po_type IS '[양식구분] RAW_GLASS:원판구매품의서, MATERIAL:자재발주서';
COMMENT ON COLUMN hkgn.purchase_order.supplier_cd IS '[공급사코드] 공급사 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.purchase_order.supplier_nm IS '[거래처명] 구입처 이름';
COMMENT ON COLUMN hkgn.purchase_order.site_nm IS '[현장명] 납품 대상 현장';
COMMENT ON COLUMN hkgn.purchase_order.receiver_nm IS '[수신자명] 공급사 담당자';
COMMENT ON COLUMN hkgn.purchase_order.sender_dept IS '[발신처] 발신 회사/부서';
COMMENT ON COLUMN hkgn.purchase_order.sender_nm IS '[발신자명] 발주 담당자';
COMMENT ON COLUMN hkgn.purchase_order.delivery_date IS '[납기일] 입고 요청일';
COMMENT ON COLUMN hkgn.purchase_order.receipt_location IS '[입고처] 도착지 (HK지앤텍 1공장 등)';
COMMENT ON COLUMN hkgn.purchase_order.total_amount IS '[총금액] 발주 총 금액';
COMMENT ON COLUMN hkgn.purchase_order.tax_amount IS '[부가세] 부가세 금액';
COMMENT ON COLUMN hkgn.purchase_order.po_status IS '[발주상태] PENDING:대기, CONFIRMED:확정, RECEIVING:입고중, COMPLETED:완료, CANCELLED:취소';
COMMENT ON COLUMN hkgn.purchase_order.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.purchase_order.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.purchase_order.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.purchase_order.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.purchase_order.updated_by IS '[수정자] 레코드 최종 수정자';
