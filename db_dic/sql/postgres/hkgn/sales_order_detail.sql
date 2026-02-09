-- ============================================
-- 수주 상세 테이블 (sales_order_detail)
-- ============================================
-- 설명: 수주의 개별 라인 아이템
-- 참조: db_dic/dictionary/standards.json
-- 출처: _recreate_with_id_pk.sql에서 분리
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.sales_order_detail CASCADE;

-- ============================================
-- sales_order_detail (수주 상세)
-- ============================================
CREATE TABLE hkgn.sales_order_detail (
    -- PK
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 수주 헤더 연결
    order_header_id     BIGINT        NOT NULL,                                  -- [수주헤더ID] 수주 헤더 ID (FK → sales_order_header.id)
    order_no            VARCHAR(30)   NOT NULL,                                  -- [수주번호] 수주 문서 번호 (denormalized)
    line_seq            INTEGER       NOT NULL,                                  -- [라인순번] 수주 내 라인 순번 (1, 2, 3, ...)

    -- 제품 정보
    material_cd         VARCHAR(30)   NOT NULL,                                  -- [자재코드] 자재/제품 코드 (FK → item_master.material_cd)
    material_nm         VARCHAR(500),                                            -- [자재명] 자재/제품명 (denormalized)
    product_category    VARCHAR(10),                                             -- [제품구분] P:제품, R:원자재, S:부자재 등

    -- 규격 정보
    width               NUMERIC(10,2),                                           -- [가로규격] 가로 크기(mm)
    height              NUMERIC(10,2),                                           -- [세로규격] 세로 크기(mm)
    thickness           NUMERIC(10,2),                                           -- [두께] 두께(mm)
    unit_type           VARCHAR(10),                                             -- [규격단위] mm, cm, m 등

    -- 수량 및 단가
    quantity            INTEGER       NOT NULL,                                  -- [수량] 주문 수량
    area                NUMERIC(15,4),                                           -- [면적] 계산된 면적 (M2)
    unit                VARCHAR(10)   DEFAULT 'EA',                              -- [단위] 수량 단위 (EA, M2, KG 등)
    unit_price          NUMERIC(15,2),                                           -- [단가] 개당 단가
    amount              NUMERIC(15,2),                                           -- [금액] 라인 금액 (quantity * unit_price)

    -- 납품 위치 정보
    dong                VARCHAR(100),                                            -- [동] 건물 동 정보
    ho                  VARCHAR(100),                                            -- [호] 호수/단위 정보
    floor               VARCHAR(50),                                             -- [층] 층수 정보
    window_type         VARCHAR(100),                                            -- [창종류] 창 타입 (FixSpandrel 등)
    location_detail     VARCHAR(500),                                            -- [위치상세] 상세 위치 설명

    -- 생산/납품 정보
    delivery_date       DATE,                                                    -- [납기일] 개별 라인 납기일
    production_status   VARCHAR(20)   DEFAULT 'PENDING',                         -- [생산상태] PENDING:대기, SCHEDULED:계획됨, IN_PROGRESS:생산중, COMPLETED:완료
    delivery_status     VARCHAR(20)   DEFAULT 'PENDING',                         -- [납품상태] PENDING:대기, READY:준비됨, DELIVERED:납품완료

    -- 비고
    remarks             TEXT,                                                    -- [비고] 라인별 특이사항

    -- 감사 컬럼
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [수정자] 레코드 최종 수정자

    -- 제약조건
    CONSTRAINT fk_sales_order_detail_header
        FOREIGN KEY (order_header_id)
        REFERENCES hkgn.sales_order_header(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_sales_order_detail_material
        FOREIGN KEY (material_cd)
        REFERENCES hkgn.item_master(material_cd),
    CONSTRAINT uq_sales_order_detail_line
        UNIQUE (order_header_id, line_seq)
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_sales_order_detail_header ON hkgn.sales_order_detail(order_header_id);
CREATE INDEX idx_sales_order_detail_order_no ON hkgn.sales_order_detail(order_no);
CREATE INDEX idx_sales_order_detail_material ON hkgn.sales_order_detail(material_cd);
CREATE INDEX idx_sales_order_detail_delivery_date ON hkgn.sales_order_detail(delivery_date);
CREATE INDEX idx_sales_order_detail_production_status ON hkgn.sales_order_detail(production_status);
CREATE INDEX idx_sales_order_detail_delivery_status ON hkgn.sales_order_detail(delivery_status);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.sales_order_detail IS '수주 상세 - 수주의 개별 라인 아이템';
COMMENT ON COLUMN hkgn.sales_order_detail.id IS '[식별자] 기본 키 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.sales_order_detail.order_header_id IS '[수주헤더ID] 수주 헤더 ID (FK → sales_order_header.id)';
COMMENT ON COLUMN hkgn.sales_order_detail.order_no IS '[수주번호] 수주 문서 번호 (denormalized)';
COMMENT ON COLUMN hkgn.sales_order_detail.line_seq IS '[라인순번] 수주 내 라인 순번';
COMMENT ON COLUMN hkgn.sales_order_detail.material_cd IS '[자재코드] 자재/제품 코드 (FK → item_master.material_cd)';
COMMENT ON COLUMN hkgn.sales_order_detail.material_nm IS '[자재명] 자재/제품명 (denormalized)';
COMMENT ON COLUMN hkgn.sales_order_detail.product_category IS '[제품구분] P:제품, R:원자재, S:부자재 등';
COMMENT ON COLUMN hkgn.sales_order_detail.width IS '[가로규격] 가로 크기(mm)';
COMMENT ON COLUMN hkgn.sales_order_detail.height IS '[세로규격] 세로 크기(mm)';
COMMENT ON COLUMN hkgn.sales_order_detail.thickness IS '[두께] 두께(mm)';
COMMENT ON COLUMN hkgn.sales_order_detail.unit_type IS '[규격단위] mm, cm, m 등';
COMMENT ON COLUMN hkgn.sales_order_detail.quantity IS '[수량] 주문 수량';
COMMENT ON COLUMN hkgn.sales_order_detail.area IS '[면적] 계산된 면적 (M2)';
COMMENT ON COLUMN hkgn.sales_order_detail.unit IS '[단위] 수량 단위';
COMMENT ON COLUMN hkgn.sales_order_detail.unit_price IS '[단가] 개당 단가';
COMMENT ON COLUMN hkgn.sales_order_detail.amount IS '[금액] 라인 금액';
COMMENT ON COLUMN hkgn.sales_order_detail.dong IS '[동] 건물 동 정보';
COMMENT ON COLUMN hkgn.sales_order_detail.ho IS '[호] 호수/단위 정보';
COMMENT ON COLUMN hkgn.sales_order_detail.floor IS '[층] 층수 정보';
COMMENT ON COLUMN hkgn.sales_order_detail.window_type IS '[창종류] 창 타입';
COMMENT ON COLUMN hkgn.sales_order_detail.location_detail IS '[위치상세] 상세 위치 설명';
COMMENT ON COLUMN hkgn.sales_order_detail.delivery_date IS '[납기일] 개별 라인 납기일';
COMMENT ON COLUMN hkgn.sales_order_detail.production_status IS '[생산상태] PENDING:대기, SCHEDULED:계획됨, IN_PROGRESS:생산중, COMPLETED:완료';
COMMENT ON COLUMN hkgn.sales_order_detail.delivery_status IS '[납품상태] PENDING:대기, READY:준비됨, DELIVERED:납품완료';
COMMENT ON COLUMN hkgn.sales_order_detail.remarks IS '[비고] 라인별 특이사항';
COMMENT ON COLUMN hkgn.sales_order_detail.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.sales_order_detail.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.sales_order_detail.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.sales_order_detail.updated_by IS '[수정자] 레코드 최종 수정자';
