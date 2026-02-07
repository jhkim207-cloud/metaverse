-- ============================================
-- 테이블: cutting_daily_report
-- 설명: 재단 일보 (유리 재단 작업 일일 보고)
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- ============================================

CREATE TABLE hkgn.cutting_daily_report (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    report_no       VARCHAR(30)   NOT NULL UNIQUE,                           -- [일보번호] 재단 일보 문서 번호
    report_date     DATE          NOT NULL,                                  -- [작업일] 재단 작업일

    -- 원판 정보
    raw_material_cd VARCHAR(30)   NOT NULL,                                  -- [원판코드] 원판 자재 코드 (→ item_master.material_cd)
    raw_thickness   NUMERIC(6,2),                                            -- [원판두께] 원판 두께 (mm)
    raw_color       VARCHAR(30),                                             -- [원판색상] 원판 색상

    -- 수량 정보
    raw_qty         NUMERIC(12,2) NOT NULL,                                  -- [투입수량] 원판 투입 수량
    good_qty        NUMERIC(12,2) NOT NULL DEFAULT 0,                        -- [양품수량] 양품 수량
    defect_qty      NUMERIC(12,2) DEFAULT 0,                                 -- [불량수량] 불량 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평

    -- 작업자 정보
    worker_cd       VARCHAR(30),                                             -- [작업자코드] 재단 담당자 (→ worker.worker_cd)

    -- 비고
    defect_reason   TEXT,                                                    -- [불량사유] 불량 발생 사유
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

-- 인덱스
CREATE INDEX idx_cutting_daily_report_date ON hkgn.cutting_daily_report(report_date);
CREATE INDEX idx_cutting_daily_report_material ON hkgn.cutting_daily_report(raw_material_cd);
CREATE INDEX idx_cutting_daily_report_worker ON hkgn.cutting_daily_report(worker_cd);

-- 코멘트
COMMENT ON TABLE hkgn.cutting_daily_report IS '재단 일보 - 유리 재단 작업 일일 보고';
COMMENT ON COLUMN hkgn.cutting_daily_report.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.cutting_daily_report.report_no IS '[일보번호] 재단 일보 문서 번호';
COMMENT ON COLUMN hkgn.cutting_daily_report.report_date IS '[작업일] 재단 작업일';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_material_cd IS '[원판코드] 원판 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_thickness IS '[원판두께] 원판 두께 (mm)';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_color IS '[원판색상] 원판 색상';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_qty IS '[투입수량] 원판 투입 수량';
COMMENT ON COLUMN hkgn.cutting_daily_report.good_qty IS '[양품수량] 양품 수량';
COMMENT ON COLUMN hkgn.cutting_daily_report.defect_qty IS '[불량수량] 불량 수량';
COMMENT ON COLUMN hkgn.cutting_daily_report.unit IS '[단위] EA/M2/평';
COMMENT ON COLUMN hkgn.cutting_daily_report.worker_cd IS '[작업자코드] 재단 담당자 (→ worker.worker_cd)';
COMMENT ON COLUMN hkgn.cutting_daily_report.defect_reason IS '[불량사유] 불량 발생 사유';
COMMENT ON COLUMN hkgn.cutting_daily_report.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.cutting_daily_report.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.cutting_daily_report.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.cutting_daily_report.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.cutting_daily_report.updated_by IS '[수정자] 레코드 최종 수정자';
