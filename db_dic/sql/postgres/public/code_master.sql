-- ============================================
-- 테이블: code_master
-- 설명: 공통 코드 마스터 - 범용 목록성 코드 관리
-- 작성일: 2026-02-06
-- ============================================

CREATE TABLE code_master (
    -- PK
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                            -- [코드마스터ID] 시스템 자동 생성 PK

    -- 그룹 정보 (비정규화)
    group_code VARCHAR(50) NOT NULL,        -- [그룹코드] 코드 그룹 식별자 (예: DEPT, PRIORITY)
    group_name VARCHAR(100) NOT NULL,       -- [그룹명] 코드 그룹 표시명 (예: 부서, 우선순위)

    -- 코드 정보
    code_id VARCHAR(50) NOT NULL,           -- [코드ID] 그룹 내 코드 식별자 (예: QA, HIGH)
    code_name VARCHAR(200) NOT NULL,        -- [코드명] 화면 표시용 코드명 (예: 품질보증팀, 높음)

    -- 계층 (그룹 내 2단계 부모-자식)
    parent_id BIGINT NULL REFERENCES code_master(id),
                                            -- [상위ID] 부모 코드 (같은 그룹 내 자기참조)

    -- 메타데이터
    sort_order INTEGER NOT NULL DEFAULT 0,  -- [정렬순서] 그룹 내 표시 순서 (오름차순)
    description TEXT,                       -- [설명] 코드 상세 설명
    extra_data JSONB,                       -- [추가데이터] 확장 속성 (예: {"color":"red","icon":"star"})
    is_active BOOLEAN NOT NULL DEFAULT TRUE,-- [활성여부] true=활성, false=비활성

    -- 감사(audit) 컬럼
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                            -- [생성일시] 레코드 생성 시각
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                            -- [수정일시] 레코드 최종 수정 시각
    created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
                                            -- [생성자] 레코드 생성자
    updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
                                            -- [수정자] 레코드 최종 수정자

    -- 제약조건
    CONSTRAINT uk_code_master UNIQUE (group_code, code_id)
);

-- 인덱스
CREATE INDEX idx_code_master_group_code ON code_master(group_code);
CREATE INDEX idx_code_master_is_active ON code_master(is_active);
CREATE INDEX idx_code_master_group_sort ON code_master(group_code, sort_order);
CREATE INDEX idx_code_master_parent_id ON code_master(parent_id);
CREATE INDEX idx_code_master_extra_data ON code_master USING GIN(extra_data);

-- 코멘트
COMMENT ON TABLE code_master IS '공통 코드 마스터 - 범용 목록성 코드 관리';
COMMENT ON COLUMN code_master.id IS '코드마스터ID - 시스템 자동 생성 PK';
COMMENT ON COLUMN code_master.group_code IS '그룹코드 - 코드 그룹 식별자 (예: DEPT, PRIORITY)';
COMMENT ON COLUMN code_master.group_name IS '그룹명 - 코드 그룹 표시명 (예: 부서, 우선순위)';
COMMENT ON COLUMN code_master.code_id IS '코드ID - 그룹 내 코드 식별자 (예: QA, HIGH)';
COMMENT ON COLUMN code_master.code_name IS '코드명 - 화면 표시용 코드명 (예: 품질보증팀, 높음)';
COMMENT ON COLUMN code_master.parent_id IS '상위ID - 부모 코드 (같은 그룹 내 자기참조, 2단계 계층)';
COMMENT ON COLUMN code_master.sort_order IS '정렬순서 - 그룹 내 표시 순서 (오름차순)';
COMMENT ON COLUMN code_master.description IS '설명 - 코드 상세 설명';
COMMENT ON COLUMN code_master.extra_data IS '추가데이터 - 확장 속성 JSON (예: {"color":"red","icon":"star"})';
COMMENT ON COLUMN code_master.is_active IS '활성여부 - true=활성, false=비활성';
COMMENT ON COLUMN code_master.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN code_master.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN code_master.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN code_master.updated_by IS '수정자 - 레코드 최종 수정자';

-- 초기 데이터
INSERT INTO code_master (group_code, group_name, code_id, code_name, sort_order, description, is_active) VALUES
-- 우선순위
('PRIORITY', '우선순위', 'HIGH',   '높음', 1, '긴급 처리 필요', TRUE),
('PRIORITY', '우선순위', 'MEDIUM', '보통', 2, '일반 처리',       TRUE),
('PRIORITY', '우선순위', 'LOW',    '낮음', 3, '여유있게 처리',   TRUE),
-- 진행상태
('PROGRESS', '진행상태', 'NOT_STARTED',  '미착수', 1, '아직 시작하지 않음', TRUE),
('PROGRESS', '진행상태', 'IN_PROGRESS',  '진행중', 2, '현재 진행 중',       TRUE),
('PROGRESS', '진행상태', 'COMPLETED',    '완료',   3, '작업 완료',          TRUE),
('PROGRESS', '진행상태', 'ON_HOLD',      '보류',   4, '일시 중단',          TRUE),
-- 부서
('DEPT', '부서', 'QA',    '품질보증팀', 1, 'Quality Assurance',       TRUE),
('DEPT', '부서', 'RND',   '연구개발팀', 2, 'Research & Development',  TRUE),
('DEPT', '부서', 'PROD',  '생산팀',     3, 'Production',              TRUE),
('DEPT', '부서', 'SALES', '영업팀',     4, 'Sales',                   TRUE),
('DEPT', '부서', 'HR',    '인사팀',     5, 'Human Resources',         TRUE),
('DEPT', '부서', 'FIN',   '재무팀',     6, 'Finance',                 TRUE),
('DEPT', '부서', 'IT',    '정보기술팀', 7, 'Information Technology',   TRUE),
('DEPT', '부서', 'ADMIN', '경영지원팀', 8, 'Administration',          TRUE);
