-- ============================================
-- 테이블: permissions (역할별 권한 정의)
-- 설명: 역할별 권한 정의
-- 스키마: hkgn
-- 작성일: 2026-02-01 (원본), 2026-02-12 (hkgn 스키마 동기화)
-- ============================================

CREATE TABLE hkgn.permissions (
    -- PK
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                            -- [권한ID] 시스템 자동 생성 PK

    -- 비즈니스 컬럼
    role_id BIGINT NOT NULL REFERENCES hkgn.roles(id),
                                            -- [역할ID] 권한이 속한 역할 FK
    resource_type VARCHAR(100) NOT NULL,    -- [리소스유형] 권한 대상 유형
                                            -- 제한값: 'MENU', 'API', 'REPORT', 'DATA'
    resource_code VARCHAR(100),             -- [리소스코드] 특정 리소스 식별 코드 (NULL=해당 유형 전체)

    -- CRUD 권한
    can_read BOOLEAN NOT NULL DEFAULT FALSE,-- [조회권한] 데이터 조회 가능 여부
    can_create BOOLEAN NOT NULL DEFAULT FALSE,
                                            -- [생성권한] 데이터 생성 가능 여부
    can_update BOOLEAN NOT NULL DEFAULT FALSE,
                                            -- [수정권한] 데이터 수정 가능 여부
    can_delete BOOLEAN NOT NULL DEFAULT FALSE,
                                            -- [삭제권한] 데이터 삭제 가능 여부

    -- 확장 권한 (ERPNext 패턴)
    can_submit BOOLEAN NOT NULL DEFAULT FALSE,
                                            -- [제출권한] 문서 제출/확정 가능 여부
    can_approve BOOLEAN NOT NULL DEFAULT FALSE,
                                            -- [승인권한] 문서 승인 가능 여부
    can_cancel BOOLEAN NOT NULL DEFAULT FALSE,
                                            -- [취소권한] 확정된 문서 취소 가능 여부
    can_export BOOLEAN NOT NULL DEFAULT FALSE,
                                            -- [내보내기권한] 데이터 내보내기 가능 여부

    -- 필드 레벨 권한 (ERPNext Perm Level)
    perm_level INTEGER NOT NULL DEFAULT 0,  -- [권한레벨] 필드 레벨 접근 권한 (0=기본, 숫자 높을수록 민감)

    -- Record 필터 (Odoo Record Rule)
    record_filter TEXT,                     -- [레코드필터] 행 단위 접근 제어 SpEL 표현식

    -- 감사(audit) 컬럼
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
    updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,

    -- 제약조건
    CONSTRAINT chk_permissions_resource_type CHECK (resource_type IN ('MENU', 'API', 'REPORT', 'DATA'))
);

-- 인덱스
CREATE INDEX idx_permissions_role ON hkgn.permissions(role_id);
CREATE INDEX idx_permissions_resource ON hkgn.permissions(resource_type, resource_code);

-- 코멘트
COMMENT ON TABLE hkgn.permissions IS '역할별 권한 정의';
COMMENT ON COLUMN hkgn.permissions.id IS '권한ID - 시스템 자동 생성 PK';
COMMENT ON COLUMN hkgn.permissions.role_id IS '역할ID - 권한이 속한 역할 FK';
COMMENT ON COLUMN hkgn.permissions.resource_type IS '리소스유형 - MENU, API, REPORT, DATA';
COMMENT ON COLUMN hkgn.permissions.resource_code IS '리소스코드 - 특정 리소스 식별 코드 (NULL=해당 유형 전체)';
COMMENT ON COLUMN hkgn.permissions.can_read IS '조회권한 - 데이터 조회 가능 여부';
COMMENT ON COLUMN hkgn.permissions.can_create IS '생성권한 - 데이터 생성 가능 여부';
COMMENT ON COLUMN hkgn.permissions.can_update IS '수정권한 - 데이터 수정 가능 여부';
COMMENT ON COLUMN hkgn.permissions.can_delete IS '삭제권한 - 데이터 삭제 가능 여부';
COMMENT ON COLUMN hkgn.permissions.can_submit IS '제출권한 - 문서 제출/확정 가능 여부';
COMMENT ON COLUMN hkgn.permissions.can_approve IS '승인권한 - 문서 승인 가능 여부';
COMMENT ON COLUMN hkgn.permissions.can_cancel IS '취소권한 - 확정된 문서 취소 가능 여부';
COMMENT ON COLUMN hkgn.permissions.can_export IS '내보내기권한 - 데이터 내보내기 가능 여부';
COMMENT ON COLUMN hkgn.permissions.perm_level IS '권한레벨 - 필드 레벨 접근 권한 (0=기본)';
COMMENT ON COLUMN hkgn.permissions.record_filter IS '레코드필터 - 행 단위 접근 제어 SpEL 표현식';
COMMENT ON COLUMN hkgn.permissions.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.permissions.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.permissions.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.permissions.updated_by IS '수정자 - 레코드 최종 수정자';
