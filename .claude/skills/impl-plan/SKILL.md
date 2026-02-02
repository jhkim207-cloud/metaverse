# /impl-plan - 구현 계획 Skill

## 개요

설계를 구현 계획으로 변환하는 전문가 Skill입니다. 파일 목록, 구현 순서, 의존성을 정의합니다.

## 사용법

```
/impl-plan [기능명]
```

## 입출력

- **입력**: `prd/{기능명}/02-ui-design.md`, `03-data-model.md`, `04-api-design.md`
- **산출물**: `prd/{기능명}/05-implementation-plan.md`

---

## 🔴 필수 실행 체크리스트

실행 전 반드시 확인:

```
□ 1. 의존성 순서 정렬: DB → Backend → Frontend
□ 2. 순환 의존성 없음 확인
□ 3. 테스트 작성 시점 명시
□ 4. 병렬 작업 가능 항목 식별
□ 5. Quality Validation 수행
□ 6. Gate 5 검증 항목 3개 확인
```

---

## Gate 5 검증 항목 (3개)

| # | 항목 | 유형 | 기준 |
|---|------|------|------|
| 1 | 의존성 순서 정렬 | 자동 | DB → Backend → Frontend |
| 2 | 테스트 작성 시점 | 수동 | 구현 직후 명시 |
| 3 | 병렬 작업 식별 | 수동 | 그룹화됨 |

---

## Phase별 구현 순서

```
Phase 1: DB
  └── DDL 실행

Phase 2: Backend
  └── Entity → Mapper → Service → DTO → Controller → Test

Phase 3: Frontend
  └── Types → API → Hooks → Components → Pages → Test
```

---

## 다음 단계

Gate 5 통과 후 → `/test-design` 실행

---

> 📖 상세 템플릿, Quality Validation은 `SKILL-detail.md` 참조
