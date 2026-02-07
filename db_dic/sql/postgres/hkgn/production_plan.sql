-- ============================================
-- 테이블: production_plan
-- 설명: 생산 계획 헤더 (일일 생산 계획)
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- ============================================

CREATE TABLE hkgn.production_plan (
    -- PK
    plan_no         VARCHAR(30)   PRIMARY KEY,                               -- [계획번호] 생산 계획 번호 (PK)

    -- 기본 정보
    plan_date       DATE          NOT NULL,                                  -- [계획일] 생산 계획 일자
    plan_type       VARCHAR(20)   NOT NULL DEFAULT 'DAILY',                  -- [계획유형] DAILY:일일, WEEKLY:주간, MONTHLY:월간

    -- 상태
    plan_status     VARCHAR(20)   NOT NULL DEFAULT 'DRAFT',                  -- [계획상태] DRAFT:작성중, CONFIRMED:확정, PROCESSING:진행중, COMPLETED:완료
    confirmed_at    TIMESTAMP WITH TIME ZONE,                                -- [확정일시] 계획 확정 시각
    confirmed_by    VARCHAR(100),                                            -- [확정자] 계획 확정자

    -- 비고
    remarks         TEXT,                                                    -- [비고] 계획 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

-- 인덱스
CREATE INDEX idx_production_plan_date ON hkgn.production_plan(plan_date);
CREATE INDEX idx_production_plan_status ON hkgn.production_plan(plan_status);
CREATE INDEX idx_production_plan_type ON hkgn.production_plan(plan_type);

-- 코멘트
COMMENT ON TABLE hkgn.production_plan IS '생산 계획 헤더 - 일일 생산 계획';
COMMENT ON COLUMN hkgn.production_plan.plan_no IS '[계획번호] 생산 계획 번호 (PK)';
COMMENT ON COLUMN hkgn.production_plan.plan_date IS '[계획일] 생산 계획 일자';
COMMENT ON COLUMN hkgn.production_plan.plan_type IS '[계획유형] DAILY:일일, WEEKLY:주간, MONTHLY:월간';
COMMENT ON COLUMN hkgn.production_plan.plan_status IS '[계획상태] DRAFT:작성중, CONFIRMED:확정, PROCESSING:진행중, COMPLETED:완료';
COMMENT ON COLUMN hkgn.production_plan.confirmed_at IS '[확정일시] 계획 확정 시각';
COMMENT ON COLUMN hkgn.production_plan.confirmed_by IS '[확정자] 계획 확정자';
COMMENT ON COLUMN hkgn.production_plan.remarks IS '[비고] 계획 특이사항';
COMMENT ON COLUMN hkgn.production_plan.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.production_plan.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.production_plan.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.production_plan.updated_by IS '[수정자] 레코드 최종 수정자';
