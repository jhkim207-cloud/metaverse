-- ============================================
-- 테이블: business_partner
-- 설명: 거래처 마스터 (매출처/매입처/외주처 통합)
-- 작성일: 2026-02-07
-- 스키마: hkgn
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

-- 인덱스
CREATE INDEX idx_bp_type ON hkgn.business_partner(bp_type);
CREATE INDEX idx_bp_nm ON hkgn.business_partner(bp_nm);
CREATE INDEX idx_bp_active ON hkgn.business_partner(is_active);

-- 코멘트
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
