# /test-design - 테스트 설계 Skill

## 개요

설계를 테스트 케이스로 변환하는 전문가 Skill입니다. Happy Path, Error Case, Edge Case 테스트를 설계합니다.

## 사용법

```
/test-design [기능명]
```

## 입출력

- **입력**: `prd/{기능명}/01-requirements.md`, `04-api-design.md`
- **산출물**: `prd/{기능명}/06-test-cases.md`

---

## 🔴 필수 실행 체크리스트

실행 전 반드시 확인:

```
□ 1. Happy Path: API 엔드포인트 수 이상
□ 2. Error Case: 에러 코드 수 이상
□ 3. Edge Case: 요구사항 EC와 1:1 매핑
□ 4. Fixture 데이터 정의
□ 5. Quality Validation 수행
□ 6. Gate 6 검증 항목 4개 확인
```

---

## Gate 6 검증 항목 (4개)

| # | 항목 | 유형 | 기준 |
|---|------|------|------|
| 1 | Happy Path 수 | 자동 | ≥ API 엔드포인트 수 |
| 2 | Error Case 수 | 자동 | ≥ 에러 코드 수 |
| 3 | Edge Case 매핑 | 수동 | 요구사항 EC 1:1 |
| 4 | Fixture 정의 | 수동 | 테스트 데이터 완비 |

---

## 테스트 ID 네이밍

| 접두사 | 용도 |
|--------|------|
| HP-xxx | Happy Path |
| EC-xxx | Error Case |
| EDGE-xxx | Edge Case |
| HP-UI-xxx | UI Happy Path |

---

## 다음 단계

Gate 6 통과 후 → `/prd-finalize` 실행

---

> 📖 상세 템플릿, Fixture 예시, 코드 스켈레톤은 `SKILL-detail.md` 참조
