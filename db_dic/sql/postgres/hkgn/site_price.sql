-- ============================================
-- 현장별 단가 테이블 (site_price) - 고도화 버전
-- ============================================
-- 설명: 현장별 유리 사양 단가 정보 (비용 상세 관리)
-- 참조: db_dic/dictionary/standards.json
-- Excel 출처: ref/현장별단가.xlsx
-- ============================================

CREATE TABLE hkgn.site_price (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 현장 정보
    site_cd         VARCHAR(30)   NOT NULL,                                  -- [현장코드] 현장 코드 (→ site_master.site_cd)
    site_nm         VARCHAR(200),                                            -- [현장명] 현장 이름 (참조용)
    customer_nm     VARCHAR(100),                                            -- [거래처명] 거래처 이름 (참조용)

    -- 사양 정보
    spec            VARCHAR(200)  NOT NULL,                                  -- [사양] 사양 (예: 5CL(HS)+12AR+5CL(HS) 22T)
    remark          VARCHAR(200),                                            -- [비고] 비고 (아르곤/TPS/eno 등)

    -- 단가 정보
    bid_price       NUMERIC(12,2) DEFAULT 0,                                 -- [입찰실행단가] 입찰실행단가 (원/평)
    proc_price      NUMERIC(12,2) DEFAULT 0,                                 -- [가공단가] 가공단가 (원/평)

    -- 가공비 상세
    processing_cost NUMERIC(12,2) DEFAULT 0,                                 -- [가공비] 기본 가공비 (원/평)
    argon_cost      NUMERIC(12,2) DEFAULT 0,                                 -- [아르곤비] 아르곤 충진 비용 (원/평)
    insul_cost      NUMERIC(12,2) DEFAULT 0,                                 -- [단열비] 단열 처리 비용 (원/평)
    struct_cost     NUMERIC(12,2) DEFAULT 0,                                 -- [구조용비] 구조용 유리 비용 (원/평)
    edge_cost       NUMERIC(12,2) DEFAULT 0,                                 -- [엣지비] 엣지 가공 비용 (원/평)
    etching_cost    NUMERIC(12,2) DEFAULT 0,                                 -- [에칭비] 에칭 가공 비용 (원/평)
    step_cost       NUMERIC(12,2) DEFAULT 0,                                 -- [스텝비] 스텝 가공 비용 (원/평)
    deform_cost     NUMERIC(12,2) DEFAULT 0,                                 -- [이형비] 이형 가공 비용 (원/평)
    temper1_cost    NUMERIC(12,2) DEFAULT 0,                                 -- [강화1비] 강화1 처리 비용 (원/평)
    temper2_cost    NUMERIC(12,2) DEFAULT 0,                                 -- [강화2비] 강화2 처리 비용 (원/평)
    temper3_cost    NUMERIC(12,2) DEFAULT 0,                                 -- [강화3비] 강화3 처리 비용 (원/평)
    total_processing_cost NUMERIC(12,2) DEFAULT 0,                           -- [가공비계] 가공비 합계 (원/평)

    -- 거래처/자재 연결 (검색용)
    customer_cd     VARCHAR(30),                                             -- [거래처코드] 거래처 코드 (→ business_partner.bp_cd)
    material_cd     VARCHAR(30),                                             -- [자재코드] 자재 코드 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

-- 인덱스 생성
CREATE INDEX idx_site_price_site ON hkgn.site_price(site_cd);
CREATE INDEX idx_site_price_spec ON hkgn.site_price(spec);
CREATE INDEX idx_site_price_customer ON hkgn.site_price(customer_cd);
CREATE INDEX idx_site_price_material ON hkgn.site_price(material_cd);

-- 코멘트 추가
COMMENT ON TABLE hkgn.site_price IS '현장별 유리사양 단가 정보 - 입찰 및 가공비 상세 관리';
COMMENT ON COLUMN hkgn.site_price.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.site_price.site_cd IS '[현장코드] 현장 코드 (→ site_master.site_cd)';
COMMENT ON COLUMN hkgn.site_price.site_nm IS '[현장명] 현장 이름 (참조용)';
COMMENT ON COLUMN hkgn.site_price.customer_nm IS '[거래처명] 거래처 이름 (참조용)';
COMMENT ON COLUMN hkgn.site_price.spec IS '[사양] 사양 (예: 5CL(HS)+12AR+5CL(HS) 22T)';
COMMENT ON COLUMN hkgn.site_price.remark IS '[비고] 비고 (아르곤/TPS/eno 등)';
COMMENT ON COLUMN hkgn.site_price.bid_price IS '[입찰실행단가] 입찰실행단가 (원/평)';
COMMENT ON COLUMN hkgn.site_price.proc_price IS '[가공단가] 가공단가 (원/평)';
COMMENT ON COLUMN hkgn.site_price.processing_cost IS '[가공비] 기본 가공비 (원/평)';
COMMENT ON COLUMN hkgn.site_price.argon_cost IS '[아르곤비] 아르곤 충진 비용 (원/평)';
COMMENT ON COLUMN hkgn.site_price.insul_cost IS '[단열비] 단열 처리 비용 (원/평)';
COMMENT ON COLUMN hkgn.site_price.struct_cost IS '[구조용비] 구조용 유리 비용 (원/평)';
COMMENT ON COLUMN hkgn.site_price.edge_cost IS '[엣지비] 엣지 가공 비용 (원/평)';
COMMENT ON COLUMN hkgn.site_price.etching_cost IS '[에칭비] 에칭 가공 비용 (원/평)';
COMMENT ON COLUMN hkgn.site_price.step_cost IS '[스텝비] 스텝 가공 비용 (원/평)';
COMMENT ON COLUMN hkgn.site_price.deform_cost IS '[이형비] 이형 가공 비용 (원/평)';
COMMENT ON COLUMN hkgn.site_price.temper1_cost IS '[강화1비] 강화1 처리 비용 (원/평)';
COMMENT ON COLUMN hkgn.site_price.temper2_cost IS '[강화2비] 강화2 처리 비용 (원/평)';
COMMENT ON COLUMN hkgn.site_price.temper3_cost IS '[강화3비] 강화3 처리 비용 (원/평)';
COMMENT ON COLUMN hkgn.site_price.total_processing_cost IS '[가공비계] 가공비 합계 (원/평)';
COMMENT ON COLUMN hkgn.site_price.customer_cd IS '[거래처코드] 거래처 코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.site_price.material_cd IS '[자재코드] 자재 코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.site_price.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.site_price.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.site_price.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.site_price.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.site_price.updated_by IS '[수정자] 레코드 최종 수정자';
