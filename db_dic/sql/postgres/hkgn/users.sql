-- ============================================
-- 테이블: users (사용자 정보)
-- 설명: 사용자 정보 (전체 버전 - 실제 DB 반영)
-- 스키마: hkgn
-- 작성일: 2026-02-01 (원본), 2026-02-12 (hkgn 스키마 동기화)
-- 참고: Flyway V1에는 간소화 버전이 적용됨.
--       Hibernate ddl-auto:update로 추가 컬럼 자동 생성됨.
-- ============================================

CREATE TABLE hkgn.users (
    -- PK
    id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                                    -- [사용자ID] 시스템 자동 생성 PK

    -- 비즈니스 컬럼
    username              VARCHAR(50)   NOT NULL UNIQUE,   -- [사용자명] 로그인 ID, 영문/숫자 조합
    email                 VARCHAR(255)  NOT NULL UNIQUE,   -- [이메일] 이메일 주소, 알림 발송용
    password_hash         VARCHAR(255)  NOT NULL,          -- [비밀번호해시] BCrypt 암호화된 비밀번호
    employee_id           VARCHAR(50),                     -- [사원번호] HR 시스템 연동용 사원번호
    display_name          VARCHAR(100),                    -- [표시명] 화면에 표시되는 이름
    phone_number          VARCHAR(20),                     -- [전화번호] 연락처
    profile_image_url     VARCHAR(500),                    -- [프로필이미지URL] 프로필 사진 경로
    organization_id       BIGINT,                          -- [조직ID] 소속 조직 FK (→ organizations.id)
    is_active             BOOLEAN       NOT NULL DEFAULT TRUE,  -- [활성여부] true=활성, false=비활성
    last_login_at         TIMESTAMP WITH TIME ZONE,        -- [최종로그인일시] 마지막 로그인 시각
    password_changed_at   TIMESTAMP WITH TIME ZONE,        -- [비밀번호변경일시] 비밀번호 만료 체크용
    failed_login_count    INTEGER       NOT NULL DEFAULT 0,-- [로그인실패횟수] 연속 실패 횟수, 잠금 기준
    locked_until          TIMESTAMP WITH TIME ZONE,        -- [잠금해제일시] 계정 잠금 해제 예정 시각

    -- 감사(audit) 컬럼
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by            VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER,
    updated_by            VARCHAR(100)  NOT NULL DEFAULT CURRENT_USER
);

-- 인덱스
CREATE UNIQUE INDEX idx_users_username ON hkgn.users(username);
CREATE UNIQUE INDEX idx_users_email ON hkgn.users(email);
CREATE INDEX idx_users_organization ON hkgn.users(organization_id);
CREATE INDEX idx_users_is_active ON hkgn.users(is_active);
CREATE INDEX idx_users_employee_id ON hkgn.users(employee_id);

-- 코멘트
COMMENT ON TABLE hkgn.users IS '사용자 정보';
COMMENT ON COLUMN hkgn.users.id IS '사용자ID - 시스템 자동 생성 PK';
COMMENT ON COLUMN hkgn.users.username IS '사용자명 - 로그인 ID, 영문/숫자 조합';
COMMENT ON COLUMN hkgn.users.email IS '이메일 - 이메일 주소, 알림 발송용';
COMMENT ON COLUMN hkgn.users.password_hash IS '비밀번호해시 - BCrypt 암호화된 비밀번호';
COMMENT ON COLUMN hkgn.users.employee_id IS '사원번호 - HR 시스템 연동용 사원번호';
COMMENT ON COLUMN hkgn.users.display_name IS '표시명 - 화면에 표시되는 이름';
COMMENT ON COLUMN hkgn.users.phone_number IS '전화번호 - 연락처';
COMMENT ON COLUMN hkgn.users.profile_image_url IS '프로필이미지URL - 프로필 사진 경로';
COMMENT ON COLUMN hkgn.users.organization_id IS '조직ID - 소속 조직 FK';
COMMENT ON COLUMN hkgn.users.is_active IS '활성여부 - true=활성, false=비활성';
COMMENT ON COLUMN hkgn.users.last_login_at IS '최종로그인일시 - 마지막 로그인 시각';
COMMENT ON COLUMN hkgn.users.password_changed_at IS '비밀번호변경일시 - 비밀번호 만료 체크용';
COMMENT ON COLUMN hkgn.users.failed_login_count IS '로그인실패횟수 - 연속 실패 횟수, 잠금 기준';
COMMENT ON COLUMN hkgn.users.locked_until IS '잠금해제일시 - 계정 잠금 해제 예정 시각';
COMMENT ON COLUMN hkgn.users.created_at IS '생성일시 - 레코드 생성 시각';
COMMENT ON COLUMN hkgn.users.updated_at IS '수정일시 - 레코드 최종 수정 시각';
COMMENT ON COLUMN hkgn.users.created_by IS '생성자 - 레코드 생성자';
COMMENT ON COLUMN hkgn.users.updated_by IS '수정자 - 레코드 최종 수정자';
