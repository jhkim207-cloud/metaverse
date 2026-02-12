-- ============================================
-- 생산회의 노트 테이블 (daily_meeting_note)
-- ============================================
-- 설명: 생산회의 섹션별 노트/메모
-- 참조: daily_production_meeting.id
-- ============================================

CREATE TABLE hkgn.daily_meeting_note (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- FK
    meeting_id                  BIGINT        NOT NULL,                           -- [회의ID] 생산회의 ID (daily_production_meeting.id 참조)

    -- 노트 정보
    section_type                VARCHAR(30)   NOT NULL,                           -- [섹션구분] 섹션 구분 (PRODUCTION:생산, QUALITY:품질, SAFETY:안전 등)
    sort_order                  INTEGER       NOT NULL DEFAULT 0,                 -- [정렬순서] 정렬 순서
    content                     TEXT          NOT NULL,                           -- [내용] 노트 내용
    work_request_no             VARCHAR(50)   NULL,                               -- [작업의뢰번호] 관련 작업 의뢰 번호

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER       -- [수정자] 레코드 최종 수정자
);

-- 인덱스 생성
CREATE INDEX idx_dmn_meeting ON hkgn.daily_meeting_note(meeting_id);

-- 코멘트 추가
COMMENT ON TABLE hkgn.daily_meeting_note IS '생산회의 노트 - 섹션별 노트/메모';
COMMENT ON COLUMN hkgn.daily_meeting_note.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.daily_meeting_note.meeting_id IS '회의ID - 생산회의 ID (daily_production_meeting.id 참조)';
COMMENT ON COLUMN hkgn.daily_meeting_note.section_type IS '섹션구분 - 섹션 구분 (PRODUCTION:생산, QUALITY:품질, SAFETY:안전 등)';
COMMENT ON COLUMN hkgn.daily_meeting_note.sort_order IS '정렬순서 - 정렬 순서';
COMMENT ON COLUMN hkgn.daily_meeting_note.content IS '내용 - 노트 내용';
COMMENT ON COLUMN hkgn.daily_meeting_note.work_request_no IS '작업의뢰번호 - 관련 작업 의뢰 번호';
COMMENT ON COLUMN hkgn.daily_meeting_note.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.daily_meeting_note.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.daily_meeting_note.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.daily_meeting_note.updated_by IS '수정자 - 레코드 최종 수정자';
