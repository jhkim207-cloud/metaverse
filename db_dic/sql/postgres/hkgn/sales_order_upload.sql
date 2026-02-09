-- ============================================
-- sales_order_upload (수주 파일 업로드)
-- ============================================
-- 용도: 엑셀로 정리한 수주정보를 업로드하여 임시 저장
-- 흐름: Excel Upload → 이 테이블 → 검증 → sales_order_header/detail로 이동
-- ============================================

DROP TABLE IF EXISTS hkgn.sales_order_upload CASCADE;

CREATE TABLE hkgn.sales_order_upload (
    -- PK
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,         -- [식별자] 기본 키

    -- 업로드 배치 정보
    upload_batch_id     VARCHAR(50)   NOT NULL,                                  -- [업로드배치ID] 동일 엑셀 파일의 배치 식별자
    upload_date         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [업로드일시] 파일 업로드 시각
    uploaded_by         VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [업로드자] 파일 업로드 사용자
    file_name           VARCHAR(255),                                            -- [파일명] 원본 엑셀 파일명

    -- 엑셀 원본 데이터 (컬럼 순서대로)
    row_num             INTEGER       NOT NULL,                                  -- [행번호] 엑셀 행 번호 (디버깅용)
    product_nm          VARCHAR(500),                                            -- [품명] 제품명 (엑셀 컬럼1)
    width               NUMERIC(10,2),                                           -- [가로규격] 가로 크기(mm) (엑셀 컬럼2)
    height              NUMERIC(10,2),                                           -- [세로규격] 세로 크기(mm) (엑셀 컬럼3)
    quantity            INTEGER,                                                 -- [수량] 주문 수량 (엑셀 컬럼4)
    dong                VARCHAR(100),                                            -- [동] 건물 동 정보 (엑셀 컬럼5)
    ho                  VARCHAR(100),                                            -- [호] 호수/단위 정보 (엑셀 컬럼6)
    window_type         VARCHAR(100),                                            -- [창종류] 창 타입 (엑셀 컬럼7)
    extra1              VARCHAR(200),                                            -- [추가정보1] 엑셀 컬럼8 (헤더 없음)
    extra2              VARCHAR(200),                                            -- [추가정보2] 엑셀 컬럼9 (헤더 없음)
    extra3              VARCHAR(200),                                            -- [추가정보3] 엑셀 컬럼10 (헤더 없음)

    -- 검증 상태
    validation_status   VARCHAR(20)   NOT NULL DEFAULT 'PENDING',                -- [검증상태] PENDING:대기, VALIDATED:검증완료, ERROR:오류, IMPORTED:이관완료
    validation_message  TEXT,                                                    -- [검증메시지] 검증 오류/경고 메시지
    validated_at        TIMESTAMP WITH TIME ZONE,                                -- [검증일시] 검증 완료 시각
    validated_by        VARCHAR(100),                                            -- [검증자] 검증 수행자

    -- 매핑 정보 (검증 후 채워짐)
    order_no            VARCHAR(30),                                             -- [수주번호] 매핑될 수주번호 (→ sales_order_header.order_no)
    material_cd         VARCHAR(30),                                             -- [자재코드] 매핑된 자재코드 (→ item_master.material_cd)
    customer_cd         VARCHAR(30),                                             -- [고객사코드] 매핑된 고객사코드 (→ business_partner.bp_cd)
    site_cd             VARCHAR(30),                                             -- [현장코드] 매핑된 현장코드 (→ site_master.site_cd)

    -- 이관 정보
    imported_at         TIMESTAMP WITH TIME ZONE,                                -- [이관일시] 수주 테이블로 이관된 시각
    imported_by         VARCHAR(100),                                            -- [이관자] 이관 수행자
    order_header_id     BIGINT,                                                  -- [수주헤더ID] 이관된 수주 헤더 ID (→ sales_order_header.id)
    order_detail_id     BIGINT,                                                  -- [수주상세ID] 이관된 수주 상세 ID (→ sales_order_detail.id)

    -- 감사 컬럼
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [생성일시] 레코드 생성 시각
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),         -- [수정일시] 레코드 최종 수정 시각
    created_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,             -- [생성자] 레코드 생성자
    updated_by          VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER              -- [수정자] 레코드 최종 수정자
);

-- 인덱스
CREATE INDEX idx_sales_order_upload_batch ON hkgn.sales_order_upload(upload_batch_id);
CREATE INDEX idx_sales_order_upload_status ON hkgn.sales_order_upload(validation_status);
CREATE INDEX idx_sales_order_upload_order_no ON hkgn.sales_order_upload(order_no);
CREATE INDEX idx_sales_order_upload_upload_date ON hkgn.sales_order_upload(upload_date);

-- 테이블 및 컬럼 코멘트
COMMENT ON TABLE hkgn.sales_order_upload IS '수주 파일 업로드 - 엑셀 업로드 데이터 임시 저장 및 검증';
COMMENT ON COLUMN hkgn.sales_order_upload.id IS '[식별자] 기본 키 (PK, 자동증가)';
COMMENT ON COLUMN hkgn.sales_order_upload.upload_batch_id IS '[업로드배치ID] 동일 엑셀 파일의 배치 식별자';
COMMENT ON COLUMN hkgn.sales_order_upload.upload_date IS '[업로드일시] 파일 업로드 시각';
COMMENT ON COLUMN hkgn.sales_order_upload.uploaded_by IS '[업로드자] 파일 업로드 사용자';
COMMENT ON COLUMN hkgn.sales_order_upload.file_name IS '[파일명] 원본 엑셀 파일명';
COMMENT ON COLUMN hkgn.sales_order_upload.row_num IS '[행번호] 엑셀 행 번호 (디버깅용)';
COMMENT ON COLUMN hkgn.sales_order_upload.product_nm IS '[품명] 제품명 (엑셀 컬럼1)';
COMMENT ON COLUMN hkgn.sales_order_upload.width IS '[가로규격] 가로 크기(mm) (엑셀 컬럼2)';
COMMENT ON COLUMN hkgn.sales_order_upload.height IS '[세로규격] 세로 크기(mm) (엑셀 컬럼3)';
COMMENT ON COLUMN hkgn.sales_order_upload.quantity IS '[수량] 주문 수량 (엑셀 컬럼4)';
COMMENT ON COLUMN hkgn.sales_order_upload.dong IS '[동] 건물 동 정보 (엑셀 컬럼5)';
COMMENT ON COLUMN hkgn.sales_order_upload.ho IS '[호] 호수/단위 정보 (엑셀 컬럼6)';
COMMENT ON COLUMN hkgn.sales_order_upload.window_type IS '[창종류] 창 타입 (엑셀 컬럼7)';
COMMENT ON COLUMN hkgn.sales_order_upload.extra1 IS '[추가정보1] 엑셀 컬럼8 (헤더 없음)';
COMMENT ON COLUMN hkgn.sales_order_upload.extra2 IS '[추가정보2] 엑셀 컬럼9 (헤더 없음)';
COMMENT ON COLUMN hkgn.sales_order_upload.extra3 IS '[추가정보3] 엑셀 컬럼10 (헤더 없음)';
COMMENT ON COLUMN hkgn.sales_order_upload.validation_status IS '[검증상태] PENDING:대기, VALIDATED:검증완료, ERROR:오류, IMPORTED:이관완료';
COMMENT ON COLUMN hkgn.sales_order_upload.validation_message IS '[검증메시지] 검증 오류/경고 메시지';
COMMENT ON COLUMN hkgn.sales_order_upload.validated_at IS '[검증일시] 검증 완료 시각';
COMMENT ON COLUMN hkgn.sales_order_upload.validated_by IS '[검증자] 검증 수행자';
COMMENT ON COLUMN hkgn.sales_order_upload.order_no IS '[수주번호] 매핑될 수주번호 (→ sales_order_header.order_no)';
COMMENT ON COLUMN hkgn.sales_order_upload.material_cd IS '[자재코드] 매핑된 자재코드 (→ item_master.material_cd)';
COMMENT ON COLUMN hkgn.sales_order_upload.customer_cd IS '[고객사코드] 매핑된 고객사코드 (→ business_partner.bp_cd)';
COMMENT ON COLUMN hkgn.sales_order_upload.site_cd IS '[현장코드] 매핑된 현장코드 (→ site_master.site_cd)';
COMMENT ON COLUMN hkgn.sales_order_upload.imported_at IS '[이관일시] 수주 테이블로 이관된 시각';
COMMENT ON COLUMN hkgn.sales_order_upload.imported_by IS '[이관자] 이관 수행자';
COMMENT ON COLUMN hkgn.sales_order_upload.order_header_id IS '[수주헤더ID] 이관된 수주 헤더 ID (→ sales_order_header.id)';
COMMENT ON COLUMN hkgn.sales_order_upload.order_detail_id IS '[수주상세ID] 이관된 수주 상세 ID (→ sales_order_detail.id)';
COMMENT ON COLUMN hkgn.sales_order_upload.created_at IS '[생성일시] 레코드 생성 시각';
COMMENT ON COLUMN hkgn.sales_order_upload.updated_at IS '[수정일시] 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.sales_order_upload.created_by IS '[생성자] 레코드 생성자';
COMMENT ON COLUMN hkgn.sales_order_upload.updated_by IS '[수정자] 레코드 최종 수정자';
