-- ============================================
-- 재단일보 테이블 (cutting_daily_report) - 고도화 버전
-- ============================================
-- 설명: 유리 재단 작업 일일 보고 (최적화 절단, 로스 관리 포함)
-- 참조: db_dic/dictionary/standards.json
-- Excel 출처: ref/재단일보.xlsx
-- ============================================

CREATE TABLE hkgn.cutting_daily_report (
    -- PK
    id                      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- 기본 정보
    report_no               VARCHAR(30)   NOT NULL UNIQUE,                    -- [일보번호] 재단 일보 문서 번호
    report_date             DATE          NOT NULL,                           -- [작업일] 재단 작업일
    seq_no                  INTEGER       NULL,                               -- [순번] 일보 내 작업 순번

    -- 작업의뢰 연계
    work_request_no         VARCHAR(50)   NULL,                               -- [작업의뢰번호] 작업 의뢰 번호 (work_request.request_no 참조)

    -- 거래처/현장 정보
    customer_cd             VARCHAR(30)   NULL,                               -- [거래처코드] 고객사 코드 (business_partner.bp_cd)
    customer_nm             VARCHAR(200)  NULL,                               -- [거래처명] 고객사 이름 (참조용)
    site_cd                 VARCHAR(30)   NULL,                               -- [현장코드] 현장 코드 (site_master.site_cd)
    site_nm                 VARCHAR(200)  NULL,                               -- [현장명] 현장 이름 (참조용)

    -- 원판 정보
    raw_plate_no            INTEGER       NULL,                               -- [원판순번] 원판 구분 (1, 2, 3...)
    raw_material_cd         VARCHAR(30)   NOT NULL,                           -- [원판코드] 원판 자재 코드 (item_master.material_cd)
    raw_material_nm         VARCHAR(200)  NULL,                               -- [원판명] 원판 이름 (참조용)
    raw_thickness           NUMERIC(6,2),                                     -- [원판두께] 원판 두께 (mm)
    raw_color               VARCHAR(30),                                      -- [원판색상] 원판 색상
    raw_width               NUMERIC(10,2) NULL,                               -- [원판가로] 원판 가로 크기 (mm)
    raw_height              NUMERIC(10,2) NULL,                               -- [원판세로] 원판 세로 크기 (mm)
    raw_plate_count         INTEGER       NULL DEFAULT 0,                     -- [원판매수] 사용한 원판 매수

    -- 면적 관리 (평수 기준)
    required_area           NUMERIC(10,3) NULL DEFAULT 0,                     -- [실평수A] 실제 필요 면적 (평)
    waste_included_area     NUMERIC(10,3) NULL DEFAULT 0,                     -- [아와평수B] 불량 포함 면적 (평)
    used_area               NUMERIC(10,3) NULL DEFAULT 0,                     -- [사용평수C] 실제 사용 면적 (평)
    production_defect_area  NUMERIC(10,3) NULL DEFAULT 0,                     -- [생산불량] C-B (평)
    loss_area               NUMERIC(10,3) NULL DEFAULT 0,                     -- [로스평수] C-A (평)
    loss_rate               NUMERIC(5,2)  NULL DEFAULT 0,                     -- [로스율] 로스율 (%)
    loss_weight             NUMERIC(10,2) NULL DEFAULT 0,                     -- [로스중량] 로스 중량 (kg)
    loss_amount             NUMERIC(15,2) NULL DEFAULT 0,                     -- [로스금액] 로스 금액 (원)

    -- 옵티마 (최적화 절단 정보)
    optimized_area_pyeong   NUMERIC(10,3) NULL DEFAULT 0,                     -- [옵티마평수] 최적화 재단 면적 (평)
    optimized_area_m2       NUMERIC(10,3) NULL DEFAULT 0,                     -- [옵티마M2] 최적화 재단 면적 (㎡)
    cutting_area            NUMERIC(10,3) NULL DEFAULT 0,                     -- [재단평수] 재단 작업 면적 (평)
    total_region            NUMERIC(10,3) NULL DEFAULT 0,                     -- [총영역] 전체 영역 (㎡)
    opt_region              NUMERIC(10,3) NULL DEFAULT 0,                     -- [OPT영역] 최적화 영역 (㎡)

    -- 기존 수량 정보 (호환성 유지)
    raw_qty                 NUMERIC(12,2) NULL DEFAULT 0,                     -- [투입수량] 원판 투입 수량
    good_qty                NUMERIC(12,2) NULL DEFAULT 0,                     -- [양품수량] 양품 수량
    defect_qty              NUMERIC(12,2) NULL DEFAULT 0,                     -- [불량수량] 불량 수량
    unit                    VARCHAR(10)   DEFAULT '평',                       -- [단위] 평/M2/EA

    -- 작업자 정보
    worker_cd               VARCHAR(30),                                      -- [작업자코드] 재단 담당자 (worker.worker_cd)

    -- 비고
    defect_reason           TEXT,                                             -- [불량사유] 불량 발생 사유
    remarks                 TEXT,                                             -- [비고] 특이사항

    -- 감사 컬럼
    created_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by              VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by              VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER       -- [수정자] 레코드 최종 수정자
);

-- 인덱스 생성
CREATE INDEX idx_cutting_daily_report_date ON hkgn.cutting_daily_report(report_date);
CREATE INDEX idx_cutting_daily_report_work_request ON hkgn.cutting_daily_report(work_request_no);
CREATE INDEX idx_cutting_daily_report_customer ON hkgn.cutting_daily_report(customer_cd);
CREATE INDEX idx_cutting_daily_report_site ON hkgn.cutting_daily_report(site_cd);
CREATE INDEX idx_cutting_daily_report_material ON hkgn.cutting_daily_report(raw_material_cd);
CREATE INDEX idx_cutting_daily_report_worker ON hkgn.cutting_daily_report(worker_cd);

-- 코멘트 추가
COMMENT ON TABLE hkgn.cutting_daily_report IS '재단 일보 - 유리 재단 작업 일일 보고 (최적화 절단, 로스 관리)';
COMMENT ON COLUMN hkgn.cutting_daily_report.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.cutting_daily_report.report_no IS '일보번호 - 재단 일보 문서 번호';
COMMENT ON COLUMN hkgn.cutting_daily_report.report_date IS '작업일 - 재단 작업일';
COMMENT ON COLUMN hkgn.cutting_daily_report.seq_no IS '순번 - 일보 내 작업 순번';
COMMENT ON COLUMN hkgn.cutting_daily_report.work_request_no IS '작업의뢰번호 - 작업 의뢰 번호 (work_request.request_no 참조)';
COMMENT ON COLUMN hkgn.cutting_daily_report.customer_cd IS '거래처코드 - 고객사 코드 (business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.cutting_daily_report.customer_nm IS '거래처명 - 고객사 이름 (참조용)';
COMMENT ON COLUMN hkgn.cutting_daily_report.site_cd IS '현장코드 - 현장 코드 (site_master.site_cd)';
COMMENT ON COLUMN hkgn.cutting_daily_report.site_nm IS '현장명 - 현장 이름 (참조용)';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_plate_no IS '원판순번 - 원판 구분 (1, 2, 3...)';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_material_cd IS '원판코드 - 원판 자재 코드 (item_master.material_cd)';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_material_nm IS '원판명 - 원판 이름 (참조용)';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_thickness IS '원판두께 - 원판 두께 (mm)';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_color IS '원판색상 - 원판 색상';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_width IS '원판가로 - 원판 가로 크기 (mm)';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_height IS '원판세로 - 원판 세로 크기 (mm)';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_plate_count IS '원판매수 - 사용한 원판 매수';
COMMENT ON COLUMN hkgn.cutting_daily_report.required_area IS '실평수A - 실제 필요 면적 (평)';
COMMENT ON COLUMN hkgn.cutting_daily_report.waste_included_area IS '아와평수B - 불량 포함 면적 (평)';
COMMENT ON COLUMN hkgn.cutting_daily_report.used_area IS '사용평수C - 실제 사용 면적 (평)';
COMMENT ON COLUMN hkgn.cutting_daily_report.production_defect_area IS '생산불량 - C-B (평)';
COMMENT ON COLUMN hkgn.cutting_daily_report.loss_area IS '로스평수 - C-A (평)';
COMMENT ON COLUMN hkgn.cutting_daily_report.loss_rate IS '로스율 - 로스율 (%)';
COMMENT ON COLUMN hkgn.cutting_daily_report.loss_weight IS '로스중량 - 로스 중량 (kg)';
COMMENT ON COLUMN hkgn.cutting_daily_report.loss_amount IS '로스금액 - 로스 금액 (원)';
COMMENT ON COLUMN hkgn.cutting_daily_report.optimized_area_pyeong IS '옵티마평수 - 최적화 재단 면적 (평)';
COMMENT ON COLUMN hkgn.cutting_daily_report.optimized_area_m2 IS '옵티마M2 - 최적화 재단 면적 (㎡)';
COMMENT ON COLUMN hkgn.cutting_daily_report.cutting_area IS '재단평수 - 재단 작업 면적 (평)';
COMMENT ON COLUMN hkgn.cutting_daily_report.total_region IS '총영역 - 전체 영역 (㎡)';
COMMENT ON COLUMN hkgn.cutting_daily_report.opt_region IS 'OPT영역 - 최적화 영역 (㎡)';
COMMENT ON COLUMN hkgn.cutting_daily_report.raw_qty IS '투입수량 - 원판 투입 수량';
COMMENT ON COLUMN hkgn.cutting_daily_report.good_qty IS '양품수량 - 양품 수량';
COMMENT ON COLUMN hkgn.cutting_daily_report.defect_qty IS '불량수량 - 불량 수량';
COMMENT ON COLUMN hkgn.cutting_daily_report.unit IS '단위 - 평/M2/EA';
COMMENT ON COLUMN hkgn.cutting_daily_report.worker_cd IS '작업자코드 - 재단 담당자 (worker.worker_cd)';
COMMENT ON COLUMN hkgn.cutting_daily_report.defect_reason IS '불량사유 - 불량 발생 사유';
COMMENT ON COLUMN hkgn.cutting_daily_report.remarks IS '비고 - 특이사항';
COMMENT ON COLUMN hkgn.cutting_daily_report.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.cutting_daily_report.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.cutting_daily_report.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.cutting_daily_report.updated_by IS '수정자 - 레코드 최종 수정자';
