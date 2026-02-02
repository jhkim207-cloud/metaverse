# Project Template

> AI 기반 PRD 워크플로우를 지원하는 엔터프라이즈 웹 애플리케이션 템플릿

## 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| **Frontend** | React + TypeScript + Vite | 18.x |
| **Backend** | Spring Boot | 3.x |
| **Database** | PostgreSQL | 15.x |
| **ORM** | MyBatis | 3.x |
| **Build** | Gradle / Vite | - |
| **Test** | JUnit 5 / Vitest / Playwright | - |
| **AI** | Claude + GPT-5.2 + Gemini-3-Pro | Multi-LLM |

## 빠른 시작

### 사전 요구사항

- Java 21+
- Node.js 20+
- PostgreSQL 15+
- Docker (선택)

### 로컬 개발 환경

```bash
# 1. 저장소 클론
git clone <repository-url>
cd project_temp

# 2. Backend 실행
cd backend
./gradlew bootRun

# 3. Frontend 실행 (새 터미널)
cd frontend
npm install
npm run dev
```

### Docker로 실행

```bash
docker-compose up -d
```

---

## PRD 워크플로우

이 프로젝트는 **AI 기반 PRD(Product Requirements Document) 워크플로우**를 통해 요구사항부터 코드 구현까지 체계적으로 진행합니다.

### 2단계 개발 접근법

| 단계 | 완성도 | 방식 | 설명 |
|------|--------|------|------|
| **MVP 단계** | 80% | `/design-all [기능명]` | 9개 Gate를 순차 통과하여 설계 문서 + 코드 생성 |
| **완성 단계** | 20% | 자유 대화 | 버그 수정, UI/UX 개선, 성능 최적화 등 |

### 워크플로우 흐름

```
[Gate 0] Research      → Best Practice, Anti-pattern 조사
    ↓
[Gate 1] Requirements  → User Story, AC, Edge Case 정의
    ↓
[Gate 2-4] 병렬 설계   → UI Design / Data Model / API Design
    ↓
[Gate 5] Impl Plan     → 구현 순서, 의존성 정의
    ↓
[Gate 6] Test Design   → 테스트 케이스 설계
    ↓
[Gate 7] PRD Finalize  → 80% 완성도 판정, Provisional 승인
    ↓
[Gate 8] Implement     → 실제 코드 생성
```

### 멀티 LLM 협업

새로운 도메인/기능 개발 시 3개 AI가 협력합니다:

| AI | 역할 | 분석 관점 |
|----|------|----------|
| **Claude** | 종합/최종 결정 | Best Practice, 창의적 아이디어 통합 |
| **GPT-5.2** | 기술 분석 | 아키텍처, Edge Case, 제약조건 |
| **Gemini-3-Pro** | 비즈니스 분석 | Persona, User Journey, UX |

> 📖 상세 가이드: [docs/PRD_WORKFLOW_GUIDE.html](docs/PRD_WORKFLOW_GUIDE.html)

---

## 프로젝트 구조

```
project_temp/
├── backend/                    # Spring Boot 백엔드
│   ├── src/main/java/
│   │   └── com/biz/template/
│   │       ├── common/         # 공통 모듈
│   │       ├── config/         # 설정
│   │       └── domain/         # 도메인별 기능
│   └── src/main/resources/
│       ├── db/migration/       # Flyway 마이그레이션
│       └── mapper/             # MyBatis XML
│
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── components/         # 공통 컴포넌트
│   │   ├── features/           # 도메인별 기능
│   │   ├── contexts/           # React Context
│   │   ├── hooks/              # Custom Hooks
│   │   ├── services/           # API 서비스
│   │   ├── types/              # TypeScript 타입
│   │   ├── utils/              # 유틸리티
│   │   └── styles/             # 글로벌 스타일
│   └── public/
│
├── docs/                       # 문서
│   ├── adr/                    # Architecture Decision Records
│   ├── api-standards/          # API 설계 표준
│   ├── security/               # 보안 가이드
│   ├── testing/                # 테스트 전략
│   ├── code-review/            # 코드 리뷰 가이드
│   ├── ui-standards/           # UI 디자인 표준
│   └── workflow/               # 워크플로우 문서
│
├── prd/                        # PRD 문서
│   ├── TEMPLATE.md             # PRD 템플릿
│   ├── implementation-status.md # 구현 상태 추적
│   ├── changes.md              # PRD 변경 추적
│   └── {기능명}/               # 기능별 PRD 폴더
│       ├── 00-research.md
│       ├── 01-requirements.md
│       ├── 02-ui-design.md
│       ├── 03-data-model.md
│       ├── 04-api-design.md
│       ├── 05-implementation-plan.md
│       └── 06-test-cases.md
│
├── db_dic/                     # DB 표준용어 사전
│   ├── dictionary/
│   │   └── standards.json      # 표준 용어 정의
│   └── sql/postgres/public/    # DDL 파일
│
├── assets/                     # 재사용 자산 카탈로그
│   ├── core/                   # 핵심 자산
│   ├── common/                 # 공통 자산
│   └── frontend/               # 프론트엔드 자산
│
├── scripts/                    # 유틸리티 스크립트
│   ├── validate_all.ps1        # 전체 검증
│   ├── create_prd.ps1          # PRD 생성
│   └── create_adr.ps1          # ADR 생성
│
├── e2e/                        # E2E 테스트 (Playwright)
├── docker/                     # Docker 설정
│
├── .claude/                    # Claude Code 설정
│   ├── skills/                 # AI Skills (15개)
│   ├── rules/                  # 워크플로우/도구 규칙
│   ├── context/                # 컨텍스트
│   └── memory.md               # 작업 히스토리
│
├── .github/                    # GitHub 워크플로우
└── CLAUDE.md                   # AI 개발 지침
```

---

## 개발 가이드

### 문서 참조

| 문서 | 설명 |
|------|------|
| [CLAUDE.md](CLAUDE.md) | AI 개발 지침 및 프로젝트 규칙 |
| [PRD 워크플로우 가이드](docs/PRD_WORKFLOW_GUIDE.html) | PRD 워크플로우 상세 설명 |
| [API 설계 가이드](docs/api-standards/API_DESIGN_GUIDE.md) | RESTful API 설계 표준 |
| [에러 처리 가이드](docs/api-standards/ERROR_HANDLING.md) | 에러 코드 체계 |
| [보안 체크리스트](docs/security/SECURITY_CHECKLIST.md) | OWASP Top 10 기반 보안 점검 |
| [테스트 전략](docs/testing/TEST_STRATEGY.md) | 테스트 피라미드 및 커버리지 |
| [코드 리뷰 가이드](docs/code-review/REVIEW_CHECKLIST.md) | PR 리뷰 체크리스트 |
| [UI 표준](docs/ui-standards/UI_STANDARD.md) | UI 디자인/구현 기준 |

### Claude Skills

#### PRD 워크플로우 스킬

| Skill | Gate | 용도 |
|-------|------|------|
| `/design-all` | 전체 | PRD 워크플로우 오케스트레이터 (Gate 0~8 자동 실행) |
| `/research` | 0 | Best Practice 조사, 창의적 아이디어 생성 |
| `/requirements` | 1 | Persona, User Story, AC, Edge Case 정의 |
| `/ui-design` | 2 | 화면 설계, 컴포넌트 매핑, 상태 정의 |
| `/data-model` | 3 | ERD, DDL, 인덱스/제약조건 설계 |
| `/api-design` | 4 | RESTful API, DTO, 에러 코드 설계 |
| `/impl-plan` | 5 | 구현 순서, 의존성, 병렬 작업 계획 |
| `/test-design` | 6 | 테스트 케이스 설계 (Happy/Error/Edge) |
| `/prd-finalize` | 7 | PRD 통합, 80% 완성도 판정 |
| `/implement` | 8 | Backend + Frontend 코드 자동 생성 |

#### 유틸리티 스킬

| Skill | 용도 |
|-------|------|
| `/security` | 보안 점검 및 취약점 분석 |
| `/vibe-coding` | AI 협업 개발 가이드 |
| `/git-commit` | Git 커밋 메시지 생성 |
| `/dev-server` | 개발 서버 관리 |
| `/validate` | 빌드/테스트 검증 |

### 재사용 자산

BizPlatform에서 추출한 검증된 모듈을 [assets/](assets/README.md)에서 참조할 수 있습니다.

- **Core**: JWT 인증, 예외 처리, API 응답
- **Common**: 파일 저장, 이메일, 캐시
- **Frontend**: AuthContext, ThemeContext, UI 컴포넌트

---

## 주요 명령어

### PRD 워크플로우

```bash
# 전체 워크플로우 실행 (Gate 0~8)
/design-all [기능명]

# 특정 Gate부터 재개
/design-all [기능명] --from [Gate번호]

# 예시
/design-all user-management
/design-all notification-system --from 3
```

### Backend

```bash
# 빌드
./gradlew clean build

# 테스트
./gradlew test

# 테스트 + 커버리지
./gradlew test jacocoTestReport

# 실행
./gradlew bootRun
```

### Frontend

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 린트
npm run lint

# 타입 체크
npm run typecheck

# 테스트
npm run test
```

### 전체 검증

```powershell
# Frontend + Backend 전체 검증
./scripts/validate_all.ps1
```

### E2E 테스트

```bash
cd e2e
npm install
npx playwright test
```

---

## 환경 설정

### Backend (application.yml)

```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:postgresql://localhost:5432/postgres}
    username: ${DB_USER:postgres}
    password: ${DB_PASSWORD:password}

jwt:
  secret: ${JWT_SECRET}
  access-expiry: ${JWT_ACCESS_EXPIRY:30m}
  refresh-expiry: ${JWT_REFRESH_EXPIRY:7d}
```

### Frontend (.env)

```env
VITE_API_BASE_URL=/api
```

---

## 브랜치 전략

```
main (운영)
  └── develop (개발 통합)
        └── feature/xxx (기능 개발)
```

- `main`: 운영 배포 브랜치
- `develop`: 개발 통합 브랜치
- `feature/*`: 기능 개발 브랜치

## 커밋 규칙

```
<type>: <subject>

type:
  - feat: 새로운 기능
  - fix: 버그 수정
  - refactor: 리팩토링
  - docs: 문서 수정
  - test: 테스트 추가
  - chore: 빌드/설정 변경
```

---

## 검증 체계

### Gate 검증 항목

| Gate | 단계 | 검증 항목 수 |
|------|------|-------------|
| 0 | Research | 5개 |
| 1 | Requirements | 7개 |
| 2 | UI Design | 11개 |
| 3 | Data Model | 5개 |
| 4 | API Design | 5개 |
| 5 | Impl Plan | 3개 |
| 6 | Test Design | 4개 |
| 7 | PRD Finalize | 6개 |
| 8 | Implementation | 8개 |
| **총계** | | **54개** |

### 테스트 커버리지 목표

| 레이어 | 최소 | 목표 |
|--------|------|------|
| Service (비즈니스 로직) | 80% | 90% |
| Controller (API) | 70% | 85% |
| Frontend Components | 70% | 80% |

---

## 라이선스

MIT License
