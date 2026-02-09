-- ============================================
-- 생산 계획 상세 테이블 (production_plan_detail)
-- ============================================
-- 설명: 생산 계획 공정별 체크리스트
-- 참조: db_dic/dictionary/standards.json (production_plan_detail 섹션)
-- ============================================

CREATE TABLE hkgn.production_plan_detail (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- FK
    plan_id                     BIGINT        NOT NULL,                           -- [생산계획ID] 생산 계획 ID (production_plan.id 참조)

    -- 공정 정보
    process_type                VARCHAR(50)   NULL,                               -- [공정구분] 공정 구분 (재단1, 재단2, 아와, 강화, 라벨 등)
    is_checked                  BOOLEAN       NULL DEFAULT FALSE,                 -- [체크여부] 공정 완료 체크 여부

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [수정자] 레코드 최종 수정자

    -- 외래키 제약조건
    CONSTRAINT fk_production_plan_detail_plan
        FOREIGN KEY (plan_id)
        REFERENCES hkgn.production_plan(id)
        ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_production_plan_detail_plan_id ON hkgn.production_plan_detail(plan_id);
CREATE INDEX idx_production_plan_detail_process_type ON hkgn.production_plan_detail(process_type);

-- 코멘트 추가
COMMENT ON TABLE hkgn.production_plan_detail IS '생산 계획 상세 - 공정별 체크리스트';
COMMENT ON COLUMN hkgn.production_plan_detail.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.production_plan_detail.plan_id IS '생산계획ID - 생산 계획 ID (production_plan.id 참조)';
COMMENT ON COLUMN hkgn.production_plan_detail.process_type IS '공정구분 - 공정 구분 (재단1, 재단2, 아와, 강화, 라벨 등)';
COMMENT ON COLUMN hkgn.production_plan_detail.is_checked IS '체크여부 - 공정 완료 체크 여부';
COMMENT ON COLUMN hkgn.production_plan_detail.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.production_plan_detail.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.production_plan_detail.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.production_plan_detail.updated_by IS '수정자 - 레코드 최종 수정자';
