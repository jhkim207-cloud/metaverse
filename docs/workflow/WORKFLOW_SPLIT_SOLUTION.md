# 워크플로우 분할 실행 솔루션

> 컨텍스트 폭발 문제 해결을 위한 C안 상세 설계

## 1. 문제 분석

### 1.1 현재 상황
```
단일 세션에서 Gate 0~8 실행 시:
- 9개 SKILL.md 로드 (~700줄)
- 멀티 LLM 결과 누적
- 산출물 7개 누적 (00~06-*.md)
- 코드 생성까지
→ 컨텍스트 75% 초과 → 품질 저하
```

### 1.2 목표
- 각 세션: 컨텍스트 75% 이하 유지
- 세션 간: 상태 손실 없이 핸드오프
- 사용자 경험: 자연스러운 흐름 유지

---

## 2. 솔루션: 3-Session Split

### 2.1 세션 분할 구조

```
┌─────────────────────────────────────────────────────────────┐
│ Session 1: Discovery (발견)                                 │
│ ┌─────────┐   ┌─────────────┐   ┌────────────────────────┐ │
│ │ Gate 0  │ → │   Gate 1    │ → │ CHECKPOINT-1.md 저장   │ │
│ │Research │   │Requirements │   │ (Research + Req 요약)  │ │
│ └─────────┘   └─────────────┘   └────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Session 2: Design (설계)                                    │
│ ┌─────────┐   ┌───────────┐   ┌─────────┐   ┌───────────┐  │
│ │ Gate 2  │ → │  Gate 3   │ → │ Gate 4  │ → │CHECKPOINT │  │
│ │UI Design│   │Data Model │   │API Design│  │-2.md 저장 │  │
│ └─────────┘   └───────────┘   └─────────┘   └───────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Session 3: Finalize (완성)                                  │
│ ┌─────────┐   ┌───────────┐   ┌─────────┐   ┌───────────┐  │
│ │ Gate 5  │ → │  Gate 6   │ → │ Gate 7  │ → │   PRD     │  │
│ │Impl Plan│   │Test Design│   │Finalize │   │ 완성      │  │
│ └─────────┘   └───────────┘   └─────────┘   └───────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Session 4: Implementation (구현)                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Gate 8: /implement                                      │ │
│ │ PRD 기반 코드 생성 (Backend → Frontend → Test)          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 왜 이렇게 나누나?

| 세션 | Gate | 이유 |
|------|------|------|
| **Session 1** | 0, 1 | 멀티 LLM 사용, 가장 많은 외부 정보 유입 |
| **Session 2** | 2, 3, 4 | 설계 문서 3개 생성, 상호 의존성 높음 |
| **Session 3** | 5, 6, 7 | 이전 설계 참조만 필요, PRD 통합 |
| **Session 4** | 8 | 코드 생성 집중, 대량 출력 |

---

## 3. Checkpoint 시스템

### 3.1 Checkpoint 파일 구조

```
prd/{기능명}/
├── 00-research.md
├── 01-requirements.md
├── CHECKPOINT-1.md          ← Session 1 종료 시 생성
├── 02-ui-design.md
├── 03-data-model.md
├── 04-api-design.md
├── CHECKPOINT-2.md          ← Session 2 종료 시 생성
├── 05-implementation-plan.md
├── 06-test-cases.md
├── {기능명}-prd.md          ← Session 3에서 생성
└── IMPLEMENTATION-STATUS.md ← Session 4에서 관리
```

### 3.2 CHECKPOINT-1.md 구조

```markdown
# Checkpoint 1: Discovery 완료

## 메타정보
- 기능명: {기능명}
- 생성일시: YYYY-MM-DD HH:mm
- 완료 Gate: 0, 1
- 다음 세션: Session 2 (Design)

## Gate 통과 현황
| Gate | 상태 | 통과 항목 | 전체 |
|------|------|----------|------|
| 0 | ✅ 통과 | 5 | 5 |
| 1 | ✅ 통과 | 7 | 7 |

## 핵심 결정사항 (다음 세션에 전달)

### 채택된 Best Practice
1. {BP-1 요약}
2. {BP-2 요약}
3. {BP-3 요약}

### 핵심 User Stories
1. US-001: {제목} - {핵심 내용 1줄}
2. US-002: {제목} - {핵심 내용 1줄}

### 주요 Edge Cases
1. EC-001: {상황 요약}
2. EC-002: {상황 요약}

### 비기능 요구사항 요약
- 성능: {요약}
- 보안: {요약}

## Provisional 항목 (Gate 7에서 처리)
- 없음 / 또는 목록

## 다음 세션 시작 가이드
```
다음 세션에서 실행:
/ui-design {기능명}

참조 파일:
- prd/{기능명}/00-research.md
- prd/{기능명}/01-requirements.md
```
```

### 3.3 CHECKPOINT-2.md 구조

```markdown
# Checkpoint 2: Design 완료

## 메타정보
- 기능명: {기능명}
- 생성일시: YYYY-MM-DD HH:mm
- 완료 Gate: 0, 1, 2, 3, 4
- 다음 세션: Session 3 (Finalize)

## Gate 통과 현황
| Gate | 상태 | 통과 항목 | 전체 |
|------|------|----------|------|
| 0 | ✅ 통과 | 5 | 5 |
| 1 | ✅ 통과 | 7 | 7 |
| 2 | ✅ 통과 | 11 | 11 |
| 3 | ✅ 통과 | 5 | 5 |
| 4 | ✅ 통과 | 5 | 5 |

## 설계 요약 (다음 세션에 전달)

### 화면 목록
| ID | 화면명 | 경로 |
|----|--------|------|
| SCR-001 | ... | ... |

### 테이블 목록
| 테이블명 | 설명 | PK |
|----------|------|-----|
| ... | ... | ... |

### API 엔드포인트
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/v1/... | ... |

### 에러 코드 목록
| 코드 | HTTP | 설명 |
|------|------|------|
| VAL_001 | 400 | ... |

## Provisional 항목
### 컴포넌트
- {Component}: {설명}

### 용어
- {Term}: {설명}

## 다음 세션 시작 가이드
```
다음 세션에서 실행:
/impl-plan {기능명}

참조 파일:
- prd/{기능명}/CHECKPOINT-2.md (이 파일)
- prd/{기능명}/04-api-design.md (API 상세)
```
```

---

## 4. 세션 실행 가이드

### 4.1 Session 1: Discovery

```
사용자: /design-all notification-management

AI 응답:
"notification-management 기능의 PRD 워크플로우를 시작합니다.

워크플로우는 4개 세션으로 분할 실행됩니다:
- Session 1 (현재): Discovery (Gate 0-1)
- Session 2: Design (Gate 2-4)
- Session 3: Finalize (Gate 5-7)
- Session 4: Implementation (Gate 8)

Gate 0: Research를 시작합니다..."

[Gate 0 실행]
[Gate 1 실행]

AI 응답:
"Session 1 완료!

✅ Gate 0: Research - 통과 (5/5)
✅ Gate 1: Requirements - 통과 (7/7)

CHECKPOINT-1.md가 생성되었습니다.

다음 세션에서 계속하려면:
/design-continue notification-management

또는 지금 계속하려면 '계속'을 입력하세요."
```

### 4.2 Session 2: Design

```
사용자: /design-continue notification-management

AI 응답:
"CHECKPOINT-1.md를 로드했습니다.

이전 진행:
✅ Gate 0: Research
✅ Gate 1: Requirements

Session 2: Design을 시작합니다 (Gate 2-4)..."

[Gate 2 실행]
[Gate 3 실행]
[Gate 4 실행]

AI 응답:
"Session 2 완료!

✅ Gate 2: UI Design - 통과 (11/11)
✅ Gate 3: Data Model - 통과 (5/5)
✅ Gate 4: API Design - 통과 (5/5)

CHECKPOINT-2.md가 생성되었습니다.

다음 세션에서 계속하려면:
/design-continue notification-management"
```

### 4.3 Session 3: Finalize

```
사용자: /design-continue notification-management

AI 응답:
"CHECKPOINT-2.md를 로드했습니다.

이전 진행:
✅ Gate 0-4: 모두 통과

Session 3: Finalize를 시작합니다 (Gate 5-7)..."

[Gate 5 실행]
[Gate 6 실행]
[Gate 7 실행 - Provisional 승인 포함]

AI 응답:
"Session 3 완료!

✅ 전체 Gate 0-7: 통과
✅ 완성도: 87% (40/46)
✅ PRD 생성: notification-management-prd.md

구현을 시작하려면:
/implement notification-management"
```

### 4.4 Session 4: Implementation

```
사용자: /implement notification-management

AI 응답:
"notification-management-prd.md를 로드했습니다.

구현 계획:
- Phase 1: DB (1개 테이블)
- Phase 2: Backend (9개 파일)
- Phase 3: Frontend (8개 파일)
- Phase 4: 통합 검증

Phase 1 시작..."

[코드 생성]

AI 응답:
"Gate 8 완료!

✅ Backend 빌드: 통과
✅ Frontend 빌드: 통과
✅ 기본 테스트: 통과

80% 구현 완료. MVP 워크플로우 종료."
```

---

## 5. 새로운 Skill: /design-continue

### 5.1 SKILL.md

```markdown
# /design-continue - 워크플로우 재개 Skill

## 개요

분할된 PRD 워크플로우를 이전 체크포인트에서 재개합니다.

## 사용법

```
/design-continue [기능명]
```

## 동작

1. CHECKPOINT-{n}.md 파일 탐색
2. 마지막 체크포인트 로드
3. 다음 세션 Gate부터 실행
4. 세션 완료 시 새 체크포인트 저장

## 체크포인트 매핑

| 마지막 CP | 다음 세션 | 실행 Gate |
|-----------|-----------|-----------|
| 없음 | Session 1 | 0, 1 |
| CHECKPOINT-1 | Session 2 | 2, 3, 4 |
| CHECKPOINT-2 | Session 3 | 5, 6, 7 |
| PRD 완성 | Session 4 | 8 (/implement) |
```

### 5.2 Checkpoint 자동 감지 로직

```
1. prd/{기능명}/ 디렉토리 확인
2. CHECKPOINT-*.md 파일 탐색
3. 가장 높은 번호 선택
4. 해당 세션 이후부터 실행
```

---

## 6. /design-all 수정

### 6.1 기존 동작
- Gate 0~7 순차 실행 (단일 세션)

### 6.2 새로운 동작
```markdown
## 실행 모드

### 기본 모드 (분할 실행)
```
/design-all [기능명]
```
- Session 1만 실행
- 체크포인트 저장
- 다음 세션 안내

### 연속 모드
```
/design-all [기능명] --continuous
```
- 모든 세션 연속 실행
- 세션 간 /clear 자동 수행
- 체크포인트 자동 저장

### 특정 세션만
```
/design-all [기능명] --session 2
```
- 지정 세션만 실행
- 이전 체크포인트 필요
```

---

## 7. 컨텍스트 절약 기법 (추가)

### 7.1 산출물 참조 방식

```markdown
❌ 이전 방식 (전체 로드):
"01-requirements.md 내용:
[전체 200줄...]"

✅ 새로운 방식 (요약 + 참조):
"01-requirements.md 요약:
- User Stories: 5개 (US-001~005)
- Edge Cases: 8개 (EC-001~008)
- 상세: prd/notification/01-requirements.md 참조"
```

### 7.2 Gate 검증 시 최소 정보

```markdown
❌ 이전 방식:
"Gate 1 검증 결과:
[전체 검증 로그...]"

✅ 새로운 방식:
"Gate 1: ✅ 통과 (7/7)
- 실패 항목: 없음"
```

### 7.3 멀티 LLM 결과 압축

```markdown
❌ 이전 방식:
"GPT-5.2 분석 결과:
[전체 응답...]

Gemini-3-Pro 분석 결과:
[전체 응답...]"

✅ 새로운 방식:
"멀티 LLM 종합:
| 항목 | Claude | GPT | Gemini | 채택 |
|------|--------|-----|--------|------|
| 인증방식 | JWT | JWT | OAuth2 | JWT |
| 저장소 | Redis | Redis | DB | Redis |

상세: 각 LLM 원본은 산출물에 포함됨"
```

---

## 8. 예상 효과

### 8.1 컨텍스트 사용량 비교

| 구분 | 단일 세션 | 분할 세션 |
|------|----------|-----------|
| Gate 0-1 후 | 40% | 40% → /clear → 5% |
| Gate 0-4 후 | 75% | 35% (CP 로드) |
| Gate 0-7 후 | 95% | 45% |
| Gate 0-8 후 | 초과 | 60% |

### 8.2 품질 예상

| 구분 | 단일 세션 | 분할 세션 |
|------|----------|-----------|
| Gate 0-1 | 양호 | 양호 |
| Gate 2-4 | 저하 시작 | 양호 |
| Gate 5-7 | 저하 | 양호 |
| Gate 8 | 불안정 | 양호 |

### 8.3 사용자 경험

- **추가 명령어**: `/design-continue` 1개
- **세션 전환**: 3~4회 (명시적)
- **진행 상황**: 체크포인트로 명확히 파악
- **재개 용이**: 언제든 중단/재개 가능

---

## 9. 구현 우선순위

### Phase 1: 핵심 기능 (즉시)
1. [ ] CHECKPOINT 파일 구조 정의
2. [ ] `/design-continue` 스킬 생성
3. [ ] `/design-all` 분할 모드 추가

### Phase 2: 최적화 (단기)
4. [ ] 산출물 요약 로직
5. [ ] Gate 간 /clear 자동화
6. [ ] 컨텍스트 사용량 모니터링

### Phase 3: 고급 기능 (중기)
7. [ ] `--continuous` 모드
8. [ ] 세션별 Task Tool 위임
9. [ ] 진행률 시각화

---

## 10. 결론

### 핵심 변경사항
1. **Gate 0~7을 3개 세션으로 분할**
2. **CHECKPOINT 파일로 상태 전달**
3. **`/design-continue`로 재개**
4. **각 세션 컨텍스트 75% 이하 유지**

### 기대 효과
- 품질 일관성 유지
- 컨텍스트 폭발 방지
- 명확한 진행 상황 추적
- 유연한 중단/재개
