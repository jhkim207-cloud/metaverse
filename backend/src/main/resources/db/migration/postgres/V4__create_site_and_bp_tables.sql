-- V4__create_site_and_bp_tables.sql
-- 현장 마스터 + 거래처 마스터 테이블 생성

-- =============================================================================
-- 거래처 마스터 (business_partner)
-- =============================================================================
CREATE TABLE IF NOT EXISTS business_partner (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bp_cd      VARCHAR(30)  NOT NULL UNIQUE,
    bp_nm      VARCHAR(200) NOT NULL,
    bp_type    VARCHAR(20)  NOT NULL DEFAULT 'GENERAL',
    ceo_nm     VARCHAR(100),
    biz_no     VARCHAR(20),
    tel_no     VARCHAR(30),
    fax_no     VARCHAR(30),
    email      VARCHAR(200),
    address    VARCHAR(500),
    remark     VARCHAR(500),
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    CONSTRAINT chk_bp_type CHECK (bp_type IN ('CONSTRUCTOR', 'SUPPLIER', 'CUSTOMER', 'GENERAL'))
);

CREATE INDEX idx_bp_bp_cd     ON business_partner(bp_cd);
CREATE INDEX idx_bp_bp_nm     ON business_partner(bp_nm);
CREATE INDEX idx_bp_is_active ON business_partner(is_active);
CREATE INDEX idx_bp_bp_type   ON business_partner(bp_type);

COMMENT ON TABLE  business_partner          IS '거래처 마스터';
COMMENT ON COLUMN business_partner.bp_cd    IS '거래처코드';
COMMENT ON COLUMN business_partner.bp_nm    IS '거래처명';
COMMENT ON COLUMN business_partner.bp_type  IS '거래처유형 (CONSTRUCTOR:건설사, SUPPLIER:공급사, CUSTOMER:고객사, GENERAL:일반)';
COMMENT ON COLUMN business_partner.ceo_nm   IS '대표자명';
COMMENT ON COLUMN business_partner.biz_no   IS '사업자번호';
COMMENT ON COLUMN business_partner.tel_no   IS '전화번호';
COMMENT ON COLUMN business_partner.fax_no   IS '팩스번호';
COMMENT ON COLUMN business_partner.email    IS '이메일';
COMMENT ON COLUMN business_partner.address  IS '주소';
COMMENT ON COLUMN business_partner.remark   IS '비고';

-- =============================================================================
-- 현장 마스터 (site_master)
-- =============================================================================
CREATE TABLE IF NOT EXISTS site_master (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    site_cd         VARCHAR(30)  NOT NULL UNIQUE,
    site_nm         VARCHAR(200) NOT NULL,
    constructor_nm  VARCHAR(100),
    bp_cd           VARCHAR(30),
    address         VARCHAR(300),
    remark          VARCHAR(500),
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by      VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    updated_by      VARCHAR(100) NOT NULL DEFAULT CURRENT_USER
);

CREATE INDEX idx_site_master_site_cd   ON site_master(site_cd);
CREATE INDEX idx_site_master_is_active ON site_master(is_active);
CREATE INDEX idx_site_master_bp_cd     ON site_master(bp_cd);

COMMENT ON TABLE  site_master                IS '현장(프로젝트) 마스터';
COMMENT ON COLUMN site_master.site_cd        IS '현장코드';
COMMENT ON COLUMN site_master.site_nm        IS '현장명';
COMMENT ON COLUMN site_master.constructor_nm IS '건설사명';
COMMENT ON COLUMN site_master.bp_cd          IS '거래처코드';
COMMENT ON COLUMN site_master.address        IS '주소';
COMMENT ON COLUMN site_master.remark         IS '비고';

-- =============================================================================
-- 거래처 샘플 데이터
-- =============================================================================
INSERT INTO business_partner (bp_cd, bp_nm, bp_type, ceo_nm, biz_no, tel_no, fax_no, email, address, remark) VALUES
('S001', '대한건설',     'CONSTRUCTOR', '김대한', '101-81-00001', '02-1234-5678', '02-1234-5679', 'info@daehan.co.kr',    '서울시 강남구 테헤란로 789',         '종합건설 1위'),
('S002', '삼성종합건설', 'CONSTRUCTOR', '이삼성', '104-81-00002', '02-2345-6789', '02-2345-6790', 'info@samsung-ec.co.kr', '경기도 성남시 분당구 판교역로 234',   '지하 5층, 지상 60층 복합단지'),
('S003', '한화건설산업', 'CONSTRUCTOR', '박한화', '105-81-00003', '02-3456-7890', '02-3456-7891', 'info@hanwha-ci.co.kr',  '인천시 연수구 송도동 센트럴로 100',   '주상복합 45층'),
('S004', '현대건설',     'CONSTRUCTOR', '정현대', '102-81-00004', '02-4567-8901', '02-4567-8902', 'info@hdec.co.kr',       '서울시 영등포구 여의대로 300',       '50층 업무용 빌딩'),
('S005', 'GS건설',       'CONSTRUCTOR', '최지에스', '103-81-00005', '02-5678-9012', '02-5678-9013', 'info@gsconst.co.kr', '경기도 수원시 영통구 광교로 500',     '아파트 10개동 1200세대');

-- =============================================================================
-- 현장 샘플 데이터
-- =============================================================================
INSERT INTO site_master (site_cd, site_nm, constructor_nm, bp_cd, address, remark) VALUES
('SITE001', '강남 테헤란 오피스텔',   '대한건설',     'S001', '서울시 강남구 테헤란로 789',         '30층 규모 오피스텔 신축'),
('SITE002', '판교 알파돔시티',         '삼성종합건설', 'S002', '경기도 성남시 분당구 판교역로 234',   '지하 5층, 지상 60층 복합단지'),
('SITE003', '송도 센트럴파크 A동',     '한화건설산업', 'S003', '인천시 연수구 송도동 센트럴로 100',   '주상복합 45층'),
('SITE004', '여의도 금융타워',         '현대건설',     'S004', '서울시 영등포구 여의대로 300',       '50층 업무용 빌딩'),
('SITE005', '수원 광교 아이파크',       'GS건설',       'S005', '경기도 수원시 영통구 광교로 500',     '아파트 10개동 1200세대'),
('SITE006', '동탄2 호반베르디움',       '대한건설',     'S001', '경기도 화성시 동탄순환대로 600',     '아파트 15개동 1800세대'),
('SITE007', '부산 해운대 엘시티',       '삼성종합건설', 'S002', '부산시 해운대구 마린시티로 700',     '주상복합 80층 랜드마크'),
('SITE008', '대전 둔산 대우 푸르지오',  '한화건설산업', 'S003', '대전시 서구 둔산로 800',             '아파트 12개동 1500세대'),
('SITE009', '광주 첨단 힐스테이트',     '현대건설',     'S004', '광주시 광산구 첨단과기로 900',       '아파트 8개동 900세대'),
('SITE010', '인천 청라 더샵',           'GS건설',       'S005', '인천시 서구 청라호수로 1000',        '아파트 20개동 2500세대');
