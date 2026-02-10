-- ============================================
-- 테이블 ALTER 스크립트
-- ============================================
-- 생성일시: 2026-02-10
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- 1. sales_order_header: 납기요청일 컬럼 추가
-- ============================================
ALTER TABLE hkgn.sales_order_header
ADD COLUMN IF NOT EXISTS delivery_request_date DATE NULL;

COMMENT ON COLUMN hkgn.sales_order_header.delivery_request_date
    IS '[납기요청일] 고객 납기 요청일';

-- ============================================
-- 2. production_plan: 수주 헤더 연결 + 생산 예정일 추가
-- ============================================
ALTER TABLE hkgn.production_plan
ADD COLUMN IF NOT EXISTS order_header_id BIGINT NULL;

ALTER TABLE hkgn.production_plan
ADD COLUMN IF NOT EXISTS planned_start_date DATE NULL;

ALTER TABLE hkgn.production_plan
ADD COLUMN IF NOT EXISTS planned_end_date DATE NULL;

COMMENT ON COLUMN hkgn.production_plan.order_header_id
    IS '[수주헤더ID] sales_order_header.id 참조';

COMMENT ON COLUMN hkgn.production_plan.planned_start_date
    IS '[생산예정시작일] 생산 예정 시작일';

COMMENT ON COLUMN hkgn.production_plan.planned_end_date
    IS '[생산예정종료일] 생산 예정 종료일';

-- FK 제약조건
ALTER TABLE hkgn.production_plan
ADD CONSTRAINT fk_production_plan_order_header
    FOREIGN KEY (order_header_id) REFERENCES hkgn.sales_order_header(id);

-- ============================================
-- 3. production_plan_detail: 수주 상세 연결 + 제품/규격/수량/위치 컬럼 추가
-- ============================================

-- 수주 상세 연결
ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS order_detail_id BIGINT NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS order_no VARCHAR(30) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS line_seq INTEGER NULL;

-- 제품 정보
ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS material_cd VARCHAR(30) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS material_nm VARCHAR(500) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS product_category VARCHAR(10) NULL;

-- 규격 정보
ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS width NUMERIC(10,2) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS height NUMERIC(10,2) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS thickness NUMERIC(10,2) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS unit_type VARCHAR(10) NULL;

-- 수량 및 단가
ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS quantity INTEGER NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS area NUMERIC(15,4) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS unit VARCHAR(10) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS unit_price NUMERIC(15,2) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS amount NUMERIC(15,2) NULL;

-- 납품 위치 정보
ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS dong VARCHAR(100) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS ho VARCHAR(100) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS floor VARCHAR(50) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS window_type VARCHAR(100) NULL;

ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS location_detail VARCHAR(500) NULL;

-- 납기일
ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS delivery_date DATE NULL;

-- 비고
ALTER TABLE hkgn.production_plan_detail
ADD COLUMN IF NOT EXISTS remarks TEXT NULL;

-- 코멘트
COMMENT ON COLUMN hkgn.production_plan_detail.order_detail_id IS '[수주상세ID] sales_order_detail.id 참조';
COMMENT ON COLUMN hkgn.production_plan_detail.order_no IS '[수주번호] 수주 문서 번호';
COMMENT ON COLUMN hkgn.production_plan_detail.line_seq IS '[라인순번] 수주 내 라인 순번';
COMMENT ON COLUMN hkgn.production_plan_detail.material_cd IS '[자재코드] 자재/제품 코드';
COMMENT ON COLUMN hkgn.production_plan_detail.material_nm IS '[자재명] 자재/제품명';
COMMENT ON COLUMN hkgn.production_plan_detail.product_category IS '[제품구분] P:제품, R:원자재, S:부자재 등';
COMMENT ON COLUMN hkgn.production_plan_detail.width IS '[가로규격] 가로 크기(mm)';
COMMENT ON COLUMN hkgn.production_plan_detail.height IS '[세로규격] 세로 크기(mm)';
COMMENT ON COLUMN hkgn.production_plan_detail.thickness IS '[두께] 두께(mm)';
COMMENT ON COLUMN hkgn.production_plan_detail.unit_type IS '[규격단위] mm, cm, m 등';
COMMENT ON COLUMN hkgn.production_plan_detail.quantity IS '[수량] 주문 수량';
COMMENT ON COLUMN hkgn.production_plan_detail.area IS '[면적] 계산된 면적 (M2)';
COMMENT ON COLUMN hkgn.production_plan_detail.unit IS '[단위] 수량 단위 (EA, M2, KG 등)';
COMMENT ON COLUMN hkgn.production_plan_detail.unit_price IS '[단가] 개당 단가';
COMMENT ON COLUMN hkgn.production_plan_detail.amount IS '[금액] 라인 금액';
COMMENT ON COLUMN hkgn.production_plan_detail.dong IS '[동] 건물 동 정보';
COMMENT ON COLUMN hkgn.production_plan_detail.ho IS '[호] 호수/단위 정보';
COMMENT ON COLUMN hkgn.production_plan_detail.floor IS '[층] 층수 정보';
COMMENT ON COLUMN hkgn.production_plan_detail.window_type IS '[창종류] 창 타입';
COMMENT ON COLUMN hkgn.production_plan_detail.location_detail IS '[위치상세] 상세 위치 설명';
COMMENT ON COLUMN hkgn.production_plan_detail.delivery_date IS '[납기일] 개별 라인 납기일';
COMMENT ON COLUMN hkgn.production_plan_detail.remarks IS '[비고] 라인별 특이사항';

-- FK 제약조건
ALTER TABLE hkgn.production_plan_detail
ADD CONSTRAINT fk_production_plan_detail_order_detail
    FOREIGN KEY (order_detail_id) REFERENCES hkgn.sales_order_detail(id);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_production_plan_detail_order_detail
    ON hkgn.production_plan_detail(order_detail_id);

CREATE INDEX IF NOT EXISTS idx_production_plan_detail_order_no
    ON hkgn.production_plan_detail(order_no);

CREATE INDEX IF NOT EXISTS idx_production_plan_detail_material
    ON hkgn.production_plan_detail(material_cd);

-- ============================================
-- 4. production_result: production_no → production_result_no 컬럼명 변경
-- ============================================
ALTER TABLE hkgn.production_result
RENAME COLUMN production_no TO production_result_no;

COMMENT ON COLUMN hkgn.production_result.production_result_no
    IS '[생산실적번호] 생산 실적 문서 번호';

-- ============================================
-- 5. production_result: 수주 상세 라인순번 컬럼 추가
-- ============================================
ALTER TABLE hkgn.production_result
ADD COLUMN IF NOT EXISTS order_line_seq INTEGER NULL;

COMMENT ON COLUMN hkgn.production_result.order_line_seq
    IS '[수주라인순번] sales_order_detail.line_seq 참조';

-- ============================================
-- 6. production_plan: site_cd 추가
-- ============================================

ALTER TABLE hkgn.production_plan
ADD COLUMN IF NOT EXISTS site_cd VARCHAR(30);

COMMENT ON COLUMN hkgn.production_plan.site_cd
    IS '[현장코드] 현장 식별 코드';

-- ============================================
-- 7. work_request: 진행상태 컬럼 추가
-- ============================================
-- approval_status: 승인 상태 (승인/미승인/반려)
-- request_status: 작업 진행 상태 (접수→진행중→완료)
-- ============================================

ALTER TABLE hkgn.work_request
ADD COLUMN IF NOT EXISTS request_status VARCHAR(20) NOT NULL DEFAULT 'REGISTERED';

COMMENT ON COLUMN hkgn.work_request.request_status
    IS '[진행상태] REGISTERED:접수, IN_PROGRESS:진행중, COMPLETED:완료, CANCELLED:취소';

CREATE INDEX IF NOT EXISTS idx_work_request_request_status
    ON hkgn.work_request(request_status);

