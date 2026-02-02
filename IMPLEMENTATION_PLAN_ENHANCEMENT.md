# IMPLEMENTATION_PLAN.md 템플릿 보완 분석 보고서

## 1. 분석 개요

### 연구 범위
- **소프트웨어 공학 방법론**: TDD, DDD, SOLID, Clean Architecture
- **최신 Vibe Coding 트렌드**: AI 보조 개발, 프롬프트 엔지니어링
- **앱 개발 표준**: API 설계, 보안, 테스트, 문서화
- **비즈니스 자산화**: 재사용성, 도메인 지식 관리

### 현재 문서 평가
| 영역 | 현재 수준 | 개선 필요성 |
|------|---------|------------|
| 코드 구조 | ⭐⭐⭐⭐ | 🟡 보통 |
| 테스트 전략 | ⭐ | 🔴 높음 |
| 아키텍처 문서화 | ⭐⭐ | 🔴 높음 |
| Vibe Coding 가이드 | ⭐ | 🔴 높음 |
| 보안 가이드라인 | ⭐⭐ | 🟠 중간 |
| 재사용 자산 관리 | ⭐⭐⭐ | 🟠 중간 |
| PRD 템플릿 | ⭐⭐⭐ | 🟡 보통 |

---

## 2. 핵심 보완 항목

### 2.1 🔴 Architecture Decision Records (ADR) 체계

**현재 상태**: 장기기억(memory.md)에 결정사항 기록하나 체계적 ADR 부재

**보완 내용**:

```
project_temp/
├── docs/
│   └── adr/
│       ├── 0000-template.md          # ADR 템플릿
│       ├── 0001-jwt-authentication.md
│       ├── 0002-mybatis-vs-jpa.md
│       └── index.md                  # ADR 목록/검색
```

**ADR 템플릿 (MADR 형식)**:
```markdown
# ADR-NNNN: [제목]

## 상태
[Proposed | Accepted | Deprecated | Superseded by ADR-XXXX]

## 컨텍스트
결정이 필요한 상황과 배경 설명

## 검토한 옵션
### 옵션 1: [이름]
- 👍 장점: ...
- 👎 단점: ...

### 옵션 2: [이름]
- 👍 장점: ...
- 👎 단점: ...

## 결정
"우리는 [옵션]을 선택한다. 왜냐하면..."

## 결과
### 긍정적 영향
- ...

### 부정적 영향 (Trade-offs)
- ...

### 관련 ADR
- [ADR-XXXX](./xxxx-title.md)

---
**작성자**: [이름]
**날짜**: YYYY-MM-DD
**신뢰도**: [High | Medium | Low]
```

**CLAUDE.md에 추가할 규칙**:
```markdown
## ADR 작성 규칙

### 언제 ADR을 작성하나?
1. 새로운 기술/라이브러리 도입
2. 아키텍처 패턴 변경
3. 데이터베이스 스키마 중요 변경
4. 외부 서비스 연동 방식 결정
5. 성능/보안 관련 중요 결정

### ADR 명명 규칙
- 파일명: `NNNN-kebab-case-title.md`
- 번호는 순차 증가, 재사용 금지
- Deprecated된 ADR도 삭제하지 않고 상태만 변경
```

---

### 2.2 🔴 테스트 전략 프레임워크

**현재 상태**: tdd Skill만 언급, 구체적 테스트 전략 부재

**보완 내용**:

#### 테스트 피라미드 전략
```
                    ┌─────────┐
                    │   E2E   │  5%  (Playwright/Cypress)
                   ─┼─────────┼─
                   │Integration│ 15% (API/DB 통합)
                  ─┼───────────┼─
                  │    Unit    │ 80% (JUnit/Vitest)
                 ─┴─────────────┴─
```

#### 테스트 디렉토리 구조
```
project_temp/
├── backend/
│   └── src/test/java/com/biz/management/
│       ├── unit/                    # 단위 테스트
│       │   ├── service/
│       │   └── util/
│       ├── integration/             # 통합 테스트
│       │   ├── api/
│       │   └── repository/
│       └── fixtures/                # 테스트 데이터
│
├── frontend/
│   └── src/
│       ├── __tests__/
│       │   ├── unit/               # 컴포넌트 단위 테스트
│       │   └── integration/        # 페이지 통합 테스트
│       └── __mocks__/              # Mock 데이터
│
└── e2e/                            # E2E 테스트 (별도)
    ├── tests/
    ├── fixtures/
    └── playwright.config.ts
```

#### 테스트 커버리지 기준
```markdown
## 테스트 커버리지 목표

| 레이어 | 최소 커버리지 | 목표 커버리지 |
|--------|-------------|--------------|
| Service (비즈니스 로직) | 80% | 90% |
| Controller (API) | 70% | 85% |
| Repository (DB) | 60% | 75% |
| Frontend Components | 70% | 80% |
| Utils/Helpers | 90% | 95% |

### 필수 테스트 시나리오
1. **Happy Path**: 정상 흐름
2. **Edge Cases**: 경계값 (null, empty, max)
3. **Error Handling**: 예외 처리
4. **Security**: 인증/인가 검증
```

#### Skills에 추가할 테스트 가이드
```
.claude/skills/
├── tdd/
│   └── SKILL.md                    # 기존
├── testing-strategy/
│   ├── SKILL.md                    # 테스트 전략 가이드
│   ├── UNIT_TEST_GUIDE.md
│   ├── INTEGRATION_TEST_GUIDE.md
│   └── E2E_TEST_GUIDE.md
```

---

### 2.3 🔴 Vibe Coding 가이드라인

**현재 상태**: Claude Skills만 존재, AI 보조 개발 전략 부재

**2025년 Vibe Coding 핵심 원칙** (Andrej Karpathy 정의 기반):

#### Responsible AI-Assisted Development 프레임워크

```markdown
## Vibe Coding 가이드라인

### 1. AI 생성 코드 검토 원칙
"AI가 모든 코드를 작성해도, 검토/테스트/이해했다면 
그것은 Vibe Coding이 아니라 AI 타이핑 어시스턴트 활용이다." 
— Simon Willison

### 2. AI 활용 영역 분류

| 영역 | AI 활용도 | 검토 수준 |
|------|---------|---------|
| 보일러플레이트 코드 | 🟢 높음 | 간단 검토 |
| CRUD 로직 | 🟢 높음 | 테스트 필수 |
| 비즈니스 로직 | 🟡 보통 | 상세 검토 |
| 보안 관련 코드 | 🔴 낮음 | 전문가 검토 |
| 아키텍처 결정 | 🔴 낮음 | ADR 필수 |

### 3. 프롬프트 엔지니어링 규칙

#### 효과적인 프롬프트 구조
```
[Context] 프로젝트 배경과 기술 스택
[Task] 구체적인 작업 내용
[Constraints] 제약 조건과 규칙
[Examples] 기존 코드 패턴 예시
[Output] 원하는 출력 형식
```

#### CLAUDE.md에 추가할 AI 협업 규칙
```markdown
## AI 코드 생성 후 필수 체크리스트

1. □ 생성된 코드를 라인별로 이해했는가?
2. □ 단위 테스트를 작성/실행했는가?
3. □ 보안 취약점이 없는가? (SQL Injection, XSS 등)
4. □ 기존 코드 패턴과 일관성이 있는가?
5. □ 불필요한 의존성이 추가되지 않았는가?
6. □ 에러 처리가 적절한가?

### AI에게 요청하지 말아야 할 것
- 민감한 비즈니스 로직의 자동 생성
- 보안 인증/암호화 코드
- 금융 계산 로직
- 법적 컴플라이언스 관련 코드
```

### 4. Vibe Coding 워크플로우

```
┌────────────────────────────────────────────────────────────┐
│  1. Ideation                                               │
│  └─ 자연어로 기능 설명                                      │
└──────────────────────┬─────────────────────────────────────┘
                       ▼
┌────────────────────────────────────────────────────────────┐
│  2. Generation                                             │
│  └─ AI가 초기 코드 생성                                     │
└──────────────────────┬─────────────────────────────────────┘
                       ▼
┌────────────────────────────────────────────────────────────┐
│  3. Review & Understand                                    │
│  └─ 개발자가 코드 검토, 이해, 수정                          │
│  └─ 🚨 이 단계를 건너뛰면 "Vibe Coding 리스크"             │
└──────────────────────┬─────────────────────────────────────┘
                       ▼
┌────────────────────────────────────────────────────────────┐
│  4. Test & Validate                                        │
│  └─ 단위/통합 테스트 실행                                   │
│  └─ 보안 스캔 실행                                         │
└──────────────────────┬─────────────────────────────────────┘
                       ▼
┌────────────────────────────────────────────────────────────┐
│  5. Document & Commit                                      │
│  └─ 의미 있는 커밋 메시지                                   │
│  └─ 필요시 ADR 작성                                        │
└────────────────────────────────────────────────────────────┘
```

### 5. AI 보안 취약점 주의사항

**2025년 보고된 AI 생성 코드 취약점 (Lovable 사례)**:
- 170/1,645 앱에서 개인정보 노출 취약점 발견
- 19% AI 코드 제안에 보안 취약점 포함

**필수 보안 검토**:
```bash
# AI 생성 코드 보안 스캔 자동화
npm run security:scan    # npm audit + OWASP
./mvnw verify -Psecurity # Dependency Check
```
```

---

### 2.4 🟠 API 설계 표준

**현재 상태**: api-crud Skill만 존재, API 설계 표준 문서 부재

**보완 내용**:

```
docs/
└── api-standards/
    ├── API_DESIGN_GUIDE.md
    ├── ERROR_HANDLING.md
    └── VERSIONING.md
```

#### API 설계 가이드 핵심 내용

```markdown
## API 설계 표준

### 1. URL 명명 규칙
```
✅ 올바른 예시
GET    /api/v1/users
GET    /api/v1/users/{id}
GET    /api/v1/users/{id}/orders
POST   /api/v1/users
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}

❌ 잘못된 예시
GET    /api/v1/getUsers        # 동사 사용 금지
POST   /api/v1/user/create     # CRUD 동사 금지
GET    /api/v1/user_orders     # 언더스코어 금지
```

### 2. 응답 표준화

#### 성공 응답
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "totalCount": 100,
    "totalPages": 5
  }
}
```

#### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다.",
    "details": [
      {
        "field": "email",
        "message": "유효한 이메일 형식이 아닙니다."
      }
    ],
    "traceId": "abc-123-xyz"
  }
}
```

### 3. HTTP 상태 코드 표준

| 상태 코드 | 의미 | 사용 시점 |
|----------|------|----------|
| 200 | OK | GET/PUT/PATCH 성공 |
| 201 | Created | POST로 생성 성공 |
| 204 | No Content | DELETE 성공 |
| 400 | Bad Request | 입력값 오류 |
| 401 | Unauthorized | 인증 필요 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스 없음 |
| 409 | Conflict | 중복/충돌 |
| 422 | Unprocessable Entity | 비즈니스 로직 오류 |
| 500 | Internal Server Error | 서버 오류 |

### 4. 에러 코드 체계

```java
// ErrorCode.java
public enum ErrorCode {
    // 인증/인가 (AUTH_xxx)
    AUTH_INVALID_TOKEN("AUTH_001", "유효하지 않은 토큰"),
    AUTH_EXPIRED_TOKEN("AUTH_002", "만료된 토큰"),
    AUTH_FORBIDDEN("AUTH_003", "접근 권한 없음"),
    
    // 검증 (VALIDATION_xxx)
    VALIDATION_REQUIRED("VAL_001", "필수 입력값 누락"),
    VALIDATION_FORMAT("VAL_002", "입력 형식 오류"),
    
    // 비즈니스 (BIZ_xxx)
    BIZ_DUPLICATE("BIZ_001", "중복된 데이터"),
    BIZ_NOT_FOUND("BIZ_002", "데이터를 찾을 수 없음"),
    BIZ_INVALID_STATE("BIZ_003", "잘못된 상태 전이"),
    
    // 시스템 (SYS_xxx)
    SYS_DATABASE("SYS_001", "데이터베이스 오류"),
    SYS_EXTERNAL_API("SYS_002", "외부 API 호출 실패"),
    SYS_UNKNOWN("SYS_999", "알 수 없는 오류");
}
```
```

---

### 2.5 🟠 보안 가이드라인

**현재 상태**: 인증/보안 모듈 이식 계획만 존재, 보안 개발 가이드 부재

**보완 내용**:

```markdown
## 보안 개발 가이드라인

### 1. OWASP Top 10 대응

| 위협 | 대응 방안 | 체크리스트 |
|------|----------|-----------|
| Injection | PreparedStatement, 입력값 검증 | □ |
| Broken Auth | JWT + Refresh Token, 세션 관리 | □ |
| XSS | 출력 인코딩, CSP 헤더 | □ |
| CSRF | CSRF Token, SameSite Cookie | □ |
| Security Misconfig | 환경별 설정 분리, 디폴트 비밀번호 변경 | □ |

### 2. 인증/인가 체크리스트

#### JWT 구현 규칙
```yaml
# application.yml
jwt:
  secret: ${JWT_SECRET}         # 환경변수로 관리
  access-token-expiry: 30m      # 30분
  refresh-token-expiry: 7d      # 7일
  
security:
  password:
    min-length: 8
    require-uppercase: true
    require-number: true
    require-special: true
```

### 3. 민감 정보 관리

#### 환경변수 관리 규칙
```markdown
## 절대 커밋하지 말 것
- application-prod.yml (민감정보 포함 시)
- .env 파일
- API 키, 비밀번호, 토큰

## 대신 사용할 것
- 환경변수: ${DB_PASSWORD}
- Vault/Secret Manager
- GitHub Secrets (CI/CD)
```

#### .gitignore 필수 항목
```gitignore
# Secrets
.env
.env.local
*.pem
*.key
secrets/

# IDE
.idea/
.vscode/settings.json

# Build
target/
dist/
node_modules/
```

### 4. 입력값 검증 규칙

```java
// 입력값 검증 어노테이션 활용
public class UserCreateRequest {
    @NotBlank(message = "이름은 필수입니다")
    @Size(min = 2, max = 50, message = "이름은 2-50자")
    private String name;
    
    @Email(message = "유효한 이메일 형식이 아닙니다")
    private String email;
    
    @Pattern(regexp = "^\\d{10,11}$", message = "유효한 전화번호 형식이 아닙니다")
    private String phone;
}
```
```

---

### 2.6 🟠 재사용 자산 분류 체계

**현재 상태**: 이식 계획만 있고, 자산 분류/평가 기준 부재

**보완 내용**:

```markdown
## 재사용 자산 분류 체계

### 1. 자산 분류 매트릭스

| 분류 | 재사용성 | 설명 | 예시 |
|------|---------|------|------|
| **Core** | ⭐⭐⭐⭐⭐ | 모든 프로젝트 필수 | 인증, 예외처리, API Response |
| **Common** | ⭐⭐⭐⭐ | 대부분 프로젝트 사용 | 파일업로드, 이메일, 페이징 |
| **Domain** | ⭐⭐⭐ | 유사 도메인에서 재사용 | 결제, 알림, 리포트 |
| **Project** | ⭐⭐ | 특정 프로젝트 종속 | 고객사별 커스텀 로직 |

### 2. 자산 메타데이터 표준

```yaml
# asset-metadata.yml
name: "JWT Authentication Module"
version: "1.2.0"
category: "Core"
author: "JANG"
created: "2024-01-15"
updated: "2025-01-30"

description: |
  Spring Security 기반 JWT 인증 모듈.
  Access Token + Refresh Token 구조.

dependencies:
  - spring-boot-starter-security: "3.2.x"
  - jjwt: "0.12.x"

usage:
  prerequisites:
    - "application.yml에 jwt.secret 설정"
    - "User, Role 테이블 마이그레이션"
  
  integration: |
    1. auth 패키지 복사
    2. SecurityConfig import
    3. JwtFilter 등록

documentation:
  - "docs/auth/README.md"
  - "docs/auth/API_SPEC.md"

quality:
  test-coverage: 85%
  security-audit: "2025-01-15"
  last-review: "2025-01-20"

tags:
  - authentication
  - security
  - jwt
  - spring-security
```

### 3. 자산 디렉토리 구조

```
project_temp/
├── assets/                          # 🆕 재사용 자산 메타데이터
│   ├── catalog.json                 # 자산 카탈로그
│   ├── core/
│   │   ├── authentication.yml
│   │   ├── exception-handler.yml
│   │   └── api-response.yml
│   ├── common/
│   │   ├── file-storage.yml
│   │   └── email-service.yml
│   └── domain/
│       └── code-master.yml
```

### 4. 재사용성 평가 체크리스트

새로운 모듈/컴포넌트 개발 시:

```markdown
## 재사용성 평가 체크리스트

### 설계 품질 (0-5점)
- [ ] 단일 책임 원칙 준수 (SRP)
- [ ] 의존성 주입 활용 (DI)
- [ ] 인터페이스 분리
- [ ] 설정 외부화 (하드코딩 없음)
- [ ] 도메인 무관한 추상화

### 문서화 (0-5점)
- [ ] API 문서 (JavaDoc/JSDoc)
- [ ] 사용 예시 코드
- [ ] 설정 가이드
- [ ] 트러블슈팅 가이드
- [ ] 변경 이력 (CHANGELOG)

### 테스트 (0-5점)
- [ ] 단위 테스트 존재
- [ ] 통합 테스트 존재
- [ ] 테스트 커버리지 80% 이상
- [ ] 경계값 테스트
- [ ] 에러 케이스 테스트

### 평가 기준
- 12점 이상: Core 자산 등록 가능
- 9-11점: Common 자산 등록 가능
- 6-8점: Domain 자산 등록 가능
- 5점 이하: 프로젝트 종속으로 분류
```
```

---

### 2.7 🟡 PRD 템플릿 고도화

**현재 상태**: 기본 PRD 템플릿 존재, 현대적 PRD 요소 부족

**보완 내용** (2025년 모던 PRD 기준):

```markdown
## PRD 템플릿 개선

### 추가해야 할 섹션

#### 1. 문제 정의 (Evidence-Based)
```markdown
## 문제 정의

### 정량적 증거
- 지표: [이탈률 20%, 지원 문의 월 500건]
- 데이터 출처: [Google Analytics, Zendesk]
- 측정 기간: [2024 Q4]

### 정성적 증거
- 사용자 인터뷰 인용: "검색해도 원하는 결과가 안 나와요"
- 인터뷰 대상: [10명, 파워유저 그룹]
```

#### 2. 성공 지표 (SMART)
```markdown
## 성공 지표

| 지표 | 현재 | 목표 | 측정 방법 |
|------|-----|------|----------|
| 검색 성공률 | 45% | 70% | "결과 없음" 비율 |
| 평균 검색 시간 | 8초 | 3초 | Analytics |
| 사용자 만족도 | 3.2 | 4.0 | NPS 설문 |

### 측정 주기
- 일간: 검색 성공률
- 주간: 사용자 행동 분석
- 월간: NPS 설문
```

#### 3. 비기능 요구사항
```markdown
## 비기능 요구사항

### 성능
- 검색 응답 시간: < 200ms (P95)
- 동시 사용자: 1,000명
- 데이터 로딩: < 1초 (First Contentful Paint)

### 확장성
- 일일 검색량: 100,000건 지원
- 데이터 증가: 연 50% 성장 대응

### 보안
- 개인정보 마스킹
- 검색 로그 30일 보관
- GDPR 준수

### 접근성
- WCAG 2.1 AA 준수
- 스크린 리더 지원
- 키보드 네비게이션
```

#### 4. 리스크 및 의존성
```markdown
## 리스크 분석

| 리스크 | 확률 | 영향 | 대응 방안 |
|--------|-----|-----|----------|
| 검색 엔진 성능 부족 | 중 | 높음 | Elasticsearch 도입 검토 |
| 데이터 품질 이슈 | 높음 | 중 | 데이터 정제 스프린트 추가 |

## 의존성

### 기술 의존성
- [ ] 검색 인덱싱 서비스 구축 (백엔드팀)
- [ ] 검색 UI 컴포넌트 (프론트엔드팀)

### 비기술 의존성
- [ ] 검색 키워드 가이드라인 (컨텐츠팀)
- [ ] 법적 검토 (법무팀)
```

#### 5. 구현 진행률 연동
```markdown
## 구현 진행률

<!-- 자동 생성 섹션: implementation-status.md 연동 -->
@import ./implementation-status.md

### 실시간 진행 상황
[implementation-status.md와 자동 동기화]
```
```

---

### 2.8 🟡 코드 리뷰 가이드라인

**현재 상태**: 코드 리뷰 프로세스 언급 없음

**보완 내용**:

```markdown
## 코드 리뷰 가이드라인

### 1. 리뷰 체크리스트

#### 기능성
- [ ] 요구사항을 정확히 구현했는가?
- [ ] 엣지 케이스를 처리했는가?
- [ ] 에러 처리가 적절한가?

#### 코드 품질
- [ ] SOLID 원칙을 준수했는가?
- [ ] DRY 원칙을 위반하지 않았는가?
- [ ] 메서드/클래스가 적절한 크기인가? (메서드 30줄, 클래스 300줄)
- [ ] 네이밍이 명확한가?

#### 보안
- [ ] SQL Injection 취약점이 없는가?
- [ ] XSS 취약점이 없는가?
- [ ] 인증/인가가 적절한가?
- [ ] 민감 정보가 로그에 노출되지 않는가?

#### 테스트
- [ ] 단위 테스트가 추가되었는가?
- [ ] 테스트가 의미 있는 케이스를 커버하는가?
- [ ] 테스트가 독립적으로 실행 가능한가?

#### 성능
- [ ] N+1 쿼리 문제가 없는가?
- [ ] 불필요한 데이터 로딩이 없는가?
- [ ] 캐싱이 필요한 부분이 있는가?

### 2. PR 템플릿

```markdown
## 변경 사항
<!-- 무엇을 왜 변경했는지 -->

## 관련 이슈
<!-- Closes #123 -->

## 변경 유형
- [ ] 기능 추가
- [ ] 버그 수정
- [ ] 리팩토링
- [ ] 문서 수정

## 체크리스트
- [ ] 로컬에서 테스트 완료
- [ ] 단위 테스트 추가/수정
- [ ] API 문서 업데이트 (필요시)
- [ ] CLAUDE.md 업데이트 (필요시)

## 스크린샷 (UI 변경 시)
```

### 3. 리뷰어 역할

| 리뷰어 수 | PR 규모 | 기준 |
|---------|--------|------|
| 1명 | 작음 | 50줄 미만, 단순 수정 |
| 2명 | 보통 | 50-200줄 |
| 2명+ | 큼 | 200줄 이상, 아키텍처 변경 |
```

---

## 3. 통합 디렉토리 구조 제안

```
project_temp/
├── CLAUDE.md                           # 프로젝트 핵심 규칙
├── README.md
│
├── .claude/
│   ├── settings.local.json
│   ├── memory.md                       # 작업 히스토리
│   ├── rules/
│   │   ├── architecture.md
│   │   ├── decisions.md
│   │   └── lessons-learned.md
│   ├── context/
│   │   └── current-sprint.md
│   └── skills/
│       ├── api-crud/SKILL.md
│       ├── design-system/SKILL.md
│       ├── dev-server/SKILL.md
│       ├── tdd/SKILL.md
│       ├── testing-strategy/SKILL.md   # 🆕
│       ├── git-commit/SKILL.md
│       ├── vibe-coding/SKILL.md        # 🆕
│       └── security/SKILL.md           # 🆕
│
├── docs/
│   ├── adr/                            # 🆕 Architecture Decision Records
│   │   ├── 0000-template.md
│   │   └── index.md
│   ├── api-standards/                  # 🆕 API 설계 표준
│   │   ├── API_DESIGN_GUIDE.md
│   │   ├── ERROR_HANDLING.md
│   │   └── VERSIONING.md
│   ├── security/                       # 🆕 보안 가이드라인
│   │   ├── SECURITY_CHECKLIST.md
│   │   └── SECRETS_MANAGEMENT.md
│   ├── testing/                        # 🆕 테스트 가이드
│   │   ├── TEST_STRATEGY.md
│   │   └── COVERAGE_REQUIREMENTS.md
│   ├── code-review/                    # 🆕 코드 리뷰 가이드
│   │   ├── REVIEW_CHECKLIST.md
│   │   └── PR_TEMPLATE.md
│   └── operation/
│       ├── RELEASE_CHECKLIST.md
│       └── BACKUP_RECOVERY_STRATEGY.md
│
├── assets/                             # 🆕 재사용 자산 메타데이터
│   ├── catalog.json
│   ├── core/
│   ├── common/
│   └── domain/
│
├── prd/
│   ├── TEMPLATE.md                     # 🆕 개선된 PRD 템플릿
│   ├── changes.md
│   └── implementation-status.md
│
├── db_dic/
│   ├── dictionary/standards.json
│   └── sql/postgres/public/
│
├── backend/...
├── frontend/...
├── e2e/                                # 🆕 E2E 테스트 분리
│   ├── tests/
│   ├── fixtures/
│   └── playwright.config.ts
│
├── docker/...
├── scripts/...
└── .github/
    ├── workflows/
    │   ├── ci.yml
    │   └── security-scan.yml           # 🆕
    ├── PULL_REQUEST_TEMPLATE.md        # 🆕
    └── CODEOWNERS                      # 🆕
```

---

## 4. 우선순위별 구현 로드맵

### Phase 1: 핵심 (1-2일)
1. ADR 체계 구축 (`docs/adr/`)
2. Vibe Coding 가이드라인 추가 (`.claude/skills/vibe-coding/`)
3. 테스트 전략 문서 (`docs/testing/`)

### Phase 2: 중요 (2-3일)
4. API 설계 표준 (`docs/api-standards/`)
5. 보안 가이드라인 (`docs/security/`)
6. PR 템플릿 및 코드 리뷰 가이드 (`.github/`)

### Phase 3: 권장 (1-2일)
7. 재사용 자산 카탈로그 (`assets/`)
8. PRD 템플릿 고도화 (`prd/TEMPLATE.md`)
9. CLAUDE.md 통합 업데이트

---

## 5. 결론

현재 IMPLEMENTATION_PLAN.md는 코드 구조와 이식 계획에 집중되어 있으나, 
**현대 소프트웨어 공학 표준**과 **2025년 AI 보조 개발 트렌드**를 반영하려면 
다음 영역의 보강이 필요합니다:

| 보완 영역 | 비즈니스 가치 | 기술 부채 감소 |
|---------|-------------|--------------|
| ADR | 의사결정 추적성 확보 | 아키텍처 일관성 유지 |
| 테스트 전략 | 품질 보증 | 회귀 버그 방지 |
| Vibe Coding 가이드 | AI 협업 효율화 | 보안 취약점 예방 |
| API 표준 | 개발자 경험 향상 | 통합 비용 절감 |
| 보안 가이드 | 컴플라이언스 준수 | 보안 사고 예방 |
| 자산 분류 | 재사용성 극대화 | 중복 개발 방지 |

이러한 보완을 통해 **템플릿의 자산화 가치**가 크게 향상되며,
새 프로젝트 시작 시 **일관된 품질**과 **빠른 개발 속도**를 
확보할 수 있습니다.
