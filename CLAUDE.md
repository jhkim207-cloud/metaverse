# CLAUDE.md - AI 보조 개발 가이드라인

## Project Overview

**프로젝트 템플릿**: 재사용 가능한 Spring Boot + React 기반 비즈니스 앱 템플릿

| 구분     | 기술                                           |
| -------- | ---------------------------------------------- |
| Backend  | Spring Boot 3.x (Java 21), MyBatis, PostgreSQL |
| Frontend | React 18 + TypeScript + Vite                   |
| 테스트   | JUnit 5, Vitest, Playwright                    |
| 인프라   | Docker, GitHub Actions                         |

---

## Git Operations

**Git 커밋/푸시는 사용자가 명시적으로 요청할 때만 수행할 것.**

- "커밋해줘", "푸시해줘", "git에 올려줘" 등 명확한 요청이 있을 때만 실행
- 작업 완료 후 자동으로 커밋/푸시하지 않음

## Build Operations

**빌드는 사용자가 명시적으로 요청할 때만 수행할 것.**

- "빌드해줘", "npm run build", "build 돌려줘" 등 명확한 요청이 있을 때만 실행
- 코드 변경 후 자동으로 빌드하지 않음

### 에이전트 검증 (Agent Verification)

작업 완료 후 스스로 코드 무결성을 검증하고 싶다면 다음 스크립트를 실행:

```powershell
./scripts/validate_all.ps1
```

이 스크립트는 Frontend(Type/Lint/Test/Build)와 Backend(Build/Test)를 모두 검증합니다.

---

## 프로젝트 구조

```
project_temp/
├── backend/                    # Spring Boot 백엔드
├── frontend/                   # React 프론트엔드
├── e2e/                        # E2E 테스트 (Playwright)
├── docs/                       # 문서
│   ├── adr/                    # Architecture Decision Records
│   ├── api-standards/          # API 설계 표준
│   ├── security/               # 보안 가이드라인
│   ├── testing/                # 테스트 전략
│   └── code-review/            # 코드 리뷰 가이드
├── assets/                     # 재사용 자산 메타데이터
├── prd/                        # PRD 문서
├── db_dic/                     # DB 표준용어
├── .claude/                    # Claude 설정
│   ├── skills/                 # AI Skills
│   ├── rules/                  # 상세 규칙
│   ├── context/                # 컨텍스트
│   └── memory.md               # 작업 히스토리
└── .github/                    # GitHub 설정
```

---

## 코드 아키텍처 규칙

### Backend Service 클래스 분리 원칙

1. **Service 클래스 크기 제한**: 단일 Service 클래스는 **300줄 이하** 유지
2. **도메인별 분리**: 새 도메인 기능은 별도 Service 클래스로 생성
3. **책임 분리 패턴**:
   - 비즈니스 로직: `*Service.java`
   - 데이터 접근: `*Mapper.java` (MyBatis)
   - 외부 API: `*Client.java`

### Frontend 컴포넌트 분리 원칙

1. **컴포넌트 크기 제한**: 단일 컴포넌트 파일은 **500줄 이하** 유지
2. **분리 패턴**:
   - 공통 로직: `hooks/` 디렉토리
   - 유틸리티 함수: `utils/` 디렉토리
   - 타입 정의: `types/` 디렉토리

### Frontend UI 표준

**프론트엔드 UI 작업 시 반드시 `docs/ui-standards/UI_STANDARD.md`를 참조할 것.**

- 컴포넌트 생성/수정 전 UI 표준 문서 확인 필수
- 색상, 간격, 타이포그래피, 컴포넌트 스타일 등 표준 준수
- 표준에 없는 새로운 패턴 도입 시 사용자에게 확인 후 진행

---

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
- 위치: `docs/adr/`

---

## Vibe Coding 가이드라인

### AI 활용 영역 분류

| 영역                | AI 활용도 | 검토 수준   |
| ------------------- | --------- | ----------- |
| 보일러플레이트 코드 | 높음      | 간단 검토   |
| CRUD 로직           | 높음      | 테스트 필수 |
| 비즈니스 로직       | 보통      | 상세 검토   |
| 보안 관련 코드      | 낮음      | 전문가 검토 |
| 아키텍처 결정       | 낮음      | ADR 필수    |

### AI 코드 생성 후 필수 체크리스트

1. [ ] 생성된 코드를 라인별로 이해했는가?
2. [ ] 단위 테스트를 작성/실행했는가?
3. [ ] 보안 취약점이 없는가? (SQL Injection, XSS 등)
4. [ ] 기존 코드 패턴과 일관성이 있는가?
5. [ ] 불필요한 의존성이 추가되지 않았는가?
6. [ ] 에러 처리가 적절한가?

### AI에게 요청하지 말아야 할 것

- 민감한 비즈니스 로직의 자동 생성
- 보안 인증/암호화 코드
- 금융 계산 로직
- 법적 컴플라이언스 관련 코드

---

## DB Schema DDL 작성 규칙

### 1. 표준 용어 및 데이터 타입 참조

- **반드시** `db_dic/dictionary/standards.json` 참조
- 동일하거나 유사한 의미의 컬럼은 기존 표준 용어와 데이터 타입을 따름

### 2. DDL 파일 저장 위치

- `db_dic/sql/postgres/public/{테이블명}.sql`

### 3. 공통 컬럼 패턴

```sql
-- PK
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

-- 감사(audit) 컬럼
created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER
```

### 4. 새 용어 등록 프로세스

DDL 작성 중 새로운 컬럼 발견 시:

1. 사용자에게 승인 요청
2. 승인 후 standards.json에 등록
3. DDL 작성 진행

---

## PRD 관리

### 개발 워크플로우 - 2단계 접근법

새로운 기능 개발은 **MVP 단계**와 **완성 단계**로 구분한다.

#### MVP 단계 (80% 완성도)

**새 도메인/기능의 첫 구현 시** `/design-all [기능명]` 워크플로우를 사용한다.

| 단계 | Skill | 산출물 | 검증 게이트 |
|------|-------|--------|-------------|
| 0 | `/research` | 00-research.md | Best Practice 3개+, 창의적 아이디어 2개+ |
| 1 | `/requirements` | 01-requirements.md | AC 3개+/스토리, Edge Case 3개+ |
| 2 | `/ui-design` | 02-ui-design.md | 컴포넌트 매핑 100%, 상태 정의 완료 |
| 3 | `/data-model` | 03-data-model.md + DDL | standards.json 준수, DDL 문법 검증 |
| 4 | `/api-design` | 04-api-design.md | REST 규칙 준수, 에러 코드 정의 |
| 5 | `/impl-plan` | 05-implementation-plan.md | 의존성 순서 검증, 파일 목록 완성 |
| 6 | `/test-design` | 06-test-cases.md | 커버리지 80% 이상 시나리오 |
| 7 | `/prd-finalize` | {기능명}-prd.md | 전체 게이트 통과 (46개 항목) |
| **8** | **`/implement`** | **실제 코드** | **빌드 성공, 기본 테스트 통과** |

**검증 게이트**: 총 9개 Gate, 54개 검증 항목 (Gate 0~7: 46개, Gate 8: 8개)

**워크플로우 완료 조건**: Gate 8 통과 시 **80% 코드 완성** → MVP 워크플로우 종료

#### 완성 단계 (나머지 20%)

MVP 구현 후 **추가 개선, 버그 수정, 기능 보완**은 자유로운 대화로 진행한다.

- 별도 워크플로우 없이 대화하며 구현
- 필요 시 사용자 판단으로 `/design-all` 사용 가능
- PRD 변경 시 해당 PRD 문서 직접 업데이트

**완성 단계에 해당하는 작업:**
- 기존 기능의 버그 수정
- UI/UX 개선
- 성능 최적화
- 기존 기능에 필드/버튼 추가
- 에러 처리 보강

**새 MVP가 필요한 경우 (사용자 판단):**
- 완전히 새로운 도메인 기능 추가
- 아키텍처에 큰 영향을 미치는 변경

### PRD 생성 규칙

1. **템플릿 사용**: `prd/TEMPLATE.md` 참조
2. **파일명**: `prd/{기능명}-prd.md` (kebab-case)
3. **필수 섹션**: 개요, 요구사항, 성공 지표, 수용기준

### 구현 상태 추적

**기능 구현 완료 시 반드시 `prd/implementation-status.md` 업데이트할 것.**

- 구현 완료: `[ ]` → `[x]`로 변경
- 부분 구현: `[~]`로 표시
- 진행률 요약 테이블도 함께 업데이트

### PRD 변경 추적

**대화 중 다음 상황을 감지하면 사용자에게 PRD 업데이트 여부를 확인:**

- 기존 기능의 동작 방식 변경
- 새로운 기능 요건 추가
- API 스펙 변경
- 데이터 모델 변경

**사용자가 동의하면 `prd/changes.md`에 기록**

---

## 장기기억 관리

### 세션 종료 시 기록 규칙

**중요한 작업 완료 시 `.claude/memory.md` 업데이트:**

1. **기록 대상**:
   - 새로운 기능 구현 완료
   - 아키텍처/설계 결정
   - 해결한 복잡한 버그

2. **기록 형식**:

   ```markdown
   ### YYYY-MM-DD: [작업 제목]

   - **완료**: 구현/수정 내용
   - **결정사항**: 선택한 방식과 이유
   - **참고 파일**: 관련 파일 경로
   ```

3. **관리 규칙**:
   - "최근 작업" 섹션: 최근 5개 세션만 유지
   - "핵심 결정사항": 영구 보존
   - 500줄 초과 시 오래된 세션 기록 아카이브

---

## 테스트 커버리지 목표

| 레이어                  | 최소 커버리지 | 목표 커버리지 |
| ----------------------- | ------------- | ------------- |
| Service (비즈니스 로직) | 80%           | 90%           |
| Controller (API)        | 70%           | 85%           |
| Repository (DB)         | 60%           | 75%           |
| Frontend Components     | 70%           | 80%           |
| Utils/Helpers           | 90%           | 95%           |

### 필수 테스트 시나리오

1. **Happy Path**: 정상 흐름
2. **Edge Cases**: 경계값 (null, empty, max)
3. **Error Handling**: 예외 처리
4. **Security**: 인증/인가 검증

---

## 민감 정보 관리

### 절대 커밋하지 말 것

- `application-prod.yml` (민감정보 포함 시)
- `.env`, `.env.local` 파일
- API 키, 비밀번호, 토큰
- `*.pem`, `*.key` 파일

### 대신 사용할 것

- 환경변수: `${DB_PASSWORD}`
- GitHub Secrets (CI/CD)
- 로컬: `application-local.yml` (.gitignore에 등록)

---

## 참조 문서

| 문서                 | 위치                        |
| -------------------- | --------------------------- |
| ADR 템플릿           | `docs/adr/0000-template.md` |
| API 설계 표준        | `docs/api-standards/`       |
| 보안 가이드          | `docs/security/`            |
| 테스트 전략          | `docs/testing/`             |
| 코드 리뷰 가이드     | `docs/code-review/`         |
| PRD 템플릿           | `prd/TEMPLATE.md`           |
| 재사용 자산 카탈로그 | `assets/catalog.json`       |
| UI 표준              | `docs/ui-standards/UI_STANDARD.md` |
