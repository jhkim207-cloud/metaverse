-- ============================================
-- 자재 마스터 테이블 (item_master)
-- ============================================
-- 설명: 제품/원판/부자재/강화/에칭/용기 통합 관리
-- 참조: db_dic/dictionary/standards.json
-- 출처: _recreate_with_id_pk.sql에서 분리
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.item_master CASCADE;

-- ============================================
-- item_master (자재)
-- ============================================
CREATE TABLE hkgn.item_master (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키
    material_cd     VARCHAR(30)   NOT NULL UNIQUE,                           -- [자재코드] 자재 식별 코드 (UNIQUE)

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

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_item_master_cd ON hkgn.item_master(material_cd);
CREATE INDEX idx_item_master_type ON hkgn.item_master(material_type);
CREATE INDEX idx_item_master_active ON hkgn.item_master(is_active);
CREATE INDEX idx_item_master_supplier ON hkgn.item_master(supplier_cd);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.item_master IS '자재 마스터 - 제품/원판/부자재/강화/에칭/용기 통합 관리';
COMMENT ON COLUMN hkgn.item_master.id IS '[식별자] 기본 키 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.item_master.material_cd IS '[자재코드] 자재 식별 코드 (UNIQUE)';
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
