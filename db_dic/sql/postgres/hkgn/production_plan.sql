-- ============================================
-- 생산 계획 테이블 (production_plan)
-- ============================================
-- 설명: 주간 생산 계획 마스터 데이터
-- 참조: db_dic/dictionary/standards.json (production_plan 섹션)
-- ============================================

CREATE TABLE hkgn.production_plan (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- 계획 정보
    plan_no                     VARCHAR(50)   NOT NULL UNIQUE,                    -- [작지번호] 작업 지시 번호 (생산 계획 번호)
    production_date             DATE          NULL,                               -- [생산일자] 생산 예정 일자
    machine_no                  VARCHAR(100)  NULL,                               -- [호기] 생산 설비 호기 (예: 복층1호기)
    category                    VARCHAR(50)   NULL,                               -- [구분] 구분 (공사, 일반 등)

    -- 거래처/현장 정보
    customer_nm                 VARCHAR(200)  NULL,                               -- [거래처명] 거래처 이름
    site_nm                     VARCHAR(200)  NULL,                               -- [현장명] 현장 이름
    location                    VARCHAR(200)  NULL,                               -- [위치] 설치 위치

    -- 제품 정보
    thickness                   INTEGER       NULL,                               -- [두께] 두께 (mm)
    product_type                VARCHAR(50)   NULL,                               -- [품종] 제품 품종 (예: A종, B종, C종)
    material_nm                 VARCHAR(200)  NULL,                               -- [품명] 품명

    -- 수량 정보
    quantity                    INTEGER       NULL DEFAULT 0,                     -- [수량] 총 수량
    area                        NUMERIC(10,3) NULL,                               -- [평수] 총 평수

    -- 옵션 및 특이사항
    options                     TEXT          NULL,                               -- [옵션및특이사항] 옵션 및 특이사항

    -- 생산 진행 상황
    completed_quantity          INTEGER       NULL DEFAULT 0,                     -- [생산완료수량] 생산 완료 수량
    completed_area              NUMERIC(10,3) NULL,                               -- [생산완료평수] 생산 완료 평수
    defect_quantity             INTEGER       NULL DEFAULT 0,                     -- [불량분수량] 불량품 수량
    defect_area                 NUMERIC(10,3) NULL,                               -- [불량분평수] 불량품 평수
    pending_quantity            INTEGER       NULL DEFAULT 0,                     -- [미생산수량] 미생산 수량
    pending_area                NUMERIC(10,3) NULL,                               -- [미생산평수] 미생산 평수

    -- 일정 정보
    shipping_date               VARCHAR(50)   NULL,                               -- [상차예정일] 상차 예정일

    -- 금액 정보
    unit_price                  NUMERIC(15,2) NULL,                               -- [단가] 단가
    amount                      NUMERIC(15,2) NULL,                               -- [금액] 총 금액

    -- 비고
    remarks                     TEXT          NULL,                               -- [비고] 비고

    -- 작업 의뢰 연결
    work_request_no             VARCHAR(50)   NULL,                               -- [작업의뢰번호] 작업 의뢰 번호 (work_request.request_no 참조)

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER       -- [수정자] 레코드 최종 수정자
);

-- 인덱스 생성
CREATE INDEX idx_production_plan_plan_no ON hkgn.production_plan(plan_no);
CREATE INDEX idx_production_plan_production_date ON hkgn.production_plan(production_date);
CREATE INDEX idx_production_plan_customer_nm ON hkgn.production_plan(customer_nm);
CREATE INDEX idx_production_plan_work_request_no ON hkgn.production_plan(work_request_no);

-- 외래키 제약조건 (선택적)
-- work_request 테이블이 존재하는 경우 활성화
-- ALTER TABLE hkgn.production_plan
-- ADD CONSTRAINT fk_production_plan_work_request
-- FOREIGN KEY (work_request_no) REFERENCES hkgn.work_request(request_no);

-- 코멘트 추가
COMMENT ON TABLE hkgn.production_plan IS '생산 계획 정보';
COMMENT ON COLUMN hkgn.production_plan.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.production_plan.plan_no IS '작지번호 - 작업 지시 번호 (생산 계획 번호)';
COMMENT ON COLUMN hkgn.production_plan.production_date IS '생산일자 - 생산 예정 일자';
COMMENT ON COLUMN hkgn.production_plan.machine_no IS '호기 - 생산 설비 호기 (예: 복층1호기)';
COMMENT ON COLUMN hkgn.production_plan.category IS '구분 - 구분 (공사, 일반 등)';
COMMENT ON COLUMN hkgn.production_plan.customer_nm IS '거래처명 - 거래처 이름';
COMMENT ON COLUMN hkgn.production_plan.site_nm IS '현장명 - 현장 이름';
COMMENT ON COLUMN hkgn.production_plan.location IS '위치 - 설치 위치';
COMMENT ON COLUMN hkgn.production_plan.thickness IS '두께 - 두께 (mm)';
COMMENT ON COLUMN hkgn.production_plan.product_type IS '품종 - 제품 품종 (예: A종, B종, C종)';
COMMENT ON COLUMN hkgn.production_plan.material_nm IS '품명 - 품명';
COMMENT ON COLUMN hkgn.production_plan.quantity IS '수량 - 총 수량';
COMMENT ON COLUMN hkgn.production_plan.area IS '평수 - 총 평수';
COMMENT ON COLUMN hkgn.production_plan.options IS '옵션및특이사항 - 옵션 및 특이사항';
COMMENT ON COLUMN hkgn.production_plan.completed_quantity IS '생산완료수량 - 생산 완료 수량';
COMMENT ON COLUMN hkgn.production_plan.completed_area IS '생산완료평수 - 생산 완료 평수';
COMMENT ON COLUMN hkgn.production_plan.defect_quantity IS '불량분수량 - 불량품 수량';
COMMENT ON COLUMN hkgn.production_plan.defect_area IS '불량분평수 - 불량품 평수';
COMMENT ON COLUMN hkgn.production_plan.pending_quantity IS '미생산수량 - 미생산 수량';
COMMENT ON COLUMN hkgn.production_plan.pending_area IS '미생산평수 - 미생산 평수';
COMMENT ON COLUMN hkgn.production_plan.shipping_date IS '상차예정일 - 상차 예정일';
COMMENT ON COLUMN hkgn.production_plan.unit_price IS '단가 - 단가';
COMMENT ON COLUMN hkgn.production_plan.amount IS '금액 - 총 금액';
COMMENT ON COLUMN hkgn.production_plan.remarks IS '비고 - 비고';
COMMENT ON COLUMN hkgn.production_plan.work_request_no IS '작업의뢰번호 - 작업 의뢰 번호 (work_request.request_no 참조)';
COMMENT ON COLUMN hkgn.production_plan.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.production_plan.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.production_plan.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.production_plan.updated_by IS '수정자 - 레코드 최종 수정자';
