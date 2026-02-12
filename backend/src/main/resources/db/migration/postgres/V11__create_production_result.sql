-- ============================================
-- V11: 생산실적 (production_result) 테이블 + 불량사유 코드
-- ============================================

-- 1. production_result 테이블 생성
CREATE TABLE IF NOT EXISTS hkgn.production_result (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    production_no     VARCHAR(30)   NOT NULL UNIQUE,
    production_date   DATE          NOT NULL,
    plan_no           VARCHAR(50)   NULL,
    plan_line_no      INTEGER       NULL,
    order_no          VARCHAR(30)   NULL,
    work_request_id   BIGINT        NULL,
    work_request_no   VARCHAR(50)   NULL,
    material_cd       VARCHAR(30)   NOT NULL,
    material_nm       VARCHAR(200)  NULL,
    good_qty          NUMERIC(12,2) NOT NULL DEFAULT 0,
    defect_qty        NUMERIC(12,2) NULL     DEFAULT 0,
    total_qty         NUMERIC(12,2) NOT NULL,
    unit              VARCHAR(10)   NULL     DEFAULT 'EA',
    good_area         NUMERIC(10,3) NULL     DEFAULT 0,
    defect_area       NUMERIC(10,3) NULL     DEFAULT 0,
    total_area        NUMERIC(10,3) NULL,
    worker_cd         VARCHAR(30)   NULL,
    defect_reason     TEXT          NULL,
    remarks           TEXT          NULL,
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by        VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by        VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

CREATE INDEX idx_pr_date       ON hkgn.production_result(production_date);
CREATE INDEX idx_pr_work_req   ON hkgn.production_result(work_request_no);
CREATE INDEX idx_pr_work_id    ON hkgn.production_result(work_request_id);
CREATE INDEX idx_pr_plan       ON hkgn.production_result(plan_no);

COMMENT ON TABLE hkgn.production_result IS '생산실적 - 양품/불량/면적 기록';

-- 2. 불량사유 공통코드 등록
INSERT INTO hkgn.code_master (group_code, group_name, code_id, code_name, sort_order, description, is_active)
VALUES
('DEFECT_REASON', '불량사유', 'SCRATCH',     '스크래치',     1, '표면 스크래치 발생',     TRUE),
('DEFECT_REASON', '불량사유', 'CRACK',       '파손/크랙',    2, '유리 파손 또는 크랙',    TRUE),
('DEFECT_REASON', '불량사유', 'SIZE_ERROR',  '치수불량',     3, '치수 규격 미달/초과',    TRUE),
('DEFECT_REASON', '불량사유', 'BUBBLE',      '기포',        4, '유리 내부 기포 발생',    TRUE),
('DEFECT_REASON', '불량사유', 'COATING',     '코팅불량',     5, '코팅 벗겨짐/불균일',    TRUE),
('DEFECT_REASON', '불량사유', 'EDGE',        '가장자리불량', 6, '엣지 처리 불량',        TRUE),
('DEFECT_REASON', '불량사유', 'MATERIAL',    '원자재불량',   7, '원자재 자체 불량',      TRUE),
('DEFECT_REASON', '불량사유', 'OTHER',       '기타',        99, '기타 불량 사유',        TRUE);
