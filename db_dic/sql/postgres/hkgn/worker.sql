-- ============================================
-- 작업자 마스터 테이블 (worker)
-- ============================================
-- 설명: 작업자 기준정보 관리
-- 참조: db_dic/dictionary/standards.json
-- 출처: _recreate_with_id_pk.sql에서 분리
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.worker CASCADE;

-- ============================================
-- worker (작업자)
-- ============================================
CREATE TABLE hkgn.worker (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키
    worker_cd       VARCHAR(30)   NOT NULL UNIQUE,                           -- [작업자코드] 작업자 식별 코드 (UNIQUE)

    -- 기본 정보
    worker_nm       VARCHAR(50)   NOT NULL,                                  -- [작업자명] 작업자 이름

    -- 조직 정보
    dept            VARCHAR(30),                                             -- [소속부서] 소속부서 (복층/강화/재단/관리)
    position        VARCHAR(30),                                             -- [직무] 직무 (관리자/조립/투입/후처리/지게차 등)
    prod_line       VARCHAR(30),                                             -- [생산라인] 생산라인 (1호기/2호기)

    -- 연락처
    phone           VARCHAR(30),                                             -- [연락처] 연락처

    -- 상태
    is_active       BOOLEAN       DEFAULT TRUE,                              -- [사용여부] 사용 여부

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_worker_cd ON hkgn.worker(worker_cd);
CREATE INDEX idx_worker_dept ON hkgn.worker(dept);
CREATE INDEX idx_worker_active ON hkgn.worker(is_active);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.worker IS '작업자 마스터';
COMMENT ON COLUMN hkgn.worker.id IS '[식별자] 기본 키 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.worker.worker_cd IS '[작업자코드] 작업자 식별 코드 (UNIQUE)';
COMMENT ON COLUMN hkgn.worker.worker_nm IS '[작업자명] 작업자 이름';
COMMENT ON COLUMN hkgn.worker.dept IS '[소속부서] 소속부서 (복층/강화/재단/관리)';
COMMENT ON COLUMN hkgn.worker.position IS '[직무] 직무 (관리자/조립/투입/후처리/지게차 등)';
COMMENT ON COLUMN hkgn.worker.prod_line IS '[생산라인] 생산라인 (1호기/2호기)';
COMMENT ON COLUMN hkgn.worker.phone IS '[연락처] 연락처';
COMMENT ON COLUMN hkgn.worker.is_active IS '[사용여부] 사용 여부';
COMMENT ON COLUMN hkgn.worker.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.worker.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.worker.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.worker.updated_by IS '[수정자] 레코드 최종 수정자';
