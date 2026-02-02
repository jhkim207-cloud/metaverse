# /evolve-standard - 상세 가이드

> 이 문서는 필요 시 참조하는 상세 가이드입니다.

## 분석 프로세스

### Step 1: 현재 표준 분석

```
표준 템플릿/prd/{도메인}/
├── {도메인}-prd.md           ← 전체 구조 파악
├── 01-requirements.md        ← 현재 기능 목록
├── 02-ui-design.md           ← 화면 구성
├── 03-data-model.md          ← 데이터 구조
├── 04-api-design.md          ← API 스펙
└── 06-test-cases.md          ← 테스트 범위
```

**분석 항목:**
- 현재 지원 기능 목록
- 데이터 모델 (엔티티, 관계)
- API 엔드포인트 목록
- 비즈니스 룰/제약조건

### Step 2: 외부 Best Practice 조사

#### 멀티 LLM 프롬프트

**Claude (종합 분석)**
```
현재 {도메인} 표준의 주요 기능:
{현재 기능 목록}

다음 관점에서 개선점을 분석해주세요:
1. 글로벌 ERP (SAP, Oracle, Microsoft Dynamics)의 동일 모듈 기능
2. 오픈소스 ERP (Odoo, ERPNext)의 구현 방식
3. 최신 산업 트렌드 및 Best Practice
```

**gpt-5.2 (기술 관점)**
```
mcp__zen__chat(
  prompt: "{도메인} 도메인의 기술적 Best Practice를 분석해주세요.

현재 기능:
{현재 기능 목록}

분석 항목:
1. SAP S/4HANA, Oracle Cloud의 해당 모듈 핵심 기능
2. 아키텍처 패턴 (마이크로서비스, 이벤트 드리븐 등)
3. 성능/확장성 고려사항
4. 데이터 모델 Best Practice
5. API 설계 패턴",
  model: "gpt-5.2",
  working_directory_absolute_path: "{프로젝트 경로}",
  thinking_mode: "high"
)
```

**gemini-3-pro-preview (비즈니스 관점)**
```
mcp__zen__chat(
  prompt: "{도메인} 도메인의 비즈니스 Best Practice를 분석해주세요.

현재 기능:
{현재 기능 목록}

분석 항목:
1. 사용자 가치 및 Pain Point 해결
2. 비즈니스 프로세스 최적화
3. ROI 및 도입 효과
4. 산업별 특화 요구사항
5. 향후 트렌드 (AI, 자동화 등)",
  model: "gemini-3-pro-preview",
  working_directory_absolute_path: "{프로젝트 경로}",
  thinking_mode: "high"
)
```

### Step 3: Gap 분석

| 분석 축 | 비교 항목 |
|---------|----------|
| 기능 커버리지 | 외부 대비 누락 기능 |
| 자동화 수준 | 수동 vs 자동 |
| 데이터 모델 | 엔티티/관계 차이 |
| API 성숙도 | RESTful, 버전 관리, 에러 처리 |
| UX 패턴 | 화면 흐름, 사용성 |

### Step 4: 우선순위 결정

| 우선순위 | 기준 | 예시 |
|----------|------|------|
| 🔴 단기 (1-3개월) | ROI 높음, 구현 난이도 낮음 | 납기 자동 계산 |
| 🟡 중기 (3-6개월) | ROI 높음, 구현 난이도 중간 | 여신 관리 |
| 🟢 장기 (6개월+) | 대규모 변경 필요 | 다중 창고 지원 |

---

## 도메인별 조사 가이드

### 주문관리 (Order Management)

**핵심 조사 항목:**
- ATP (Available-to-Promise)
- CTP (Capable-to-Promise)
- Order Promising / Scheduling
- Credit Check / Hold
- Order Splitting / Consolidation
- Backorder Management

**참고 소스:**
- SAP: SD (Sales & Distribution) 모듈
- Oracle: Order Management Cloud
- Odoo: Sale 모듈

### 재고관리 (Inventory)

**핵심 조사 항목:**
- 다중 창고/로케이션
- Lot/Serial 추적
- ABC 분석
- 안전재고/재주문점
- 재고 평가 (FIFO, LIFO, 이동평균)
- 실사/조정

**참고 소스:**
- SAP: MM (Materials Management) 모듈
- Oracle: Inventory Management Cloud
- Odoo: Stock 모듈

### 생산관리 (Production)

**핵심 조사 항목:**
- BOM (Bill of Materials)
- 라우팅 (Routing)
- MRP (Material Requirements Planning)
- 작업지시 (Work Order)
- 생산실적 집계
- 품질 관리 연동

**참고 소스:**
- SAP: PP (Production Planning) 모듈
- Oracle: Manufacturing Cloud
- ISA-95 표준

---

## 결과 종합 기준

### 3개 LLM 결과 통합

| 상황 | 처리 방법 |
|------|----------|
| 3개 모두 동일 제안 | 필수 반영 (최고 신뢰도) |
| 2개 동일 + 1개 다름 | 다수 의견 채택, 소수 의견 참고 기록 |
| 3개 모두 다름 | Claude가 최종 판단, 근거 명시 |

### 개선 제안 품질 기준

| 기준 | 충족 조건 |
|------|----------|
| 구체성 | 구현 방안이 명확 (API, 테이블 등) |
| 실현 가능성 | 현재 기술 스택으로 구현 가능 |
| 비용 효과 | 예상 효과 > 구현 비용 |
| 호환성 | 기존 표준과 충돌 없음 |

---

## Quality Validation

### 조사 결과 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 소스 다양성 | 최소 3개 다른 소스 | 추가 조사 |
| 최신성 | 3년 이내 정보 | 최신 정보로 갱신 |
| 관련성 | 도메인과 직접 관련 | 무관 정보 제거 |
| 정확성 | 사실 확인 가능 | 출처 명시 또는 제거 |

### 개선 제안 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 구현 명세 | API/테이블 수준 상세 | 상세화 |
| 우선순위 근거 | ROI/난이도 분석 포함 | 근거 추가 |
| 의존성 파악 | 선행 조건 명시 | 의존성 분석 |

---

## 표준 반영 프로세스

### 승인 후 반영

```python
for proposal in approved_proposals:
    # 1. 로드맵에 추가
    add_to_roadmap(
        file=f"prd/{domain}/roadmap.md",
        item=proposal
    )

    # 2. PRD 업데이트 (향후 기능으로)
    if proposal.priority == '단기':
        add_to_requirements(
            file=f"prd/{domain}/01-requirements.md",
            section="향후 기능",
            content=proposal.user_story
        )

    # 3. 변경 이력 기록
    add_to_changelog(
        date=today,
        type="개선 제안",
        description=proposal.summary
    )
```

### 파일럿 선택 시

```python
if approval_type == 'pilot':
    # 파일럿 프로젝트 지정
    create_pilot_tracking(
        domain=domain,
        proposal=proposal,
        target_project="다음 프로젝트"
    )

    # 파일럿 후 /pull-from-project로 환류 예정
```

---

## 정기 실행 권장

### 실행 주기

| 도메인 유형 | 권장 주기 | 이유 |
|------------|----------|------|
| 핵심 도메인 | 분기 1회 | 빠른 트렌드 반영 |
| 일반 도메인 | 반기 1회 | 안정성 우선 |
| 신규 도메인 | 초기 집중 조사 | 표준 정립 |

### 트리거 이벤트

- 주요 ERP 벤더 신규 릴리즈
- 산업 표준 업데이트 (ISA-95 등)
- 여러 프로젝트에서 동일 요구사항 반복
- 컨설턴트 요청
