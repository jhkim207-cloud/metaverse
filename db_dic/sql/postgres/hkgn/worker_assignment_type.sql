-- ============================================
-- 작업자 배치 유형 마스터 테이블 (worker_assignment_type)
-- ============================================
-- 설명: 작업 배치 유형 정의 (A~F 유형)
-- 참조: db_dic/dictionary/standards.json (worker_assignment 섹션)
-- ============================================

CREATE TABLE hkgn.worker_assignment_type (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- 배치 유형 정보
    assignment_type_cd          VARCHAR(10)   NOT NULL UNIQUE,                    -- [배치유형코드] 작업 배치 유형 코드 (A, B, C, D, E, F)
    assignment_type_nm          VARCHAR(100)  NULL,                               -- [배치유형명] 작업 배치 유형 이름
    description                 TEXT          NULL,                               -- [설명] 배치 유형 상세 설명
    sort_order                  INTEGER       NULL DEFAULT 0,                     -- [정렬순서] 정렬 순서
    is_active                   BOOLEAN       NULL DEFAULT TRUE,                  -- [활성여부] 사용 여부

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER       -- [수정자] 레코드 최종 수정자
);

-- 인덱스 생성
CREATE INDEX idx_worker_assignment_type_cd ON hkgn.worker_assignment_type(assignment_type_cd);
CREATE INDEX idx_worker_assignment_type_active ON hkgn.worker_assignment_type(is_active);

-- 코멘트 추가
COMMENT ON TABLE hkgn.worker_assignment_type IS '작업자 배치 유형 마스터 - 작업 배치 유형 정의 (A~F)';
COMMENT ON COLUMN hkgn.worker_assignment_type.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.worker_assignment_type.assignment_type_cd IS '배치유형코드 - 작업 배치 유형 코드 (A, B, C, D, E, F)';
COMMENT ON COLUMN hkgn.worker_assignment_type.assignment_type_nm IS '배치유형명 - 작업 배치 유형 이름';
COMMENT ON COLUMN hkgn.worker_assignment_type.description IS '설명 - 배치 유형 상세 설명';
COMMENT ON COLUMN hkgn.worker_assignment_type.sort_order IS '정렬순서 - 정렬 순서';
COMMENT ON COLUMN hkgn.worker_assignment_type.is_active IS '활성여부 - 사용 여부';
COMMENT ON COLUMN hkgn.worker_assignment_type.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.worker_assignment_type.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.worker_assignment_type.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.worker_assignment_type.updated_by IS '수정자 - 레코드 최종 수정자';
