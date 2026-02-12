-- ============================================
-- 테이블: subcontract_order (외주발주)
-- 설명: 유리 가공 외주 발주 관리 (임가공/강화/에칭/재단 등)
-- 작성일: 2026-02-09
-- 스키마: hkgn
-- 고도화: 외주발주.xlsx 기반 컬럼 추가
--   - 라인순번(line_seq): 같은 발주번호 내 복수 라인 관리
--   - 외주업체명(subcontractor_nm): 업체 코드 외 이름 보관
--   - 현장(site_nm), 위치(location): 납품 현장/동·층 정보
--   - 두께(thickness), 품종(product_type): 유리 규격 정보
--   - 면적(area_m2, area_pyeong): M2/평 단위 면적 관리
--   - 입고 관리: 요청일/실제입고일/변경일/입고처 세분화
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.subcontract_order CASCADE;

-- ============================================
-- subcontract_order (외주발주)
-- ============================================
CREATE TABLE hkgn.subcontract_order (
    -- PK
    id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    subcontract_no        VARCHAR(30)   NOT NULL,                                  -- [외주번호] 외주 발주 문서 번호 (예: HK-230601-01)
    line_seq              INTEGER       NOT NULL DEFAULT 1,                        -- [라인순번] 발주 내 라인 순번 (1, 2, 3, ...)
    subcontract_date      DATE          NOT NULL,                                  -- [외주일] 외주 발주일
    subcontract_type      VARCHAR(30)   NOT NULL DEFAULT 'PROCESSING',            -- [외주구분] PROCESSING:임가공, TEMPERED:강화, ETCHED:에칭, CUTTING:재단

    -- 외주 업체
    subcontractor_cd      VARCHAR(30),                                             -- [외주업체코드] 외주 업체 코드 (→ business_partner.bp_cd)
    subcontractor_nm      VARCHAR(100)  NOT NULL,                                  -- [외주업체명] 외주 업체 이름

    -- 수주 연결
    order_no              VARCHAR(30),                                             -- [수주번호] 연관 수주 번호 (→ sales_order_header.order_no)

    -- 현장 정보
    site_nm               VARCHAR(200),                                            -- [현장명] 납품/시공 현장명
    location              VARCHAR(200),                                            -- [위치] 동·층 등 세부 위치 (예: 1-1차2동1-9층)

    -- 자재/제품 정보
    material_cd           VARCHAR(30),                                             -- [자재코드] 가공 대상 자재 (→ item_master.material_cd)
    material_nm           VARCHAR(200),                                            -- [품명] 유리 구성명 (예: 5CL+12A+5LE)
    product_type          VARCHAR(50),                                             -- [품종] 유리 품종 구분
    thickness             NUMERIC(6,2),                                            -- [두께] 총 두께 (mm)

    -- 수량 및 면적
    order_qty             NUMERIC(12,2) DEFAULT 0,                                 -- [발주수량] 외주 수량
    unit                  VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평
    area_m2               NUMERIC(12,4),                                           -- [면적M2] M2 단위 면적
    area_pyeong           NUMERIC(12,3),                                           -- [면적평수] 평 단위 면적

    -- 금액 정보
    unit_price            NUMERIC(15,2) DEFAULT 0,                                 -- [단가] 단위당 가공비
    total_amount          NUMERIC(15,2) DEFAULT 0,                                 -- [총금액] 총 가공비

    -- 입고 관리
    requested_receipt_date DATE,                                                   -- [입고요청일] 입고 요청일
    actual_receipt_date   DATE,                                                    -- [실제입고일] 실제 입고 완료일
    receipt_changed_date  DATE,                                                    -- [입고변경일] 입고일 변경된 경우
    receipt_location      VARCHAR(100),                                            -- [입고처] 입고 위치 (HK지앤텍 1공장, 현장입고 등)

    -- 진행 상태
    completed_qty         NUMERIC(12,2) DEFAULT 0,                                 -- [완료수량] 가공 완료 수량
    subcontract_status    VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [외주상태] PENDING:대기, PROCESSING:작업중, RECEIVED:입고완료, COMPLETED:완료, CANCELLED:취소

    -- 비고
    remarks               TEXT,                                                    -- [비고] 특이사항

    -- 감사 컬럼
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),          -- [생성일시] 레코드 생성 시각
    updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),          -- [수정일시] 레코드 최종 수정 시각
    created_by            VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,              -- [생성자] 레코드 생성자
    updated_by            VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,              -- [수정자] 레코드 최종 수정자

    -- 제약조건
    CONSTRAINT uq_subcontract_order_line
        UNIQUE (subcontract_no, line_seq)
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_subcontract_no ON hkgn.subcontract_order(subcontract_no);
CREATE INDEX idx_subcontract_date ON hkgn.subcontract_order(subcontract_date);
CREATE INDEX idx_subcontract_type ON hkgn.subcontract_order(subcontract_type);
CREATE INDEX idx_subcontract_contractor ON hkgn.subcontract_order(subcontractor_cd);
CREATE INDEX idx_subcontract_order_no ON hkgn.subcontract_order(order_no);
CREATE INDEX idx_subcontract_site ON hkgn.subcontract_order(site_nm);
CREATE INDEX idx_subcontract_status ON hkgn.subcontract_order(subcontract_status);
CREATE INDEX idx_subcontract_receipt_date ON hkgn.subcontract_order(requested_receipt_date);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.subcontract_order IS '외주 발주 - 임가공/강화/에칭 등 외주 가공 발주 관리';
COMMENT ON COLUMN hkgn.subcontract_order.id IS '[식별자] 기본 키 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.subcontract_order.subcontract_no IS '[외주번호] 외주 발주 문서 번호 (예: HK-230601-01)';
COMMENT ON COLUMN hkgn.subcontract_order.line_seq IS '[라인순번] 발주 내 라인 순번 (1, 2, 3, ...)';
COMMENT ON COLUMN hkgn.subcontract_order.subcontract_date IS '[외주일] 외주 발주일';
COMMENT ON COLUMN hkgn.subcontract_order.subcontract_type IS '[외주구분] PROCESSING:임가공, TEMPERED:강화, ETCHED:에칭, CUTTING:재단';
COMMENT ON COLUMN hkgn.subcontract_order.subcontractor_cd IS '[외주업체코드] 외주 업체 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.subcontract_order.subcontractor_nm IS '[외주업체명] 외주 업체 이름';
COMMENT ON COLUMN hkgn.subcontract_order.order_no IS '[수주번호] 연관 수주 번호 (→ sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.subcontract_order.site_nm IS '[현장명] 납품/시공 현장명';
COMMENT ON COLUMN hkgn.subcontract_order.location IS '[위치] 동·층 등 세부 위치';
COMMENT ON COLUMN hkgn.subcontract_order.material_cd IS '[자재코드] 가공 대상 자재 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.subcontract_order.material_nm IS '[품명] 유리 구성명 (예: 5CL+12A+5LE)';
COMMENT ON COLUMN hkgn.subcontract_order.product_type IS '[품종] 유리 품종 구분';
COMMENT ON COLUMN hkgn.subcontract_order.thickness IS '[두께] 총 두께 (mm)';
COMMENT ON COLUMN hkgn.subcontract_order.order_qty IS '[발주수량] 외주 수량';
COMMENT ON COLUMN hkgn.subcontract_order.unit IS '[단위] EA/M2/평';
COMMENT ON COLUMN hkgn.subcontract_order.area_m2 IS '[면적M2] M2 단위 면적';
COMMENT ON COLUMN hkgn.subcontract_order.area_pyeong IS '[면적평수] 평 단위 면적';
COMMENT ON COLUMN hkgn.subcontract_order.unit_price IS '[단가] 단위당 가공비';
COMMENT ON COLUMN hkgn.subcontract_order.total_amount IS '[총금액] 총 가공비';
COMMENT ON COLUMN hkgn.subcontract_order.requested_receipt_date IS '[입고요청일] 입고 요청일';
COMMENT ON COLUMN hkgn.subcontract_order.actual_receipt_date IS '[실제입고일] 실제 입고 완료일';
COMMENT ON COLUMN hkgn.subcontract_order.receipt_changed_date IS '[입고변경일] 입고일 변경된 경우';
COMMENT ON COLUMN hkgn.subcontract_order.receipt_location IS '[입고처] 입고 위치 (HK지앤텍 1공장, 현장입고 등)';
COMMENT ON COLUMN hkgn.subcontract_order.completed_qty IS '[완료수량] 가공 완료 수량';
COMMENT ON COLUMN hkgn.subcontract_order.subcontract_status IS '[외주상태] PENDING:대기, PROCESSING:작업중, RECEIVED:입고완료, COMPLETED:완료, CANCELLED:취소';
COMMENT ON COLUMN hkgn.subcontract_order.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.subcontract_order.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.subcontract_order.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.subcontract_order.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.subcontract_order.updated_by IS '[수정자] 레코드 최종 수정자';
