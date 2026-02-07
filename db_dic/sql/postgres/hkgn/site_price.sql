-- ============================================
-- 테이블: site_price
-- 설명: 현장별 유리사양 단가 정보
-- 작성일: 2026-02-07
-- 스키마: hkgn
-- ============================================

CREATE TABLE hkgn.site_price (
    -- PK
    site_price_id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [현장단가ID] 식별자 (PK, 자동증가)

    -- 참조 정보
    site_cd         VARCHAR(30)   NOT NULL,                                  -- [현장코드] 현장 코드 (→ site_master.site_cd)

    -- 사양 정보
    spec            VARCHAR(200)  NOT NULL,                                  -- [사양] 사양 (예: 5CL(HS)+12AR+5CL(HS) 22T)
    remark          VARCHAR(200),                                            -- [비고] 비고 (아르곤/TPS 등)

    -- 단가 정보
    bid_price       NUMERIC(12,2) DEFAULT 0,                                 -- [입찰실행단가] 입찰실행단가
    proc_price      NUMERIC(12,2) DEFAULT 0,                                 -- [가공단가] 가공단가
    processing_cost NUMERIC(12,2) DEFAULT 0,                                 -- [가공비] 가공비
    argon_cost      NUMERIC(12,2) DEFAULT 0,                                 -- [아르곤비] 아르곤 비용
    insul_cost      NUMERIC(12,2) DEFAULT 0,                                 -- [단열비] 단열 비용
    struct_cost     NUMERIC(12,2) DEFAULT 0,                                 -- [구조용비] 구조용 비용
    edge_cost       NUMERIC(12,2) DEFAULT 0,                                 -- [엣지비] 엣지 비용
    etching_cost    NUMERIC(12,2) DEFAULT 0,                                 -- [에칭비] 에칭 비용
    step_cost       NUMERIC(12,2) DEFAULT 0,                                 -- [스텝비] 스텝 비용
    deform_cost     NUMERIC(12,2) DEFAULT 0,                                 -- [이형비] 이형 비용
    temper1_cost    NUMERIC(12,2) DEFAULT 0,                                 -- [강화1비] 강화1 비용
    temper2_cost    NUMERIC(12,2) DEFAULT 0,                                 -- [강화2비] 강화2 비용
    temper3_cost    NUMERIC(12,2) DEFAULT 0,                                 -- [강화3비] 강화3 비용

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

-- 인덱스
CREATE INDEX idx_site_price_site ON hkgn.site_price(site_cd);

-- 코멘트
COMMENT ON TABLE hkgn.site_price IS '현장별 유리사양 단가 정보';
COMMENT ON COLUMN hkgn.site_price.site_price_id IS '[현장단가ID] 식별자 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.site_price.site_cd IS '[현장코드] 현장 코드 (→ site_master.site_cd)';
COMMENT ON COLUMN hkgn.site_price.spec IS '[사양] 사양 (예: 5CL(HS)+12AR+5CL(HS) 22T)';
COMMENT ON COLUMN hkgn.site_price.remark IS '[비고] 비고 (아르곤/TPS 등)';
COMMENT ON COLUMN hkgn.site_price.bid_price IS '[입찰실행단가] 입찰실행단가';
COMMENT ON COLUMN hkgn.site_price.proc_price IS '[가공단가] 가공단가';
COMMENT ON COLUMN hkgn.site_price.processing_cost IS '[가공비] 가공비';
COMMENT ON COLUMN hkgn.site_price.argon_cost IS '[아르곤비] 아르곤 비용';
COMMENT ON COLUMN hkgn.site_price.insul_cost IS '[단열비] 단열 비용';
COMMENT ON COLUMN hkgn.site_price.struct_cost IS '[구조용비] 구조용 비용';
COMMENT ON COLUMN hkgn.site_price.edge_cost IS '[엣지비] 엣지 비용';
COMMENT ON COLUMN hkgn.site_price.etching_cost IS '[에칭비] 에칭 비용';
COMMENT ON COLUMN hkgn.site_price.step_cost IS '[스텝비] 스텝 비용';
COMMENT ON COLUMN hkgn.site_price.deform_cost IS '[이형비] 이형 비용';
COMMENT ON COLUMN hkgn.site_price.temper1_cost IS '[강화1비] 강화1 비용';
COMMENT ON COLUMN hkgn.site_price.temper2_cost IS '[강화2비] 강화2 비용';
COMMENT ON COLUMN hkgn.site_price.temper3_cost IS '[강화3비] 강화3 비용';
COMMENT ON COLUMN hkgn.site_price.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.site_price.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.site_price.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.site_price.updated_by IS '[수정자] 레코드 최종 수정자';
