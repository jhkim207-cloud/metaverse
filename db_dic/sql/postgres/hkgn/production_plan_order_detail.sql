-- ============================================
-- 생산계획-주문상세 매핑 테이블 (production_plan_order_detail)
-- ============================================
-- 설명: 생산계획과 수주상세 간 N:M 매핑 (배정 수량 포함)
-- 참조: production_plan.id, sales_order_detail.id
-- ============================================

CREATE TABLE hkgn.production_plan_order_detail (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- FK
    plan_id                     BIGINT        NOT NULL,                           -- [생산계획ID] 생산계획 ID (production_plan.id 참조)
    detail_id                   BIGINT        NOT NULL,                           -- [주문상세ID] 수주상세 ID (sales_order_detail.id 참조)

    -- 배정 수량
    assigned_quantity           INTEGER       NOT NULL DEFAULT 0,                 -- [배정수량] 해당 계획에 배정된 수량

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER       -- [수정자] 레코드 최종 수정자
);

-- 유니크 제약조건
CREATE UNIQUE INDEX uq_plan_detail ON hkgn.production_plan_order_detail(plan_id, detail_id);

-- 인덱스 생성
CREATE INDEX idx_ppod_plan_id ON hkgn.production_plan_order_detail(plan_id);
CREATE INDEX idx_ppod_detail_id ON hkgn.production_plan_order_detail(detail_id);

-- 코멘트 추가
COMMENT ON TABLE hkgn.production_plan_order_detail IS '생산계획-주문상세 매핑 - N:M 매핑 (배정 수량 포함)';
COMMENT ON COLUMN hkgn.production_plan_order_detail.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.production_plan_order_detail.plan_id IS '생산계획ID - 생산계획 ID (production_plan.id 참조)';
COMMENT ON COLUMN hkgn.production_plan_order_detail.detail_id IS '주문상세ID - 수주상세 ID (sales_order_detail.id 참조)';
COMMENT ON COLUMN hkgn.production_plan_order_detail.assigned_quantity IS '배정수량 - 해당 계획에 배정된 수량';
COMMENT ON COLUMN hkgn.production_plan_order_detail.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.production_plan_order_detail.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.production_plan_order_detail.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.production_plan_order_detail.updated_by IS '수정자 - 레코드 최종 수정자';
