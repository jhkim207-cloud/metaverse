# /implement - 자동 구현 Skill

## 개요

PRD 설계 완료 후 실제 코드를 자동 생성하는 구현 전문가 Skill입니다.
Gate 7 통과 후 실행하여 **80% 코드 완성도**를 달성합니다.

## 사용법

```
/implement [기능명]
/implement [기능명] --backend-only   # 백엔드만
/implement [기능명] --frontend-only  # 프론트엔드만
/implement [기능명] --resume         # 중단된 구현 재개
```

## 입출력

- **입력**: `prd/{기능명}-prd.md`, `05-implementation-plan.md` 등 PRD 문서
- **산출물**: Backend + Frontend 실제 코드

---

## 🔴 필수 실행 체크리스트

실행 전 반드시 확인:

```
□ 1. Gate 7 통과 확인
□ 2. Provisional 항목 승인 완료 확인
□ 3. 기존 코드 패턴 분석
□ 4. 의존성 순서대로 구현 (impl-plan)
□ 5. 각 파일 생성 후 빌드 확인
□ 6. 기본 테스트 작성
□ 7. Gate 8 검증 항목 9개 확인
```

---

## Gate 8 검증 항목 (9개)

| # | 항목 | 유형 | 기준 |
|---|------|------|------|
| 1 | PRD 입력 파일 | 자동 | 5개 필수 파일 존재 |
| 2 | Backend 빌드 | 자동 | gradlew build 통과 |
| 3 | Frontend 빌드 | 자동 | npm run build 통과 |
| 4 | TypeScript 체크 | 자동 | npm run typecheck 통과 |
| 5 | ESLint 체크 | 자동 | npm run lint 통과 (warning 0) |
| 6 | API 엔드포인트 | 수동 | PRD 모든 API 구현 |
| 7 | UI 컴포넌트 | 수동 | PRD 모든 컴포넌트 구현 |
| 8 | 단위 테스트 존재 | 자동 | 테스트 파일 존재 |
| 9 | 기본 테스트 통과 | 자동 | 테스트 실행 성공 |

---

## 구현 순서

```
Phase 1: DB
  └── DDL 실행 확인

Phase 2: Backend
  └── Entity → Mapper → Service → DTO → Controller → Test

Phase 3: Frontend
  └── Types → Service → Hooks → Components → Pages → Test

Phase 4: 통합 검증
  └── 빌드 + ESLint + 테스트 → 실패 시 수정 → 재검증
```

---

## 80% 완성도 범위

**포함**: 핵심 CRUD, 기본 유효성, 표준 에러 처리, 주요 UI, 기본 테스트
**미포함**: 고급 에러 처리, 성능 최적화, 캐싱, E2E 테스트

---

## 다음 단계

Gate 8 통과 → **MVP 워크플로우 종료** → 완성 단계 (자유 대화)

---

> 📖 상세 구현 프로세스, 진행 상황 표시, 오류 처리는 `SKILL-detail.md` 참조
