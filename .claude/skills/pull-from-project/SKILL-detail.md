# /pull-from-project - 상세 가이드

> 이 문서는 필요 시 참조하는 상세 가이드입니다.

## 분석 프로세스

### Step 1: 프로젝트 구조 스캔

```
대상 프로젝트/
├── prd/                    ← 도메인별 PRD 스캔
│   ├── {domain-name}/
│   │   ├── {domain-name}-prd.md
│   │   ├── 00-research.md
│   │   ├── 01-requirements.md
│   │   ├── 02-ui-design.md
│   │   ├── 03-data-model.md
│   │   ├── 04-api-design.md
│   │   ├── 05-implementation-plan.md
│   │   └── 06-test-cases.md
│   └── ...
├── assets/
│   └── domain/             ← 도메인 자산 스캔
│       └── {domain-name}.yml
└── db_dic/
    ├── dictionary/
    │   └── standards.json  ← 새 용어 스캔
    └── sql/postgres/public/
        └── *.sql           ← 새 테이블/컬럼 스캔
```

### Step 2: 현재 표준과 비교

```python
# 비교 로직 (의사 코드)

for domain in project.prd:
    if domain not in standard.prd:
        # 신규 도메인
        candidates.add_new_domain(domain)
    else:
        # 기존 도메인 - 변경사항 비교
        diff = compare_prd(standard.prd[domain], project.prd[domain])
        if diff.has_new_user_stories:
            candidates.add_user_stories(diff.new_user_stories)
        if diff.has_new_apis:
            candidates.add_apis(diff.new_apis)

for table in project.db_dic.sql:
    if table not in standard.db_dic.sql:
        candidates.add_new_table(table)
    else:
        new_columns = compare_columns(standard, project, table)
        candidates.add_columns(new_columns)

for term in project.db_dic.dictionary:
    if term not in standard.db_dic.dictionary:
        candidates.add_term(term)
```

---

## 비교 항목 상세

### PRD 비교

| 파일 | 비교 항목 |
|------|----------|
| `*-prd.md` | 전체 구조, 스코프 변경 |
| `01-requirements.md` | User Story ID, Acceptance Criteria |
| `02-ui-design.md` | 화면 목록, 컴포넌트 |
| `03-data-model.md` | 엔티티, 관계 |
| `04-api-design.md` | 엔드포인트, DTO |
| `06-test-cases.md` | 테스트 시나리오, 엣지 케이스 |

### DB 비교

| 항목 | 비교 방법 |
|------|----------|
| 테이블 | 파일명 기준 (존재 여부) |
| 컬럼 | DDL 파싱하여 컬럼 목록 비교 |
| 표준 용어 | standards.json의 키 비교 |

---

## 표준화 추천 로직

### 자동 추천 기준

| 조건 | 추천 |
|------|------|
| 이미 2개 이상 프로젝트에서 사용 | ✓ 강력 추천 |
| 산업 공통 도메인 (재고, 주문 등) | ✓ 추천 |
| 비즈니스 룰이 일반적 | ✓ 추천 |
| 고객사명이 포함된 명칭 | ✗ 프로젝트 특화 |
| 매우 구체적인 요구사항 | ? 검토 필요 |

### 추천 표시

```markdown
- 표준화 추천: ✓ (이유: ...)
- 표준화 추천: ✗ (이유: ...)
- 표준화 추천: ? (판단 필요: ...)
```

---

## 컨설턴트 검토 UI

### 승인 프로세스

```
1. AI가 후보 리포트 생성
2. 컨설턴트가 리포트 검토
3. 각 항목별 [x] 체크 또는 해제
4. 승인 옵션 선택:
   - [A] 전체 승인
   - [S] 선택 승인 (체크된 항목만)
   - [R] 전체 반려
5. AI가 승인된 항목 표준에 반영
```

### AskUserQuestion 형식

```
표준화 후보 검토가 필요합니다.

[신규 도메인]
1. 출하취소 (shipment-cancel)
   - 추천: ✓ 제조업 공통 기능

[기존 도메인 확장]
2. 주문관리 - 대량 일괄 승인
   - 추천: ✓ 범용 기능

어떻게 처리하시겠습니까?
- [A] 전체 승인
- [S] 개별 선택
- [R] 전체 반려
```

---

## 표준 반영 로직

### 승인 후 자동 반영

```python
for candidate in approved_candidates:
    if candidate.type == 'new_domain':
        # prd/ 폴더 복사
        copy_directory(
            source=f"{project}/prd/{candidate.domain}",
            target=f"{standard}/prd/{candidate.domain}"
        )
        # assets/ 복사 (있으면)
        if exists(f"{project}/assets/domain/{candidate.domain}.yml"):
            copy_file(...)
        # db_dic/ 복사
        copy_related_ddl(...)

    elif candidate.type == 'new_user_story':
        # 해당 requirements.md에 추가
        append_to_file(
            file=f"{standard}/prd/{candidate.domain}/01-requirements.md",
            content=candidate.user_story
        )

    elif candidate.type == 'new_column':
        # DDL 파일 수정
        add_column_to_ddl(...)
        # standards.json 업데이트
        add_to_dictionary(...)
```

---

## Quality Validation

### 분석 결과 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 경로 유효성 | 프로젝트 경로 존재 | 에러 메시지 후 종료 |
| PRD 구조 | prd/ 디렉토리 존재 | 경고 후 다른 항목 분석 |
| 비교 정확성 | diff 결과 검증 | 재분석 |
| 분류 완전성 | 모든 변경사항 포함 | 누락 항목 추가 |

### 반영 결과 검증

| 검증 항목 | 기준 | 미달 시 조치 |
|----------|------|-------------|
| 파일 복사 성공 | 대상 파일 존재 확인 | 재시도 또는 수동 안내 |
| 내용 무결성 | 복사 전후 비교 | 롤백 후 재시도 |
| 참조 정합성 | 내부 링크 유효 | 링크 수정 |

---

## 멀티 프로젝트 분석

여러 프로젝트를 한 번에 분석할 수 있습니다.

```
/pull-from-project "../project_samsung" "../project_lg" "../project_sk"
```

### 통합 분석 시 이점

- 2개 이상 프로젝트에서 공통으로 나타나는 패턴 자동 식별
- 표준화 추천 신뢰도 향상
- 중복 분석 방지

---

## 에러 처리

| 에러 | 원인 | 대응 |
|------|------|------|
| 경로 없음 | 잘못된 프로젝트 경로 | 경로 확인 안내 |
| 권한 없음 | 읽기 권한 부족 | 권한 확인 안내 |
| 구조 불일치 | 비표준 프로젝트 구조 | 수동 분석 안내 |
| 파싱 실패 | 잘못된 파일 형식 | 해당 파일 스킵 후 계속 |
