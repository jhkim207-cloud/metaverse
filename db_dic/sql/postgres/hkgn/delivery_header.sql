-- ============================================
-- 출고 헤더 테이블 (delivery_header)
-- ============================================
-- 설명: 출고 지시 기본 정보 (운반비, 운송사 포함)
-- 참조: db_dic/dictionary/standards.json
-- 출처: ref/출고실적.xlsx
-- ============================================

CREATE TABLE hkgn.delivery_header (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키
    delivery_no                 VARCHAR(30)   NOT NULL UNIQUE,                    -- [출고번호] 출고 문서 번호

    -- 기본 정보
    delivery_date               DATE          NOT NULL,                           -- [출고일] 출고 예정일 (거래일자)
    actual_date                 DATE          NULL,                               -- [실출고일] 실제 출고일

    -- FK
    order_no                    VARCHAR(30)   NOT NULL,                           -- [주문서번호] 연관 수주 번호 (sales_order_header.order_no)
    customer_cd                 VARCHAR(30)   NOT NULL,                           -- [고객사코드] 고객사 코드 (business_partner.bp_cd)
    site_cd                     VARCHAR(30)   NULL,                               -- [현장코드] 출고 현장 코드 (site_master.site_cd)

    -- 거래 정보 (추가)
    transaction_type            VARCHAR(20)   NULL DEFAULT '정상',                -- [거래구분] 거래 구분 (정상, 반품, 교환 등)
    special_notes               TEXT          NULL,                               -- [특이사항] 특이사항

    -- 배송 정보
    delivery_address            VARCHAR(500)  NULL,                               -- [배송주소] 배송지 주소
    vehicle_no                  VARCHAR(20)   NULL,                               -- [차량번호] 배송 차량 번호
    driver_nm                   VARCHAR(100)  NULL,                               -- [기사명] 배송 기사 이름
    driver_phone                VARCHAR(20)   NULL,                               -- [기사연락처] 배송 기사 전화번호

    -- 운송 비용 (추가)
    shipping_company            VARCHAR(200)  NULL,                               -- [운송사] 운송 회사명
    shipping_cost               NUMERIC(15,2) NULL DEFAULT 0,                     -- [운반비] 운반비
    shipping_tax                NUMERIC(15,2) NULL DEFAULT 0,                     -- [운반비세액] 운반비 세액

    -- 상태
    delivery_status             VARCHAR(20)   NOT NULL DEFAULT 'PENDING',         -- [출고상태] PENDING:대기, LOADING:적재중, SHIPPED:출고완료, DELIVERED:배송완료

    -- 비고
    remarks                     TEXT          NULL,                               -- [비고] 비고

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER       -- [수정자] 레코드 최종 수정자
);

-- 인덱스 생성
CREATE INDEX idx_delivery_header_delivery_no ON hkgn.delivery_header(delivery_no);
CREATE INDEX idx_delivery_header_date ON hkgn.delivery_header(delivery_date);
CREATE INDEX idx_delivery_header_order ON hkgn.delivery_header(order_no);
CREATE INDEX idx_delivery_header_customer ON hkgn.delivery_header(customer_cd);
CREATE INDEX idx_delivery_header_site ON hkgn.delivery_header(site_cd);
CREATE INDEX idx_delivery_header_status ON hkgn.delivery_header(delivery_status);

-- 코멘트 추가
COMMENT ON TABLE hkgn.delivery_header IS '출고 헤더 - 출고 지시 기본 정보';
COMMENT ON COLUMN hkgn.delivery_header.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.delivery_header.delivery_no IS '출고번호 - 출고 문서 번호';
COMMENT ON COLUMN hkgn.delivery_header.delivery_date IS '출고일 - 출고 예정일 (거래일자)';
COMMENT ON COLUMN hkgn.delivery_header.actual_date IS '실출고일 - 실제 출고일';
COMMENT ON COLUMN hkgn.delivery_header.order_no IS '주문서번호 - 연관 수주 번호 (sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.delivery_header.customer_cd IS '고객사코드 - 고객사 코드 (business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.delivery_header.site_cd IS '현장코드 - 출고 현장 코드 (site_master.site_cd)';
COMMENT ON COLUMN hkgn.delivery_header.transaction_type IS '거래구분 - 거래 구분 (정상, 반품, 교환 등)';
COMMENT ON COLUMN hkgn.delivery_header.special_notes IS '특이사항 - 특이사항';
COMMENT ON COLUMN hkgn.delivery_header.delivery_address IS '배송주소 - 배송지 주소';
COMMENT ON COLUMN hkgn.delivery_header.vehicle_no IS '차량번호 - 배송 차량 번호';
COMMENT ON COLUMN hkgn.delivery_header.driver_nm IS '기사명 - 배송 기사 이름';
COMMENT ON COLUMN hkgn.delivery_header.driver_phone IS '기사연락처 - 배송 기사 전화번호';
COMMENT ON COLUMN hkgn.delivery_header.shipping_company IS '운송사 - 운송 회사명';
COMMENT ON COLUMN hkgn.delivery_header.shipping_cost IS '운반비 - 운반비';
COMMENT ON COLUMN hkgn.delivery_header.shipping_tax IS '운반비세액 - 운반비 세액';
COMMENT ON COLUMN hkgn.delivery_header.delivery_status IS '출고상태 - PENDING:대기, LOADING:적재중, SHIPPED:출고완료, DELIVERED:배송완료';
COMMENT ON COLUMN hkgn.delivery_header.remarks IS '비고 - 비고';
COMMENT ON COLUMN hkgn.delivery_header.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.delivery_header.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.delivery_header.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.delivery_header.updated_by IS '수정자 - 레코드 최종 수정자';
