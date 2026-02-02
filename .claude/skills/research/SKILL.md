# /research - Research & Ideation Skill

## 개요

기능 개발 전 Best Practice 조사와 LLM 창의적 아이디어를 생성하는 리서치 전문가 Skill입니다.

## 사용법

```
/research [기능명]
/research [기능명] --no-multi-llm  # 단일 LLM 모드
```

## 입출력

- **입력**: 자연어 기능 요청
- **산출물**: `prd/{기능명}/00-research.md`

---

## 🔴 필수 실행 체크리스트

실행 전 반드시 확인:

```
□ 1. 새 도메인/기능인가? → 멀티 LLM 필수
□ 2. 멀티 LLM 실행 (GPT-5.2 + Gemini-3-Pro 병렬 호출)
□ 3. 3개 결과 종합 후 산출물 생성
□ 4. Quality Validation 수행
□ 5. Gate 0 검증 항목 5개 확인
```

---

## Gate 0 검증 항목 (5개)

| # | 항목 | 유형 | 기준 |
|---|------|------|------|
| 1 | Best Practice | 수동 | 최소 3개 |
| 2 | 오픈소스/상용 사례 | 수동 | 분석 포함 |
| 3 | Anti-pattern | 수동 | 최소 2개 |
| 4 | 창의적 아이디어 | 수동 | 최소 2개 |
| 5 | 채택 근거 | 수동 | 모든 아이디어에 명시 |

---

## 외부 조사 대상

### 글로벌 ERP/CRM

| 벤더 | 제품 | 조사 항목 |
|------|------|----------|
| SAP | S/4HANA | 모듈별 핵심 기능, Best Practice |
| Oracle | Cloud ERP, SCM Cloud | 기능 구성, 프로세스 플로우 |
| Microsoft | Dynamics 365 | 산업별 솔루션, 모듈 구조 |
| Salesforce | Sales/Service Cloud | CRM 기능, 자동화 패턴 |

### 오픈소스

| 프로젝트 | 분야 | 조사 항목 |
|----------|------|----------|
| Odoo | ERP | 모듈 구조, 데이터 모델 |
| ERPNext | ERP | 프로세스 설계, API 패턴 |
| Apache OFBiz | ERP | 엔터프라이즈 패턴 |

### 산업 표준/리서치

| 소스 | 내용 |
|------|------|
| Gartner | 산업별 트렌드, Magic Quadrant |
| Forrester | 기술 평가, Wave 리포트 |
| APICS/ASCM | 공급망 표준, SCOR 모델 |
| ISA-95 | 제조업 통합 표준 |

---

## 멀티 LLM (새 도메인 필수)

```
[Claude 분석] + [gpt-5.2 기술] + [gemini-3-pro-preview 비즈니스]
                     ↓
              3개 결과 종합
                     ↓
           00-research.md 생성
```

**gpt-5.2 호출**: 기술 스택, 아키텍처, 성능, 리스크, 글로벌 ERP 기능 분석
**gemini-3-pro-preview 호출**: 사용자 가치, Persona, UX 아이디어, 비즈니스 효과

---

## 다음 단계

Gate 0 통과 후 → `/requirements` 실행

---

> 📖 상세 템플릿, Quality Validation, LLM 프롬프트는 `SKILL-detail.md` 참조
