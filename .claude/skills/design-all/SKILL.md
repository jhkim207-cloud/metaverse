# /design-all - 서브에이전트 오케스트레이터

## 개요

9개 서브에이전트를 조율하여 PRD 워크플로우를 실행합니다.
**컨텍스트 폭발 방지**를 위해 각 Gate는 독립적인 서브에이전트로 실행됩니다.

## 사용법

```
/design-all [기능명]
/design-all [기능명] --from [단계번호]  # 특정 단계부터 재개
```

예시:
```
/design-all user-management
/design-all notification-system --from 3
```

---

## 🔴 필수 실행 체크리스트

이 스킬 실행 전 반드시 확인:

- [ ] 기능명이 kebab-case인가?
- [ ] `prd/{기능명}/` 디렉토리 확인
- [ ] 새 도메인/기능인가? → 멀티 LLM 자동 적용됨

---

## 아키텍처

```
[Main Agent - 오케스트레이터]
    │
    │ 컨텍스트 사용량: ~3.5% (경량 유지)
    │
    ├─ [포그라운드] Gate 0: prd-research
    │       └─ 독립 200k 컨텍스트
    │
    ├─ [포그라운드] Gate 1: prd-requirements
    │       └─ 독립 200k 컨텍스트
    │
    ├─ [백그라운드 병렬] Gate 2,3,4 동시 실행
    │   ├─ prd-ui-design
    │   ├─ prd-data-model
    │   └─ prd-api-design
    │       └─ 각각 독립 200k 컨텍스트
    │
    ├─ [포그라운드] Gate 5: prd-impl-plan
    │
    ├─ [포그라운드] Gate 6: prd-test-design
    │
    ├─ [포그라운드] Gate 7: prd-finalizer
    │       └─ 사용자 승인 필요 (Provisional 항목)
    │
    └─ [포그라운드] Gate 8: prd-implementer
            └─ 실제 코드 생성
```

---

## 실행 절차

### 1단계: Gate 0 - Research (포그라운드)

```
Task(
  subagent_type: "prd-research",
  prompt: "
    기능명: {기능명}

    🔴 필수: 먼저 .claude/skills/research/SKILL.md 파일을 Read한 후 진행하시오.

    Best Practice 조사, Anti-pattern 식별, 창의적 아이디어 생성.
    멀티 LLM(GPT-5.2, Gemini-3-Pro) 협업으로 진행.
  ",
  run_in_background: false
)
```

**산출물**: `prd/{기능명}/00-research.md`

**완료 조건**:
- 파일 존재 확인
- "Gate 0: ✅ 통과" 텍스트 확인

### 2단계: Gate 1 - Requirements (포그라운드)

```
Task(
  subagent_type: "prd-requirements",
  prompt: "
    기능명: {기능명}

    🔴 필수: 먼저 .claude/skills/requirements/SKILL.md 파일을 Read한 후 진행하시오.

    00-research.md 기반으로 Persona, Use Case, User Story, AC, Edge Case 정의.
  ",
  run_in_background: false
)
```

**산출물**: `prd/{기능명}/01-requirements.md`

### 3단계: Gate 2,3,4 - 병렬 설계 (백그라운드)

**세 개의 서브에이전트를 동시에 백그라운드로 실행**:

```
// 단일 메시지에서 3개 Task 병렬 호출
Task(
  subagent_type: "prd-ui-design",
  prompt: "
    기능명: {기능명}

    🔴 필수: 먼저 .claude/skills/ui-design/SKILL.md 파일을 Read한 후 진행하시오.

    00-research.md, 01-requirements.md 기반으로 UI 설계.
  ",
  run_in_background: true
)

Task(
  subagent_type: "prd-data-model",
  prompt: "
    기능명: {기능명}

    🔴 필수: 먼저 .claude/skills/data-model/SKILL.md 파일을 Read한 후 진행하시오.

    00-research.md, 01-requirements.md 기반으로 데이터 모델 설계.
  ",
  run_in_background: true
)

Task(
  subagent_type: "prd-api-design",
  prompt: "
    기능명: {기능명}

    🔴 필수: 먼저 .claude/skills/api-design/SKILL.md 파일을 Read한 후 진행하시오.

    00-research.md, 01-requirements.md 기반으로 API 설계.
  ",
  run_in_background: true
)
```

**병렬 실행 후 대기**:
- 각 백그라운드 태스크의 output_file 모니터링
- 3개 모두 완료될 때까지 대기
- 완료 후 산출물 확인:
  - `prd/{기능명}/02-ui-design.md`
  - `prd/{기능명}/03-data-model.md`
  - `prd/{기능명}/04-api-design.md`

### 4단계: Gate 5 - Implementation Plan (포그라운드)

Gate 2,3,4 완료 후 실행:

```
Task(
  subagent_type: "prd-impl-plan",
  prompt: "
    기능명: {기능명}

    🔴 필수: 먼저 .claude/skills/impl-plan/SKILL.md 파일을 Read한 후 진행하시오.

    02-ui-design.md, 03-data-model.md, 04-api-design.md 기반으로 구현 계획 수립.
  ",
  run_in_background: false
)
```

**산출물**: `prd/{기능명}/05-implementation-plan.md`

### 5단계: Gate 6 - Test Design (포그라운드)

```
Task(
  subagent_type: "prd-test-design",
  prompt: "
    기능명: {기능명}

    🔴 필수: 먼저 .claude/skills/test-design/SKILL.md 파일을 Read한 후 진행하시오.

    01-requirements.md, 04-api-design.md 기반으로 테스트 케이스 설계.
  ",
  run_in_background: false
)
```

**산출물**: `prd/{기능명}/06-test-cases.md`

### 6단계: Gate 7 - PRD Finalize (포그라운드)

```
Task(
  subagent_type: "prd-finalizer",
  prompt: "
    기능명: {기능명}

    🔴 필수: 먼저 .claude/skills/prd-finalize/SKILL.md 파일을 Read한 후 진행하시오.

    00~06 문서 통합, Gate 검증, Provisional 승인 요청, 80% 완성도 판정.
  ",
  run_in_background: false
)
```

**사용자 승인 필요**:
- Provisional 컴포넌트/용어 승인
- 80% 완성도 확인

**산출물**: `prd/{기능명}/{기능명}-prd.md`

### 7단계: Gate 8 - Implementation (포그라운드)

80% 완성도 달성 후:

```
Task(
  subagent_type: "prd-implementer",
  prompt: "
    기능명: {기능명}

    🔴 필수: 먼저 .claude/skills/implement/SKILL.md 파일을 Read한 후 진행하시오.

    PRD 기반으로 Backend/Frontend 코드 생성, 빌드 검증.
  ",
  run_in_background: false
)
```

**산출물**:
- Backend 코드 파일들
- Frontend 코드 파일들
- 테스트 파일들

---

## 진행 상황 표시

각 단계 완료 시 사용자에게 진행 상황 표시:

```
## PRD 워크플로우 진행 상황

| Gate | 단계 | 상태 | 산출물 |
|------|------|------|--------|
| 0 | Research | ✅ 완료 | 00-research.md |
| 1 | Requirements | ✅ 완료 | 01-requirements.md |
| 2 | UI Design | 🔄 진행중 | - |
| 3 | Data Model | 🔄 진행중 | - |
| 4 | API Design | 🔄 진행중 | - |
| 5 | Impl Plan | ⏳ 대기 | - |
| 6 | Test Design | ⏳ 대기 | - |
| 7 | PRD Finalize | ⏳ 대기 | - |
| 8 | Implementation | ⏳ 대기 | - |
```

---

## 오류 처리

### 서브에이전트 실패 시

```
1. 실패한 Gate 식별
2. 오류 메시지 확인
3. 해당 서브에이전트만 재실행:
   /design-all {기능명} --from {실패한 Gate 번호}
```

### 80% 완성도 미달 시

```
1. Gate 7에서 미달 항목 리스트 확인
2. 해당 Gate 서브에이전트 재실행
3. /design-all {기능명} --from 7 로 재검증
```

---

## 컨텍스트 효율성

| 구분 | 기존 방식 | 서브에이전트 방식 |
|------|----------|-----------------|
| 메인 컨텍스트 | ~90% (포화) | ~3.5% (경량) |
| Gate별 컨텍스트 | 공유 (누적) | 독립 (격리) |
| 토큰 사용량 | 높음 | **67% 감소** |
| 품질 저하 | 후반 Gate에서 발생 | 없음 |

---

## 서브에이전트 목록

| 서브에이전트 | Gate | Skill 경로 | 모델 |
|-------------|------|-----------|------|
| prd-research | 0 | .claude/skills/research/SKILL.md | sonnet |
| prd-requirements | 1 | .claude/skills/requirements/SKILL.md | sonnet |
| prd-ui-design | 2 | .claude/skills/ui-design/SKILL.md | sonnet |
| prd-data-model | 3 | .claude/skills/data-model/SKILL.md | sonnet |
| prd-api-design | 4 | .claude/skills/api-design/SKILL.md | sonnet |
| prd-impl-plan | 5 | .claude/skills/impl-plan/SKILL.md | haiku |
| prd-test-design | 6 | .claude/skills/test-design/SKILL.md | haiku |
| prd-finalizer | 7 | .claude/skills/prd-finalize/SKILL.md | sonnet |
| prd-implementer | 8 | .claude/skills/implement/SKILL.md | sonnet |

---

## 산출물 요약

| Gate | 산출물 | 검증 항목 |
|------|--------|----------|
| 0 | 00-research.md | 5개 |
| 1 | 01-requirements.md | 7개 |
| 2 | 02-ui-design.md | 11개 |
| 3 | 03-data-model.md + DDL | 5개 |
| 4 | 04-api-design.md | 5개 |
| 5 | 05-implementation-plan.md | 3개 |
| 6 | 06-test-cases.md | 4개 |
| 7 | {기능명}-prd.md | 6개 |
| 8 | Backend/Frontend 코드 | 8개 |
| **총계** | | **54개** |

---

## 참조 문서

| 문서 | 위치 |
|------|------|
| 서브에이전트 정의 | .claude/agents/prd-*.md |
| 컨텍스트 관리 연구 | docs/workflow/CONTEXT_MANAGEMENT_RESEARCH.md |
| UI 표준 | docs/ui-standards/UI_STANDARD.md |
| DB 표준 용어 | db_dic/dictionary/standards.json |
| API 설계 가이드 | docs/api-standards/ |
