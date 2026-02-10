-- ============================================
-- 수주 헤더 테이블 (sales_order_header)
-- ============================================
-- 설명: 판매 주문 기본 정보
-- 참조: db_dic/dictionary/standards.json
-- 출처: _recreate_with_id_pk.sql에서 분리
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.sales_order_header CASCADE;

-- ============================================
-- sales_order_header (수주 헤더)
-- ============================================
CREATE TABLE hkgn.sales_order_header (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키
    order_no        VARCHAR(30)   NOT NULL UNIQUE,                           -- [수주번호] 수주 문서 번호 (UNIQUE)

    -- 기본 정보
    order_date      DATE          NOT NULL,                                  -- [수주일] 수주 접수일
    delivery_date   DATE,                                                    -- [납기일] 약속된 납품일
    customer_cd     VARCHAR(30)   NOT NULL,                                  -- [고객사코드] 고객사 코드 (→ business_partner.bp_cd)
    order_type      VARCHAR(20),                                             -- [수주구분] 완제품, 반제품, 원자재 등
    order_kind      VARCHAR(50),                                             -- [주문종류] 주문 종류

    -- 현장 정보
    site_cd         VARCHAR(30),                                             -- [현장코드] 납품 현장 코드 (→ site_master.site_cd)
    site_nm         VARCHAR(200),                                            -- [현장명] 납품 현장명
    site_address    VARCHAR(500),                                            -- [현장주소] 납품 현장 주소

    -- 금액 정보
    total_amount    NUMERIC(15,2) DEFAULT 0,                                 -- [총금액] 수주 총 금액
    tax_amount      NUMERIC(15,2) DEFAULT 0,                                 -- [부가세] 부가세 금액
    tax_separate    BOOLEAN       DEFAULT FALSE,                             -- [부가세별도] 부가세 별도 여부

    -- 특수 옵션
    duo_light       VARCHAR(100),                                            -- [듀오라이트] 듀오라이트 옵션 정보
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

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_sales_order_header_order_no ON hkgn.sales_order_header(order_no);
CREATE INDEX idx_sales_order_header_date ON hkgn.sales_order_header(order_date);
CREATE INDEX idx_sales_order_header_customer ON hkgn.sales_order_header(customer_cd);
CREATE INDEX idx_sales_order_header_site ON hkgn.sales_order_header(site_cd);
CREATE INDEX idx_sales_order_header_status ON hkgn.sales_order_header(order_status);
CREATE INDEX idx_sales_order_header_delivery ON hkgn.sales_order_header(delivery_date);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.sales_order_header IS '수주 헤더 - 판매 주문 기본 정보';
COMMENT ON COLUMN hkgn.sales_order_header.id IS '[식별자] 기본 키 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.sales_order_header.order_no IS '[수주번호] 수주 문서 번호 (UNIQUE)';
COMMENT ON COLUMN hkgn.sales_order_header.order_date IS '[수주일] 수주 접수일';
COMMENT ON COLUMN hkgn.sales_order_header.delivery_date IS '[납기일] 약속된 납품일';
COMMENT ON COLUMN hkgn.sales_order_header.customer_cd IS '[고객사코드] 고객사 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.sales_order_header.order_type IS '[수주구분] 완제품, 반제품, 원자재 등';
COMMENT ON COLUMN hkgn.sales_order_header.order_kind IS '[주문종류] 주문 종류';
COMMENT ON COLUMN hkgn.sales_order_header.site_cd IS '[현장코드] 납품 현장 코드 (→ site_master.site_cd)';
COMMENT ON COLUMN hkgn.sales_order_header.site_nm IS '[현장명] 납품 현장명';
COMMENT ON COLUMN hkgn.sales_order_header.site_address IS '[현장주소] 납품 현장 주소';
COMMENT ON COLUMN hkgn.sales_order_header.total_amount IS '[총금액] 수주 총 금액';
COMMENT ON COLUMN hkgn.sales_order_header.tax_amount IS '[부가세] 부가세 금액';
COMMENT ON COLUMN hkgn.sales_order_header.tax_separate IS '[부가세별도] 부가세 별도 여부';
COMMENT ON COLUMN hkgn.sales_order_header.duo_light IS '[듀오라이트] 듀오라이트 옵션 정보';
COMMENT ON COLUMN hkgn.sales_order_header.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.sales_order_header.order_status IS '[수주상태] PENDING:대기, CONFIRMED:확정, PROCESSING:진행중, COMPLETED:완료, CANCELLED:취소';
COMMENT ON COLUMN hkgn.sales_order_header.is_urgent IS '[긴급여부] 긴급 주문 여부';
COMMENT ON COLUMN hkgn.sales_order_header.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.sales_order_header.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.sales_order_header.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.sales_order_header.updated_by IS '[수정자] 레코드 최종 수정자';
