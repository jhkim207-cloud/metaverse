-- ============================================
-- 테이블: production_plan_detail
-- 설명: 생산 계획 상세 (품목별 생산 계획)
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- ============================================

CREATE TABLE hkgn.production_plan_detail (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- FK
    plan_no         VARCHAR(30)   NOT NULL,                                  -- [계획번호] 생산 계획 헤더 참조 (→ production_plan.plan_no)
    line_no         INTEGER       NOT NULL,                                  -- [행번호] 계획 품목 순번

    -- 수주 정보
    order_no        VARCHAR(30),                                             -- [수주번호] 연관 수주 번호 (→ sales_order_header.order_no)
    order_line_no   INTEGER,                                                 -- [수주행번호] 연관 수주 상세 행번호

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 생산 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량
    plan_qty        NUMERIC(12,2) NOT NULL,                                  -- [계획수량] 생산 계획 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평/kg
    produced_qty    NUMERIC(12,2) DEFAULT 0,                                 -- [생산수량] 실제 생산 수량

    -- 우선순위
    priority        INTEGER       DEFAULT 0,                                 -- [우선순위] 생산 우선순위 (높을수록 높음)

    -- 비고
    remarks         TEXT,                                                    -- [비고] 품목별 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [수정자] 레코드 최종 수정자

    -- 제약조건
    UNIQUE(plan_no, line_no)
);

-- 인덱스
CREATE INDEX idx_production_plan_detail_plan ON hkgn.production_plan_detail(plan_no);
CREATE INDEX idx_production_plan_detail_order ON hkgn.production_plan_detail(order_no);
CREATE INDEX idx_production_plan_detail_material ON hkgn.production_plan_detail(material_cd);

-- 코멘트
COMMENT ON TABLE hkgn.production_plan_detail IS '생산 계획 상세 - 품목별 생산 계획';
COMMENT ON COLUMN hkgn.production_plan_detail.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.production_plan_detail.plan_no IS '[계획번호] 생산 계획 헤더 참조 (→ production_plan.plan_no)';
COMMENT ON COLUMN hkgn.production_plan_detail.line_no IS '[행번호] 계획 품목 순번';
COMMENT ON COLUMN hkgn.production_plan_detail.order_no IS '[수주번호] 연관 수주 번호 (→ sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.production_plan_detail.order_line_no IS '[수주행번호] 연관 수주 상세 행번호';
COMMENT ON COLUMN hkgn.production_plan_detail.material_cd IS '[자재코드] 생산 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.production_plan_detail.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.production_plan_detail.plan_qty IS '[계획수량] 생산 계획 수량';
COMMENT ON COLUMN hkgn.production_plan_detail.unit IS '[단위] EA/M2/평/kg';
COMMENT ON COLUMN hkgn.production_plan_detail.produced_qty IS '[생산수량] 실제 생산 수량';
COMMENT ON COLUMN hkgn.production_plan_detail.priority IS '[우선순위] 생산 우선순위 (높을수록 높음)';
COMMENT ON COLUMN hkgn.production_plan_detail.remarks IS '[비고] 품목별 특이사항';
COMMENT ON COLUMN hkgn.production_plan_detail.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.production_plan_detail.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.production_plan_detail.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.production_plan_detail.updated_by IS '[수정자] 레코드 최종 수정자';
