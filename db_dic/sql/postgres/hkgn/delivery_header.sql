-- ============================================
-- 테이블: delivery_header
-- 설명: 출하 헤더 (출하 지시 기본 정보)
-- 작성일: 2026-02-07
-- 스키마: hkgn
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

-- 인덱스
CREATE INDEX idx_delivery_header_date ON hkgn.delivery_header(delivery_date);
CREATE INDEX idx_delivery_header_order ON hkgn.delivery_header(order_no);
CREATE INDEX idx_delivery_header_customer ON hkgn.delivery_header(customer_cd);
CREATE INDEX idx_delivery_header_site ON hkgn.delivery_header(site_cd);
CREATE INDEX idx_delivery_header_status ON hkgn.delivery_header(delivery_status);

-- 코멘트
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
