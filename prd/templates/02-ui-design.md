# UI 설계: {기능명}

> **생성일**: YYYY-MM-DD
> **Skill**: `/ui-design`
> **Gate**: Gate 2
> **입력**: `00-research.md`, `01-requirements.md`
> **참조**: `docs/ui-standards/UI_STANDARD.md`

---

## 1. 화면 목록

| ID | 화면명 | 유형 | 설명 | 연결 화면 |
|----|--------|------|------|----------|
| SCR-001 | [화면명 1] | Page/Modal/Panel | ... | ... |
| SCR-002 | [화면명 2] | Page/Modal/Panel | ... | ... |

---

## 2. 컴포넌트 트리

### SCR-001: [화면명 1]

```
Page
├── Header
│   ├── Title
│   └── ActionButtons
│       ├── Button (Primary)
│       └── Button (Secondary)
├── Content
│   ├── FilterPanel
│   │   ├── SearchInput
│   │   └── SelectFilter
│   ├── DataTable
│   │   ├── TableHeader
│   │   └── TableBody
│   │       └── TableRow (반복)
│   └── Pagination
└── Footer
```

### SCR-002: [화면명 2]

```
Modal
├── ModalHeader
│   ├── Title
│   └── CloseButton
├── ModalBody
│   └── Form
│       ├── FormField (email)
│       ├── FormField (name)
│       └── FormField (...)
└── ModalFooter
    ├── Button (Cancel)
    └── Button (Submit)
```

---

## 3. 컴포넌트 매핑

| 컴포넌트 | UI 표준 컴포넌트 | Props | 비고 |
|----------|-----------------|-------|------|
| Button (Primary) | Button | variant="primary", size="md" | CTA 버튼 |
| Button (Secondary) | Button | variant="secondary", size="md" | 보조 버튼 |
| SearchInput | Input | type="search", placeholder="..." | 검색 입력 |
| SelectFilter | Select | options={...} | 필터 선택 |
| DataTable | Table | columns={...}, data={...} | 데이터 테이블 |
| FormField | Input/Select/... | ... | 폼 필드 |

---

## 4. 상태 설계

### 4.1 페이지 상태

| 상태 변수 | 타입 | 초기값 | 설명 |
|-----------|------|--------|------|
| isLoading | boolean | false | 로딩 상태 |
| error | Error \| null | null | 에러 객체 |
| data | T[] | [] | 데이터 목록 |
| selectedId | number \| null | null | 선택된 항목 ID |
| filters | FilterType | {} | 필터 조건 |
| page | number | 0 | 현재 페이지 |
| pageSize | number | 20 | 페이지 크기 |

### 4.2 폼 상태

| 필드 | 타입 | 검증 규칙 | 에러 메시지 |
|------|------|----------|-------------|
| email | string | required, email | "이메일 형식이 올바르지 않습니다" |
| name | string | required, minLength(2) | "이름은 2자 이상이어야 합니다" |
| ... | ... | ... | ... |

---

## 5. 화면 상태 정의

### 5.1 로딩 상태

- **컴포넌트**: Skeleton UI
- **위치**: 데이터 테이블 영역
- **조건**: isLoading === true

```
┌─────────────────────────────────┐
│ ████████████████████████████    │
│ ████████████████                │
│ ██████████████████████          │
└─────────────────────────────────┘
```

### 5.2 에러 상태

- **컴포넌트**: ErrorBoundary + ErrorMessage
- **조건**: error !== null
- **액션**: 재시도 버튼 제공

```
┌─────────────────────────────────┐
│         ⚠️ 오류 발생            │
│    데이터를 불러올 수 없습니다    │
│         [다시 시도]              │
└─────────────────────────────────┘
```

### 5.3 빈 상태

- **컴포넌트**: EmptyState
- **조건**: data.length === 0 && !isLoading
- **메시지**: "등록된 데이터가 없습니다"
- **CTA**: "새로 등록하기"

```
┌─────────────────────────────────┐
│           📭                    │
│    등록된 데이터가 없습니다      │
│        [새로 등록하기]           │
└─────────────────────────────────┘
```

---

## 6. 이벤트 흐름

### 6.1 목록 조회

```
[페이지 로드]
    ↓
[useEffect 트리거]
    ↓
[setIsLoading(true)]
    ↓
[API 호출: GET /api/v1/xxx]
    ↓
├─ 성공 → [setData(response.data)]
│         [setIsLoading(false)]
│
└─ 실패 → [setError(error)]
          [setIsLoading(false)]
          [토스트: 에러 메시지]
```

### 6.2 항목 생성

```
[사용자: 생성 버튼 클릭]
    ↓
[모달 열기: setIsModalOpen(true)]
    ↓
[사용자: 폼 입력]
    ↓
[사용자: 제출 버튼 클릭]
    ↓
[폼 검증]
├─ 실패 → [에러 메시지 표시]
│
└─ 성공 → [API 호출: POST /api/v1/xxx]
          ├─ 성공 → [목록 새로고침]
          │         [모달 닫기]
          │         [토스트: 성공]
          │
          └─ 실패 → [에러 메시지 표시]
```

---

## 7. 반응형 설계

| 브레이크포인트 | 레이아웃 변경사항 |
|---------------|------------------|
| Desktop (≥1024px) | 3컬럼 그리드, 테이블 전체 표시 |
| Tablet (768-1023px) | 2컬럼 그리드, 일부 컬럼 숨김 |
| Mobile (<768px) | 1컬럼, 카드 레이아웃으로 변경 |

---

## 8. 접근성 고려사항

- **키보드 네비게이션**: Tab/Shift+Tab으로 모든 인터랙티브 요소 접근 가능
- **포커스 관리**: 모달 열림 시 첫 입력 필드로 포커스 이동
- **스크린 리더**:
  - 테이블에 `aria-label` 적용
  - 버튼에 `aria-label` 또는 텍스트 제공
  - 상태 변경 시 `aria-live` 영역 업데이트

---

## Gate 2 체크리스트

- [ ] [자동] 참조된 모든 컴포넌트가 UI_STANDARD.md에 존재하는지 확인
- [ ] [자동] 상태 변수 타입이 TypeScript 유효 타입인지 확인
- [ ] [수동] 모든 화면에 로딩/에러/빈 상태 정의됨
- [ ] [수동] 폼 필드별 검증 규칙 정의됨
- [ ] [수동] 이벤트 흐름이 시작→종료까지 완성됨
