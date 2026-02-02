# /ui-design - UI 설계 Skill

## 개요

요구사항을 UI 설계로 변환하는 전문가 Skill입니다. 컴포넌트 트리, 상태 설계, 이벤트 흐름을 정의합니다.

## 사용법

```
/ui-design [기능명]
```

## 입출력

- **입력**: `prd/{기능명}/00-research.md`, `01-requirements.md`
- **산출물**: `prd/{기능명}/02-ui-design.md`
- **참조**: `docs/ui-standards/UI_STANDARD.md`

---

## 🔴 필수 실행 체크리스트

실행 전 반드시 확인:

```
□ 1. UI_STANDARD.md 전체 읽기 (SKIP 금지!)
□ 2. 디자인 컨셉 확인 (Liquid Glass, Spatial Depth)
□ 3. 사용 가능한 표준 컴포넌트 파악
□ 4. 새 도메인이면 멀티 LLM 트렌드 조사
□ 5. 신규 컴포넌트 → [PROVISIONAL] 태그
□ 6. 신규 트렌드 → [NEW TREND] 태그
□ 7. Quality Validation 수행
□ 8. Gate 2 검증 항목 11개 확인
```

---

## Gate 2 검증 항목 (11개)

| # | 항목 | 기준 |
|---|------|------|
| 1 | Persona-화면 커버리지 | 모든 Persona 지원 |
| 2 | UC-이벤트 흐름 매핑 | 모든 UC 정의됨 |
| 3 | 컴포넌트 존재 확인 | 표준 또는 PROVISIONAL |
| 4 | 상태 타입 검증 | TS 유효 타입 |
| 5 | 화면 상태 정의 | 로딩/에러/빈 상태 |
| 6 | 폼 검증 규칙 | 필드별 정의 |
| 7 | 이벤트 흐름 완성 | 성공/실패 분기 포함 |
| 8 | 디자인 컨셉 적용 | Glass, Depth 등 |
| 9 | CSS 토큰 매핑 | 변수 사용 |
| 10 | 아이콘 표준 | Lucide React |
| 11 | 모션/인터랙션 | 0.2~0.3s 정의 |

---

## 트렌드 적용 (UI_STANDARD.md 섹션 9~12)

| 기능 특성 | 적용 트렌드 |
|----------|------------|
| 목록 조회 | TanStack Query, 가상화 |
| 실시간 | SSE, 새 항목 알림 |
| CRUD | Optimistic UI |
| 모바일 | Bottom Sheet, Swipe |
| 대량 데이터 | 가상화 필수 (100+) |

---

## Provisional 처리

- **신규 컴포넌트**: `[PROVISIONAL]` 태그 → Gate 7 승인
- **신규 트렌드**: `[NEW TREND]` 태그 → Gate 7 승인

---

## 다음 단계

Gate 2 통과 후 → `/data-model`, `/api-design` 실행

---

> 📖 상세 템플릿, Quality Validation, 멀티 LLM 프롬프트는 `SKILL-detail.md` 참조
