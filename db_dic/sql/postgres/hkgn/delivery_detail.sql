-- ============================================
-- 출고 상세 테이블 (delivery_detail)
-- ============================================
-- 설명: 출고 품목별 상세 (규격, 면적, 금액 포함)
-- 참조: db_dic/dictionary/standards.json
-- 출처: ref/출고실적.xlsx
-- ============================================

CREATE TABLE hkgn.delivery_detail (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- FK
    delivery_no                 VARCHAR(30)   NOT NULL,                           -- [출고번호] 출고 헤더 참조 (delivery_header.delivery_no)
    line_no                     INTEGER       NOT NULL,                           -- [행번호] 출고 품목 순번

    -- 수주 정보
    order_no                    VARCHAR(30)   NULL,                               -- [주문서번호] 연관 수주 번호 (sales_order_header.order_no)
    order_line_no               INTEGER       NULL,                               -- [수주행번호] 연관 수주 상세 행번호

    -- 자재 정보
    material_cd                 VARCHAR(30)   NOT NULL,                           -- [자재코드] 출고 자재 코드 (item_master.material_cd)
    material_nm                 VARCHAR(200)  NULL,                               -- [자재명] 자재 이름 (참조용, 품명)
    category                    VARCHAR(10)   NULL,                               -- [구분] 구분 (P, S 등)

    -- 규격 정보 (추가)
    thickness                   NUMERIC(10,2) NULL,                               -- [두께] 두께
    width                       NUMERIC(10,2) NULL,                               -- [가로규격] 가로 규격
    height                      NUMERIC(10,2) NULL,                               -- [세로규격] 세로 규격

    -- 수량 정보 (추가)
    order_quantity              NUMERIC(12,2) NULL DEFAULT 0,                     -- [주문수량] 주문 수량
    unshipped_quantity          NUMERIC(12,2) NULL DEFAULT 0,                     -- [미출수량] 미출고 수량
    delivery_qty                NUMERIC(12,2) NOT NULL,                           -- [출고수량] 출고 수량
    unit                        VARCHAR(10)   NULL DEFAULT 'EA',                  -- [단위] EA/M2/평/kg
    area                        NUMERIC(10,3) NULL DEFAULT 0,                     -- [면적] 면적 (평수 또는 M2)

    -- 금액 정보 (추가)
    unit_price                  NUMERIC(15,2) NULL DEFAULT 0,                     -- [주문단가] 주문 단가
    amount                      NUMERIC(15,2) NULL DEFAULT 0,                     -- [출고금액] 출고 금액
    tax                         NUMERIC(15,2) NULL DEFAULT 0,                     -- [세액] 세액
    total_amount                NUMERIC(15,2) NULL DEFAULT 0,                     -- [출고총액] 출고 총액 (금액 + 세액)

    -- 진행 상태
    line_status                 VARCHAR(20)   NOT NULL DEFAULT 'PENDING',         -- [행상태] PENDING:대기, PICKED:피킹완료, LOADED:상차완료, DELIVERED:출고완료

    -- 비고
    remarks                     TEXT          NULL,                               -- [비고] 품목별 특이사항

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [수정자] 레코드 최종 수정자

    -- 제약조건
    UNIQUE(delivery_no, line_no)
);

-- 인덱스 생성
CREATE INDEX idx_delivery_detail_delivery ON hkgn.delivery_detail(delivery_no);
CREATE INDEX idx_delivery_detail_order ON hkgn.delivery_detail(order_no);
CREATE INDEX idx_delivery_detail_material ON hkgn.delivery_detail(material_cd);
CREATE INDEX idx_delivery_detail_status ON hkgn.delivery_detail(line_status);

-- 코멘트 추가
COMMENT ON TABLE hkgn.delivery_detail IS '출고 상세 - 출고 품목별 상세 (규격, 면적, 금액 포함)';
COMMENT ON COLUMN hkgn.delivery_detail.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.delivery_detail.delivery_no IS '출고번호 - 출고 헤더 참조 (delivery_header.delivery_no)';
COMMENT ON COLUMN hkgn.delivery_detail.line_no IS '행번호 - 출고 품목 순번';
COMMENT ON COLUMN hkgn.delivery_detail.order_no IS '주문서번호 - 연관 수주 번호 (sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.delivery_detail.order_line_no IS '수주행번호 - 연관 수주 상세 행번호';
COMMENT ON COLUMN hkgn.delivery_detail.material_cd IS '자재코드 - 출고 자재 코드 (item_master.material_cd)';
COMMENT ON COLUMN hkgn.delivery_detail.material_nm IS '자재명 - 자재 이름 (품명)';
COMMENT ON COLUMN hkgn.delivery_detail.category IS '구분 - 구분 (P, S 등)';
COMMENT ON COLUMN hkgn.delivery_detail.thickness IS '두께 - 두께';
COMMENT ON COLUMN hkgn.delivery_detail.width IS '가로규격 - 가로 규격';
COMMENT ON COLUMN hkgn.delivery_detail.height IS '세로규격 - 세로 규격';
COMMENT ON COLUMN hkgn.delivery_detail.order_quantity IS '주문수량 - 주문 수량';
COMMENT ON COLUMN hkgn.delivery_detail.unshipped_quantity IS '미출수량 - 미출고 수량';
COMMENT ON COLUMN hkgn.delivery_detail.delivery_qty IS '출고수량 - 출고 수량';
COMMENT ON COLUMN hkgn.delivery_detail.unit IS '단위 - EA/M2/평/kg';
COMMENT ON COLUMN hkgn.delivery_detail.area IS '면적 - 면적 (평수 또는 M2)';
COMMENT ON COLUMN hkgn.delivery_detail.unit_price IS '주문단가 - 주문 단가';
COMMENT ON COLUMN hkgn.delivery_detail.amount IS '출고금액 - 출고 금액';
COMMENT ON COLUMN hkgn.delivery_detail.tax IS '세액 - 세액';
COMMENT ON COLUMN hkgn.delivery_detail.total_amount IS '출고총액 - 출고 총액 (금액 + 세액)';
COMMENT ON COLUMN hkgn.delivery_detail.line_status IS '행상태 - PENDING:대기, PICKED:피킹완료, LOADED:상차완료, DELIVERED:출고완료';
COMMENT ON COLUMN hkgn.delivery_detail.remarks IS '비고 - 품목별 특이사항';
COMMENT ON COLUMN hkgn.delivery_detail.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.delivery_detail.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.delivery_detail.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.delivery_detail.updated_by IS '수정자 - 레코드 최종 수정자';
