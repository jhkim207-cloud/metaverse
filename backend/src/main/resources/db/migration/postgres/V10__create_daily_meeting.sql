-- ============================================
-- V10: 일일 생산회의 테이블 + 공통코드 + 메뉴
-- 작성일: 2026-02-09
-- ============================================

-- 1. daily_production_meeting
CREATE TABLE IF NOT EXISTS hkgn.daily_production_meeting (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    meeting_date        DATE          NOT NULL,
    meeting_no          VARCHAR(50)   NOT NULL,
    status              VARCHAR(20)   NOT NULL DEFAULT 'DRAFT',
    title               VARCHAR(200)  NULL,
    start_time          TIME          NULL,
    end_time            TIME          NULL,
    attendees           TEXT          NULL,
    carryforward_notes  TEXT          NULL,
    general_notes       TEXT          NULL,
    total_work_orders   INTEGER       NULL DEFAULT 0,
    total_quantity      INTEGER       NULL DEFAULT 0,
    total_area          NUMERIC(12,3) NULL DEFAULT 0,
    assigned_count      INTEGER       NULL DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    CONSTRAINT uq_dpm_meeting_date UNIQUE (meeting_date)
);

CREATE INDEX idx_dpm_date ON hkgn.daily_production_meeting(meeting_date);

COMMENT ON TABLE hkgn.daily_production_meeting IS '일일 생산회의 - 매일 아침 생산관리자 미팅 기록';

-- 2. daily_meeting_note
CREATE TABLE IF NOT EXISTS hkgn.daily_meeting_note (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    meeting_id          BIGINT        NOT NULL,
    section_type        VARCHAR(30)   NOT NULL,
    sort_order          INTEGER       NOT NULL DEFAULT 0,
    content             TEXT          NOT NULL,
    work_request_no     VARCHAR(50)   NULL,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

CREATE INDEX idx_dmn_meeting ON hkgn.daily_meeting_note(meeting_id);

COMMENT ON TABLE hkgn.daily_meeting_note IS '일일 생산회의 노트 - 섹션별 회의록';

-- 3. daily_meeting_action_item
CREATE TABLE IF NOT EXISTS hkgn.daily_meeting_action_item (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    meeting_id          BIGINT        NOT NULL,
    title               VARCHAR(300)  NOT NULL,
    description         TEXT          NULL,
    assignee            VARCHAR(100)  NOT NULL,
    due_date            DATE          NULL,
    priority            VARCHAR(10)   NOT NULL DEFAULT 'MEDIUM',
    status              VARCHAR(20)   NOT NULL DEFAULT 'OPEN',
    work_request_no     VARCHAR(50)   NULL,
    resolution_note     TEXT          NULL,
    resolved_at         TIMESTAMP WITH TIME ZONE NULL,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

CREATE INDEX idx_dmai_meeting ON hkgn.daily_meeting_action_item(meeting_id);
CREATE INDEX idx_dmai_status ON hkgn.daily_meeting_action_item(status);

COMMENT ON TABLE hkgn.daily_meeting_action_item IS '일일 생산회의 액션아이템 - 담당자/마감일/우선순위';

-- 4. 공통코드 등록
INSERT INTO hkgn.code_master (group_code, group_name, code_id, code_name, sort_order, description, is_active) VALUES
('MEETING_STATUS', '회의상태', 'DRAFT',        '작성중',      1, '회의 준비 중',     TRUE),
('MEETING_STATUS', '회의상태', 'IN_PROGRESS',   '진행중',      2, '회의 진행 중',     TRUE),
('MEETING_STATUS', '회의상태', 'COMPLETED',     '완료',        3, '회의 완료',        TRUE),
('NOTE_SECTION',   '노트구분', 'AGENDA',        '안건',        1, '회의 안건',        TRUE),
('NOTE_SECTION',   '노트구분', 'DISCUSSION',    '논의사항',    2, '논의 내용',        TRUE),
('NOTE_SECTION',   '노트구분', 'DECISION',      '결정사항',    3, '결정된 사항',      TRUE),
('NOTE_SECTION',   '노트구분', 'SAFETY',        '안전사항',    4, '안전 관련 사항',   TRUE),
('NOTE_SECTION',   '노트구분', 'QUALITY',       '품질이슈',    5, '품질 관련 이슈',   TRUE),
('NOTE_SECTION',   '노트구분', 'OTHER',         '기타',        6, '기타 사항',        TRUE),
('ACTION_PRIORITY','액션우선순위','HIGH',        '긴급',        1, '긴급 처리 필요',   TRUE),
('ACTION_PRIORITY','액션우선순위','MEDIUM',      '보통',        2, '보통 우선순위',    TRUE),
('ACTION_PRIORITY','액션우선순위','LOW',         '낮음',        3, '낮은 우선순위',    TRUE),
('ACTION_STATUS',  '액션상태', 'OPEN',          '미착수',      1, '미착수 상태',      TRUE),
('ACTION_STATUS',  '액션상태', 'IN_PROGRESS',   '진행중',      2, '진행 중',          TRUE),
('ACTION_STATUS',  '액션상태', 'DONE',          '완료',        3, '처리 완료',        TRUE),
('ACTION_STATUS',  '액션상태', 'CANCELLED',     '취소',        4, '취소됨',           TRUE);

-- 5. 메뉴 등록 (작업지시 바로 아래, sort_order 기존값 조정)
UPDATE hkgn.menus SET sort_order = sort_order + 1
WHERE parent_id = (SELECT id FROM hkgn.menus WHERE code = 'PRODUCTION')
  AND sort_order >= 8;

INSERT INTO hkgn.menus (code, name, parent_id, path, icon, menu_type, sort_order, is_active, depth) VALUES
('PROD_DAILY_MEETING', '일일 생산회의',
 (SELECT id FROM hkgn.menus WHERE code = 'PRODUCTION'),
 '/production/daily-meeting', 'clipboard_list', 'MENU', 8, TRUE, 1);
