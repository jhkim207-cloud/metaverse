# 데이터 모델 설계서: 시스템 Core

## 1. ERD

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ users           │       │ user_roles      │       │ roles           │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ PK id           │───┐   │ PK,FK user_id   │   ┌───│ PK id           │
│    username     │   └──>│ PK,FK role_id   │<──┘   │    code         │
│    email        │       │    assigned_at  │       │    name         │
│    password_hash│       │ FK assigned_by  │       │    description  │
│    employee_id  │       └─────────────────┘       │    is_system    │
│    display_name │                                 │    is_active    │
│ FK organization_│──┐    ┌─────────────────┐       │    created_at   │
│    is_active    │  │    │ permissions     │       │    updated_at   │
│    last_login_at│  │    ├─────────────────┤       │    created_by   │
│    password_    │  │    │ PK id           │       │    updated_by   │
│    failed_login_│  │    │ FK role_id      │<──────└─────────────────┘
│    locked_until │  │    │    resource_type│
│    created_at   │  │    │    resource_code│       ┌─────────────────┐
│    updated_at   │  │    │    can_read     │       │ role_menus      │
│    created_by   │  │    │    can_create   │       ├─────────────────┤
│    updated_by   │  │    │    can_update   │   ┌───│ PK,FK role_id   │
└─────────────────┘  │    │    can_delete   │   │   │ PK,FK menu_id   │──┐
                     │    │    can_submit   │   │   └─────────────────┘  │
┌─────────────────┐  │    │    can_approve  │   │                        │
│ organizations   │  │    │    can_cancel   │   │   ┌─────────────────┐  │
├─────────────────┤  │    │    can_export   │   │   │ menus           │  │
│ PK id           │<─┘    │    perm_level   │   │   ├─────────────────┤  │
│    code         │       │    record_filter│   └───│ PK id           │<─┘
│    name         │       │    created_at   │       │    code         │
│    org_type     │       │    updated_at   │       │    name         │
│ FK parent_id    │───┐   │    created_by   │       │ FK parent_id    │───┐
│    depth        │   │   │    updated_by   │       │    path         │   │
│    path         │   │   └─────────────────┘       │    icon         │   │
│ FK manager_id   │   │                             │    menu_type    │   │
│    is_active    │   │   ┌─────────────────┐       │    sort_order   │   │
│    created_at   │   └──>│ (self-reference)│       │    is_active    │   │
│    updated_at   │       └─────────────────┘       │    depth        │   │
│    created_by   │                                 │    created_at   │   │
│    updated_by   │       ┌─────────────────┐       │    updated_at   │   │
└─────────────────┘       │ audit_logs      │       │    created_by   │   │
                          ├─────────────────┤       │    updated_by   │   │
                          │ PK id           │       └─────────────────┘   │
                          │ FK user_id      │               │             │
                          │    action       │               └─────────────┘
                          │    resource_type│
                          │    resource_id  │       ┌─────────────────┐
                          │    old_values   │       │ role_groups     │
                          │    new_values   │       ├─────────────────┤
                          │    ip_address   │   ┌───│ PK id           │
                          │    user_agent   │   │   │    code         │
                          │    status       │   │   │    name         │
                          │    error_message│   │   │    description  │
                          │    created_at   │   │   └─────────────────┘
                          └─────────────────┘   │             │
                                                │             │
┌─────────────────────────────────────────────┐ │   ┌─────────────────┐
│ role_group_members                          │ │   │ role_group_     │
├─────────────────────────────────────────────┤ │   │ inheritance     │
│ PK,FK role_group_id                         │<┘   ├─────────────────┤
│ PK,FK role_id                               │     │ PK,FK child_    │
└─────────────────────────────────────────────┘     │ PK,FK parent_   │
                                                    └─────────────────┘
```

---

## 2. 테이블 정의

### 2.1 users (사용자)

| 컬럼명 | 데이터타입 | 제약조건 | 한글명 | 설명 |
|--------|-----------|----------|--------|------|
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | 사용자ID | 시스템 자동 생성 PK |
| username | VARCHAR(50) | NOT NULL UNIQUE | 사용자명 | 로그인 ID |
| email | VARCHAR(255) | NOT NULL UNIQUE | 이메일 | 이메일 주소 |
| password_hash | VARCHAR(255) | NOT NULL | 비밀번호해시 | BCrypt 암호화 |
| employee_id | VARCHAR(50) | NULL | 사원번호 | HR 시스템 연동용 |
| display_name | VARCHAR(100) | NULL | 표시명 | 화면 표시 이름 |
| phone_number | VARCHAR(20) | NULL | 전화번호 | 연락처 |
| profile_image_url | VARCHAR(500) | NULL | 프로필이미지URL | 프로필 사진 |
| organization_id | BIGINT | FK organizations(id) | 조직ID | 소속 조직 |
| is_active | BOOLEAN | NOT NULL DEFAULT TRUE | 활성여부 | 활성 상태 |
| last_login_at | TIMESTAMP WITH TIME ZONE | NULL | 최종로그인일시 | 마지막 로그인 |
| password_changed_at | TIMESTAMP WITH TIME ZONE | NULL | 비밀번호변경일시 | 비밀번호 만료 체크용 |
| failed_login_count | INTEGER | NOT NULL DEFAULT 0 | 로그인실패횟수 | 연속 실패 횟수 |
| locked_until | TIMESTAMP WITH TIME ZONE | NULL | 잠금해제일시 | 계정 잠금 해제 시각 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT now() | 생성일시 | 레코드 생성 시각 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT now() | 수정일시 | 레코드 수정 시각 |
| created_by | VARCHAR(100) | NOT NULL DEFAULT CURRENT_USER | 생성자 | 레코드 생성자 |
| updated_by | VARCHAR(100) | NOT NULL DEFAULT CURRENT_USER | 수정자 | 레코드 수정자 |

### 2.2 roles (역할)

| 컬럼명 | 데이터타입 | 제약조건 | 한글명 | 설명 |
|--------|-----------|----------|--------|------|
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | 역할ID | 시스템 자동 생성 PK |
| code | VARCHAR(50) | NOT NULL UNIQUE | 역할코드 | 시스템 식별용 코드 |
| name | VARCHAR(100) | NOT NULL | 역할명 | 화면 표시 이름 |
| description | TEXT | NULL | 설명 | 역할 상세 설명 |
| is_system | BOOLEAN | NOT NULL DEFAULT FALSE | 시스템역할여부 | 시스템 역할 (삭제 불가) |
| is_active | BOOLEAN | NOT NULL DEFAULT TRUE | 활성여부 | 활성 상태 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT now() | 생성일시 | 레코드 생성 시각 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT now() | 수정일시 | 레코드 수정 시각 |
| created_by | VARCHAR(100) | NOT NULL DEFAULT CURRENT_USER | 생성자 | 레코드 생성자 |
| updated_by | VARCHAR(100) | NOT NULL DEFAULT CURRENT_USER | 수정자 | 레코드 수정자 |

### 2.3 permissions (권한)

| 컬럼명 | 데이터타입 | 제약조건 | 한글명 | 설명 |
|--------|-----------|----------|--------|------|
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | 권한ID | 시스템 자동 생성 PK |
| role_id | BIGINT | NOT NULL FK roles(id) | 역할ID | 권한이 속한 역할 |
| resource_type | VARCHAR(100) | NOT NULL | 리소스유형 | MENU, API, REPORT, DATA |
| resource_code | VARCHAR(100) | NULL | 리소스코드 | 특정 리소스 식별 코드 |
| can_read | BOOLEAN | NOT NULL DEFAULT FALSE | 조회권한 | 조회 가능 여부 |
| can_create | BOOLEAN | NOT NULL DEFAULT FALSE | 생성권한 | 생성 가능 여부 |
| can_update | BOOLEAN | NOT NULL DEFAULT FALSE | 수정권한 | 수정 가능 여부 |
| can_delete | BOOLEAN | NOT NULL DEFAULT FALSE | 삭제권한 | 삭제 가능 여부 |
| can_submit | BOOLEAN | NOT NULL DEFAULT FALSE | 제출권한 | 제출/확정 가능 여부 |
| can_approve | BOOLEAN | NOT NULL DEFAULT FALSE | 승인권한 | 승인 가능 여부 |
| can_cancel | BOOLEAN | NOT NULL DEFAULT FALSE | 취소권한 | 취소 가능 여부 |
| can_export | BOOLEAN | NOT NULL DEFAULT FALSE | 내보내기권한 | 내보내기 가능 여부 |
| perm_level | INTEGER | NOT NULL DEFAULT 0 | 권한레벨 | 필드 레벨 접근 권한 |
| record_filter | TEXT | NULL | 레코드필터 | 행 단위 접근 제어 SpEL |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT now() | 생성일시 | 레코드 생성 시각 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT now() | 수정일시 | 레코드 수정 시각 |
| created_by | VARCHAR(100) | NOT NULL DEFAULT CURRENT_USER | 생성자 | 레코드 생성자 |
| updated_by | VARCHAR(100) | NOT NULL DEFAULT CURRENT_USER | 수정자 | 레코드 수정자 |

### 2.4 menus (메뉴)

| 컬럼명 | 데이터타입 | 제약조건 | 한글명 | 설명 |
|--------|-----------|----------|--------|------|
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | 메뉴ID | 시스템 자동 생성 PK |
| code | VARCHAR(50) | NOT NULL UNIQUE | 메뉴코드 | 시스템 식별용 코드 |
| name | VARCHAR(100) | NOT NULL | 메뉴명 | 화면 표시 이름 |
| parent_id | BIGINT | FK menus(id) | 상위메뉴ID | 부모 메뉴 (NULL=최상위) |
| path | VARCHAR(255) | NULL | 계층경로 | 라우팅 경로 |
| icon | VARCHAR(50) | NULL | 아이콘 | 메뉴 아이콘 클래스명 |
| menu_type | VARCHAR(20) | NOT NULL | 메뉴유형 | GROUP, MENU, LINK |
| sort_order | INTEGER | NOT NULL DEFAULT 0 | 정렬순서 | 같은 레벨 내 표시 순서 |
| is_active | BOOLEAN | NOT NULL DEFAULT TRUE | 활성여부 | 활성 상태 |
| depth | INTEGER | NOT NULL DEFAULT 0 | 계층깊이 | 메뉴 계층 깊이 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT now() | 생성일시 | 레코드 생성 시각 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT now() | 수정일시 | 레코드 수정 시각 |
| created_by | VARCHAR(100) | NOT NULL DEFAULT CURRENT_USER | 생성자 | 레코드 생성자 |
| updated_by | VARCHAR(100) | NOT NULL DEFAULT CURRENT_USER | 수정자 | 레코드 수정자 |

### 2.5 organizations (조직)

| 컬럼명 | 데이터타입 | 제약조건 | 한글명 | 설명 |
|--------|-----------|----------|--------|------|
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | 조직ID | 시스템 자동 생성 PK |
| code | VARCHAR(50) | NOT NULL UNIQUE | 조직코드 | 시스템 식별용 코드 |
| name | VARCHAR(100) | NOT NULL | 조직명 | 조직 이름 |
| org_type | VARCHAR(20) | NOT NULL | 조직유형 | COMPANY, DEPARTMENT, TEAM |
| parent_id | BIGINT | FK organizations(id) | 상위조직ID | 부모 조직 (NULL=최상위) |
| depth | INTEGER | NOT NULL DEFAULT 0 | 계층깊이 | 조직 계층 깊이 |
| path | VARCHAR(500) | NULL | 계층경로 | Materialized Path |
| manager_id | BIGINT | FK users(id) | 관리자ID | 조직 책임자 |
| is_active | BOOLEAN | NOT NULL DEFAULT TRUE | 활성여부 | 활성 상태 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT now() | 생성일시 | 레코드 생성 시각 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT now() | 수정일시 | 레코드 수정 시각 |
| created_by | VARCHAR(100) | NOT NULL DEFAULT CURRENT_USER | 생성자 | 레코드 생성자 |
| updated_by | VARCHAR(100) | NOT NULL DEFAULT CURRENT_USER | 수정자 | 레코드 수정자 |

### 2.6 audit_logs (감사 로그)

| 컬럼명 | 데이터타입 | 제약조건 | 한글명 | 설명 |
|--------|-----------|----------|--------|------|
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | 감사로그ID | 시스템 자동 생성 PK |
| user_id | BIGINT | FK users(id) | 사용자ID | 행위자 (NULL=시스템) |
| action | VARCHAR(50) | NOT NULL | 행위 | LOGIN, LOGOUT, CREATE 등 |
| resource_type | VARCHAR(100) | NULL | 리소스유형 | 대상 리소스 종류 |
| resource_id | VARCHAR(100) | NULL | 리소스ID | 대상 리소스의 ID |
| old_values | JSONB | NULL | 변경전값 | 변경 전 데이터 |
| new_values | JSONB | NULL | 변경후값 | 변경 후 데이터 |
| ip_address | VARCHAR(45) | NULL | IP주소 | 클라이언트 IP |
| user_agent | TEXT | NULL | 사용자에이전트 | 브라우저 정보 |
| status | VARCHAR(20) | NOT NULL | 상태 | SUCCESS, FAILURE |
| error_message | TEXT | NULL | 오류메시지 | 실패 시 오류 내용 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT now() | 생성일시 | 로그 기록 시각 |

### 2.7 user_roles (사용자-역할 매핑)

| 컬럼명 | 데이터타입 | 제약조건 | 한글명 | 설명 |
|--------|-----------|----------|--------|------|
| user_id | BIGINT | PK, NOT NULL FK users(id) | 사용자ID | 역할 부여받은 사용자 |
| role_id | BIGINT | PK, NOT NULL FK roles(id) | 역할ID | 부여된 역할 |
| assigned_at | TIMESTAMP WITH TIME ZONE | NOT NULL DEFAULT now() | 할당일시 | 역할 부여 시각 |
| assigned_by | BIGINT | FK users(id) | 할당자ID | 역할 부여한 사용자 |

### 2.8 role_menus (역할-메뉴 매핑)

| 컬럼명 | 데이터타입 | 제약조건 | 한글명 | 설명 |
|--------|-----------|----------|--------|------|
| role_id | BIGINT | PK, NOT NULL FK roles(id) | 역할ID | 메뉴 접근 권한 가진 역할 |
| menu_id | BIGINT | PK, NOT NULL FK menus(id) | 메뉴ID | 접근 허용된 메뉴 |

### 2.9 role_groups (역할 그룹)

| 컬럼명 | 데이터타입 | 제약조건 | 한글명 | 설명 |
|--------|-----------|----------|--------|------|
| id | BIGINT | PK, GENERATED ALWAYS AS IDENTITY | 역할그룹ID | 시스템 자동 생성 PK |
| code | VARCHAR(50) | NOT NULL UNIQUE | 역할그룹코드 | 시스템 식별용 코드 |
| name | VARCHAR(100) | NOT NULL | 역할그룹명 | 역할 그룹 이름 |
| description | TEXT | NULL | 설명 | 역할 그룹 상세 설명 |

### 2.10 role_group_members (역할 그룹-역할 매핑)

| 컬럼명 | 데이터타입 | 제약조건 | 한글명 | 설명 |
|--------|-----------|----------|--------|------|
| role_group_id | BIGINT | PK, NOT NULL FK role_groups(id) | 역할그룹ID | 역할이 속한 그룹 |
| role_id | BIGINT | PK, NOT NULL FK roles(id) | 역할ID | 그룹에 속한 역할 |

### 2.11 role_group_inheritance (역할 그룹 상속)

| 컬럼명 | 데이터타입 | 제약조건 | 한글명 | 설명 |
|--------|-----------|----------|--------|------|
| child_group_id | BIGINT | PK, NOT NULL FK role_groups(id) | 하위그룹ID | 상속받는 역할 그룹 |
| parent_group_id | BIGINT | PK, NOT NULL FK role_groups(id) | 상위그룹ID | 상속하는 역할 그룹 |

---

## 3. 인덱스 정의

| 테이블 | 인덱스명 | 컬럼 | 유형 | 용도 |
|--------|----------|------|------|------|
| users | idx_users_username | username | BTREE UNIQUE | 로그인 검색 |
| users | idx_users_email | email | BTREE UNIQUE | 이메일 검색 |
| users | idx_users_organization | organization_id | BTREE | 조직별 사용자 조회 |
| users | idx_users_is_active | is_active | BTREE | 활성 사용자 필터 |
| roles | idx_roles_code | code | BTREE UNIQUE | 역할 코드 검색 |
| roles | idx_roles_is_active | is_active | BTREE | 활성 역할 필터 |
| permissions | idx_permissions_role | role_id | BTREE | 역할별 권한 조회 |
| permissions | idx_permissions_resource | resource_type, resource_code | BTREE | 리소스별 권한 조회 |
| menus | idx_menus_code | code | BTREE UNIQUE | 메뉴 코드 검색 |
| menus | idx_menus_parent | parent_id | BTREE | 메뉴 트리 조회 |
| menus | idx_menus_sort | parent_id, sort_order | BTREE | 메뉴 정렬 조회 |
| organizations | idx_organizations_code | code | BTREE UNIQUE | 조직 코드 검색 |
| organizations | idx_organizations_parent | parent_id | BTREE | 조직 트리 조회 |
| organizations | idx_organizations_path | path | BTREE | 계층 경로 검색 |
| audit_logs | idx_audit_logs_user | user_id | BTREE | 사용자별 로그 조회 |
| audit_logs | idx_audit_logs_action | action | BTREE | 행위별 로그 조회 |
| audit_logs | idx_audit_logs_resource | resource_type, resource_id | BTREE | 리소스별 로그 조회 |
| audit_logs | idx_audit_logs_created | created_at | BTREE | 시간별 로그 조회 |

---

## 4. 제약조건

| 테이블 | 제약명 | 유형 | 정의 |
|--------|--------|------|------|
| users | pk_users | PRIMARY KEY | (id) |
| users | uq_users_username | UNIQUE | (username) |
| users | uq_users_email | UNIQUE | (email) |
| users | fk_users_organization | FOREIGN KEY | REFERENCES organizations(id) |
| roles | pk_roles | PRIMARY KEY | (id) |
| roles | uq_roles_code | UNIQUE | (code) |
| permissions | pk_permissions | PRIMARY KEY | (id) |
| permissions | fk_permissions_role | FOREIGN KEY | REFERENCES roles(id) |
| permissions | chk_permissions_resource_type | CHECK | resource_type IN ('MENU', 'API', 'REPORT', 'DATA') |
| menus | pk_menus | PRIMARY KEY | (id) |
| menus | uq_menus_code | UNIQUE | (code) |
| menus | fk_menus_parent | FOREIGN KEY | REFERENCES menus(id) |
| menus | chk_menus_type | CHECK | menu_type IN ('GROUP', 'MENU', 'LINK') |
| organizations | pk_organizations | PRIMARY KEY | (id) |
| organizations | uq_organizations_code | UNIQUE | (code) |
| organizations | fk_organizations_parent | FOREIGN KEY | REFERENCES organizations(id) |
| organizations | fk_organizations_manager | FOREIGN KEY | REFERENCES users(id) |
| organizations | chk_organizations_type | CHECK | org_type IN ('COMPANY', 'DEPARTMENT', 'TEAM') |
| audit_logs | pk_audit_logs | PRIMARY KEY | (id) |
| audit_logs | fk_audit_logs_user | FOREIGN KEY | REFERENCES users(id) |
| audit_logs | chk_audit_logs_status | CHECK | status IN ('SUCCESS', 'FAILURE') |
| user_roles | pk_user_roles | PRIMARY KEY | (user_id, role_id) |
| user_roles | fk_user_roles_user | FOREIGN KEY | REFERENCES users(id) |
| user_roles | fk_user_roles_role | FOREIGN KEY | REFERENCES roles(id) |
| user_roles | fk_user_roles_assigned_by | FOREIGN KEY | REFERENCES users(id) |
| role_menus | pk_role_menus | PRIMARY KEY | (role_id, menu_id) |
| role_menus | fk_role_menus_role | FOREIGN KEY | REFERENCES roles(id) |
| role_menus | fk_role_menus_menu | FOREIGN KEY | REFERENCES menus(id) |
| role_groups | pk_role_groups | PRIMARY KEY | (id) |
| role_groups | uq_role_groups_code | UNIQUE | (code) |
| role_group_members | pk_role_group_members | PRIMARY KEY | (role_group_id, role_id) |
| role_group_members | fk_rgm_role_group | FOREIGN KEY | REFERENCES role_groups(id) |
| role_group_members | fk_rgm_role | FOREIGN KEY | REFERENCES roles(id) |
| role_group_inheritance | pk_role_group_inheritance | PRIMARY KEY | (child_group_id, parent_group_id) |
| role_group_inheritance | fk_rgi_child | FOREIGN KEY | REFERENCES role_groups(id) |
| role_group_inheritance | fk_rgi_parent | FOREIGN KEY | REFERENCES role_groups(id) |

---

## 5. 초기 데이터

```sql
-- 기본 역할
INSERT INTO roles (code, name, description, is_system, is_active) VALUES
('SUPER_ADMIN', '슈퍼관리자', '시스템 전체 관리 권한', TRUE, TRUE),
('ADMIN', '관리자', '사용자/역할 관리 권한', TRUE, TRUE),
('USER', '일반사용자', '기본 사용자 권한', TRUE, TRUE),
('VIEWER', '조회자', '조회 전용 권한', TRUE, TRUE);

-- 기본 메뉴
INSERT INTO menus (code, name, parent_id, path, icon, menu_type, sort_order, is_active, depth) VALUES
('SYSTEM', '시스템관리', NULL, NULL, 'settings', 'GROUP', 1, TRUE, 0),
('SYSTEM_USERS', '사용자 관리', 1, '/admin/users', 'people', 'MENU', 1, TRUE, 1),
('SYSTEM_ROLES', '역할 관리', 1, '/admin/roles', 'security', 'MENU', 2, TRUE, 1),
('SYSTEM_MENUS', '메뉴 관리', 1, '/admin/menus', 'menu', 'MENU', 3, TRUE, 1),
('SYSTEM_ORGS', '조직 관리', 1, '/admin/organizations', 'business', 'MENU', 4, TRUE, 1),
('SYSTEM_AUDIT', '감사 로그', 1, '/admin/audit-logs', 'history', 'MENU', 5, TRUE, 1),
('MY', '마이페이지', NULL, NULL, 'person', 'GROUP', 2, TRUE, 0),
('MY_PROFILE', '프로필', 7, '/my/profile', 'account_circle', 'MENU', 1, TRUE, 1),
('MY_PASSWORD', '비밀번호 변경', 7, '/my/password', 'lock', 'MENU', 2, TRUE, 1);
```

---

## 6. 마이그레이션 전략

| 단계 | 작업 | 롤백 방안 |
|------|------|----------|
| 1 | organizations 테이블 생성 | DROP TABLE organizations |
| 2 | users 테이블 생성 | DROP TABLE users |
| 3 | roles 테이블 생성 | DROP TABLE roles |
| 4 | permissions 테이블 생성 | DROP TABLE permissions |
| 5 | menus 테이블 생성 | DROP TABLE menus |
| 6 | audit_logs 테이블 생성 | DROP TABLE audit_logs |
| 7 | user_roles 테이블 생성 | DROP TABLE user_roles |
| 8 | role_menus 테이블 생성 | DROP TABLE role_menus |
| 9 | role_groups 테이블 생성 | DROP TABLE role_groups |
| 10 | role_group_members 테이블 생성 | DROP TABLE role_group_members |
| 11 | role_group_inheritance 테이블 생성 | DROP TABLE role_group_inheritance |
| 12 | 인덱스 생성 | DROP INDEX |
| 13 | 초기 데이터 삽입 | DELETE FROM |
