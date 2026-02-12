-- ============================================
-- 생산회의 액션아이템 테이블 (daily_meeting_action_item)
-- ============================================
-- 설명: 생산회의에서 도출된 액션아이템 관리
-- 참조: daily_production_meeting.id
-- ============================================

CREATE TABLE hkgn.daily_meeting_action_item (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- FK
    meeting_id                  BIGINT        NOT NULL,                           -- [회의ID] 생산회의 ID (daily_production_meeting.id 참조)

    -- 액션아이템 정보
    title                       VARCHAR(300)  NOT NULL,                           -- [제목] 액션아이템 제목
    description                 TEXT          NULL,                               -- [설명] 상세 설명
    assignee                    VARCHAR(100)  NOT NULL,                           -- [담당자] 담당자
    due_date                    DATE          NULL,                               -- [기한] 완료 기한
    priority                    VARCHAR(10)   NOT NULL DEFAULT 'MEDIUM',          -- [우선순위] HIGH:높음, MEDIUM:보통, LOW:낮음
    status                      VARCHAR(20)   NOT NULL DEFAULT 'OPEN',            -- [상태] OPEN:미처리, IN_PROGRESS:진행중, DONE:완료, CANCELLED:취소

    -- 관련 정보
    work_request_no             VARCHAR(50)   NULL,                               -- [작업의뢰번호] 관련 작업 의뢰 번호

    -- 해결 정보
    resolution_note             TEXT          NULL,                               -- [해결메모] 해결 내용 메모
    resolved_at                 TIMESTAMP WITH TIME ZONE NULL,                    -- [해결일시] 해결 완료 시각

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER       -- [수정자] 레코드 최종 수정자
);

-- 인덱스 생성
CREATE INDEX idx_dmai_meeting ON hkgn.daily_meeting_action_item(meeting_id);
CREATE INDEX idx_dmai_status ON hkgn.daily_meeting_action_item(status);

-- 코멘트 추가
COMMENT ON TABLE hkgn.daily_meeting_action_item IS '생산회의 액션아이템 - 회의에서 도출된 액션아이템 관리';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.meeting_id IS '회의ID - 생산회의 ID (daily_production_meeting.id 참조)';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.title IS '제목 - 액션아이템 제목';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.description IS '설명 - 상세 설명';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.assignee IS '담당자 - 담당자';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.due_date IS '기한 - 완료 기한';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.priority IS '우선순위 - HIGH:높음, MEDIUM:보통, LOW:낮음';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.status IS '상태 - OPEN:미처리, IN_PROGRESS:진행중, DONE:완료, CANCELLED:취소';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.work_request_no IS '작업의뢰번호 - 관련 작업 의뢰 번호';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.resolution_note IS '해결메모 - 해결 내용 메모';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.resolved_at IS '해결일시 - 해결 완료 시각';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.daily_meeting_action_item.updated_by IS '수정자 - 레코드 최종 수정자';
