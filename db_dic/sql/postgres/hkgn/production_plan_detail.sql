-- ============================================
-- 생산 계획 상세 테이블 (production_plan_detail)
-- ============================================
-- 설명: 생산 계획 공정별 체크리스트
-- 참조: db_dic/dictionary/standards.json (production_plan_detail 섹션)
-- ============================================

CREATE TABLE hkgn.production_plan_detail (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- FK
    plan_id                     BIGINT        NOT NULL,                           -- [생산계획ID] 생산 계획 ID (production_plan.id 참조)

    -- 공정 정보
    process_type                VARCHAR(50)   NULL,                               -- [공정구분] 공정 구분 (재단1, 재단2, 아와, 강화, 라벨 등)
    is_checked                  BOOLEAN       NULL DEFAULT FALSE,                 -- [체크여부] 공정 완료 체크 여부

    -- 진행 상태
    process_status              VARCHAR(20)   NOT NULL DEFAULT 'PENDING',         -- [공정상태] PENDING:대기, IN_PROGRESS:진행중, COMPLETED:완료, SKIPPED:스킵

    -- 수주 연결
    order_detail_id             BIGINT        NULL,                               -- [수주상세ID] 수주 상세 ID (sales_order_detail.id 참조)
    order_no                    VARCHAR(30)   NULL,                               -- [수주번호] 수주 번호 (sales_order_header.order_no 참조)
    line_seq                    INTEGER       NULL,                               -- [행번호] 수주 상세 행 번호

    -- 자재/제품 정보
    material_cd                 VARCHAR(30)   NULL,                               -- [자재코드] 자재 코드 (item_master.material_cd 참조)
    material_nm                 VARCHAR(500)  NULL,                               -- [자재명] 자재 이름
    product_category            VARCHAR(10)   NULL,                               -- [제품구분] 제품 구분 코드

    -- 규격 정보
    width                       NUMERIC(10,2) NULL,                               -- [가로] 가로 규격
    height                      NUMERIC(10,2) NULL,                               -- [세로] 세로 규격
    thickness                   NUMERIC(10,2) NULL,                               -- [두께] 두께
    unit_type                   VARCHAR(10)   NULL,                               -- [규격단위] 규격 단위

    -- 수량/금액
    quantity                    INTEGER       NULL,                               -- [수량] 수량
    area                        NUMERIC(15,4) NULL,                               -- [면적] 면적
    unit                        VARCHAR(10)   NULL,                               -- [단위] 단위
    unit_price                  NUMERIC(15,2) NULL,                               -- [단가] 단가
    amount                      NUMERIC(15,2) NULL,                               -- [금액] 금액

    -- 위치 정보
    dong                        VARCHAR(100)  NULL,                               -- [동] 동
    ho                          VARCHAR(100)  NULL,                               -- [호] 호
    floor                       VARCHAR(50)   NULL,                               -- [층] 층
    window_type                 VARCHAR(100)  NULL,                               -- [창호유형] 창호 유형
    location_detail             VARCHAR(500)  NULL,                               -- [상세위치] 상세 위치

    -- 납기/비고
    delivery_date               DATE          NULL,                               -- [납기일] 납기일
    remarks                     TEXT          NULL,                               -- [비고] 비고

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [수정자] 레코드 최종 수정자

    -- 외래키 제약조건
    CONSTRAINT fk_production_plan_detail_plan
        FOREIGN KEY (plan_id)
        REFERENCES hkgn.production_plan(id)
        ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX idx_production_plan_detail_plan_id ON hkgn.production_plan_detail(plan_id);
CREATE INDEX idx_production_plan_detail_process_type ON hkgn.production_plan_detail(process_type);
CREATE INDEX idx_production_plan_detail_status ON hkgn.production_plan_detail(process_status);
CREATE INDEX idx_production_plan_detail_order_detail ON hkgn.production_plan_detail(order_detail_id);
CREATE INDEX idx_production_plan_detail_order_no ON hkgn.production_plan_detail(order_no);
CREATE INDEX idx_production_plan_detail_material ON hkgn.production_plan_detail(material_cd);

-- 코멘트 추가
COMMENT ON TABLE hkgn.production_plan_detail IS '생산 계획 상세 - 공정별 체크리스트';
COMMENT ON COLUMN hkgn.production_plan_detail.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.production_plan_detail.plan_id IS '생산계획ID - 생산 계획 ID (production_plan.id 참조)';
COMMENT ON COLUMN hkgn.production_plan_detail.process_type IS '공정구분 - 공정 구분 (재단1, 재단2, 아와, 강화, 라벨 등)';
COMMENT ON COLUMN hkgn.production_plan_detail.is_checked IS '체크여부 - 공정 완료 체크 여부';
COMMENT ON COLUMN hkgn.production_plan_detail.process_status IS '공정상태 - PENDING:대기, IN_PROGRESS:진행중, COMPLETED:완료, SKIPPED:스킵';
COMMENT ON COLUMN hkgn.production_plan_detail.order_detail_id IS '수주상세ID - 수주 상세 ID (sales_order_detail.id 참조)';
COMMENT ON COLUMN hkgn.production_plan_detail.order_no IS '수주번호 - 수주 번호 (sales_order_header.order_no 참조)';
COMMENT ON COLUMN hkgn.production_plan_detail.line_seq IS '행번호 - 수주 상세 행 번호';
COMMENT ON COLUMN hkgn.production_plan_detail.material_cd IS '자재코드 - 자재 코드 (item_master.material_cd 참조)';
COMMENT ON COLUMN hkgn.production_plan_detail.material_nm IS '자재명 - 자재 이름';
COMMENT ON COLUMN hkgn.production_plan_detail.product_category IS '제품구분 - 제품 구분 코드';
COMMENT ON COLUMN hkgn.production_plan_detail.width IS '가로 - 가로 규격';
COMMENT ON COLUMN hkgn.production_plan_detail.height IS '세로 - 세로 규격';
COMMENT ON COLUMN hkgn.production_plan_detail.thickness IS '두께 - 두께';
COMMENT ON COLUMN hkgn.production_plan_detail.unit_type IS '규격단위 - 규격 단위';
COMMENT ON COLUMN hkgn.production_plan_detail.quantity IS '수량 - 수량';
COMMENT ON COLUMN hkgn.production_plan_detail.area IS '면적 - 면적';
COMMENT ON COLUMN hkgn.production_plan_detail.unit IS '단위 - 단위';
COMMENT ON COLUMN hkgn.production_plan_detail.unit_price IS '단가 - 단가';
COMMENT ON COLUMN hkgn.production_plan_detail.amount IS '금액 - 금액';
COMMENT ON COLUMN hkgn.production_plan_detail.dong IS '동 - 동';
COMMENT ON COLUMN hkgn.production_plan_detail.ho IS '호 - 호';
COMMENT ON COLUMN hkgn.production_plan_detail.floor IS '층 - 층';
COMMENT ON COLUMN hkgn.production_plan_detail.window_type IS '창호유형 - 창호 유형';
COMMENT ON COLUMN hkgn.production_plan_detail.location_detail IS '상세위치 - 상세 위치';
COMMENT ON COLUMN hkgn.production_plan_detail.delivery_date IS '납기일 - 납기일';
COMMENT ON COLUMN hkgn.production_plan_detail.remarks IS '비고 - 비고';
COMMENT ON COLUMN hkgn.production_plan_detail.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.production_plan_detail.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.production_plan_detail.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.production_plan_detail.updated_by IS '수정자 - 레코드 최종 수정자';
