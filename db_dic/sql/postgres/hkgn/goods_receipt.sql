-- ============================================
-- 테이블: goods_receipt (입고 실적)
-- 설명: 원부자재 입고 기록 및 품질 검사 관리
-- 작성일: 2026-02-09
-- 스키마: hkgn
-- 고도화: 구매발주입고확인.xlsx 기반 컬럼 추가
--   - 공급사명(supplier_nm): 공급사코드 외 이름 보관
--   - 유리 규격(width_mm, height_mm, frame_count): 원판 사이즈
--   - 면적(area_m2, area_pyeong): M2/평 단위 면적
--   - 금액(unit_price, supply_amount, tax_amount): 입고 시점 가격
--   - 미입고수량(outstanding_qty): 잔여 미입고 수량
--   - 할인(discount_pct): 할인율(%)
--   - 평단가(price_per_pyeong): 평(면적) 기준 단가
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.goods_receipt CASCADE;

-- ============================================
-- goods_receipt (입고 실적)
-- ============================================
CREATE TABLE hkgn.goods_receipt (
    -- PK
    id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    receipt_no            VARCHAR(30)   NOT NULL UNIQUE,                           -- [입고번호] 입고 문서 번호
    receipt_date          DATE          NOT NULL,                                  -- [입고일] 입고 일자

    -- FK (발주 연결)
    po_no                 VARCHAR(30),                                             -- [발주번호] 연관 발주 번호 (→ purchase_order.po_no)
    po_line_seq           INTEGER,                                                 -- [발주라인순번] 연관 발주 상세 라인 (→ purchase_order_detail.line_seq)

    -- 공급사 정보
    supplier_cd           VARCHAR(30),                                             -- [공급사코드] 공급사 코드 (→ business_partner.bp_cd)
    supplier_nm           VARCHAR(100),                                            -- [거래처명] 공급사 이름 (예: LX글라스, 티앤티)

    -- 자재 정보
    material_cd           VARCHAR(30),                                             -- [자재코드] 입고 자재 코드 (→ item_master.material_cd)
    material_nm           VARCHAR(200),                                            -- [품명] 자재/유리 이름 (예: 5T 투명, SWS-16m/m)

    -- 유리 규격 정보
    width_mm              NUMERIC(10,2),                                           -- [가로규격] 가로 사이즈 (mm)
    height_mm             NUMERIC(10,2),                                           -- [세로규격] 세로 사이즈 (mm)
    frame_count           INTEGER,                                                 -- [프레임수] 원판 프레임 수

    -- 수량
    receipt_qty           NUMERIC(12,2) NOT NULL,                                  -- [입고수량] 입고 수량
    outstanding_qty       NUMERIC(12,2) DEFAULT 0,                                 -- [미입고수량] 잔여 미입고 수량
    unit                  VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/매/BOX/M2/평/kg

    -- 면적 정보
    area_m2               NUMERIC(12,4),                                           -- [면적M2] M2 단위 면적
    area_pyeong           NUMERIC(12,3),                                           -- [면적평수] 평 단위 면적

    -- 금액 정보
    unit_price            NUMERIC(12,2) DEFAULT 0,                                 -- [단가] M2 단위 단가 (원/m2)
    price_per_pyeong      NUMERIC(12,2),                                           -- [평단가] 평(면적) 기준 단가 (원/평)
    discount_pct          NUMERIC(5,2),                                            -- [할인율] 할인율 (%)
    supply_amount         NUMERIC(15,2) DEFAULT 0,                                 -- [공급가액] 공급가액
    tax_amount            NUMERIC(15,2) DEFAULT 0,                                 -- [부가세] 세액

    -- 품질 검사
    inspected_qty         NUMERIC(12,2) DEFAULT 0,                                 -- [검사수량] 검사 수량
    passed_qty            NUMERIC(12,2) DEFAULT 0,                                 -- [합격수량] 합격 수량
    rejected_qty          NUMERIC(12,2) DEFAULT 0,                                 -- [불량수량] 불량 수량
    inspection_status     VARCHAR(20)   DEFAULT 'PENDING',                         -- [검사상태] PENDING:대기, PASSED:합격, REJECTED:불합격, PARTIAL:부분합격
    rejection_reason      TEXT,                                                    -- [불량사유] 불량 사유

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
CREATE INDEX idx_goods_receipt_date ON hkgn.goods_receipt(receipt_date);
CREATE INDEX idx_goods_receipt_po ON hkgn.goods_receipt(po_no);
CREATE INDEX idx_goods_receipt_supplier ON hkgn.goods_receipt(supplier_cd);
CREATE INDEX idx_goods_receipt_material ON hkgn.goods_receipt(material_cd);
CREATE INDEX idx_goods_receipt_status ON hkgn.goods_receipt(inspection_status);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.goods_receipt IS '입고 실적 - 원부자재 입고 기록 및 품질 검사 관리';
COMMENT ON COLUMN hkgn.goods_receipt.id IS '[식별자] 기본 키 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.goods_receipt.receipt_no IS '[입고번호] 입고 문서 번호';
COMMENT ON COLUMN hkgn.goods_receipt.receipt_date IS '[입고일] 입고 일자';
COMMENT ON COLUMN hkgn.goods_receipt.po_no IS '[발주번호] 연관 발주 번호 (→ purchase_order.po_no)';
COMMENT ON COLUMN hkgn.goods_receipt.po_line_seq IS '[발주라인순번] 연관 발주 상세 라인 (→ purchase_order_detail.line_seq)';
COMMENT ON COLUMN hkgn.goods_receipt.supplier_cd IS '[공급사코드] 공급사 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.goods_receipt.supplier_nm IS '[거래처명] 공급사 이름';
COMMENT ON COLUMN hkgn.goods_receipt.material_cd IS '[자재코드] 입고 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.goods_receipt.material_nm IS '[품명] 자재/유리 이름';
COMMENT ON COLUMN hkgn.goods_receipt.width_mm IS '[가로규격] 가로 사이즈 (mm)';
COMMENT ON COLUMN hkgn.goods_receipt.height_mm IS '[세로규격] 세로 사이즈 (mm)';
COMMENT ON COLUMN hkgn.goods_receipt.frame_count IS '[프레임수] 원판 프레임 수';
COMMENT ON COLUMN hkgn.goods_receipt.receipt_qty IS '[입고수량] 입고 수량';
COMMENT ON COLUMN hkgn.goods_receipt.outstanding_qty IS '[미입고수량] 잔여 미입고 수량';
COMMENT ON COLUMN hkgn.goods_receipt.unit IS '[단위] EA/매/BOX/M2/평/kg';
COMMENT ON COLUMN hkgn.goods_receipt.area_m2 IS '[면적M2] M2 단위 면적';
COMMENT ON COLUMN hkgn.goods_receipt.area_pyeong IS '[면적평수] 평 단위 면적';
COMMENT ON COLUMN hkgn.goods_receipt.unit_price IS '[단가] M2 단위 단가 (원/m2)';
COMMENT ON COLUMN hkgn.goods_receipt.price_per_pyeong IS '[평단가] 평(면적) 기준 단가 (원/평)';
COMMENT ON COLUMN hkgn.goods_receipt.discount_pct IS '[할인율] 할인율 (%)';
COMMENT ON COLUMN hkgn.goods_receipt.supply_amount IS '[공급가액] 공급가액';
COMMENT ON COLUMN hkgn.goods_receipt.tax_amount IS '[부가세] 세액';
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
