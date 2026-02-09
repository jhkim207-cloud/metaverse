-- ============================================
-- 작업자 일일 배치 현황 테이블 (worker_daily_assignment)
-- ============================================
-- 설명: 작업자 일일 배치 현황 (날짜별, 작업영역별, 직책별)
-- 참조: db_dic/dictionary/standards.json (worker_assignment 섹션)
-- ============================================

CREATE TABLE hkgn.worker_daily_assignment (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- 작업 정보
    work_date                   DATE          NOT NULL,                           -- [작업일자] 작업 일자
    assignment_type_cd          VARCHAR(10)   NULL,                               -- [배치유형코드] 작업 배치 유형 코드 (A, B, C, D, E, F)

    -- 작업자 배치 정보
    work_area                   VARCHAR(50)   NULL,                               -- [작업영역] 작업 영역 (복층1호기, 복층2호기, 재단/강화)
    position                    VARCHAR(50)   NULL,                               -- [직책] 직책 (관리자, 투입, 조립, 부틸, 부착, 후처리, 재단, 강화, 간봉, 지게차 등)
    worker_nm                   VARCHAR(100)  NULL,                               -- [작업자명] 작업자 이름

    -- 연결 정보 (선택적)
    worker_cd                   VARCHAR(50)   NULL,                               -- [작업자코드] 작업자 코드 (worker.worker_cd 참조)
    plan_no                     VARCHAR(50)   NULL,                               -- [계획번호] 생산 계획 번호 (production_plan.plan_no 참조)
    work_request_no             VARCHAR(50)   NULL,                               -- [작업의뢰번호] 작업 의뢰 번호 (work_request.request_no 참조)

    -- 비고
    assignment_remarks          TEXT          NULL,                               -- [배치비고] 배치 비고

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER       -- [수정자] 레코드 최종 수정자

    -- 외래키 제약조건 (선택적)
    -- CONSTRAINT fk_worker_daily_assignment_type
    --     FOREIGN KEY (assignment_type_cd)
    --     REFERENCES hkgn.worker_assignment_type(assignment_type_cd),
    -- CONSTRAINT fk_worker_daily_assignment_worker
    --     FOREIGN KEY (worker_cd)
    --     REFERENCES hkgn.worker(worker_cd)
);

-- 인덱스 생성
CREATE INDEX idx_worker_daily_assignment_date ON hkgn.worker_daily_assignment(work_date);
CREATE INDEX idx_worker_daily_assignment_type ON hkgn.worker_daily_assignment(assignment_type_cd);
CREATE INDEX idx_worker_daily_assignment_area ON hkgn.worker_daily_assignment(work_area);
CREATE INDEX idx_worker_daily_assignment_worker ON hkgn.worker_daily_assignment(worker_cd);
CREATE INDEX idx_worker_daily_assignment_plan ON hkgn.worker_daily_assignment(plan_no);

-- 코멘트 추가
COMMENT ON TABLE hkgn.worker_daily_assignment IS '작업자 일일 배치 현황 - 날짜별, 작업영역별, 직책별 작업자 배치';
COMMENT ON COLUMN hkgn.worker_daily_assignment.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.worker_daily_assignment.work_date IS '작업일자 - 작업 일자';
COMMENT ON COLUMN hkgn.worker_daily_assignment.assignment_type_cd IS '배치유형코드 - 작업 배치 유형 코드 (A, B, C, D, E, F)';
COMMENT ON COLUMN hkgn.worker_daily_assignment.work_area IS '작업영역 - 작업 영역 (복층1호기, 복층2호기, 재단/강화)';
COMMENT ON COLUMN hkgn.worker_daily_assignment.position IS '직책 - 직책 (관리자, 투입, 조립, 부틸, 부착, 후처리, 재단, 강화, 간봉, 지게차 등)';
COMMENT ON COLUMN hkgn.worker_daily_assignment.worker_nm IS '작업자명 - 작업자 이름';
COMMENT ON COLUMN hkgn.worker_daily_assignment.worker_cd IS '작업자코드 - 작업자 코드 (worker.worker_cd 참조)';
COMMENT ON COLUMN hkgn.worker_daily_assignment.plan_no IS '계획번호 - 생산 계획 번호 (production_plan.plan_no 참조)';
COMMENT ON COLUMN hkgn.worker_daily_assignment.work_request_no IS '작업의뢰번호 - 작업 의뢰 번호 (work_request.request_no 참조)';
COMMENT ON COLUMN hkgn.worker_daily_assignment.assignment_remarks IS '배치비고 - 배치 비고';
COMMENT ON COLUMN hkgn.worker_daily_assignment.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.worker_daily_assignment.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.worker_daily_assignment.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.worker_daily_assignment.updated_by IS '수정자 - 레코드 최종 수정자';
