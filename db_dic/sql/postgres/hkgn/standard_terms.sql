-- ============================================
-- 표준용어 테이블 (standard_terms)
-- ============================================
-- 설명: 거래 조건, 약어 등 표준 코드
-- 참조: db_dic/dictionary/standards.json
-- 출처: _execute_all_ddl_merged.sql에서 분리
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.standard_terms CASCADE;

-- ============================================
-- standard_terms (표준용어)
-- ============================================
CREATE TABLE hkgn.standard_terms (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 그룹 정보
    term_group      VARCHAR(50)   NOT NULL,                                  -- [용어그룹] 용어 그룹 (PAYMENT:결제조건, DELIVERY:배송조건, QUALITY:품질기준)
    term_code       VARCHAR(50)   NOT NULL,                                  -- [용어코드] 용어 코드

    -- 명칭
    term_name_kr    VARCHAR(200)  NOT NULL,                                  -- [용어명(한글)] 한글 명칭
    term_name_en    VARCHAR(200),                                            -- [용어명(영문)] 영문 명칭

    -- 설명
    description     TEXT,                                                    -- [설명] 상세 설명
    abbreviation    VARCHAR(20),                                             -- [약어] 약어

    -- 정렬 순서
    sort_order      INTEGER       DEFAULT 0,                                 -- [정렬순서] 표시 순서

    -- 상태
    is_active       BOOLEAN       DEFAULT TRUE,                              -- [사용여부] 사용 여부

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [수정자] 레코드 최종 수정자

    -- 제약조건
    UNIQUE(term_group, term_code)
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_standard_terms_group ON hkgn.standard_terms(term_group);
CREATE INDEX idx_standard_terms_active ON hkgn.standard_terms(is_active);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.standard_terms IS '표준 용어 - 거래 조건, 약어 등 표준 코드';
COMMENT ON COLUMN hkgn.standard_terms.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.standard_terms.term_group IS '[용어그룹] 용어 그룹 (PAYMENT:결제조건, DELIVERY:배송조건, QUALITY:품질기준)';
COMMENT ON COLUMN hkgn.standard_terms.term_code IS '[용어코드] 용어 코드';
COMMENT ON COLUMN hkgn.standard_terms.term_name_kr IS '[용어명(한글)] 한글 명칭';
COMMENT ON COLUMN hkgn.standard_terms.term_name_en IS '[용어명(영문)] 영문 명칭';
COMMENT ON COLUMN hkgn.standard_terms.description IS '[설명] 상세 설명';
COMMENT ON COLUMN hkgn.standard_terms.abbreviation IS '[약어] 약어';
COMMENT ON COLUMN hkgn.standard_terms.sort_order IS '[정렬순서] 표시 순서';
COMMENT ON COLUMN hkgn.standard_terms.is_active IS '[사용여부] 사용 여부';
COMMENT ON COLUMN hkgn.standard_terms.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.standard_terms.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.standard_terms.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.standard_terms.updated_by IS '[수정자] 레코드 최종 수정자';
