# 시스템 Core 기능 PRD

## 개요

**기능명**: 시스템 Core (사용자/인증/권한/메뉴/조직/감사)
**버전**: 1.0.0
**작성일**: 2026-02-01
**목표**: Spring Boot + React 기반 엔터프라이즈 앱의 기본 표준 기능 정의

**벤치마킹 대상**:
- 글로벌 ERP: SAP S/4HANA, Oracle Cloud ERP, Microsoft Dynamics 365, Salesforce
- 오픈소스: Odoo, ERPNext, Apache OFBiz

---

## 1. 기능 범위

### 1.1 Core 도메인 (필수)

| 도메인 | 기능 | 우선순위 |
|--------|------|----------|
| **사용자 관리** | 사용자 CRUD, 프로필, 비활성화 | P0 |
| **인증** | 로그인/로그아웃, JWT, 세션 관리 | P0 |
| **권한 관리** | RBAC, 역할/권한 정의, 권한 할당 | P0 |
| **메뉴 관리** | 메뉴 구조, 역할별 메뉴 접근 | P0 |
| **조직 관리** | 회사/부서/팀 계층 구조 | P1 |
| **감사 로그** | 로그인, 데이터 변경, 권한 변경 추적 | P1 |

### 1.2 Common 도메인 (선택)

| 도메인 | 기능 | 우선순위 |
|--------|------|----------|
| **공통코드** | 코드 그룹/상세 관리 | P1 |
| **파일 관리** | 업로드/다운로드, 메타데이터 | P2 |
| **알림** | 시스템 알림, 이메일 발송 | P2 |
| **설정** | 시스템/사용자 설정 | P2 |

---

## 2. 권한 모델 설계 (RBAC + ABAC Hybrid)

### 2.1 핵심 엔티티

```
┌─────────────────────────────────────────────────────────────┐
│                      권한 모델 ERD                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User ──M:N──> Role ──1:N──> Permission                    │
│    │             │              │                          │
│    │             │              ├─ resourceType (메뉴, API)│
│    │             │              ├─ action (CRUD+α)         │
│    │             │              └─ permLevel (필드 레벨)   │
│    │             │                                         │
│    │             └──M:N──> RoleGroup (역할 그룹화)         │
│    │                          │                            │
│    │                          └─ 상속 관계                 │
│    │                                                       │
│    └──M:1──> Organization (조직 소속)                      │
│                  │                                         │
│                  └─ Company > Department > Team            │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 테이블 목록

| 테이블명 | 한글명 | 유형 | 설명 |
|----------|--------|------|------|
| users | 사용자 | Master | 사용자 정보 |
| roles | 역할 | Master | 역할 정의 |
| permissions | 권한 | Master | 역할별 권한 |
| menus | 메뉴 | Master | 메뉴 구조 |
| organizations | 조직 | Master | 조직 계층 |
| audit_logs | 감사로그 | Log | 감사 기록 |
| user_roles | 사용자역할 | Relation | M:N 매핑 |
| role_menus | 역할메뉴 | Relation | M:N 매핑 |
| role_groups | 역할그룹 | Master | 역할 그룹 |
| role_group_members | 역할그룹멤버 | Relation | M:N 매핑 |
| role_group_inheritance | 역할그룹상속 | Relation | 상속 관계 |

---

## 3. 인증 체계 설계

### 3.1 인증 방식

| 방식 | 용도 | 구현 |
|------|------|------|
| **JWT** | API 인증 | Access Token (15분) + Refresh Token (7일) |
| **Session** | Web UI | Redis 세션 저장 |
| **MFA** | 선택적 2차 인증 | TOTP (Google Authenticator 호환) |

### 3.2 인증 플로우

```
[로그인 요청]
     │
     ▼
┌─────────────────┐
│ 1. 사용자 검증   │ ← username/password 확인
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. 계정 상태 확인│ ← 잠금, 비활성화, 비밀번호 만료
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. MFA 필요?    │ ← 설정에 따라 2차 인증
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. JWT 발급     │ ← Access + Refresh Token
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 5. 감사 로그    │ ← 로그인 성공/실패 기록
└─────────────────┘
```

### 3.3 보안 정책

| 정책 | 기본값 | 설명 |
|------|--------|------|
| 비밀번호 최소 길이 | 8자 | 대소문자, 숫자, 특수문자 포함 |
| 비밀번호 만료 | 90일 | 설정 가능 |
| 로그인 실패 잠금 | 5회 | 30분 잠금 |
| 세션 타임아웃 | 30분 | 설정 가능 |
| 동시 세션 | 3개 | 설정 가능 |

---

## 4. API 설계

### 4.1 인증 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/auth/login | 로그인 |
| POST | /api/auth/logout | 로그아웃 |
| POST | /api/auth/refresh | 토큰 갱신 |
| POST | /api/auth/mfa/setup | MFA 설정 |
| POST | /api/auth/mfa/verify | MFA 검증 |
| POST | /api/auth/password/change | 비밀번호 변경 |
| POST | /api/auth/password/reset | 비밀번호 초기화 요청 |

### 4.2 사용자 관리 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/users | 사용자 목록 |
| GET | /api/users/{id} | 사용자 상세 |
| POST | /api/users | 사용자 생성 |
| PUT | /api/users/{id} | 사용자 수정 |
| DELETE | /api/users/{id} | 사용자 삭제 (비활성화) |
| POST | /api/users/{id}/activate | 사용자 활성화 |
| POST | /api/users/{id}/deactivate | 사용자 비활성화 |
| PUT | /api/users/{id}/roles | 역할 할당 |
| GET | /api/users/me | 내 정보 |
| PUT | /api/users/me | 내 정보 수정 |

### 4.3 역할/권한 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/roles | 역할 목록 |
| GET | /api/roles/{id} | 역할 상세 |
| POST | /api/roles | 역할 생성 |
| PUT | /api/roles/{id} | 역할 수정 |
| DELETE | /api/roles/{id} | 역할 삭제 |
| GET | /api/roles/{id}/permissions | 역할 권한 조회 |
| PUT | /api/roles/{id}/permissions | 역할 권한 설정 |
| GET | /api/roles/{id}/menus | 역할 메뉴 조회 |
| PUT | /api/roles/{id}/menus | 역할 메뉴 설정 |

### 4.4 메뉴 관리 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/menus | 전체 메뉴 트리 |
| GET | /api/menus/my | 내 접근 가능 메뉴 |
| GET | /api/menus/{id} | 메뉴 상세 |
| POST | /api/menus | 메뉴 생성 |
| PUT | /api/menus/{id} | 메뉴 수정 |
| DELETE | /api/menus/{id} | 메뉴 삭제 |
| PUT | /api/menus/{id}/sort | 메뉴 순서 변경 |

### 4.5 조직 관리 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/organizations | 조직 트리 |
| GET | /api/organizations/{id} | 조직 상세 |
| POST | /api/organizations | 조직 생성 |
| PUT | /api/organizations/{id} | 조직 수정 |
| DELETE | /api/organizations/{id} | 조직 삭제 |
| GET | /api/organizations/{id}/users | 조직 소속 사용자 |

---

## 5. UI 설계

### 5.1 화면 목록

| 메뉴 | 화면 | 경로 | 설명 |
|------|------|------|------|
| 로그인 | 로그인 | /login | 인증 |
| 시스템관리 | 사용자 관리 | /admin/users | 사용자 CRUD |
| 시스템관리 | 역할 관리 | /admin/roles | 역할/권한 설정 |
| 시스템관리 | 메뉴 관리 | /admin/menus | 메뉴 구조 관리 |
| 시스템관리 | 조직 관리 | /admin/organizations | 조직 트리 관리 |
| 시스템관리 | 감사 로그 | /admin/audit-logs | 감사 기록 조회 |
| 마이페이지 | 프로필 | /my/profile | 내 정보 |
| 마이페이지 | 비밀번호 변경 | /my/password | 비밀번호 변경 |

### 5.2 역할 관리 UI (ERPNext 패턴 적용)

```
┌─────────────────────────────────────────────────────────────┐
│ 역할 관리                                          [+ 추가] │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐  ┌────────────────────────────────────────┐ │
│ │ 역할 목록    │  │ Tabs: [권한] [사용자] [메뉴] [상속]    │ │
│ │             │  ├────────────────────────────────────────┤ │
│ │ ● ADMIN     │  │ 권한 설정 테이블                       │ │
│ │ ○ MANAGER   │  │ ┌──────────┬────┬────┬────┬────┬────┐ │ │
│ │ ○ USER      │  │ │리소스    │조회│생성│수정│삭제│승인│ │ │
│ │ ○ VIEWER    │  │ ├──────────┼────┼────┼────┼────┼────┤ │ │
│ │             │  │ │주문      │ ✓ │ ✓ │ ✓ │ ✓ │ ✓ │ │ │
│ │             │  │ │재고      │ ✓ │ ✓ │ ✓ │ - │ - │ │ │
│ │             │  │ │리포트    │ ✓ │ - │ - │ - │ - │ │ │
│ │             │  │ └──────────┴────┴────┴────┴────┴────┘ │ │
│ │             │  │                              [+ 행 추가]│ │
│ └─────────────┘  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. 기술 스택

### Backend

| 항목 | 기술 | 용도 |
|------|------|------|
| 인증 | Spring Security + JWT | 인증/인가 |
| 캐싱 | Redis | 세션, 권한 캐시 |
| ORM | MyBatis | 데이터 접근 |
| Validation | Jakarta Validation | 입력 검증 |
| API Doc | SpringDoc OpenAPI | API 문서화 |

### Frontend

| 항목 | 기술 | 용도 |
|------|------|------|
| 상태 관리 | Zustand | 전역 상태 |
| API 호출 | TanStack Query | 서버 상태 |
| 라우팅 | React Router | 페이지 라우팅 |
| UI | 기존 컴포넌트 라이브러리 | 재사용 |

---

## 7. 확정된 범위

| 항목 | 결정 | 비고 |
|------|------|------|
| **MFA** | 선택적 | 사용자 개별 설정, 역할별 강제 가능 |
| **SSO** | 1차 미지원 | 향후 확장 가능하게 인터페이스 설계 |
| **필드 레벨 권한** | 1차 미구현 | DB에 perm_level 컬럼 포함, 향후 확장 |
| **조직 계층** | 3단계 | Company > Department > Team |

---

## 8. 구현 계획

### Phase 1: 인증/사용자

- DDL: users, roles, permissions, user_roles
- Backend: AuthController, AuthService, UserController, UserService, JWT 인증 필터
- Frontend: 로그인 페이지, 사용자 관리 페이지, 인증 Context

### Phase 2: 권한/메뉴

- DDL: menus, role_menus
- Backend: RoleController, RoleService, MenuController, MenuService
- Frontend: 역할 관리 페이지, 메뉴 관리 페이지, 동적 메뉴 렌더링

### Phase 3: 조직/감사

- DDL: organizations, audit_logs
- Backend: OrganizationController, OrganizationService, AuditLogService (AOP)
- Frontend: 조직 관리 페이지, 감사 로그 조회 페이지

---

## 9. 검증 방법

### 기능 테스트

- [ ] 로그인/로그아웃 동작
- [ ] JWT 토큰 발급/갱신
- [ ] 권한 없는 API 접근 차단
- [ ] 역할별 메뉴 필터링
- [ ] 감사 로그 기록

### 보안 테스트

- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] CSRF 토큰 검증
- [ ] 비밀번호 암호화 (BCrypt)
- [ ] 민감 정보 마스킹
