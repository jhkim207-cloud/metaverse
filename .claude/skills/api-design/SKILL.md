# /api-design - API/로직 설계 Skill

## 개요

요구사항을 API 명세로 변환하는 전문가 Skill입니다. RESTful 엔드포인트, DTO, 에러 코드, 비즈니스 로직을 설계합니다.

## 사용법

```
/api-design [기능명]
/api-design [기능명] --fix  # Gate 실패 시 재실행
```

## 입출력

- **입력**: `prd/{기능명}/00-research.md`, `01-requirements.md`, `02-ui-design.md`, `03-data-model.md`
- **산출물**: `prd/{기능명}/04-api-design.md`
- **참조**: `docs/api-standards/API_DESIGN_GUIDE.md`

> **참고**: `02-ui-design.md`의 이벤트 흐름, 상태 정의를 참조하여 API 설계

---

## 🔴 필수 실행 체크리스트

실행 전 반드시 확인:

```
□ 1. URL 규칙: 소문자, 복수형, 하이픈
□ 2. HTTP 메서드: CRUD 패턴 일치
□ 3. 에러 코드 패턴: AUTH_/VAL_/BIZ_/SYS_
□ 4. 모든 필드에 검증 규칙 (@Valid)
□ 5. 비즈니스 로직 흐름도 작성
□ 6. Quality Validation 수행
□ 7. Gate 4 검증 항목 5개 확인
```

---

## Gate 4 검증 항목 (5개)

| # | 항목 | 유형 | 기준 |
|---|------|------|------|
| 1 | URL 규칙 준수 | 자동 | 소문자, 복수형, 하이픈 |
| 2 | HTTP 메서드 일치 | 자동 | CRUD 패턴 |
| 3 | 에러 코드 패턴 | 자동 | AUTH_/VAL_/BIZ_/SYS_ |
| 4 | 검증 규칙 정의 | 수동 | 모든 필드 @Valid |
| 5 | 비즈니스 로직 | 수동 | 단계별 흐름도 |

---

## 에러 코드 체계

| 접두사 | 용도 | HTTP |
|--------|------|------|
| AUTH_ | 인증/인가 | 401/403 |
| VAL_ | 입력값 검증 | 400 |
| BIZ_ | 비즈니스 로직 | 404/409 |
| SYS_ | 시스템 | 500 |

---

## 다음 단계

Gate 4 통과 후 → `/impl-plan` 실행

---

> 📖 상세 템플릿, Quality Validation은 `SKILL-detail.md` 참조
