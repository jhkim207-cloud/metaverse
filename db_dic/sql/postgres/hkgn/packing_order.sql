-- ============================================
-- 포장지시 테이블 (packing_order)
-- ============================================
-- 설명: 출하 전 포장 작업 지시
-- 참조: db_dic/dictionary/standards.json
-- 출처: _execute_all_ddl_merged.sql에서 분리
-- ============================================

SET search_path TO hkgn, public;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS hkgn.packing_order CASCADE;

-- ============================================
-- packing_order (포장지시)
-- ============================================
CREATE TABLE hkgn.packing_order (
    -- PK
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 기본 정보
    packing_no      VARCHAR(30)   NOT NULL UNIQUE,                           -- [포장번호] 포장 지시 문서 번호
    packing_date    DATE          NOT NULL,                                  -- [포장일] 포장 작업일

    -- FK
    order_no        VARCHAR(30)   NOT NULL,                                  -- [수주번호] 연관 수주 번호 (→ sales_order_header.order_no)

    -- 자재 정보
    material_cd     VARCHAR(30)   NOT NULL,                                  -- [자재코드] 포장 대상 자재 (→ item_master.material_cd)
    material_nm     VARCHAR(200),                                            -- [자재명] 자재 이름 (참조용)

    -- 수량
    packing_qty     NUMERIC(12,2) NOT NULL,                                  -- [포장수량] 포장 수량
    unit            VARCHAR(10)   DEFAULT 'EA',                              -- [단위] EA/M2/평

    -- 용기 정보
    container_cd    VARCHAR(30),                                             -- [용기코드] 사용 용기 코드 (→ item_master.material_cd, material_type='CONTAINER')
    container_qty   INTEGER       DEFAULT 0,                                 -- [용기수량] 사용한 용기 수량

    -- 작업자 정보
    worker_cd       VARCHAR(30),                                             -- [작업자코드] 포장 담당자 (→ worker.worker_cd)

    -- 상태
    packing_status  VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [포장상태] PENDING:대기, PROCESSING:작업중, COMPLETED:완료

    -- 비고
    remarks         TEXT,                                                    -- [비고] 특이사항

    -- 감사 컬럼
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by      VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_packing_order_date ON hkgn.packing_order(packing_date);
CREATE INDEX idx_packing_order_order ON hkgn.packing_order(order_no);
CREATE INDEX idx_packing_order_material ON hkgn.packing_order(material_cd);
CREATE INDEX idx_packing_order_status ON hkgn.packing_order(packing_status);

-- ============================================
-- 코멘트
-- ============================================
COMMENT ON TABLE hkgn.packing_order IS '포장 지시 - 출하 전 포장 작업 지시';
COMMENT ON COLUMN hkgn.packing_order.id IS '[식별자] 기본 키';
COMMENT ON COLUMN hkgn.packing_order.packing_no IS '[포장번호] 포장 지시 문서 번호';
COMMENT ON COLUMN hkgn.packing_order.packing_date IS '[포장일] 포장 작업일';
COMMENT ON COLUMN hkgn.packing_order.order_no IS '[수주번호] 연관 수주 번호 (→ sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.packing_order.material_cd IS '[자재코드] 포장 대상 자재 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.packing_order.material_nm IS '[자재명] 자재 이름 (참조용)';
COMMENT ON COLUMN hkgn.packing_order.packing_qty IS '[포장수량] 포장 수량';
COMMENT ON COLUMN hkgn.packing_order.unit IS '[단위] EA/M2/평';
COMMENT ON COLUMN hkgn.packing_order.container_cd IS '[용기코드] 사용 용기 코드 (→ item_master.material_cd, material_type=CONTAINER)';
COMMENT ON COLUMN hkgn.packing_order.container_qty IS '[용기수량] 사용한 용기 수량';
COMMENT ON COLUMN hkgn.packing_order.worker_cd IS '[작업자코드] 포장 담당자 (→ worker.worker_cd)';
COMMENT ON COLUMN hkgn.packing_order.packing_status IS '[포장상태] PENDING:대기, PROCESSING:작업중, COMPLETED:완료';
COMMENT ON COLUMN hkgn.packing_order.remarks IS '[비고] 특이사항';
COMMENT ON COLUMN hkgn.packing_order.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.packing_order.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.packing_order.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.packing_order.updated_by IS '[수정자] 레코드 최종 수정자';
