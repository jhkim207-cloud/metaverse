-- ============================================
-- 현장 마스터 테이블 (site_master)
-- ============================================
-- 설명: 건설현장/납품처 관리
-- 참조: db_dic/dictionary/standards.json
-- 출처: _recreate_with_id_pk.sql에서 분리
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.site_master CASCADE;

-- ============================================
-- site_master (현장)
-- ============================================
CREATE TABLE hkgn.site_master (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키
    site_cd         VARCHAR(30)   NOT NULL UNIQUE,                           -- [현장코드] 현장 식별 코드 (UNIQUE)

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

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_site_master_cd ON hkgn.site_master(site_cd);
CREATE INDEX idx_site_master_bp ON hkgn.site_master(bp_cd);
CREATE INDEX idx_site_master_active ON hkgn.site_master(is_active);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.site_master IS '현장 마스터 - 건설현장/납품처 관리';
COMMENT ON COLUMN hkgn.site_master.id IS '[식별자] 기본 키 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.site_master.site_cd IS '[현장코드] 현장 식별 코드 (UNIQUE)';
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
