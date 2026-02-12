-- ============================================
-- 일일 생산회의 테이블 (daily_production_meeting)
-- ============================================
-- 설명: 일일 생산회의 마스터 데이터
-- 참조: db_dic/dictionary/standards.json
-- ============================================

CREATE TABLE hkgn.daily_production_meeting (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- 회의 기본 정보
    meeting_date                DATE          NOT NULL,                           -- [회의일자] 회의 일자
    meeting_no                  VARCHAR(50)   NOT NULL,                           -- [회의번호] 회의 문서 번호
    status                      VARCHAR(20)   NOT NULL DEFAULT 'DRAFT',           -- [상태] DRAFT:초안, IN_PROGRESS:진행중, COMPLETED:완료
    title                       VARCHAR(200)  NULL,                               -- [제목] 회의 제목

    -- 시간 정보
    start_time                  TIME          NULL,                               -- [시작시간] 회의 시작 시간
    end_time                    TIME          NULL,                               -- [종료시간] 회의 종료 시간

    -- 참석자 및 메모
    attendees                   TEXT          NULL,                               -- [참석자] 참석자 목록
    carryforward_notes          TEXT          NULL,                               -- [전달사항] 전달/이월 사항
    general_notes               TEXT          NULL,                               -- [일반메모] 일반 메모

    -- 집계 정보
    total_work_orders           INTEGER       NULL DEFAULT 0,                     -- [총작업지시수] 총 작업 지시 건수
    total_quantity              INTEGER       NULL DEFAULT 0,                     -- [총수량] 총 수량
    total_area                  NUMERIC(12,3) NULL DEFAULT 0,                     -- [총면적] 총 면적 (평수)
    assigned_count              INTEGER       NULL DEFAULT 0,                     -- [배정인원수] 배정된 작업 인원 수

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER       -- [수정자] 레코드 최종 수정자
);

-- 인덱스 생성
CREATE INDEX idx_dpm_date ON hkgn.daily_production_meeting(meeting_date);
CREATE UNIQUE INDEX uq_dpm_meeting_date ON hkgn.daily_production_meeting(meeting_date);

-- 코멘트 추가
COMMENT ON TABLE hkgn.daily_production_meeting IS '일일 생산회의 - 일일 생산회의 마스터 데이터';
COMMENT ON COLUMN hkgn.daily_production_meeting.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.daily_production_meeting.meeting_date IS '회의일자 - 회의 일자';
COMMENT ON COLUMN hkgn.daily_production_meeting.meeting_no IS '회의번호 - 회의 문서 번호';
COMMENT ON COLUMN hkgn.daily_production_meeting.status IS '상태 - DRAFT:초안, IN_PROGRESS:진행중, COMPLETED:완료';
COMMENT ON COLUMN hkgn.daily_production_meeting.title IS '제목 - 회의 제목';
COMMENT ON COLUMN hkgn.daily_production_meeting.start_time IS '시작시간 - 회의 시작 시간';
COMMENT ON COLUMN hkgn.daily_production_meeting.end_time IS '종료시간 - 회의 종료 시간';
COMMENT ON COLUMN hkgn.daily_production_meeting.attendees IS '참석자 - 참석자 목록';
COMMENT ON COLUMN hkgn.daily_production_meeting.carryforward_notes IS '전달사항 - 전달/이월 사항';
COMMENT ON COLUMN hkgn.daily_production_meeting.general_notes IS '일반메모 - 일반 메모';
COMMENT ON COLUMN hkgn.daily_production_meeting.total_work_orders IS '총작업지시수 - 총 작업 지시 건수';
COMMENT ON COLUMN hkgn.daily_production_meeting.total_quantity IS '총수량 - 총 수량';
COMMENT ON COLUMN hkgn.daily_production_meeting.total_area IS '총면적 - 총 면적 (평수)';
COMMENT ON COLUMN hkgn.daily_production_meeting.assigned_count IS '배정인원수 - 배정된 작업 인원 수';
COMMENT ON COLUMN hkgn.daily_production_meeting.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.daily_production_meeting.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.daily_production_meeting.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.daily_production_meeting.updated_by IS '수정자 - 레코드 최종 수정자';
