-- ============================================
-- 테이블: delivery_detail
-- 설명: 출하 상세 (출하 품목별 상세)
-- 작성일: 2026-02-07
-- 스키마: hkgn
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

-- 인덱스
CREATE INDEX idx_delivery_detail_delivery ON hkgn.delivery_detail(delivery_no);
CREATE INDEX idx_delivery_detail_order ON hkgn.delivery_detail(order_no);
CREATE INDEX idx_delivery_detail_material ON hkgn.delivery_detail(material_cd);

-- 코멘트
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
