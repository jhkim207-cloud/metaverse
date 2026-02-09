-- ============================================
-- 생산 실적 테이블 (production_result)
-- ============================================
-- 설명: 생산 완료 기록 (양품, 불량, 면적 포함)
-- 참조: db_dic/dictionary/standards.json
-- ============================================

CREATE TABLE hkgn.production_result (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- 기본 정보
    production_no               VARCHAR(30)   NOT NULL UNIQUE,                    -- [생산번호] 생산 실적 문서 번호
    production_date             DATE          NOT NULL,                           -- [생산일] 생산 완료일

    -- FK (선택적 참조)
    plan_no                     VARCHAR(50)   NULL,                               -- [계획번호] 생산 계획 번호 (production_plan.plan_no 참조)
    plan_line_no                INTEGER       NULL,                               -- [계획행번호] 생산 계획 상세 행번호
    order_no                    VARCHAR(30)   NULL,                               -- [수주번호] 연관 수주 번호 (sales_order_header.order_no)
    work_request_no             VARCHAR(50)   NULL,                               -- [작업의뢰번호] 작업 의뢰 번호 (work_request.request_no 참조)

    -- 자재 정보
    material_cd                 VARCHAR(30)   NOT NULL,                           -- [자재코드] 생산 자재 코드 (item_master.material_cd)
    material_nm                 VARCHAR(200)  NULL,                               -- [자재명] 자재 이름 (참조용)

    -- 수량
    good_qty                    NUMERIC(12,2) NOT NULL DEFAULT 0,                 -- [양품수량] 양품 수량
    defect_qty                  NUMERIC(12,2) NULL DEFAULT 0,                     -- [불량수량] 불량 수량
    total_qty                   NUMERIC(12,2) NOT NULL,                           -- [총수량] 총 생산 수량 (양품 + 불량)
    unit                        VARCHAR(10)   NULL DEFAULT 'EA',                  -- [단위] EA/M2/평/kg

    -- 면적 (추가)
    good_area                   NUMERIC(10,3) NULL DEFAULT 0,                     -- [양품면적] 양품 면적 (평수)
    defect_area                 NUMERIC(10,3) NULL DEFAULT 0,                     -- [불량면적] 불량 면적 (평수)
    total_area                  NUMERIC(10,3) NULL,                               -- [총면적] 총 생산 면적 (양품 + 불량)

    -- 작업자 정보
    worker_cd                   VARCHAR(30)   NULL,                               -- [작업자코드] 생산 담당자 (worker.worker_cd)

    -- 비고
    defect_reason               TEXT          NULL,                               -- [불량사유] 불량 발생 사유
    remarks                     TEXT          NULL,                               -- [비고] 실적 특이사항

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER       -- [수정자] 레코드 최종 수정자
);

-- 인덱스 생성
CREATE INDEX idx_production_result_date ON hkgn.production_result(production_date);
CREATE INDEX idx_production_result_plan ON hkgn.production_result(plan_no);
CREATE INDEX idx_production_result_order ON hkgn.production_result(order_no);
CREATE INDEX idx_production_result_material ON hkgn.production_result(material_cd);
CREATE INDEX idx_production_result_worker ON hkgn.production_result(worker_cd);

-- 코멘트 추가
COMMENT ON TABLE hkgn.production_result IS '생산 실적 - 생산 완료 기록 (양품, 불량, 면적 포함)';
COMMENT ON COLUMN hkgn.production_result.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.production_result.production_no IS '생산번호 - 생산 실적 문서 번호';
COMMENT ON COLUMN hkgn.production_result.production_date IS '생산일 - 생산 완료일';
COMMENT ON COLUMN hkgn.production_result.plan_no IS '계획번호 - 생산 계획 번호 (production_plan.plan_no 참조)';
COMMENT ON COLUMN hkgn.production_result.plan_line_no IS '계획행번호 - 생산 계획 상세 행번호';
COMMENT ON COLUMN hkgn.production_result.order_no IS '수주번호 - 연관 수주 번호 (sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.production_result.work_request_no IS '작업의뢰번호 - 작업 의뢰 번호 (work_request.request_no 참조)';
COMMENT ON COLUMN hkgn.production_result.material_cd IS '자재코드 - 생산 자재 코드 (item_master.material_cd)';
COMMENT ON COLUMN hkgn.production_result.material_nm IS '자재명 - 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.production_result.good_qty IS '양품수량 - 양품 수량';
COMMENT ON COLUMN hkgn.production_result.defect_qty IS '불량수량 - 불량 수량';
COMMENT ON COLUMN hkgn.production_result.total_qty IS '총수량 - 총 생산 수량 (양품 + 불량)';
COMMENT ON COLUMN hkgn.production_result.unit IS '단위 - EA/M2/평/kg';
COMMENT ON COLUMN hkgn.production_result.good_area IS '양품면적 - 양품 면적 (평수)';
COMMENT ON COLUMN hkgn.production_result.defect_area IS '불량면적 - 불량 면적 (평수)';
COMMENT ON COLUMN hkgn.production_result.total_area IS '총면적 - 총 생산 면적 (양품 + 불량)';
COMMENT ON COLUMN hkgn.production_result.worker_cd IS '작업자코드 - 생산 담당자 (worker.worker_cd)';
COMMENT ON COLUMN hkgn.production_result.defect_reason IS '불량사유 - 불량 발생 사유';
COMMENT ON COLUMN hkgn.production_result.remarks IS '비고 - 실적 특이사항';
COMMENT ON COLUMN hkgn.production_result.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.production_result.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.production_result.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.production_result.updated_by IS '수정자 - 레코드 최종 수정자';
