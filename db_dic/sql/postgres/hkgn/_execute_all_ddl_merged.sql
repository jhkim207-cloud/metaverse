-- ============================================
-- HK지앤텍 ERP DDL 통합 실행 스크립트
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- 데이터베이스: apps@localhost:5433 (로컬 개발)
--
-- DBeaver 실행용 통합 스크립트
-- (\i 명령어 대신 모든 DDL을 하나의 파일로 통합)
-- ============================================

-- 스키마 생성
CREATE SCHEMA IF NOT EXISTS hkgn;
SET search_path TO hkgn, public;

-- ============================================
-- [1] 기준정보 마스터 (Master Data) - 6개
-- ============================================

-- 1-1. business_partner (거래처)
-- ============================================
CREATE TABLE hkgn.business_partner (
    -- PK
    bp_cd             VARCHAR(30)   PRIMARY KEY,                             -- [거래처코드] 거래처 식별 코드 (PK)

    -- 거래처 유형
    bp_type           VARCHAR(20)   NOT NULL,                                -- [거래처구분] SALES:매출처, PURCHASE:매입처, OUTSOURCE:외주처
    sales_category    VARCHAR(30),                                           -- [매출처세부구분] 유리판매/기타
    purchase_category VARCHAR(30),                                           -- [매입처세부구분] 원자재/부자재

    -- 기본 정보
    bp_nm             VARCHAR(100)  NOT NULL,                                -- [거래처명] 거래처 이름
    ceo_nm            VARCHAR(50),                                           -- [대표자명] 대표자 이름
    biz_reg_no        VARCHAR(20),                                           -- [사업자등록번호] 사업자등록번호

    -- 연락처
    phone             VARCHAR(30),                                           -- [전화번호] 전화번호
    mobile            VARCHAR(30),                                           -- [휴대폰] 휴대폰 번호
    fax               VARCHAR(30),                                           -- [팩스] 팩스 번호
    contact_person    VARCHAR(50),                                           -- [담당자] 담당자 이름
    email             VARCHAR(100),                                          -- [이메일] 이메일 주소

    -- 주소
    address1          VARCHAR(200),                                          -- [주소1] 기본 주소
    address2          VARCHAR(200),                                          -- [주소2] 상세 주소

    -- 사업 정보
    biz_type          VARCHAR(100),                                          -- [업태] 업태
    biz_item          VARCHAR(100),                                          -- [종목] 종목

    -- 계좌 정보
    bank_holder       VARCHAR(50),                                           -- [예금주] 예금주
    bank_account      VARCHAR(50),                                           -- [계좌번호] 계좌번호
    bank_nm           VARCHAR(50),                                           -- [은행명] 은행명

    -- 상태
    is_active         BOOLEAN       DEFAULT TRUE,                            -- [사용여부] 사용 여부

    -- 감사 컬럼
    created_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),       -- [생성일시] 레코드 생성 시각
    updated_at        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),       -- [수정일시] 레코드 최종 수정 시각
    created_by        VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,           -- [생성자] 레코드 생성자
    updated_by        VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER            -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_bp_type ON hkgn.business_partner(bp_type);
CREATE INDEX idx_bp_nm ON hkgn.business_partner(bp_nm);
CREATE INDEX idx_bp_active ON hkgn.business_partner(is_active);

COMMENT ON TABLE hkgn.business_partner IS '거래처 마스터 - 매출처/매입처/외주처 통합 관리';
COMMENT ON COLUMN hkgn.business_partner.bp_cd IS '[거래처코드] 거래처 식별 코드 (PK)';
COMMENT ON COLUMN hkgn.business_partner.bp_type IS '[거래처구분] SALES:매출처, PURCHASE:매입처, OUTSOURCE:외주처';
COMMENT ON COLUMN hkgn.business_partner.sales_category IS '[매출처세부구분] 유리판매/기타';
COMMENT ON COLUMN hkgn.business_partner.purchase_category IS '[매입처세부구분] 원자재/부자재';
COMMENT ON COLUMN hkgn.business_partner.bp_nm IS '[거래처명] 거래처 이름';
COMMENT ON COLUMN hkgn.business_partner.ceo_nm IS '[대표자명] 대표자 이름';
COMMENT ON COLUMN hkgn.business_partner.biz_reg_no IS '[사업자등록번호] 사업자등록번호';
COMMENT ON COLUMN hkgn.business_partner.phone IS '[전화번호] 전화번호';
COMMENT ON COLUMN hkgn.business_partner.mobile IS '[휴대폰] 휴대폰 번호';
COMMENT ON COLUMN hkgn.business_partner.fax IS '[팩스] 팩스 번호';
COMMENT ON COLUMN hkgn.business_partner.contact_person IS '[담당자] 담당자 이름';
COMMENT ON COLUMN hkgn.business_partner.email IS '[이메일] 이메일 주소';
COMMENT ON COLUMN hkgn.business_partner.address1 IS '[주소1] 기본 주소';
COMMENT ON COLUMN hkgn.business_partner.address2 IS '[주소2] 상세 주소';
COMMENT ON COLUMN hkgn.business_partner.biz_type IS '[업태] 업태';
COMMENT ON COLUMN hkgn.business_partner.biz_item IS '[종목] 종목';
COMMENT ON COLUMN hkgn.business_partner.bank_holder IS '[예금주] 예금주';
COMMENT ON COLUMN hkgn.business_partner.bank_account IS '[계좌번호] 계좌번호';
COMMENT ON COLUMN hkgn.business_partner.bank_nm IS '[은행명] 은행명';
COMMENT ON COLUMN hkgn.business_partner.is_active IS '[사용여부] 사용 여부';
COMMENT ON COLUMN hkgn.business_partner.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.business_partner.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.business_partner.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.business_partner.updated_by IS '[수정자] 레코드 최종 수정자';


-- 1-2. item_master (자재)
-- ============================================
CREATE TABLE hkgn.item_master (
    -- PK
    material_cd     VARCHAR(30)   PRIMARY KEY,                               -- [자재코드] 자재 식별 코드 (PK)

    -- 기본 정보
    material_type   VARCHAR(20)   NOT NULL,                                  -- [자재구분] PRODUCT:완제품, RAW:원판, SUB:부자재, TEMPERED:강화, ETCHED:에칭, CONTAINER:용기
    category        VARCHAR(30),                                             -- [세부분류] 원판/스페이서/격자/운반용기 등
    material_nm     VARCHAR(200)  NOT NULL,                                  -- [자재명] 자재 이름

    -- 규격 정보
    thickness       NUMERIC(6,2),                                            -- [두께] 두께 (mm)
    spec_remark     VARCHAR(200),                                            -- [기타규격] 추가 규격 정보
    color_type      VARCHAR(30),                                             -- [색상구분] 투명/그린/브론즈 등
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [기본단위] EA/M2/평/kg

    -- 가격 정보
    cost_price      NUMERIC(12,2) DEFAULT 0,                                 -- [원가] 원가
    list_price      NUMERIC(12,2) DEFAULT 0,                                 -- [정가] 정가
    purchase_price  NUMERIC(12,2) DEFAULT 0,                                 -- [매입가] 매입가
    selling_price   NUMERIC(12,2) DEFAULT 0,                                 -- [판매가] 판매가

    -- 참조 정보
    supplier_cd     VARCHAR(30),                                             -- [주거래처코드] 주거래처 코드 (→ business_partner.bp_cd)

    -- 유리 관련 정보
    sf_count        NUMERIC(8,2),                                            -- [SF수] SF 수
    mf_count        NUMERIC(8,2),                                            -- [MF수] MF 수
    glass_count     NUMERIC(8,2),                                            -- [유리수] 유리 수

    -- 상태
    is_active       BOOLEAN       DEFAULT TRUE,                              -- [사용여부] 사용 여부

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_item_master_type ON hkgn.item_master(material_type);
CREATE INDEX idx_item_master_active ON hkgn.item_master(is_active);
CREATE INDEX idx_item_master_supplier ON hkgn.item_master(supplier_cd);

COMMENT ON TABLE hkgn.item_master IS '자재 마스터 - 제품/원판/부자재/강화/에칭/용기 통합 관리';
COMMENT ON COLUMN hkgn.item_master.material_cd IS '[자재코드] 자재 식별 코드 (PK)';
COMMENT ON COLUMN hkgn.item_master.material_type IS '[자재구분] PRODUCT:완제품, RAW:원판, SUB:부자재, TEMPERED:강화, ETCHED:에칭, CONTAINER:용기';
COMMENT ON COLUMN hkgn.item_master.category IS '[세부분류] 원판/스페이서/격자/운반용기 등';
COMMENT ON COLUMN hkgn.item_master.material_nm IS '[자재명] 자재 이름';
COMMENT ON COLUMN hkgn.item_master.thickness IS '[두께] 두께 (mm)';
COMMENT ON COLUMN hkgn.item_master.spec_remark IS '[기타규격] 추가 규격 정보';
COMMENT ON COLUMN hkgn.item_master.color_type IS '[색상구분] 투명/그린/브론즈 등';
COMMENT ON COLUMN hkgn.item_master.unit IS '[기본단위] EA/M2/평/kg';
COMMENT ON COLUMN hkgn.item_master.cost_price IS '[원가] 원가';
COMMENT ON COLUMN hkgn.item_master.list_price IS '[정가] 정가';
COMMENT ON COLUMN hkgn.item_master.purchase_price IS '[매입가] 매입가';
COMMENT ON COLUMN hkgn.item_master.selling_price IS '[판매가] 판매가';
COMMENT ON COLUMN hkgn.item_master.supplier_cd IS '[주거래처코드] 주거래처 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.item_master.sf_count IS '[SF수] SF 수';
COMMENT ON COLUMN hkgn.item_master.mf_count IS '[MF수] MF 수';
COMMENT ON COLUMN hkgn.item_master.glass_count IS '[유리수] 유리 수';
COMMENT ON COLUMN hkgn.item_master.is_active IS '[사용여부] 사용 여부';
COMMENT ON COLUMN hkgn.item_master.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.item_master.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.item_master.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.item_master.updated_by IS '[수정자] 레코드 최종 수정자';


-- 1-3. site_master (현장)
-- ============================================
CREATE TABLE hkgn.site_master (
    -- PK
    site_cd         VARCHAR(30)   PRIMARY KEY,                               -- [현장코드] 현장 식별 코드 (PK)

    -- 기본 정보
    site_nm         VARCHAR(200)  NOT NULL,                                  -- [현장명] 현장 이름
    constructor_nm  VARCHAR(100),                                            -- [건설사] 건설사명

    -- 참조 정보
    bp_cd           VARCHAR(30),                                             -- [거래처코드] 거래처 코드 (→ business_partner.bp_cd)

    -- 위치 정보
    address         VARCHAR(300),                                            -- [현장주소] 현장 주소

    -- 비고
    remark          VARCHAR(500),                                            -- [비고] 비고

    -- 상태
    is_active       BOOLEAN       DEFAULT TRUE,                              -- [사용여부] 사용 여부

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_site_master_bp ON hkgn.site_master(bp_cd);
CREATE INDEX idx_site_master_active ON hkgn.site_master(is_active);

COMMENT ON TABLE hkgn.site_master IS '현장 마스터 - 건설현장/납품처 관리';
COMMENT ON COLUMN hkgn.site_master.site_cd IS '[현장코드] 현장 식별 코드 (PK)';
COMMENT ON COLUMN hkgn.site_master.site_nm IS '[현장명] 현장 이름';
COMMENT ON COLUMN hkgn.site_master.constructor_nm IS '[건설사] 건설사명';
COMMENT ON COLUMN hkgn.site_master.bp_cd IS '[거래처코드] 거래처 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.site_master.address IS '[현장주소] 현장 주소';
COMMENT ON COLUMN hkgn.site_master.remark IS '[비고] 비고';
COMMENT ON COLUMN hkgn.site_master.is_active IS '[사용여부] 사용 여부';
COMMENT ON COLUMN hkgn.site_master.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.site_master.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.site_master.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.site_master.updated_by IS '[수정자] 레코드 최종 수정자';


-- 1-4. site_price (현장별 단가)
-- ============================================
CREATE TABLE hkgn.site_price (
    -- PK
    site_price_id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [현장단가ID] 식별자 (PK, 자동증가)

    -- 참조 정보
    site_cd         VARCHAR(30)   NOT NULL,                                  -- [현장코드] 현장 코드 (→ site_master.site_cd)

    -- 사양 정보
    spec            VARCHAR(200)  NOT NULL,                                  -- [사양] 사양 (예: 5CL(HS)+12AR+5CL(HS) 22T)
    remark          VARCHAR(200),                                            -- [비고] 비고 (아르곤/TPS 등)

    -- 단가 정보
    bid_price       NUMERIC(12,2) DEFAULT 0,                                 -- [입찰실행단가] 입찰실행단가
    proc_price      NUMERIC(12,2) DEFAULT 0,                                 -- [가공단가] 가공단가
    processing_cost NUMERIC(12,2) DEFAULT 0,                                 -- [가공비] 가공비
    argon_cost      NUMERIC(12,2) DEFAULT 0,                                 -- [아르곤비] 아르곤 비용
    insul_cost      NUMERIC(12,2) DEFAULT 0,                                 -- [단열비] 단열 비용
    struct_cost     NUMERIC(12,2) DEFAULT 0,                                 -- [구조용비] 구조용 비용
    edge_cost       NUMERIC(12,2) DEFAULT 0,                                 -- [엣지비] 엣지 비용
    etching_cost    NUMERIC(12,2) DEFAULT 0,                                 -- [에칭비] 에칭 비용
    step_cost       NUMERIC(12,2) DEFAULT 0,                                 -- [스텝비] 스텝 비용
    deform_cost     NUMERIC(12,2) DEFAULT 0,                                 -- [이형비] 이형 비용
    temper1_cost    NUMERIC(12,2) DEFAULT 0,                                 -- [강화1비] 강화1 비용
    temper2_cost    NUMERIC(12,2) DEFAULT 0,                                 -- [강화2비] 강화2 비용
    temper3_cost    NUMERIC(12,2) DEFAULT 0,                                 -- [강화3비] 강화3 비용

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_site_price_site ON hkgn.site_price(site_cd);

COMMENT ON TABLE hkgn.site_price IS '현장별 유리사양 단가 정보';
COMMENT ON COLUMN hkgn.site_price.site_price_id IS '[현장단가ID] 식별자 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.site_price.site_cd IS '[현장코드] 현장 코드 (→ site_master.site_cd)';
COMMENT ON COLUMN hkgn.site_price.spec IS '[사양] 사양 (예: 5CL(HS)+12AR+5CL(HS) 22T)';
COMMENT ON COLUMN hkgn.site_price.remark IS '[비고] 비고 (아르곤/TPS 등)';
COMMENT ON COLUMN hkgn.site_price.bid_price IS '[입찰실행단가] 입찰실행단가';
COMMENT ON COLUMN hkgn.site_price.proc_price IS '[가공단가] 가공단가';
COMMENT ON COLUMN hkgn.site_price.processing_cost IS '[가공비] 가공비';
COMMENT ON COLUMN hkgn.site_price.argon_cost IS '[아르곤비] 아르곤 비용';
COMMENT ON COLUMN hkgn.site_price.insul_cost IS '[단열비] 단열 비용';
COMMENT ON COLUMN hkgn.site_price.struct_cost IS '[구조용비] 구조용 비용';
COMMENT ON COLUMN hkgn.site_price.edge_cost IS '[엣지비] 엣지 비용';
COMMENT ON COLUMN hkgn.site_price.etching_cost IS '[에칭비] 에칭 비용';
COMMENT ON COLUMN hkgn.site_price.step_cost IS '[스텝비] 스텝 비용';
COMMENT ON COLUMN hkgn.site_price.deform_cost IS '[이형비] 이형 비용';
COMMENT ON COLUMN hkgn.site_price.temper1_cost IS '[강화1비] 강화1 비용';
COMMENT ON COLUMN hkgn.site_price.temper2_cost IS '[강화2비] 강화2 비용';
COMMENT ON COLUMN hkgn.site_price.temper3_cost IS '[강화3비] 강화3 비용';
COMMENT ON COLUMN hkgn.site_price.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.site_price.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.site_price.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.site_price.updated_by IS '[수정자] 레코드 최종 수정자';


-- 1-5. worker (작업자)
-- ============================================
CREATE TABLE hkgn.worker (
    -- PK
    worker_cd       VARCHAR(30)   PRIMARY KEY,                               -- [작업자코드] 작업자 식별 코드 (PK)

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

CREATE INDEX idx_worker_dept ON hkgn.worker(dept);
CREATE INDEX idx_worker_active ON hkgn.worker(is_active);

COMMENT ON TABLE hkgn.worker IS '작업자 마스터';
COMMENT ON COLUMN hkgn.worker.worker_cd IS '[작업자코드] 작업자 식별 코드 (PK)';
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


-- 1-6. standard_terms (표준용어)
-- ============================================
CREATE TABLE hkgn.standard_terms (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 그룹 정보
    term_group      VARCHAR(50)   NOT NULL,                                  -- [용어그룹] 용어 그룹 (PAYMENT:결제조건, DELIVERY:배송조건, QUALITY:품질기준)
    term_code       VARCHAR(50)   NOT NULL,                                  -- [용어코드] 용어 코드

    -- 명칭
    term_name_kr    VARCHAR(200)  NOT NULL,                                  -- [용어명(한글)] 한글 명칭
    term_name_en    VARCHAR(200),                                            -- [용어명(영문)] 영문 명칭

    -- 설명
    description     TEXT,                                                    -- [설명] 상세 설명
    abbreviation    VARCHAR(20),                                             -- [약어] 약어

    -- 정렬 순서
    sort_order      INTEGER       DEFAULT 0,                                 -- [정렬순서] 표시 순서

    -- 상태
    is_active       BOOLEAN       DEFAULT TRUE,                              -- [사용여부] 사용 여부

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [수정자] 레코드 최종 수정자

    -- 제약조건
    UNIQUE(term_group, term_code)
);

CREATE INDEX idx_standard_terms_group ON hkgn.standard_terms(term_group);
CREATE INDEX idx_standard_terms_active ON hkgn.standard_terms(is_active);

COMMENT ON TABLE hkgn.standard_terms IS '표준 용어 - 거래 조건, 약어 등 표준 코드';
COMMENT ON COLUMN hkgn.standard_terms.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.standard_terms.term_group IS '[용어그룹] 용어 그룹 (PAYMENT:결제조건, DELIVERY:배송조건, QUALITY:품질기준)';
COMMENT ON COLUMN hkgn.standard_terms.term_code IS '[용어코드] 용어 코드';
COMMENT ON COLUMN hkgn.standard_terms.term_name_kr IS '[용어명(한글)] 한글 명칭';
COMMENT ON COLUMN hkgn.standard_terms.term_name_en IS '[용어명(영문)] 영문 명칭';
COMMENT ON COLUMN hkgn.standard_terms.description IS '[설명] 상세 설명';
COMMENT ON COLUMN hkgn.standard_terms.abbreviation IS '[약어] 약어';
COMMENT ON COLUMN hkgn.standard_terms.sort_order IS '[정렬순서] 표시 순서';
COMMENT ON COLUMN hkgn.standard_terms.is_active IS '[사용여부] 사용 여부';
COMMENT ON COLUMN hkgn.standard_terms.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.standard_terms.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.standard_terms.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.standard_terms.updated_by IS '[수정자] 레코드 최종 수정자';


-- ============================================
-- [2] 영업/수주 (Sales Order) - 2개
-- ============================================

-- 2-1. sales_order_header (수주 헤더)
-- ============================================
CREATE TABLE hkgn.sales_order_header (
    -- PK
    order_no        VARCHAR(30)   PRIMARY KEY,                               -- [수주번호] 수주 문서 번호 (PK)

    -- 기본 정보
    order_date      DATE          NOT NULL,                                  -- [수주일] 수주 접수일
    delivery_date   DATE,                                                    -- [납기일] 약속된 납품일
    customer_cd     VARCHAR(30)   NOT NULL,                                  -- [고객사코드] 고객사 코드 (→ business_partner.bp_cd)

    -- 현장 정보
    site_cd         VARCHAR(30),                                             -- [현장코드] 납품 현장 코드 (→ site_master.site_cd)
    site_address    VARCHAR(500),                                            -- [현장주소] 납품 현장 주소

    -- 금액 정보
    total_amount    NUMERIC(15,2) DEFAULT 0,                                 -- [총금액] 수주 총 금액
    tax_amount      NUMERIC(15,2) DEFAULT 0,                                 -- [부가세] 부가세 금액
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 상태
    order_status    VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [수주상태] PENDING:대기, CONFIRMED:확정, PROCESSING:진행중, COMPLETED:완료, CANCELLED:취소
    is_urgent       BOOLEAN       DEFAULT FALSE,                             -- [긴급여부] 긴급 주문 여부

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_sales_order_header_date ON hkgn.sales_order_header(order_date);
CREATE INDEX idx_sales_order_header_customer ON hkgn.sales_order_header(customer_cd);
CREATE INDEX idx_sales_order_header_site ON hkgn.sales_order_header(site_cd);
CREATE INDEX idx_sales_order_header_status ON hkgn.sales_order_header(order_status);
CREATE INDEX idx_sales_order_header_delivery ON hkgn.sales_order_header(delivery_date);

COMMENT ON TABLE hkgn.sales_order_header IS '수주 헤더 - 판매 주문 기본 정보';
COMMENT ON COLUMN hkgn.sales_order_header.order_no IS '[수주번호] 수주 문서 번호 (PK)';
COMMENT ON COLUMN hkgn.sales_order_header.order_date IS '[수주일] 수주 접수일';
COMMENT ON COLUMN hkgn.sales_order_header.delivery_date IS '[납기일] 약속된 납품일';
COMMENT ON COLUMN hkgn.sales_order_header.customer_cd IS '[고객사코드] 고객사 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.sales_order_header.site_cd IS '[현장코드] 납품 현장 코드 (→ site_master.site_cd)';
COMMENT ON COLUMN hkgn.sales_order_header.site_address IS '[현장주소] 납품 현장 주소';
COMMENT ON COLUMN hkgn.sales_order_header.total_amount IS '[총금액] 수주 총 금액';
COMMENT ON COLUMN hkgn.sales_order_header.tax_amount IS '[부가세] 부가세 금액';
COMMENT ON COLUMN hkgn.sales_order_header.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.sales_order_header.order_status IS '[수주상태] PENDING:대기, CONFIRMED:확정, PROCESSING:진행중, COMPLETED:완료, CANCELLED:취소';
COMMENT ON COLUMN hkgn.sales_order_header.is_urgent IS '[긴급여부] 긴급 주문 여부';
COMMENT ON COLUMN hkgn.sales_order_header.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.sales_order_header.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.sales_order_header.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.sales_order_header.updated_by IS '[수정자] 레코드 최종 수정자';


-- 2-2. sales_order_detail (수주 상세)
-- ============================================
CREATE TABLE hkgn.sales_order_detail (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- FK
    order_no        VARCHAR(30)   NOT NULL,                                  -- [수주번호] 수주 헤더 참조 (→ sales_order_header.order_no)
    line_no         INTEGER       NOT NULL,                                  -- [행번호] 수주 품목 순번

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 주문 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량/금액
    order_qty       NUMERIC(12,2) NOT NULL,                                  -- [수주수량] 주문 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평/kg
    unit_price      NUMERIC(12,2) NOT NULL,                                  -- [단가] 개당/단위당 가격
    supply_amount   NUMERIC(15,2) NOT NULL,                                  -- [공급가액] 수량 × 단가
    tax_amount      NUMERIC(15,2) DEFAULT 0,                                 -- [부가세] 부가세 금액

    -- 진행 상태
    produced_qty    NUMERIC(12,2) DEFAULT 0,                                 -- [생산수량] 생산 완료 수량
    delivered_qty   NUMERIC(12,2) DEFAULT 0,                                 -- [출하수량] 출하 완료 수량
    line_status     VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [행상태] PENDING:대기, CONFIRMED:확정, PRODUCING:생산중, COMPLETED:완료

    -- 비고
    remarks         TEXT,                                                    -- [비고] 품목별 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [수정자] 레코드 최종 수정자

    -- 제약조건
    UNIQUE(order_no, line_no)
);

CREATE INDEX idx_sales_order_detail_order ON hkgn.sales_order_detail(order_no);
CREATE INDEX idx_sales_order_detail_material ON hkgn.sales_order_detail(material_cd);
CREATE INDEX idx_sales_order_detail_status ON hkgn.sales_order_detail(line_status);

COMMENT ON TABLE hkgn.sales_order_detail IS '수주 상세 - 판매 주문 품목별 상세';
COMMENT ON COLUMN hkgn.sales_order_detail.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.sales_order_detail.order_no IS '[수주번호] 수주 헤더 참조 (→ sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.sales_order_detail.line_no IS '[행번호] 수주 품목 순번';
COMMENT ON COLUMN hkgn.sales_order_detail.material_cd IS '[자재코드] 주문 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.sales_order_detail.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.sales_order_detail.order_qty IS '[수주수량] 주문 수량';
COMMENT ON COLUMN hkgn.sales_order_detail.unit IS '[단위] EA/M2/평/kg';
COMMENT ON COLUMN hkgn.sales_order_detail.unit_price IS '[단가] 개당/단위당 가격';
COMMENT ON COLUMN hkgn.sales_order_detail.supply_amount IS '[공급가액] 수량 × 단가';
COMMENT ON COLUMN hkgn.sales_order_detail.tax_amount IS '[부가세] 부가세 금액';
COMMENT ON COLUMN hkgn.sales_order_detail.produced_qty IS '[생산수량] 생산 완료 수량';
COMMENT ON COLUMN hkgn.sales_order_detail.delivered_qty IS '[출하수량] 출하 완료 수량';
COMMENT ON COLUMN hkgn.sales_order_detail.line_status IS '[행상태] PENDING:대기, CONFIRMED:확정, PRODUCING:생산중, COMPLETED:완료';
COMMENT ON COLUMN hkgn.sales_order_detail.remarks IS '[비고] 품목별 특이사항';
COMMENT ON COLUMN hkgn.sales_order_detail.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.sales_order_detail.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.sales_order_detail.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.sales_order_detail.updated_by IS '[수정자] 레코드 최종 수정자';


-- ============================================
-- [3] 생산 (Production) - 4개
-- ============================================

-- 3-1. production_plan (생산계획)
-- ============================================
CREATE TABLE hkgn.production_plan (
    -- PK
    plan_no         VARCHAR(30)   PRIMARY KEY,                               -- [계획번호] 생산 계획 번호 (PK)

    -- 기본 정보
    plan_date       DATE          NOT NULL,                                  -- [계획일] 생산 계획 일자
    plan_type       VARCHAR(20)   NOT NULL DEFAULT 'DAILY',                  -- [계획유형] DAILY:일일, WEEKLY:주간, MONTHLY:월간

    -- 상태
    plan_status     VARCHAR(20)   NOT NULL DEFAULT 'DRAFT',                  -- [계획상태] DRAFT:작성중, CONFIRMED:확정, PROCESSING:진행중, COMPLETED:완료
    confirmed_at    TIMESTAMP WITH TIME ZONE,                                -- [확정일시] 계획 확정 시각
    confirmed_by    VARCHAR(100),                                            -- [확정자] 계획 확정자

    -- 비고
    remarks         TEXT,                                                    -- [비고] 계획 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_production_plan_date ON hkgn.production_plan(plan_date);
CREATE INDEX idx_production_plan_status ON hkgn.production_plan(plan_status);
CREATE INDEX idx_production_plan_type ON hkgn.production_plan(plan_type);

COMMENT ON TABLE hkgn.production_plan IS '생산 계획 헤더 - 일일 생산 계획';
COMMENT ON COLUMN hkgn.production_plan.plan_no IS '[계획번호] 생산 계획 번호 (PK)';
COMMENT ON COLUMN hkgn.production_plan.plan_date IS '[계획일] 생산 계획 일자';
COMMENT ON COLUMN hkgn.production_plan.plan_type IS '[계획유형] DAILY:일일, WEEKLY:주간, MONTHLY:월간';
COMMENT ON COLUMN hkgn.production_plan.plan_status IS '[계획상태] DRAFT:작성중, CONFIRMED:확정, PROCESSING:진행중, COMPLETED:완료';
COMMENT ON COLUMN hkgn.production_plan.confirmed_at IS '[확정일시] 계획 확정 시각';
COMMENT ON COLUMN hkgn.production_plan.confirmed_by IS '[확정자] 계획 확정자';
COMMENT ON COLUMN hkgn.production_plan.remarks IS '[비고] 계획 특이사항';
COMMENT ON COLUMN hkgn.production_plan.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.production_plan.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.production_plan.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.production_plan.updated_by IS '[수정자] 레코드 최종 수정자';


-- 3-2. production_plan_detail (생산계획 상세)
-- ============================================
CREATE TABLE hkgn.production_plan_detail (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- FK
    plan_no         VARCHAR(30)   NOT NULL,                                  -- [계획번호] 생산 계획 헤더 참조 (→ production_plan.plan_no)
    line_no         INTEGER       NOT NULL,                                  -- [행번호] 계획 품목 순번

    -- 수주 정보
    order_no        VARCHAR(30),                                             -- [수주번호] 연관 수주 번호 (→ sales_order_header.order_no)
    order_line_no   INTEGER,                                                 -- [수주행번호] 연관 수주 상세 행번호

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 생산 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량
    plan_qty        NUMERIC(12,2) NOT NULL,                                  -- [계획수량] 생산 계획 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평/kg
    produced_qty    NUMERIC(12,2) DEFAULT 0,                                 -- [생산수량] 실제 생산 수량

    -- 우선순위
    priority        INTEGER       DEFAULT 0,                                 -- [우선순위] 생산 우선순위 (높을수록 높음)

    -- 비고
    remarks         TEXT,                                                    -- [비고] 품목별 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [수정자] 레코드 최종 수정자

    -- 제약조건
    UNIQUE(plan_no, line_no)
);

CREATE INDEX idx_production_plan_detail_plan ON hkgn.production_plan_detail(plan_no);
CREATE INDEX idx_production_plan_detail_order ON hkgn.production_plan_detail(order_no);
CREATE INDEX idx_production_plan_detail_material ON hkgn.production_plan_detail(material_cd);

COMMENT ON TABLE hkgn.production_plan_detail IS '생산 계획 상세 - 품목별 생산 계획';
COMMENT ON COLUMN hkgn.production_plan_detail.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.production_plan_detail.plan_no IS '[계획번호] 생산 계획 헤더 참조 (→ production_plan.plan_no)';
COMMENT ON COLUMN hkgn.production_plan_detail.line_no IS '[행번호] 계획 품목 순번';
COMMENT ON COLUMN hkgn.production_plan_detail.order_no IS '[수주번호] 연관 수주 번호 (→ sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.production_plan_detail.order_line_no IS '[수주행번호] 연관 수주 상세 행번호';
COMMENT ON COLUMN hkgn.production_plan_detail.material_cd IS '[자재코드] 생산 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.production_plan_detail.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.production_plan_detail.plan_qty IS '[계획수량] 생산 계획 수량';
COMMENT ON COLUMN hkgn.production_plan_detail.unit IS '[단위] EA/M2/평/kg';
COMMENT ON COLUMN hkgn.production_plan_detail.produced_qty IS '[생산수량] 실제 생산 수량';
COMMENT ON COLUMN hkgn.production_plan_detail.priority IS '[우선순위] 생산 우선순위 (높을수록 높음)';
COMMENT ON COLUMN hkgn.production_plan_detail.remarks IS '[비고] 품목별 특이사항';
COMMENT ON COLUMN hkgn.production_plan_detail.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.production_plan_detail.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.production_plan_detail.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.production_plan_detail.updated_by IS '[수정자] 레코드 최종 수정자';


-- 3-3. production_result (생산실적)
-- ============================================
CREATE TABLE hkgn.production_result (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    production_no   VARCHAR(30)   NOT NULL UNIQUE,                           -- [생산번호] 생산 실적 문서 번호
    production_date DATE          NOT NULL,                                  -- [생산일] 생산 완료일

    -- FK
    plan_no         VARCHAR(30),                                             -- [계획번호] 생산 계획 참조 (→ production_plan.plan_no)
    plan_line_no    INTEGER,                                                 -- [계획행번호] 생산 계획 상세 행번호
    order_no        VARCHAR(30),                                             -- [수주번호] 연관 수주 번호 (→ sales_order_header.order_no)

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 생산 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량
    good_qty        NUMERIC(12,2) NOT NULL DEFAULT 0,                        -- [양품수량] 양품 수량
    defect_qty      NUMERIC(12,2) DEFAULT 0,                                 -- [불량수량] 불량 수량
    total_qty       NUMERIC(12,2) NOT NULL,                                  -- [총수량] 총 생산 수량 (양품 + 불량)
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평/kg

    -- 작업자 정보
    worker_cd       VARCHAR(30),                                             -- [작업자코드] 생산 담당자 (→ worker.worker_cd)

    -- 비고
    defect_reason   TEXT,                                                    -- [불량사유] 불량 발생 사유
    remarks         TEXT,                                                    -- [비고] 실적 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_production_result_date ON hkgn.production_result(production_date);
CREATE INDEX idx_production_result_plan ON hkgn.production_result(plan_no);
CREATE INDEX idx_production_result_order ON hkgn.production_result(order_no);
CREATE INDEX idx_production_result_material ON hkgn.production_result(material_cd);
CREATE INDEX idx_production_result_worker ON hkgn.production_result(worker_cd);

COMMENT ON TABLE hkgn.production_result IS '생산 실적 - 생산 완료 기록';
COMMENT ON COLUMN hkgn.production_result.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.production_result.production_no IS '[생산번호] 생산 실적 문서 번호';
COMMENT ON COLUMN hkgn.production_result.production_date IS '[생산일] 생산 완료일';
COMMENT ON COLUMN hkgn.production_result.plan_no IS '[계획번호] 생산 계획 참조 (→ production_plan.plan_no)';
COMMENT ON COLUMN hkgn.production_result.plan_line_no IS '[계획행번호] 생산 계획 상세 행번호';
COMMENT ON COLUMN hkgn.production_result.order_no IS '[수주번호] 연관 수주 번호 (→ sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.production_result.material_cd IS '[자재코드] 생산 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.production_result.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.production_result.good_qty IS '[양품수량] 양품 수량';
COMMENT ON COLUMN hkgn.production_result.defect_qty IS '[불량수량] 불량 수량';
COMMENT ON COLUMN hkgn.production_result.total_qty IS '[총수량] 총 생산 수량 (양품 + 불량)';
COMMENT ON COLUMN hkgn.production_result.unit IS '[단위] EA/M2/평/kg';
COMMENT ON COLUMN hkgn.production_result.worker_cd IS '[작업자코드] 생산 담당자 (→ worker.worker_cd)';
COMMENT ON COLUMN hkgn.production_result.defect_reason IS '[불량사유] 불량 발생 사유';
COMMENT ON COLUMN hkgn.production_result.remarks IS '[비고] 실적 특이사항';
COMMENT ON COLUMN hkgn.production_result.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.production_result.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.production_result.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.production_result.updated_by IS '[수정자] 레코드 최종 수정자';


-- 3-4. cutting_daily_report (재단일보)
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

CREATE INDEX idx_cutting_daily_report_date ON hkgn.cutting_daily_report(report_date);
CREATE INDEX idx_cutting_daily_report_material ON hkgn.cutting_daily_report(raw_material_cd);
CREATE INDEX idx_cutting_daily_report_worker ON hkgn.cutting_daily_report(worker_cd);

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


-- ============================================
-- [4] 포장/출고 (Packing & Delivery) - 3개
-- ============================================

-- 4-1. packing_order (포장지시)
-- ============================================
CREATE TABLE hkgn.packing_order (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    packing_no      VARCHAR(30)   NOT NULL UNIQUE,                           -- [포장번호] 포장 지시 문서 번호
    packing_date    DATE          NOT NULL,                                  -- [포장일] 포장 작업일

    -- FK
    order_no        VARCHAR(30)   NOT NULL,                                  -- [수주번호] 연관 수주 번호 (→ sales_order_header.order_no)

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 포장 대상 자재 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량
    packing_qty     NUMERIC(12,2) NOT NULL,                                  -- [포장수량] 포장 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평

    -- 용기 정보
    container_cd    VARCHAR(30),                                             -- [용기코드] 사용 용기 코드 (→ item_master.material_cd, material_type='CONTAINER')
    container_qty   INTEGER       DEFAULT 0,                                 -- [용기수량] 사용한 용기 수량

    -- 작업자 정보
    worker_cd       VARCHAR(30),                                             -- [작업자코드] 포장 담당자 (→ worker.worker_cd)

    -- 상태
    packing_status  VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [포장상태] PENDING:대기, PROCESSING:작업중, COMPLETED:완료

    -- 비고
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_packing_order_date ON hkgn.packing_order(packing_date);
CREATE INDEX idx_packing_order_order ON hkgn.packing_order(order_no);
CREATE INDEX idx_packing_order_material ON hkgn.packing_order(material_cd);
CREATE INDEX idx_packing_order_status ON hkgn.packing_order(packing_status);

COMMENT ON TABLE hkgn.packing_order IS '포장 지시 - 출하 전 포장 작업 지시';
COMMENT ON COLUMN hkgn.packing_order.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.packing_order.packing_no IS '[포장번호] 포장 지시 문서 번호';
COMMENT ON COLUMN hkgn.packing_order.packing_date IS '[포장일] 포장 작업일';
COMMENT ON COLUMN hkgn.packing_order.order_no IS '[수주번호] 연관 수주 번호 (→ sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.packing_order.material_cd IS '[자재코드] 포장 대상 자재 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.packing_order.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.packing_order.packing_qty IS '[포장수량] 포장 수량';
COMMENT ON COLUMN hkgn.packing_order.unit IS '[단위] EA/M2/평';
COMMENT ON COLUMN hkgn.packing_order.container_cd IS '[용기코드] 사용 용기 코드 (→ item_master.material_cd, material_type=CONTAINER)';
COMMENT ON COLUMN hkgn.packing_order.container_qty IS '[용기수량] 사용한 용기 수량';
COMMENT ON COLUMN hkgn.packing_order.worker_cd IS '[작업자코드] 포장 담당자 (→ worker.worker_cd)';
COMMENT ON COLUMN hkgn.packing_order.packing_status IS '[포장상태] PENDING:대기, PROCESSING:작업중, COMPLETED:완료';
COMMENT ON COLUMN hkgn.packing_order.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.packing_order.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.packing_order.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.packing_order.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.packing_order.updated_by IS '[수정자] 레코드 최종 수정자';


-- 4-2. delivery_header (출고 헤더)
-- ============================================
CREATE TABLE hkgn.delivery_header (
    -- PK
    delivery_no     VARCHAR(30)   PRIMARY KEY,                               -- [출하번호] 출하 문서 번호 (PK)

    -- 기본 정보
    delivery_date   DATE          NOT NULL,                                  -- [출하일] 출하 예정일
    actual_date     DATE,                                                    -- [실출하일] 실제 출하일

    -- FK
    order_no        VARCHAR(30)   NOT NULL,                                  -- [수주번호] 연관 수주 번호 (→ sales_order_header.order_no)
    customer_cd     VARCHAR(30)   NOT NULL,                                  -- [고객사코드] 고객사 코드 (→ business_partner.bp_cd)
    site_cd         VARCHAR(30),                                             -- [현장코드] 출하 현장 코드 (→ site_master.site_cd)

    -- 배송 정보
    delivery_address VARCHAR(500),                                           -- [배송주소] 배송지 주소
    vehicle_no      VARCHAR(20),                                             -- [차량번호] 배송 차량 번호
    driver_nm       VARCHAR(100),                                            -- [기사명] 배송 기사 이름
    driver_phone    VARCHAR(20),                                             -- [기사연락처] 배송 기사 전화번호

    -- 상태
    delivery_status VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [출하상태] PENDING:대기, LOADING:적재중, SHIPPED:출하완료, DELIVERED:배송완료

    -- 비고
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_delivery_header_date ON hkgn.delivery_header(delivery_date);
CREATE INDEX idx_delivery_header_order ON hkgn.delivery_header(order_no);
CREATE INDEX idx_delivery_header_customer ON hkgn.delivery_header(customer_cd);
CREATE INDEX idx_delivery_header_site ON hkgn.delivery_header(site_cd);
CREATE INDEX idx_delivery_header_status ON hkgn.delivery_header(delivery_status);

COMMENT ON TABLE hkgn.delivery_header IS '출하 헤더 - 출하 지시 기본 정보';
COMMENT ON COLUMN hkgn.delivery_header.delivery_no IS '[출하번호] 출하 문서 번호 (PK)';
COMMENT ON COLUMN hkgn.delivery_header.delivery_date IS '[출하일] 출하 예정일';
COMMENT ON COLUMN hkgn.delivery_header.actual_date IS '[실출하일] 실제 출하일';
COMMENT ON COLUMN hkgn.delivery_header.order_no IS '[수주번호] 연관 수주 번호 (→ sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.delivery_header.customer_cd IS '[고객사코드] 고객사 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.delivery_header.site_cd IS '[현장코드] 출하 현장 코드 (→ site_master.site_cd)';
COMMENT ON COLUMN hkgn.delivery_header.delivery_address IS '[배송주소] 배송지 주소';
COMMENT ON COLUMN hkgn.delivery_header.vehicle_no IS '[차량번호] 배송 차량 번호';
COMMENT ON COLUMN hkgn.delivery_header.driver_nm IS '[기사명] 배송 기사 이름';
COMMENT ON COLUMN hkgn.delivery_header.driver_phone IS '[기사연락처] 배송 기사 전화번호';
COMMENT ON COLUMN hkgn.delivery_header.delivery_status IS '[출하상태] PENDING:대기, LOADING:적재중, SHIPPED:출하완료, DELIVERED:배송완료';
COMMENT ON COLUMN hkgn.delivery_header.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.delivery_header.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.delivery_header.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.delivery_header.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.delivery_header.updated_by IS '[수정자] 레코드 최종 수정자';


-- 4-3. delivery_detail (출고 상세)
-- ============================================
CREATE TABLE hkgn.delivery_detail (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- FK
    delivery_no     VARCHAR(30)   NOT NULL,                                  -- [출하번호] 출하 헤더 참조 (→ delivery_header.delivery_no)
    line_no         INTEGER       NOT NULL,                                  -- [행번호] 출하 품목 순번

    -- 수주 정보
    order_no        VARCHAR(30),                                             -- [수주번호] 연관 수주 번호 (→ sales_order_header.order_no)
    order_line_no   INTEGER,                                                 -- [수주행번호] 연관 수주 상세 행번호

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 출하 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량
    delivery_qty    NUMERIC(12,2) NOT NULL,                                  -- [출하수량] 출하 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평/kg

    -- 비고
    remarks         TEXT,                                                    -- [비고] 품목별 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [수정자] 레코드 최종 수정자

    -- 제약조건
    UNIQUE(delivery_no, line_no)
);

CREATE INDEX idx_delivery_detail_delivery ON hkgn.delivery_detail(delivery_no);
CREATE INDEX idx_delivery_detail_order ON hkgn.delivery_detail(order_no);
CREATE INDEX idx_delivery_detail_material ON hkgn.delivery_detail(material_cd);

COMMENT ON TABLE hkgn.delivery_detail IS '출하 상세 - 출하 품목별 상세';
COMMENT ON COLUMN hkgn.delivery_detail.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.delivery_detail.delivery_no IS '[출하번호] 출하 헤더 참조 (→ delivery_header.delivery_no)';
COMMENT ON COLUMN hkgn.delivery_detail.line_no IS '[행번호] 출하 품목 순번';
COMMENT ON COLUMN hkgn.delivery_detail.order_no IS '[수주번호] 연관 수주 번호 (→ sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.delivery_detail.order_line_no IS '[수주행번호] 연관 수주 상세 행번호';
COMMENT ON COLUMN hkgn.delivery_detail.material_cd IS '[자재코드] 출하 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.delivery_detail.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.delivery_detail.delivery_qty IS '[출하수량] 출하 수량';
COMMENT ON COLUMN hkgn.delivery_detail.unit IS '[단위] EA/M2/평/kg';
COMMENT ON COLUMN hkgn.delivery_detail.remarks IS '[비고] 품목별 특이사항';
COMMENT ON COLUMN hkgn.delivery_detail.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.delivery_detail.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.delivery_detail.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.delivery_detail.updated_by IS '[수정자] 레코드 최종 수정자';


-- ============================================
-- [5] 구매 (Procurement) - 3개
-- ============================================

-- 5-1. purchase_order (구매발주)
-- ============================================
CREATE TABLE hkgn.purchase_order (
    -- PK
    po_no           VARCHAR(30)   PRIMARY KEY,                               -- [발주번호] 발주 문서 번호 (PK)

    -- 기본 정보
    po_date         DATE          NOT NULL,                                  -- [발주일] 발주 일자
    delivery_date   DATE,                                                    -- [납기일] 요청 납기일
    supplier_cd     VARCHAR(30)   NOT NULL,                                  -- [공급사코드] 공급사 코드 (→ business_partner.bp_cd)

    -- 금액 정보
    total_amount    NUMERIC(15,2) DEFAULT 0,                                 -- [총금액] 발주 총 금액
    tax_amount      NUMERIC(15,2) DEFAULT 0,                                 -- [부가세] 부가세 금액
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 상태
    po_status       VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [발주상태] PENDING:대기, CONFIRMED:확정, RECEIVING:입고중, COMPLETED:완료, CANCELLED:취소

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_purchase_order_date ON hkgn.purchase_order(po_date);
CREATE INDEX idx_purchase_order_supplier ON hkgn.purchase_order(supplier_cd);
CREATE INDEX idx_purchase_order_status ON hkgn.purchase_order(po_status);
CREATE INDEX idx_purchase_order_delivery ON hkgn.purchase_order(delivery_date);

COMMENT ON TABLE hkgn.purchase_order IS '발주 헤더 - 구매 발주 기본 정보';
COMMENT ON COLUMN hkgn.purchase_order.po_no IS '[발주번호] 발주 문서 번호 (PK)';
COMMENT ON COLUMN hkgn.purchase_order.po_date IS '[발주일] 발주 일자';
COMMENT ON COLUMN hkgn.purchase_order.delivery_date IS '[납기일] 요청 납기일';
COMMENT ON COLUMN hkgn.purchase_order.supplier_cd IS '[공급사코드] 공급사 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.purchase_order.total_amount IS '[총금액] 발주 총 금액';
COMMENT ON COLUMN hkgn.purchase_order.tax_amount IS '[부가세] 부가세 금액';
COMMENT ON COLUMN hkgn.purchase_order.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.purchase_order.po_status IS '[발주상태] PENDING:대기, CONFIRMED:확정, RECEIVING:입고중, COMPLETED:완료, CANCELLED:취소';
COMMENT ON COLUMN hkgn.purchase_order.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.purchase_order.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.purchase_order.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.purchase_order.updated_by IS '[수정자] 레코드 최종 수정자';


-- 5-2. purchase_order_detail (구매발주 상세)
-- ============================================
CREATE TABLE hkgn.purchase_order_detail (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- FK
    po_no           VARCHAR(30)   NOT NULL,                                  -- [발주번호] 발주 헤더 참조 (→ purchase_order.po_no)
    line_no         INTEGER       NOT NULL,                                  -- [행번호] 발주 품목 순번

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 발주 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량/금액
    order_qty       NUMERIC(12,2) NOT NULL,                                  -- [발주수량] 발주 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평/kg
    unit_price      NUMERIC(12,2) NOT NULL,                                  -- [단가] 개당/단위당 가격
    supply_amount   NUMERIC(15,2) NOT NULL,                                  -- [공급가액] 수량 × 단가
    tax_amount      NUMERIC(15,2) DEFAULT 0,                                 -- [부가세] 부가세 금액

    -- 진행 상태
    received_qty    NUMERIC(12,2) DEFAULT 0,                                 -- [입고수량] 입고 완료 수량
    line_status     VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [행상태] PENDING:대기, CONFIRMED:확정, RECEIVING:입고중, COMPLETED:완료

    -- 비고
    remarks         TEXT,                                                    -- [비고] 품목별 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [수정자] 레코드 최종 수정자

    -- 제약조건
    UNIQUE(po_no, line_no)
);

CREATE INDEX idx_purchase_order_detail_po ON hkgn.purchase_order_detail(po_no);
CREATE INDEX idx_purchase_order_detail_material ON hkgn.purchase_order_detail(material_cd);
CREATE INDEX idx_purchase_order_detail_status ON hkgn.purchase_order_detail(line_status);

COMMENT ON TABLE hkgn.purchase_order_detail IS '발주 상세 - 구매 발주 품목별 상세';
COMMENT ON COLUMN hkgn.purchase_order_detail.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.purchase_order_detail.po_no IS '[발주번호] 발주 헤더 참조 (→ purchase_order.po_no)';
COMMENT ON COLUMN hkgn.purchase_order_detail.line_no IS '[행번호] 발주 품목 순번';
COMMENT ON COLUMN hkgn.purchase_order_detail.material_cd IS '[자재코드] 발주 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.purchase_order_detail.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.purchase_order_detail.order_qty IS '[발주수량] 발주 수량';
COMMENT ON COLUMN hkgn.purchase_order_detail.unit IS '[단위] EA/M2/평/kg';
COMMENT ON COLUMN hkgn.purchase_order_detail.unit_price IS '[단가] 개당/단위당 가격';
COMMENT ON COLUMN hkgn.purchase_order_detail.supply_amount IS '[공급가액] 수량 × 단가';
COMMENT ON COLUMN hkgn.purchase_order_detail.tax_amount IS '[부가세] 부가세 금액';
COMMENT ON COLUMN hkgn.purchase_order_detail.received_qty IS '[입고수량] 입고 완료 수량';
COMMENT ON COLUMN hkgn.purchase_order_detail.line_status IS '[행상태] PENDING:대기, CONFIRMED:확정, RECEIVING:입고중, COMPLETED:완료';
COMMENT ON COLUMN hkgn.purchase_order_detail.remarks IS '[비고] 품목별 특이사항';
COMMENT ON COLUMN hkgn.purchase_order_detail.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.purchase_order_detail.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.purchase_order_detail.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.purchase_order_detail.updated_by IS '[수정자] 레코드 최종 수정자';


-- 5-3. goods_receipt (입고)
-- ============================================
CREATE TABLE hkgn.goods_receipt (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    receipt_no      VARCHAR(30)   NOT NULL UNIQUE,                           -- [입고번호] 입고 문서 번호
    receipt_date    DATE          NOT NULL,                                  -- [입고일] 입고 일자

    -- FK
    po_no           VARCHAR(30),                                             -- [발주번호] 연관 발주 번호 (→ purchase_order.po_no)
    po_line_no      INTEGER,                                                 -- [발주행번호] 연관 발주 상세 행번호
    supplier_cd     VARCHAR(30)   NOT NULL,                                  -- [공급사코드] 공급사 코드 (→ business_partner.bp_cd)

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 입고 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량
    receipt_qty     NUMERIC(12,2) NOT NULL,                                  -- [입고수량] 입고 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평/kg

    -- 품질 검사
    inspected_qty   NUMERIC(12,2) DEFAULT 0,                                 -- [검사수량] 검사 수량
    passed_qty      NUMERIC(12,2) DEFAULT 0,                                 -- [합격수량] 합격 수량
    rejected_qty    NUMERIC(12,2) DEFAULT 0,                                 -- [불량수량] 불량 수량
    inspection_status VARCHAR(20) DEFAULT 'PENDING',                         -- [검사상태] PENDING:대기, PASSED:합격, REJECTED:불합격, PARTIAL:부분합격

    -- 비고
    rejection_reason TEXT,                                                   -- [불량사유] 불량 사유
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_goods_receipt_date ON hkgn.goods_receipt(receipt_date);
CREATE INDEX idx_goods_receipt_po ON hkgn.goods_receipt(po_no);
CREATE INDEX idx_goods_receipt_supplier ON hkgn.goods_receipt(supplier_cd);
CREATE INDEX idx_goods_receipt_material ON hkgn.goods_receipt(material_cd);

COMMENT ON TABLE hkgn.goods_receipt IS '입고 실적 - 자재 입고 기록';
COMMENT ON COLUMN hkgn.goods_receipt.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.goods_receipt.receipt_no IS '[입고번호] 입고 문�� 번호';
COMMENT ON COLUMN hkgn.goods_receipt.receipt_date IS '[입고일] 입고 일자';
COMMENT ON COLUMN hkgn.goods_receipt.po_no IS '[발주번호] 연관 발주 번호 (→ purchase_order.po_no)';
COMMENT ON COLUMN hkgn.goods_receipt.po_line_no IS '[발주행번호] 연관 발주 상세 행번호';
COMMENT ON COLUMN hkgn.goods_receipt.supplier_cd IS '[공급사코드] 공급사 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.goods_receipt.material_cd IS '[자재코드] 입고 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.goods_receipt.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.goods_receipt.receipt_qty IS '[입고수량] 입고 수량';
COMMENT ON COLUMN hkgn.goods_receipt.unit IS '[단위] EA/M2/평/kg';
COMMENT ON COLUMN hkgn.goods_receipt.inspected_qty IS '[검사수량] 검사 수량';
COMMENT ON COLUMN hkgn.goods_receipt.passed_qty IS '[합격수량] 합격 수량';
COMMENT ON COLUMN hkgn.goods_receipt.rejected_qty IS '[불량수량] 불량 수량';
COMMENT ON COLUMN hkgn.goods_receipt.inspection_status IS '[검사상태] PENDING:대기, PASSED:합격, REJECTED:불합격, PARTIAL:부분합격';
COMMENT ON COLUMN hkgn.goods_receipt.rejection_reason IS '[불량사유] 불량 사유';
COMMENT ON COLUMN hkgn.goods_receipt.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.goods_receipt.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.goods_receipt.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.goods_receipt.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.goods_receipt.updated_by IS '[수정자] 레코드 최종 수정자';


-- ============================================
-- [6] 재고 (Inventory) - 3개
-- ============================================

-- 6-1. inventory (재고 현황)
-- ============================================
CREATE TABLE hkgn.inventory (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL UNIQUE,                           -- [자재코드] 재고 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량 정보
    current_qty     NUMERIC(12,2) NOT NULL DEFAULT 0,                        -- [현재고] 현재 재고 수량
    available_qty   NUMERIC(12,2) NOT NULL DEFAULT 0,                        -- [가용재고] 가용 재고 (현재고 - 예약)
    reserved_qty    NUMERIC(12,2) DEFAULT 0,                                 -- [예약수량] 예약된 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평/kg

    -- 재고 기준
    min_qty         NUMERIC(12,2) DEFAULT 0,                                 -- [최소재고] 안전 재고 수량
    max_qty         NUMERIC(12,2) DEFAULT 0,                                 -- [최대재고] 최대 보유 수량

    -- 위치
    warehouse_cd    VARCHAR(30),                                             -- [창고코드] 보관 창고 코드
    location        VARCHAR(100),                                            -- [위치] 상세 보관 위치

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_inventory_material ON hkgn.inventory(material_cd);
CREATE INDEX idx_inventory_warehouse ON hkgn.inventory(warehouse_cd);

COMMENT ON TABLE hkgn.inventory IS '재고 현황 - 자재별 재고 수량 관리';
COMMENT ON COLUMN hkgn.inventory.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.inventory.material_cd IS '[자재코드] 재고 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.inventory.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.inventory.current_qty IS '[현재고] 현재 재고 수량';
COMMENT ON COLUMN hkgn.inventory.available_qty IS '[가용재고] 가용 재고 (현재고 - 예약)';
COMMENT ON COLUMN hkgn.inventory.reserved_qty IS '[예약수량] 예약된 수량';
COMMENT ON COLUMN hkgn.inventory.unit IS '[단위] EA/M2/평/kg';
COMMENT ON COLUMN hkgn.inventory.min_qty IS '[최소재고] 안전 재고 수량';
COMMENT ON COLUMN hkgn.inventory.max_qty IS '[최대재고] 최대 보유 수량';
COMMENT ON COLUMN hkgn.inventory.warehouse_cd IS '[창고코드] 보관 창고 코드';
COMMENT ON COLUMN hkgn.inventory.location IS '[위치] 상세 보관 위치';
COMMENT ON COLUMN hkgn.inventory.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.inventory.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.inventory.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.inventory.updated_by IS '[수정자] 레코드 최종 수정자';


-- 6-2. inventory_transaction (재고 이동)
-- ============================================
CREATE TABLE hkgn.inventory_transaction (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    transaction_no  VARCHAR(30)   NOT NULL,                                  -- [전표번호] 이동 전표 번호
    transaction_date DATE         NOT NULL,                                  -- [이동일] 이동 일자
    transaction_type VARCHAR(20)  NOT NULL,                                  -- [이동유형] IN:입고, OUT:출고, ADJUST:조정, MOVE:이동

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 이동 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량
    quantity        NUMERIC(12,2) NOT NULL,                                  -- [수량] 이동 수량 (양수:입고, 음수:출고)
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평/kg

    -- 이동 전후 재고
    before_qty      NUMERIC(12,2),                                           -- [이동전재고] 이동 전 재고 수량
    after_qty       NUMERIC(12,2),                                           -- [이동후재고] 이동 후 재고 수량

    -- 위치
    from_location   VARCHAR(100),                                            -- [출발위치] 출발 창고/위치
    to_location     VARCHAR(100),                                            -- [도착위치] 도착 창고/위치

    -- 참조 문서
    ref_doc_type    VARCHAR(20),                                             -- [참조문서유형] PO:발주, SO:수주, PROD:생산, DELIVERY:출하
    ref_doc_no      VARCHAR(30),                                             -- [참조문서번호] 참조 문서 번호

    -- 비고
    remarks         TEXT,                                                    -- [비고] 이동 사유/특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_inventory_transaction_date ON hkgn.inventory_transaction(transaction_date);
CREATE INDEX idx_inventory_transaction_material ON hkgn.inventory_transaction(material_cd);
CREATE INDEX idx_inventory_transaction_type ON hkgn.inventory_transaction(transaction_type);
CREATE INDEX idx_inventory_transaction_ref ON hkgn.inventory_transaction(ref_doc_type, ref_doc_no);

COMMENT ON TABLE hkgn.inventory_transaction IS '재고 이동 이력 - 입출고 트랜잭션 로그';
COMMENT ON COLUMN hkgn.inventory_transaction.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.inventory_transaction.transaction_no IS '[전표번호] 이동 전표 번호';
COMMENT ON COLUMN hkgn.inventory_transaction.transaction_date IS '[이동일] 이동 일자';
COMMENT ON COLUMN hkgn.inventory_transaction.transaction_type IS '[이동유형] IN:입고, OUT:출고, ADJUST:조정, MOVE:이동';
COMMENT ON COLUMN hkgn.inventory_transaction.material_cd IS '[자재코드] 이동 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.inventory_transaction.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.inventory_transaction.quantity IS '[수량] 이동 수량 (양수:입고, 음수:출고)';
COMMENT ON COLUMN hkgn.inventory_transaction.unit IS '[단위] EA/M2/평/kg';
COMMENT ON COLUMN hkgn.inventory_transaction.before_qty IS '[이동전재고] 이동 전 재고 수량';
COMMENT ON COLUMN hkgn.inventory_transaction.after_qty IS '[이동후재고] 이동 후 재고 수량';
COMMENT ON COLUMN hkgn.inventory_transaction.from_location IS '[출발위치] 출발 창고/위치';
COMMENT ON COLUMN hkgn.inventory_transaction.to_location IS '[도착위치] 도착 창고/위치';
COMMENT ON COLUMN hkgn.inventory_transaction.ref_doc_type IS '[참조문서유형] PO:발주, SO:수주, PROD:생산, DELIVERY:출하';
COMMENT ON COLUMN hkgn.inventory_transaction.ref_doc_no IS '[참조문서번호] 참조 문서 번호';
COMMENT ON COLUMN hkgn.inventory_transaction.remarks IS '[비고] 이동 사유/특이사항';
COMMENT ON COLUMN hkgn.inventory_transaction.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.inventory_transaction.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.inventory_transaction.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.inventory_transaction.updated_by IS '[수정자] 레코드 최종 수정자';


-- 6-3. container_inventory (용기 재고)
-- ============================================
CREATE TABLE hkgn.container_inventory (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 용기 정보
    container_cd    VARCHAR(30)   NOT NULL,                                  -- [용기코드] 용기 자재 코드 (→ item_master.material_cd, material_type='CONTAINER')
    container_nm    VARCHAR(200),                                            -- [용기명] 용기 이름 (참조용)

    -- 위치별 재고
    location        VARCHAR(100)  NOT NULL,                                  -- [위치] 보관 위치 (공장/고객사/현장)
    location_type   VARCHAR(20)   NOT NULL,                                  -- [위치구분] FACTORY:공장, CUSTOMER:고객사, SITE:현장
    bp_cd           VARCHAR(30),                                             -- [거래처코드] 고객사/현장 코드 (→ business_partner.bp_cd)

    -- 수량
    quantity        INTEGER       NOT NULL DEFAULT 0,                        -- [수량] 용기 수량

    -- 상태
    container_status VARCHAR(20)  NOT NULL DEFAULT 'GOOD',                   -- [상태] GOOD:양호, DAMAGED:파손, LOST:분실

    -- 비고
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [수정자] 레코드 최종 수정자

    -- 제약조건
    UNIQUE(container_cd, location)
);

CREATE INDEX idx_container_inventory_container ON hkgn.container_inventory(container_cd);
CREATE INDEX idx_container_inventory_location_type ON hkgn.container_inventory(location_type);
CREATE INDEX idx_container_inventory_bp ON hkgn.container_inventory(bp_cd);
CREATE INDEX idx_container_inventory_status ON hkgn.container_inventory(container_status);

COMMENT ON TABLE hkgn.container_inventory IS '용기 재고 - 운반 용기 재고 관리';
COMMENT ON COLUMN hkgn.container_inventory.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.container_inventory.container_cd IS '[용기코드] 용기 자재 코드 (→ item_master.material_cd, material_type=CONTAINER)';
COMMENT ON COLUMN hkgn.container_inventory.container_nm IS '[용기명] 용기 이름 (참조용)';
COMMENT ON COLUMN hkgn.container_inventory.location IS '[위치] 보관 위치 (공장/고객사/현장)';
COMMENT ON COLUMN hkgn.container_inventory.location_type IS '[위치구분] FACTORY:공장, CUSTOMER:고객사, SITE:현장';
COMMENT ON COLUMN hkgn.container_inventory.bp_cd IS '[거래처코드] 고객사/현장 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.container_inventory.quantity IS '[수량] 용기 수량';
COMMENT ON COLUMN hkgn.container_inventory.container_status IS '[상태] GOOD:양호, DAMAGED:파손, LOST:분실';
COMMENT ON COLUMN hkgn.container_inventory.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.container_inventory.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.container_inventory.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.container_inventory.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.container_inventory.updated_by IS '[수정자] 레코드 최종 수정자';


-- ============================================
-- [7] 외주 (Subcontracting) - 1개
-- ============================================

-- 7-1. subcontract_order (외주발주)
-- ============================================
CREATE TABLE hkgn.subcontract_order (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    subcontract_no  VARCHAR(30)   NOT NULL UNIQUE,                           -- [외주번호] 외주 발주 문서 번호
    subcontract_date DATE         NOT NULL,                                  -- [외주일] 외주 발주일
    delivery_date   DATE,                                                    -- [납기일] 요청 납기일

    -- 외주 업체
    subcontractor_cd VARCHAR(30)  NOT NULL,                                  -- [외주업체코드] 외주 업체 코드 (→ business_partner.bp_cd)
    work_type       VARCHAR(30)   NOT NULL,                                  -- [작업구분] TEMPERED:강화, ETCHED:에칭, CUTTING:재단

    -- FK
    order_no        VARCHAR(30),                                             -- [수주번호] 연관 수주 번호 (→ sales_order_header.order_no)

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 가공 대상 자재 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량/금액
    order_qty       NUMERIC(12,2) NOT NULL,                                  -- [발주수량] 외주 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평
    unit_price      NUMERIC(12,2),                                           -- [단가] 개당/단위당 가공비
    total_amount    NUMERIC(15,2),                                           -- [총금액] 총 가공비

    -- 진행 상태
    completed_qty   NUMERIC(12,2) DEFAULT 0,                                 -- [완료수량] 가공 완료 수량
    subcontract_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',               -- [외주상태] PENDING:대기, PROCESSING:작업중, COMPLETED:완료, CANCELLED:취소

    -- 비고
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

CREATE INDEX idx_subcontract_order_date ON hkgn.subcontract_order(subcontract_date);
CREATE INDEX idx_subcontract_order_contractor ON hkgn.subcontract_order(subcontractor_cd);
CREATE INDEX idx_subcontract_order_work_type ON hkgn.subcontract_order(work_type);
CREATE INDEX idx_subcontract_order_order ON hkgn.subcontract_order(order_no);
CREATE INDEX idx_subcontract_order_status ON hkgn.subcontract_order(subcontract_status);

COMMENT ON TABLE hkgn.subcontract_order IS '외주 발주 - 강화/에칭 등 외주 가공 발주';
COMMENT ON COLUMN hkgn.subcontract_order.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.subcontract_order.subcontract_no IS '[외주번호] 외주 발주 문서 번호';
COMMENT ON COLUMN hkgn.subcontract_order.subcontract_date IS '[외주일] 외주 발주일';
COMMENT ON COLUMN hkgn.subcontract_order.delivery_date IS '[납기일] 요청 납기일';
COMMENT ON COLUMN hkgn.subcontract_order.subcontractor_cd IS '[외주업체코드] 외주 업체 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.subcontract_order.work_type IS '[작업구분] TEMPERED:강화, ETCHED:에칭, CUTTING:재단';
COMMENT ON COLUMN hkgn.subcontract_order.order_no IS '[수주번호] 연관 수주 번호 (→ sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.subcontract_order.material_cd IS '[자재코드] 가공 대상 자재 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.subcontract_order.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.subcontract_order.order_qty IS '[발주수량] 외주 수량';
COMMENT ON COLUMN hkgn.subcontract_order.unit IS '[단위] EA/M2/평';
COMMENT ON COLUMN hkgn.subcontract_order.unit_price IS '[단가] 개당/단위당 가공비';
COMMENT ON COLUMN hkgn.subcontract_order.total_amount IS '[총금액] 총 가공비';
COMMENT ON COLUMN hkgn.subcontract_order.completed_qty IS '[완료수량] 가공 완료 수량';
COMMENT ON COLUMN hkgn.subcontract_order.subcontract_status IS '[외주상태] PENDING:대기, PROCESSING:작업중, COMPLETED:완료, CANCELLED:취소';
COMMENT ON COLUMN hkgn.subcontract_order.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.subcontract_order.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.subcontract_order.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.subcontract_order.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.subcontract_order.updated_by IS '[수정자] 레코드 최종 수정자';


-- ============================================
-- 완료 메시지
-- ============================================

-- DDL 실행 완료!
-- 총 22개 테이블 생성:
--   [1] 기준정보 마스터: 6개
--   [2] 영업/수주: 2개
--   [3] 생산: 4개
--   [4] 포장/출고: 3개
--   [5] 구매: 3개
--   [6] 재고: 3개
--   [7] 외주: 1개
