-- ============================================
-- 테이블: audit_logs (감사 로그)
-- 설명: 감사 로그 (로그인, 데이터 변경, 권한 변경 추적)
-- 스키마: hkgn
-- 작성일: 2026-02-01 (원본), 2026-02-12 (hkgn 스키마 동기화)
-- ============================================

CREATE TABLE hkgn.audit_logs (
    -- PK
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                            -- [감사로그ID] 시스템 자동 생성 PK

    -- 비즈니스 컬럼
    user_id BIGINT REFERENCES hkgn.users(id),
                                            -- [사용자ID] 행위자 FK (NULL=시스템)
    action VARCHAR(50) NOT NULL,            -- [행위] 수행한 작업 유형
                                            -- 제한값: 'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE',
                                            --         'SUBMIT', 'APPROVE', 'CANCEL', 'EXPORT'
    resource_type VARCHAR(100),             -- [리소스유형] 대상 리소스 종류 (예: USER, ORDER)
    resource_id VARCHAR(100),               -- [리소스ID] 대상 리소스의 ID
    old_values JSONB,                       -- [변경전값] 변경 전 데이터 (JSON)
    new_values JSONB,                       -- [변경후값] 변경 후 데이터 (JSON)
    ip_address VARCHAR(45),                 -- [IP주소] 클라이언트 IP (IPv4/IPv6)
    user_agent TEXT,                        -- [사용자에이전트] 브라우저/클라이언트 정보
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
                                            -- [상태] 작업 결과
                                            -- 제한값: 'SUCCESS', 'FAILURE'
    error_message TEXT,                     -- [오류메시지] 실패 시 오류 내용

    -- 생성일시만 (로그 테이블은 수정 불가)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_audit_logs_user ON hkgn.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON hkgn.audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON hkgn.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON hkgn.audit_logs(created_at);
CREATE INDEX idx_audit_logs_status ON hkgn.audit_logs(status);

-- 코멘트
COMMENT ON TABLE hkgn.audit_logs IS '감사 로그 (로그인, 데이터 변경, 권한 변경 추적)';
COMMENT ON COLUMN hkgn.audit_logs.id IS '감사로그ID - 시스템 자동 생성 PK';
COMMENT ON COLUMN hkgn.audit_logs.user_id IS '사용자ID - 행위자 FK (NULL=시스템)';
COMMENT ON COLUMN hkgn.audit_logs.action IS '행위 - LOGIN, LOGOUT, CREATE, UPDATE, DELETE, SUBMIT, APPROVE, CANCEL, EXPORT';
COMMENT ON COLUMN hkgn.audit_logs.resource_type IS '리소스유형 - 대상 리소스 종류 (예: USER, ORDER)';
COMMENT ON COLUMN hkgn.audit_logs.resource_id IS '리소스ID - 대상 리소스의 ID';
COMMENT ON COLUMN hkgn.audit_logs.old_values IS '변경전값 - 변경 전 데이터 (JSON)';
COMMENT ON COLUMN hkgn.audit_logs.new_values IS '변경후값 - 변경 후 데이터 (JSON)';
COMMENT ON COLUMN hkgn.audit_logs.ip_address IS 'IP주소 - 클라이언트 IP (IPv4/IPv6)';
COMMENT ON COLUMN hkgn.audit_logs.user_agent IS '사용자에이전트 - 브라우저/클라이언트 정보';
COMMENT ON COLUMN hkgn.audit_logs.status IS '상태 - SUCCESS, FAILURE';
COMMENT ON COLUMN hkgn.audit_logs.error_message IS '오류메시지 - 실패 시 오류 내용';
COMMENT ON COLUMN hkgn.audit_logs.created_at IS '생성일시 - 로그 기록 시각';
