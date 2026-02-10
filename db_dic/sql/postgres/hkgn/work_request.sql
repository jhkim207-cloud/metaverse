-- ============================================
-- 작업 의뢰 테이블 (work_request)
-- ============================================
-- 설명: 작업 의뢰서 데이터 관리
-- 참조: db_dic/dictionary/standards.json (work_request 섹션)
-- ============================================

CREATE TABLE hkgn.work_request (
    -- PK
    id                          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,  -- [식별자] 기본 키

    -- 의뢰 정보
    request_no                  VARCHAR(50)   NOT NULL,                           -- [의뢰번호] 작업 의뢰 번호
    request_date                DATE          NOT NULL,                           -- [의뢰일자] 작업 의뢰 일자
    plan_id                     BIGINT        NULL,                               -- [생산계획ID] 생산계획 참조
    order_no                    VARCHAR(50)   NULL,                               -- [주문번호] 수주 번호 참조

    -- 주문/거래처 정보
    customer_nm                 VARCHAR(200)  NULL,                               -- [주문처명] 주문처 이름
    supplier_nm                 VARCHAR(200)  NULL,                               -- [거래처명] 거래처 이름
    site_nm                     VARCHAR(200)  NULL,                               -- [현장명] 현장 이름

    -- 작업 구분
    work_category               VARCHAR(50)   NULL,                               -- [작업구분] 작업 구분 (standard_terms: WORK_CATEGORY)
    approval_status             VARCHAR(50)   NULL,                               -- [승인상태] 승인 상태 (standard_terms: APPROVAL_STATUS)
    memo                        TEXT          NULL,                               -- [메모] 메모
    duo_light                   VARCHAR(50)   NULL,                               -- [듀오라이트] 듀오라이트 사용 여부
    dong_ho_window_separate     BOOLEAN       NULL DEFAULT FALSE,                 -- [동호수창분리] 동호수창 분리 여부
    remarks                     TEXT          NULL,                               -- [비고] 비고

    -- 제품 정보
    product_category            VARCHAR(10)   NULL,                               -- [제품구분] 제품 구분 코드 (P: 완제품)
    material_nm                 VARCHAR(200)  NULL,                               -- [품명] 품명
    thickness                   INTEGER       NULL,                               -- [두께] 두께 (mm)

    -- 규격 정보
    unit_type                   VARCHAR(20)   NULL,                               -- [규격단위] 규격 단위 (mm, cm 등)
    width                       NUMERIC(10,2) NULL,                               -- [가로규격] 가로 규격
    height                      NUMERIC(10,2) NULL,                               -- [세로규격] 세로 규격
    other_spec                  VARCHAR(200)  NULL,                               -- [기타규격] 기타 규격

    -- 수량 정보
    quantity                    INTEGER       NULL DEFAULT 0,                     -- [수량] 총 수량
    unrequested_quantity        INTEGER       NULL DEFAULT 0,                     -- [미의뢰수량] 미의뢰 수량
    requested_quantity          INTEGER       NULL DEFAULT 0,                     -- [의뢰수량] 의뢰 수량
    area                        NUMERIC(10,3) NULL,                               -- [면적] 면적 (㎡)

    -- 추가 정보
    order_remarks               TEXT          NULL,                               -- [주문비고] 주문 비고
    origin_1                    VARCHAR(100)  NULL,                               -- [원산지1] 원산지 1
    origin_2                    VARCHAR(100)  NULL,                               -- [원산지2] 원산지 2

    -- 공정 정보
    process_1                   VARCHAR(100)  NULL,                               -- [공정1] 공정 1
    process_2                   VARCHAR(100)  NULL,                               -- [공정2] 공정 2
    process_3                   VARCHAR(100)  NULL,                               -- [공정3] 공정 3
    process_4                   VARCHAR(100)  NULL,                               -- [공정4] 공정 4
    process_5                   VARCHAR(100)  NULL,                               -- [공정5] 공정 5
    process_6                   VARCHAR(100)  NULL,                               -- [공정6] 공정 6
    process_7                   VARCHAR(100)  NULL,                               -- [공정7] 공정 7

    -- 감사 컬럼
    created_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [생성일시] 레코드 생성 시각
    updated_at                  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  -- [수정일시] 레코드 최종 수정 시각
    created_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,      -- [생성자] 레코드 생성자
    updated_by                  VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER       -- [수정자] 레코드 최종 수정자
);

-- 인덱스 생성
CREATE INDEX idx_work_request_request_no ON hkgn.work_request(request_no);
CREATE INDEX idx_work_request_order_no ON hkgn.work_request(order_no);
CREATE INDEX idx_work_request_request_date ON hkgn.work_request(request_date);
CREATE INDEX idx_work_request_approval_status ON hkgn.work_request(approval_status);

-- 코멘트 추가
COMMENT ON TABLE hkgn.work_request IS '작업 의뢰 정보';
COMMENT ON COLUMN hkgn.work_request.id IS '식별자 - 기본 키';
COMMENT ON COLUMN hkgn.work_request.request_no IS '의뢰번호 - 작업 의뢰 번호';
COMMENT ON COLUMN hkgn.work_request.request_date IS '의뢰일자 - 작업 의뢰 일자';
COMMENT ON COLUMN hkgn.work_request.order_no IS '주문번호 - 수주 번호 참조';
COMMENT ON COLUMN hkgn.work_request.customer_nm IS '주문처명 - 주문처 이름';
COMMENT ON COLUMN hkgn.work_request.supplier_nm IS '거래처명 - 거래처 이름';
COMMENT ON COLUMN hkgn.work_request.site_nm IS '현장명 - 현장 이름';
COMMENT ON COLUMN hkgn.work_request.work_category IS '작업구분 - 작업 구분 (standard_terms: WORK_CATEGORY 참조)';
COMMENT ON COLUMN hkgn.work_request.approval_status IS '승인상태 - 승인 상태 (standard_terms: APPROVAL_STATUS 참조)';
COMMENT ON COLUMN hkgn.work_request.memo IS '메모 - 메모';
COMMENT ON COLUMN hkgn.work_request.duo_light IS '듀오라이트 - 듀오라이트 사용 여부';
COMMENT ON COLUMN hkgn.work_request.dong_ho_window_separate IS '동호수창분리 - 동호수창 분리 여부';
COMMENT ON COLUMN hkgn.work_request.remarks IS '비고 - 비고';
COMMENT ON COLUMN hkgn.work_request.product_category IS '제품구분 - 제품 구분 코드 (P: 완제품)';
COMMENT ON COLUMN hkgn.work_request.material_nm IS '품명 - 품명';
COMMENT ON COLUMN hkgn.work_request.thickness IS '두께 - 두께 (mm)';
COMMENT ON COLUMN hkgn.work_request.unit_type IS '규격단위 - 규격 단위 (mm, cm 등)';
COMMENT ON COLUMN hkgn.work_request.width IS '가로규격 - 가로 규격';
COMMENT ON COLUMN hkgn.work_request.height IS '세로규격 - 세로 규격';
COMMENT ON COLUMN hkgn.work_request.other_spec IS '기타규격 - 기타 규격';
COMMENT ON COLUMN hkgn.work_request.quantity IS '수량 - 총 수량';
COMMENT ON COLUMN hkgn.work_request.unrequested_quantity IS '미의뢰수량 - 미의뢰 수량';
COMMENT ON COLUMN hkgn.work_request.requested_quantity IS '의뢰수량 - 의뢰 수량';
COMMENT ON COLUMN hkgn.work_request.area IS '면적 - 면적 (㎡)';
COMMENT ON COLUMN hkgn.work_request.order_remarks IS '주문비고 - 주문 비고';
COMMENT ON COLUMN hkgn.work_request.origin_1 IS '원산지1 - 원산지 1';
COMMENT ON COLUMN hkgn.work_request.origin_2 IS '원산지2 - 원산지 2';
COMMENT ON COLUMN hkgn.work_request.process_1 IS '공정1 - 공정 1';
COMMENT ON COLUMN hkgn.work_request.process_2 IS '공정2 - 공정 2';
COMMENT ON COLUMN hkgn.work_request.process_3 IS '공정3 - 공정 3';
COMMENT ON COLUMN hkgn.work_request.process_4 IS '공정4 - 공정 4';
COMMENT ON COLUMN hkgn.work_request.process_5 IS '공정5 - 공정 5';
COMMENT ON COLUMN hkgn.work_request.process_6 IS '공정6 - 공정 6';
COMMENT ON COLUMN hkgn.work_request.process_7 IS '공정7 - 공정 7';
COMMENT ON COLUMN hkgn.work_request.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.work_request.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.work_request.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.work_request.updated_by IS '수정자 - 레코드 최종 수정자';
