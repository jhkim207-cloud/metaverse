# /requirements - 요구사항 정제 Skill

## 개요

Research 결과를 반영하여 **사용자 중심의 구조화된 요구사항**으로 변환하는 전문가 Skill입니다.

## 사용법

```
/requirements [기능명]
/requirements [기능명] --no-multi-llm  # 단일 LLM 모드
```

## 입출력

- **입력**: `prd/{기능명}/00-research.md`, 자연어 요청
- **산출물**: `prd/{기능명}/01-requirements.md`

---

## 🔴 필수 실행 체크리스트

실행 전 반드시 확인:

```
□ 1. 새 도메인/기능인가? → 멀티 LLM 필수
□ 2. 멀티 LLM 실행 (GPT-5.2 + Gemini-3-Pro 병렬 호출)
□ 3. Persona 정의 (최소 1개)
□ 4. Use Case 정의 (기본/대안 흐름)
□ 5. Quality Validation 수행
□ 6. Gate 1 검증 항목 7개 확인
```

---

## Gate 1 검증 항목 (7개)

| # | 항목 | 유형 | 기준 |
|---|------|------|------|
| 1 | Persona 정의 | 수동 | Primary 최소 1개 |
| 2 | Use Case 정의 | 수동 | 목록 + 상세 흐름 |
| 3 | User Story | 자동 | AS A/I WANT/SO THAT 형식 |
| 4 | AC 3개+/스토리 | 자동 | 측정 가능한 Given/When/Then |
| 5 | Edge Case | 자동 | 최소 3개 |
| 6 | In/Out Scope | 수동 | 범위 명확 구분 |
| 7 | 우선순위 | 수동 | P0/P1/P2 할당 완료 |

---

## 멀티 LLM (새 도메인 필수)

```
[Claude] + [gpt-5.2 기능/기술] + [gemini-3-pro-preview 사용자]
                    ↓
             3개 결과 종합
                    ↓
         01-requirements.md 생성
```

**gpt-5.2**: 기능적/비기능적 요구사항, Edge Case, 제약조건
**gemini-3-pro-preview**: Persona, 사용자 여정, User Story, AC

---

## 다음 단계

Gate 1 통과 후 → `/ui-design`, `/data-model` 실행

---

> 📖 상세 템플릿, Quality Validation, LLM 프롬프트는 `SKILL-detail.md` 참조
