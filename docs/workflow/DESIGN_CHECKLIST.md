# 설계 체크리스트 - 80% 완성도 달성 가이드

## 개요

이 문서는 `/design-all` 워크플로우의 8개 Gate(35개 검증 항목)를 통과하기 위한 체크리스트입니다.

---

## Gate 요약

| Gate | 단계 | 자동 | 수동 | 합계 | 산출물 |
|------|------|------|------|------|--------|
| Gate 0 | Research & Ideation | 0 | 5 | 5 | 00-research.md |
| Gate 1 | 요구사항 정제 (Persona/Use Case) | 0 | 7 | 7 | 01-requirements.md |
| Gate 2 | UI 상세 설계 | 2 | 3 | 5 | 02-ui-design.md |
| Gate 3 | 데이터 모델 설계 | 4 | 1 | 5 | 03-data-model.md |
| Gate 4 | API/로직 설계 | 3 | 2 | 5 | 04-api-design.md |
| Gate 5 | 구현 계획 | 0 | 3 | 3 | 05-implementation-plan.md |
| Gate 6 | 테스트 케이스 설계 | 2 | 2 | 4 | 06-test-cases.md |
| Gate 7 | 최종 검증 | 3 | 0 | 3 | {기능명}-prd.md |
| **총계** | | **14** | **23** | **37** | |

---

## Gate 0: Research & Ideation

### 체크리스트 (수동 5개)

- [ ] **Best Practice 최소 3개**: 유사 기능의 업계 표준, 패턴 조사
- [ ] **오픈소스/상용 서비스 분석**: 참고할 프로젝트/서비스 분석
- [ ] **Anti-pattern 최소 2개**: 피해야 할 패턴 식별
- [ ] **창의적 아이디어 최소 2개**: LLM이 제안한 혁신적 아이디어
- [ ] **채택/미채택 근거 명시**: 각 아이디어의 채택 여부와 이유

### 작성 가이드

```markdown
## 1. Best Practice 분석
- 최소 3개 이상의 업계 표준/패턴 조사
- 각 Best Practice의 장단점 분석
- 프로젝트 적용 방안 제시

## 2. Anti-pattern 목록
- 최소 2개 이상의 Anti-pattern 식별
- 각 Anti-pattern의 위험도 평가
- 회피 전략 제시

## 3. LLM 창의적 아이디어
- UX 개선, 기술 혁신, 비즈니스 가치 관점
- 각 아이디어의 채택 여부 + 근거 명시
```

---

## Gate 1: 요구사항 정제

### 체크리스트 (수동 7개)

**사용자 관점 정의:**
- [ ] **Persona 정의**: Primary Persona 최소 1개 (목표, Pain Points, 사용 환경)
- [ ] **Use Case 정의**: Use Case 다이어그램 또는 목록 (Actor, 기본/대안 흐름)

**요구사항 구조화:**
- [ ] **사용자 스토리 형식**: 모든 기능에 AS A/I WANT/SO THAT 형식 + Persona 연결
- [ ] **AC 3개 이상/스토리**: 각 사용자 스토리에 Acceptance Criteria 3개 이상 (측정 가능)
- [ ] **Edge Case 최소 3개**: 경계 조건 및 예외 상황 식별
- [ ] **In/Out Scope 구분**: 범위 명확히 정의
- [ ] **우선순위 배정**: P0/P1/P2 우선순위 할당 완료

### 작성 가이드

```markdown
## Persona 정의

### Primary Persona: 일반 사용자
| 항목 | 내용 |
|------|------|
| 역할 | 서비스 이용 고객 |
| 주요 목표 | 빠르고 편리한 업무 처리 |
| Pain Points | 복잡한 UI, 느린 응답 속도 |
| 기술 숙련도 | 중급 |
| 사용 환경 | 데스크톱 (크롬 브라우저) |

## Use Case 정의

### UC-001: 알림 조회
- **Actor**: 일반 사용자
- **사전 조건**: 로그인된 상태
- **기본 흐름**:
  1. 사용자가 알림 아이콘 클릭
  2. 시스템이 알림 목록 표시
  3. 사용자가 알림 선택
  4. 시스템이 상세 내용 표시
- **대안 흐름**: 2a. 알림이 없으면 빈 상태 표시
- **사후 조건**: 알림이 읽음 상태로 변경

## 사용자 스토리

### US-001: [스토리 제목] (P0)
> **Persona**: 일반 사용자
> **Use Case**: UC-001

**AS A** [사용자 유형]
**I WANT** [원하는 기능]
**SO THAT** [달성하고자 하는 가치]

#### Acceptance Criteria (최소 3개, 측정 가능)
1. **Given** [사전 조건] **When** [행동] **Then** [측정 가능한 결과]
2. **Given** ... **When** ... **Then** [예: "2초 이내 표시"]
3. **Given** ... **When** ... **Then** [예: "목록에 추가됨"]
```

---

## Gate 2: UI 상세 설계

### 체크리스트 (자동 2개 + 수동 3개)

**자동 검증:**
- [ ] 참조된 모든 컴포넌트가 UI_STANDARD.md에 존재
- [ ] 상태 변수 타입이 TypeScript 유효 타입

**수동 검증:**
- [ ] **화면 상태 정의**: 모든 화면에 로딩/에러/빈 상태 정의
- [ ] **폼 검증 규칙**: 폼 필드별 검증 규칙 정의
- [ ] **이벤트 흐름 완성**: 이벤트 흐름이 시작→종료까지 완성

### 작성 가이드

```markdown
## 4. 상태 설계
| 상태 변수 | 타입 | 초기값 | 설명 |
|-----------|------|--------|------|
| isLoading | boolean | false | 로딩 상태 |
| error | Error | null | 에러 객체 |

## 5. 화면 상태 정의
### 5.1 로딩 상태
- 컴포넌트: Skeleton UI
- 위치: [컴포넌트 위치]

### 5.2 에러 상태
- 컴포넌트: ErrorBoundary
- 액션: 재시도 버튼

### 5.3 빈 상태
- 컴포넌트: EmptyState
- 메시지: "..."
- CTA: "..."
```

---

## Gate 3: 데이터 모델 설계

### 체크리스트 (자동 4개 + 수동 1개)

**자동 검증:**
- [ ] DDL 문법 검증 통과
- [ ] 모든 컬럼이 standards.json에 정의된 타입 사용
- [ ] 감사 컬럼(created_at, updated_at, created_by, updated_by) 존재
- [ ] PK가 BIGINT GENERATED ALWAYS AS IDENTITY 형식

**수동 검증:**
- [ ] **인덱스 정의**: 검색 조건 컬럼에 인덱스 정의

### 필수 패턴

```sql
-- PK 형식
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

-- 감사 컬럼 (필수)
created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
created_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER,
updated_by VARCHAR(100) NOT NULL DEFAULT CURRENT_USER
```

---

## Gate 4: API/로직 설계

### 체크리스트 (자동 3개 + 수동 2개)

**자동 검증:**
- [ ] URL이 소문자, 복수형, 하이픈 규칙 준수
- [ ] HTTP 메서드가 CRUD 패턴과 일치
- [ ] 에러 코드가 AUTH_/VAL_/BIZ_/SYS_ 패턴 준수

**수동 검증:**
- [ ] **검증 규칙 정의**: 모든 필드에 @Valid 어노테이션 정의
- [ ] **비즈니스 로직 기술**: 로직 흐름이 단계별로 기술됨

### URL 규칙

```
✓ /api/v1/users         (소문자, 복수형)
✓ /api/v1/user-profiles (하이픈 사용)
✗ /api/v1/Users         (대문자 X)
✗ /api/v1/user          (단수형 X)
✗ /api/v1/user_profiles (언더스코어 X)
```

### 에러 코드 패턴

```
AUTH_001: 인증 오류 (401)
AUTH_002: 인가 오류 (403)
VAL_001:  입력값 검증 오류 (400)
BIZ_001:  비즈니스 로직 오류 (409, 422)
SYS_001:  시스템 오류 (500)
```

---

## Gate 5: 구현 계획

### 체크리스트 (수동 3개)

- [ ] **의존성 순서 정렬**: 파일 생성 순서가 DB → Backend → Frontend 순
- [ ] **테스트 작성 시점**: 테스트 코드 작성 시점 명시
- [ ] **병렬 작업 식별**: 병렬 작업 가능 항목 식별

### 구현 순서 원칙

```
Phase 1: 데이터베이스 (DDL)
    ↓
Phase 2: 백엔드
    - Entity → Mapper → Service → Controller
    - 각 레이어 완료 후 테스트 작성
    ↓
Phase 3: 프론트엔드
    - Types → API → Hooks → Components → Pages
    - 컴포넌트 완료 후 테스트 작성
```

---

## Gate 6: 테스트 케이스 설계

### 체크리스트 (자동 2개 + 수동 2개)

**자동 검증:**
- [ ] Happy Path 테스트 수 >= API 엔드포인트 수
- [ ] Error Case 테스트 수 >= 에러 코드 수

**수동 검증:**
- [ ] **Edge Case 매핑**: 요구사항의 Edge Case와 1:1 매핑
- [ ] **Fixture 데이터**: 테스트에 필요한 Fixture 데이터 정의

### 테스트 ID 규칙

```
HP-001 ~ HP-NNN: Happy Path 테스트
EC-001 ~ EC-NNN: Error Case 테스트
EDGE-001 ~ EDGE-NNN: Edge Case 테스트
HP-UI-001 ~ HP-UI-NNN: UI Happy Path 테스트
```

---

## Gate 7: 최종 검증

### 체크리스트 (자동 3개)

- [ ] Gate 0~6 모든 항목 통과 여부 집계
- [ ] 누락된 게이트 항목 리스트 출력
- [ ] 80% 완성도 달성 여부 판정

### 80% 달성 기준

- **총 37개 항목** 중 **30개 이상 통과** 필요
- 자동 검증 14개 + 수동 검증 23개 = 37개

---

## 검증 스크립트 실행

```powershell
# 전체 검증
.\scripts\validate_design.ps1 -FeatureName "user-management"

# 특정 Gate만 검증
.\scripts\validate_design.ps1 -FeatureName "user-management" -Gate 3
```

---

## 실패 시 조치

### 자동 검증 실패

1. 실패 항목 확인
2. 해당 설계 문서 수정
3. 개별 Skill 재실행: `/[skill-name] [feature-name] --fix`
4. 검증 스크립트 재실행

### 수동 검증 미완료

1. 체크리스트 확인
2. 누락 항목 보완
3. 문서 업데이트
4. 체크리스트 완료 표시 후 재검증

---

## Provisional 모드 (Gate 3)

### 신규 용어 발견 시 블로킹 없이 진행

```sql
-- [PROVISIONAL] 미등록 용어 (Gate 7에서 승인)
display_name VARCHAR(100),
```

- Gate 7에서 모든 Provisional 항목 일괄 승인
- `--blocking` 옵션으로 즉시 승인 모드 전환 가능

---

## 역전파 (Back-propagation)

### 후속 단계에서 이전 단계 결함 발견 시

1. PATCH 요청 생성 (`prd/{기능명}/patches/`)
2. 현재 단계 계속 진행 (Non-blocking)
3. Gate 7에서 모든 PATCH 일괄 검토
4. 사용자 승인 후 원본 반영

---

## 참조 문서

| 문서 | 위치 |
|------|------|
| 설계 워크플로우 | `.claude/skills/design-all/SKILL.md` |
| PRD 템플릿 | `prd/templates/` |
| DB 표준 용어 | `db_dic/dictionary/standards.json` |
| UI 표준 | `docs/ui-standards/UI_STANDARD.md` |
| API 설계 표준 | `docs/api-standards/` |
| 테스트 전략 | `docs/testing/` |
