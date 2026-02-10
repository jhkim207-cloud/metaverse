-- ============================================
-- 관리자 사용자 등록 (users + user_roles)
-- ============================================
-- 대상 DB: localhost:5433/apps (hkgn 스키마)
-- 계정: admin / admin123
-- 역할: ADMIN (roles.id = 2)
-- 생성일시: 2026-02-10
-- ============================================

SET search_path TO hkgn, public;

-- ============================================
-- STEP 1: users 테이블 INSERT
-- ============================================
-- password_hash: BCrypt 해시 (admin123)
-- 운영 환경에서는 반드시 애플리케이션을 통해 비밀번호를 설정할 것

INSERT INTO hkgn.users (
    username,
    password_hash,
    email,
    display_name,
    employee_id,
    phone_number,
    is_active,
    failed_login_count,
    created_by,
    updated_by
) VALUES (
    'admin',
    '$2a$10$pgUxN0hM5kVMQPms7up5Ge3XuKLnKI2/6U72D2Gebpok7hzOtp3Vm',  -- admin123
    'admin@hkgn.co.kr',
    '시스템관리자',
    '1',
    NULL,
    TRUE,
    0,
    'system',
    'system'
);

-- ============================================
-- STEP 2: user_roles 테이블 INSERT (ADMIN 역할 부여)
-- ============================================

INSERT INTO hkgn.user_roles (user_id, role_id, assigned_at)
SELECT u.id, 2, now()
FROM hkgn.users u
WHERE u.username = 'admin';

-- ============================================
-- STEP 3: 등록 확인
-- ============================================

SELECT
    u.id,
    u.username,
    u.display_name,
    u.email,
    u.employee_id,
    u.is_active,
    r.code AS role_code,
    r.name AS role_name
FROM hkgn.users u
JOIN hkgn.user_roles ur ON ur.user_id = u.id
JOIN hkgn.roles r ON r.id = ur.role_id
WHERE u.username = 'admin';
