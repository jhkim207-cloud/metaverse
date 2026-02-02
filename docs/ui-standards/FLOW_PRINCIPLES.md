# Flow Principles - 사용자 흐름 및 인터랙션 원칙

> BizPlatform UI 표준의 사용자 흐름, 네비게이션, 인터랙션 원칙을 정의합니다.
> PAGE_PATTERNS.md와 함께 사용하여 일관된 사용자 경험을 제공합니다.

---

## 1. 네비게이션 원칙

### 1.1 URL을 Single Source of Truth로

```
원칙: 화면 상태는 URL에 반영되어야 한다
```

| 상태 유형 | URL 반영 | 예시 |
|-----------|----------|------|
| 현재 페이지 | Path | `/users`, `/projects/123` |
| 필터 조건 | Query String | `?status=active&grade=A` |
| 정렬 상태 | Query String | `?sort=createdAt&order=desc` |
| 페이지네이션 | Query String | `?page=2&size=20` |
| 선택된 탭 | Query String | `?tab=details` |
| 검색어 | Query String | `?q=검색어` |

**구현 패턴:**
```typescript
// useQueryParams 훅 사용
const { filters, setFilters, resetFilters } = useQueryParams({
  status: 'all',
  page: 1,
  size: 20,
  sort: 'createdAt',
  order: 'desc'
});

// URL 변경 시 자동으로 데이터 refetch
useEffect(() => {
  fetchData(filters);
}, [filters]);
```

**장점:**
- 브라우저 뒤로가기/앞으로가기 지원
- 북마크 및 URL 공유 가능
- 새로고침 시 상태 유지
- 딥링크 지원

### 1.2 계층적 네비게이션

```
GNB (Global) → LNB (Local) → Breadcrumb → Page Content
```

| 레벨 | 컴포넌트 | 역할 | 예시 |
|------|----------|------|------|
| L1 | GNB | 메인 메뉴 (도메인) | 품질관리, 생산관리, 물류 |
| L2 | LNB | 서브 메뉴 (기능) | 부적합관리, 검사관리 |
| L3 | Breadcrumb | 현재 위치 표시 | 품질관리 > 부적합 > CAPA-001 |
| L4 | Tab | 상세 영역 구분 | 기본정보, 이력, 첨부파일 |

**Breadcrumb 규칙:**
```typescript
// 자동 생성 패턴
const breadcrumbs = [
  { label: '품질관리', path: '/quality' },
  { label: '부적합 관리', path: '/quality/incidents' },
  { label: 'INC-2024-001', path: null } // 현재 페이지는 링크 없음
];
```

### 1.3 컨텍스트 유지 네비게이션

```
원칙: 목록 → 상세 이동 시 목록 상태를 보존한다
```

**패턴 A: Query String 전달**
```typescript
// 목록에서 상세로 이동
navigate(`/users/${id}?returnTo=${encodeURIComponent(location.search)}`);

// 상세에서 목록으로 복귀
const returnTo = searchParams.get('returnTo');
navigate(`/users${returnTo || ''}`);
```

**패턴 B: 세션 스토리지 활용**
```typescript
// 목록 상태 저장
sessionStorage.setItem('userListState', JSON.stringify(filters));

// 복귀 시 복원
const savedState = sessionStorage.getItem('userListState');
```

---

## 2. 패턴별 사용자 흐름

### 2.1 ListPage 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                      ListPage Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [진입] ──→ [필터 적용] ──→ [검색] ──→ [결과 확인]          │
│                │              │            │                │
│                ▼              ▼            ▼                │
│         URL 업데이트    API 호출     테이블 렌더링          │
│                │              │            │                │
│                └──────────────┴────────────┘                │
│                              │                              │
│                              ▼                              │
│              ┌───────────────┴───────────────┐              │
│              │                               │              │
│         [단건 선택]                    [다건 선택]          │
│              │                               │              │
│              ▼                               ▼              │
│       [상세 이동]                    [일괄 작업]            │
│       또는 [인라인 액션]              (상태 변경, 삭제)     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**핵심 인터랙션:**

| 액션 | 트리거 | 결과 |
|------|--------|------|
| 필터 변경 | Select/Input | URL 업데이트 → 데이터 refetch |
| 검색 | Enter 또는 버튼 클릭 | URL 업데이트 → 데이터 refetch |
| 정렬 | 컬럼 헤더 클릭 | URL 업데이트 → 데이터 refetch |
| 페이지 이동 | Pagination 클릭 | URL 업데이트 → 데이터 refetch |
| 행 클릭 | 테이블 행 | 상세 페이지 이동 |
| 액션 버튼 | 행 내 버튼 | 모달 열기 또는 API 호출 |
| 다건 선택 | 체크박스 | 일괄 작업 버튼 활성화 |

### 2.2 DetailPage 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                     DetailPage Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [진입] ──→ [데이터 로딩] ──→ [탭 전환] ──→ [정보 확인]     │
│                                    │                        │
│                                    ▼                        │
│                            URL ?tab= 업데이트               │
│                                    │                        │
│                                    ▼                        │
│              ┌───────────────┬─────┴─────┬──────────┐       │
│              │               │           │          │       │
│         [수정 모드]    [상태 변경]   [삭제]    [관련 이동]  │
│              │               │           │          │       │
│              ▼               ▼           ▼          ▼       │
│        인라인 편집      확인 모달   확인 모달   상세 이동   │
│        또는 FormPage                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**탭 전환 규칙:**
```typescript
// Lazy Loading 적용
const TabContent = lazy(() => import(`./tabs/${activeTab}`));

// 탭별 데이터는 개별 fetch
useEffect(() => {
  if (activeTab === 'history') {
    fetchHistory(id);
  }
}, [activeTab, id]);
```

### 2.3 FormPage 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                      FormPage Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [진입] ──→ [폼 초기화] ──→ [필드 입력] ──→ [실시간 검증]   │
│     │                            │               │          │
│     │                            ▼               ▼          │
│     │                      dirty 상태      에러 표시        │
│     │                            │               │          │
│     │                            └───────┬───────┘          │
│     │                                    │                  │
│     ▼                                    ▼                  │
│  [취소 시도] ◀────────────────── [저장 클릭]                │
│     │                                    │                  │
│     ▼                                    ▼                  │
│  dirty 확인 ──→ 확인 모달         전체 검증 실행            │
│                    │                     │                  │
│                    ▼                     ▼                  │
│               [이탈 허용]         ┌──────┴──────┐           │
│                                   │             │           │
│                              [검증 통과]   [검증 실패]      │
│                                   │             │           │
│                                   ▼             ▼           │
│                              API 호출      에러 포커스      │
│                                   │                         │
│                                   ▼                         │
│                           ┌──────┴──────┐                   │
│                           │             │                   │
│                      [성공]        [실패]                   │
│                           │             │                   │
│                           ▼             ▼                   │
│                    목록/상세 이동   에러 토스트              │
│                    + 성공 토스트                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**폼 상태 관리:**
```typescript
const {
  register,
  handleSubmit,
  formState: { errors, isDirty, isSubmitting }
} = useForm({
  defaultValues: initialData,
  mode: 'onChange' // 실시간 검증
});

// 이탈 방지
useBlocker(isDirty && !isSubmitting);
```

### 2.4 Dashboard 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                     Dashboard Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [진입] ──→ [KPI 로딩] ──→ [차트 로딩] ──→ [전체 표시]      │
│                                               │             │
│                                               ▼             │
│              ┌───────────────┬───────────────┬─────┐        │
│              │               │               │     │        │
│         [기간 변경]    [KPI 클릭]     [차트 클릭] [Quick]   │
│              │               │               │    [Action]  │
│              ▼               ▼               ▼     │        │
│         데이터 refetch  필터링된 목록   상세 데이터  │        │
│                         페이지 이동    드릴다운     │        │
│                                               │     │        │
│                                               └─────┘        │
│                                                  │           │
│                                                  ▼           │
│                                           관련 페이지 이동   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**드릴다운 패턴:**
```typescript
// KPI 카드 클릭 → 필터링된 목록으로 이동
const handleKpiClick = (status: string) => {
  navigate(`/incidents?status=${status}`);
};

// 차트 클릭 → 상세 데이터 표시
const handleChartClick = (dataPoint: DataPoint) => {
  setSelectedData(dataPoint);
  setDetailModalOpen(true);
};
```

### 2.5 BoardPage (Multi-Panel) 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                      BoardPage Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [진입] ──→ [패널 초기화] ──→ [데이터 로딩]                 │
│                                    │                        │
│         ┌──────────────────────────┼──────────────────────┐ │
│         │                          │                      │ │
│         ▼                          ▼                      ▼ │
│    [Panel A]                  [Panel B]              [Panel C]
│    소스 목록                   작업 영역              상세/지도│
│         │                          │                      │ │
│         │                          │                      │ │
│         └──────────► Drag ─────────┘                      │ │
│                        │                                  │ │
│                        ▼                                  │ │
│                   [Drop 검증]                             │ │
│                        │                                  │ │
│              ┌─────────┴─────────┐                        │ │
│              │                   │                        │ │
│         [허용]              [불허]                        │ │
│              │                   │                        │ │
│              ▼                   ▼                        │ │
│        Optimistic UI        원위치 복귀                   │ │
│        + API 호출           + 에러 표시                   │ │
│              │                                            │ │
│              └────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**패널 간 상태 동기화:**
```typescript
// 공유 상태 관리
const [selectedItem, setSelectedItem] = useState<Item | null>(null);

// Panel A에서 선택
<SourceList onSelect={setSelectedItem} />

// Panel C에서 상세 표시
<DetailPanel item={selectedItem} />
```

### 2.6 WorkflowPage 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                      WorkflowPage Flow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [진입] ──→ [워크플로우 상태 복원] ──→ [현재 스텝 표시]         │
│                                             │                   │
│                                             ▼                   │
│              ┌──────────────────────────────┴───────────────┐   │
│              │                                              │   │
│         [스텝 폼 입력]                              [스텝 클릭] │
│              │                                              │   │
│              ▼                                              ▼   │
│      [실시간 검증] ◀─────────────────────────► [canProceed 검증]│
│              │                                              │   │
│              ▼                                              │   │
│      [다음/이전 버튼]                                       │   │
│              │                                              │   │
│              ▼                                              │   │
│      ┌──────┴──────┐                                        │   │
│      │             │                                        │   │
│ [이전 스텝]   [다음 스텝]                                   │   │
│      │             │                                        │   │
│      ▼             ▼                                        │   │
│  즉시 이동    검증 실행                                     │   │
│                    │                                        │   │
│           ┌────────┴────────┐                               │   │
│           │                 │                               │   │
│      [검증 통과]       [검증 실패]                          │   │
│           │                 │                               │   │
│           ▼                 ▼                               │   │
│      스텝 전환         에러 표시                            │   │
│      + URL 업데이트    + 해당 필드 포커스                   │   │
│           │                                                 │   │
│           ▼                                                 │   │
│      [마지막 스텝?] ──→ [완료 버튼] ──→ [최종 제출]         │   │
│                               │                             │   │
│                               ▼                             │   │
│                    ┌─────────┴─────────┐                    │   │
│                    │                   │                    │   │
│               [성공]              [실패]                    │   │
│                    │                   │                    │   │
│                    ▼                   ▼                    │   │
│            완료 페이지 이동     에러 표시 + 해당 스텝 이동  │   │
│                                                             │   │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 인터랙션:**

| 액션 | 트리거 | 결과 |
|------|--------|------|
| 스텝 입력 | 폼 필드 변경 | 실시간 검증, Summary 업데이트 |
| 다음 스텝 | 다음 버튼 클릭 | 현재 스텝 검증 → 성공 시 이동 |
| 이전 스텝 | 이전 버튼 클릭 | 검증 없이 즉시 이동 |
| 스텝 직접 선택 | Stepper 클릭 | canProceed 검증 후 이동 |
| 임시 저장 | 임시저장 버튼 | 현재까지 데이터 저장 |
| 최종 제출 | 완료 버튼 | 전체 검증 → 제출 |

**상태 복원 패턴:**
```typescript
// URL에서 현재 스텝 복원
const step = searchParams.get('step') || '1';
const [currentStep, setCurrentStep] = useState(parseInt(step));

// 스텝 변경 시 URL 업데이트
const goToStep = (index: number) => {
  if (canProceedToStep(index)) {
    setCurrentStep(index);
    setSearchParams({ step: String(index) });
  }
};

// 페이지 이탈 방지
useBlocker(isDirty, '작성 중인 내용이 있습니다. 페이지를 떠나시겠습니까?');
```

### 2.7 StageGatePage 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                      StageGatePage Flow                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [진입] ──→ [프로젝트/BMC 로딩] ──→ [Gate 상태 표시]            │
│                                          │                      │
│                                          ▼                      │
│         ┌────────────────────────────────┴──────────────────┐   │
│         │                                                   │   │
│    [Gate 클릭]                                     [승인 액션]  │
│         │                                                   │   │
│         ▼                                                   ▼   │
│    Gate 상세 표시                            ┌──────────────┴───┐
│    (산출물, 체크리스트)                      │                  │
│         │                               [승인]          [조건부]
│         ▼                                    │            [반려]
│    ┌────┴────┐                               │                  │
│    │         │                               ▼                  │
│ [산출물]  [체크리스트]              ┌────────┴────────┐         │
│ 완료 체크    체크                   │                 │         │
│    │         │                 [승인 완료]      [반려 처리]     │
│    └────┬────┘                      │                 │         │
│         │                           ▼                 ▼         │
│         ▼                     다음 Gate 활성화   현재 Gate 유지 │
│    [모든 항목 완료?]                + 알림 발송    + 피드백 요청│
│         │                                                       │
│    ┌────┴────┐                                                  │
│    │         │                                                  │
│ [미완료]  [완료]                                                │
│    │         │                                                  │
│    ▼         ▼                                                  │
│ 승인 버튼  승인 버튼                                            │
│ 비활성화   활성화                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 인터랙션:**

| 액션 | 트리거 | 결과 |
|------|--------|------|
| Gate 선택 | Stepper 클릭 | Gate 상세 정보 표시 |
| 산출물 체크 | 체크박스 클릭 | 완료 상태 업데이트, 진행률 갱신 |
| 승인 | 승인 버튼 | 확인 모달 → 다음 Gate 활성화 |
| 조건부 승인 | 조건부 승인 버튼 | 조건 입력 → 조건 충족 시 자동 승인 |
| 반려 | 반려 버튼 | 반려 사유 입력 → 담당자 알림 |

**Gate 승인 권한 체크:**
```typescript
// 권한 및 조건 검증
const canApprove = useMemo(() => {
  const hasRole = user.roles.includes('GATE_APPROVER');
  const isCurrentGate = gate.status === 'current';
  const allDeliverablesComplete = gate.deliverables.every(d => d.completed);

  return hasRole && isCurrentGate && allDeliverablesComplete;
}, [user, gate]);

// 승인 액션
const handleApprove = async (decision: GateDecision) => {
  if (decision === 'PASS') {
    await approveGate(projectId, gateId);
    showToast({ type: 'success', message: 'Gate가 승인되었습니다.' });
  } else if (decision === 'CONDITIONAL') {
    setConditionModalOpen(true);
  } else {
    setRejectModalOpen(true);
  }
};
```

### 2.8 TimelinePage 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                      TimelinePage Flow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [진입] ──→ [타임라인 로딩] ──→ [전체 표시]                     │
│                                     │                           │
│                                     ▼                           │
│         ┌───────────────────────────┴───────────────────────┐   │
│         │                                                   │   │
│    [필터 적용]                                    [아이템 클릭] │
│         │                                                   │   │
│         ▼                                                   ▼   │
│    필터링된 표시                              ┌─────────────┴───┐
│    (상태별, 날짜별)                           │                 │
│         │                                [Milestone]      [Task]│
│         │                                     │                 │
│         │                                     ▼                 │
│         │                              상세 패널 열기           │
│         │                              또는 인라인 확장         │
│         │                                     │                 │
│         │                                     ▼                 │
│         │                          ┌──────────┴──────────┐      │
│         │                          │                     │      │
│         │                     [진행률 수정]        [상태 변경]  │
│         │                          │                     │      │
│         │                          ▼                     ▼      │
│         │                    슬라이더 조작         드롭다운     │
│         │                          │                     │      │
│         │                          └──────────┬──────────┘      │
│         │                                     │                 │
│         │                                     ▼                 │
│         │                              API 호출                 │
│         │                              + 타임라인 갱신          │
│         │                                     │                 │
│         └─────────────────────────────────────┘                 │
│                                                                 │
│  [Critical Path 토글]                                           │
│         │                                                       │
│         ▼                                                       │
│    Critical Path 항목 강조 표시                                 │
│    (색상 구분 + 아이콘)                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 인터랙션:**

| 액션 | 트리거 | 결과 |
|------|--------|------|
| 상태 필터 | 필터 버튼 클릭 | 해당 상태만 표시 |
| Critical Path | 토글 클릭 | Critical 아이템 강조 |
| 마일스톤 클릭 | 타임라인 아이템 | 상세 정보 패널/모달 |
| 진행률 수정 | 슬라이더 드래그 | 실시간 업데이트 |
| 상태 변경 | 드롭다운 선택 | API 호출 → 타임라인 갱신 |
| 확장/축소 | 화살표 클릭 | 하위 Task 표시/숨김 |

### 2.9 CanvasPage 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                       CanvasPage Flow                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [진입] ──→ [캔버스 로딩] ──→ [그리드 렌더링]                   │
│                                     │                           │
│                                     ▼                           │
│    ┌────────────────────────────────┴────────────────────────┐  │
│    │                                                         │  │
│ [팔레트에서 요소 선택]                          [기존 요소 선택]│
│    │                                                         │  │
│    ▼                                                         ▼  │
│ 드래그 시작                                          편집 모드  │
│    │                                                         │  │
│    ▼                                                         │  │
│ 셀로 드롭                                            ┌───────┴─┐
│    │                                                 │         │
│    ▼                                            [수정]    [삭제]│
│ 요소 생성                                            │         │
│ + 편집 모달                                          ▼         ▼
│    │                                            편집 모달  확인 후
│    │                                                 │     삭제
│    └────────────────────┬───────────────────────────┘         │
│                         │                                      │
│                         ▼                                      │
│                   [저장/자동저장]                               │
│                         │                                      │
│                         ▼                                      │
│                   History에 상태 저장                          │
│                   (Undo/Redo 지원)                             │
│                                                                │
│  [Stage 전환]                                                  │
│         │                                                      │
│         ▼                                                      │
│    Stage 조건 검증                                             │
│         │                                                      │
│    ┌────┴────┐                                                 │
│    │         │                                                 │
│ [미충족]  [충족]                                               │
│    │         │                                                 │
│    ▼         ▼                                                 │
│ 경고 표시  다음 Stage 활성화                                   │
│ (누락 요소)   + 이전 요소 잠금                                 │
│                                                                │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 인터랙션:**

| 액션 | 트리거 | 결과 |
|------|--------|------|
| 요소 추가 | 팔레트 → 셀 드래그 | 요소 생성 + 편집 모달 |
| 요소 편집 | 요소 더블클릭 | 편집 모달 열기 |
| 요소 이동 | 요소 드래그 | 다른 셀로 이동 |
| 요소 삭제 | 삭제 버튼/키 | 확인 후 삭제 |
| 실행취소 | Ctrl+Z | 이전 상태 복원 |
| 다시실행 | Ctrl+Y | 다음 상태 복원 |
| 검증 상태 변경 | 상태 버튼 | hypothesis → testing → validated |

**Undo/Redo 구현:**
```typescript
const useCanvasHistory = (initialState: CanvasState) => {
  const [history, setHistory] = useState<CanvasState[]>([initialState]);
  const [index, setIndex] = useState(0);

  const pushState = (newState: CanvasState) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(newState);
    if (newHistory.length > 50) newHistory.shift(); // 최대 50개
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  };

  const undo = () => index > 0 && setIndex(index - 1);
  const redo = () => index < history.length - 1 && setIndex(index + 1);

  return { state: history[index], pushState, undo, redo, canUndo: index > 0, canRedo: index < history.length - 1 };
};
```

### 2.10 GraphPage 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                       GraphPage Flow                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [진입] ──→ [그래프 데이터 로딩] ──→ [Force 레이아웃 렌더링]    │
│                                            │                    │
│                                            ▼                    │
│         ┌──────────────────────────────────┴────────────────┐   │
│         │                                                   │   │
│    [필터 적용]                                     [노드 호버]  │
│         │                                                   │   │
│         ▼                                                   ▼   │
│    노드/엣지 필터링                           연결된 노드 하이라이트
│    + 그래프 재배치                                          │   │
│         │                                                   │   │
│         └────────────────────────────┬──────────────────────┘   │
│                                      │                          │
│                                      ▼                          │
│                              [노드 클릭]                        │
│                                      │                          │
│                      ┌───────────────┴───────────────┐          │
│                      │                               │          │
│                 [단순 선택]                    [드릴다운]       │
│                      │                               │          │
│                      ▼                               ▼          │
│               사이드바에 상세 표시          서브그래프 로딩     │
│                      │                     (선택 노드 중심)     │
│                      │                               │          │
│                      │                               ▼          │
│                      │                    ┌──────────┴────────┐ │
│                      │                    │                   │ │
│                      │              [서브그래프]        [뒤로가기]
│                      │               표시                      │ │
│                      │                    │                   │ │
│                      │                    ▼                   ▼ │
│                      │             새 그래프 렌더링    원래 그래프
│                      │                                  복원   │ │
│                      └────────────────────┴───────────────────┘ │
│                                                                 │
│  [줌/팬]                                                        │
│         │                                                       │
│         ▼                                                       │
│    줌 레벨에 따른 LOD 적용                                      │
│    (축소 시 라벨 숨김, 노드 단순화)                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 인터랙션:**

| 액션 | 트리거 | 결과 |
|------|--------|------|
| 노드 호버 | 마우스 오버 | 연결된 노드/엣지 하이라이트 |
| 노드 클릭 | 클릭 | 사이드바에 상세 정보 |
| 노드 드릴다운 | 더블클릭/우클릭 | 서브그래프 탐색 |
| 필터 적용 | 필터 컨트롤 | 노드/엣지 필터링 |
| 줌 | 휠/버튼 | 확대/축소 + LOD |
| 팬 | 드래그 | 그래프 이동 |
| 레이아웃 변경 | 드롭다운 | Force/Radial/Hierarchical |

**호버 하이라이트 구현:**
```typescript
const [hoveredNode, setHoveredNode] = useState<string | null>(null);
const [highlightedNodes, setHighlightedNodes] = useState<Set<string>>(new Set());

const handleNodeHover = (node: GraphNode | null) => {
  setHoveredNode(node?.id ?? null);
  if (node) {
    const connected = edges
      .filter(e => e.source === node.id || e.target === node.id)
      .flatMap(e => [e.source, e.target]);
    setHighlightedNodes(new Set([node.id, ...connected]));
  } else {
    setHighlightedNodes(new Set());
  }
};

// 렌더링 시 스타일 적용
const getNodeStyle = (node: GraphNode) => ({
  opacity: highlightedNodes.size === 0 || highlightedNodes.has(node.id) ? 1 : 0.2
});
```

### 2.11 ScheduleGridPage 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                    ScheduleGridPage Flow                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [진입] ──→ [날짜 범위 설정] ──→ [스케줄 로딩]                  │
│                                       │                         │
│                                       ▼                         │
│         ┌─────────────────────────────┴─────────────────────┐   │
│         │                                                   │   │
│    [미배정 목록]                                    [스케줄 그리드]
│         │                                                   │   │
│         ▼                                                   ▼   │
│    ┌────┴────┐                                     ┌────────┴──┐│
│    │         │                                     │           ││
│ [드래그 시작] [필터]                          [셀 클릭]  [기존 항목││
│    │         │                                     │      드래그]││
│    ▼         ▼                                     ▼           ▼ │
│ 드래그 프리뷰 필터링                          빈 셀:    재배정   │
│    │         표시                            신규 배정   시작    │
│    │                                         모달               │
│    │                                               │           │
│    └─────────────────────► Drop ◀──────────────────┘           │
│                              │                                  │
│                              ▼                                  │
│                     ┌────────┴────────┐                         │
│                     │                 │                         │
│                [유효한 위치]     [무효한 위치]                  │
│                     │                 │                         │
│                     ▼                 ▼                         │
│              Optimistic UI       드래그 취소                    │
│              + API 호출          + 에러 표시                    │
│                     │                                           │
│                     ▼                                           │
│              ┌──────┴──────┐                                    │
│              │             │                                    │
│         [성공]        [실패]                                    │
│              │             │                                    │
│              ▼             ▼                                    │
│         배정 확정     롤백                                      │
│         + 토스트      + 에러 토스트                             │
│                                                                 │
│  [주간 네비게이션]                                              │
│         │                                                       │
│         ▼                                                       │
│    이전/다음 주 데이터 로딩                                     │
│    + 미배정 목록 갱신                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 인터랙션:**

| 액션 | 트리거 | 결과 |
|------|--------|------|
| 미배정 → 그리드 | 드래그 앤 드롭 | 배정 생성 |
| 그리드 내 이동 | 드래그 앤 드롭 | 배정 변경 |
| 그리드 → 미배정 | 드래그 앤 드롭 | 배정 취소 |
| 셀 클릭 | 빈 셀 클릭 | 신규 배정 모달 |
| 항목 클릭 | 배정 카드 클릭 | 상세/편집 모달 |
| 주간 이동 | 화살표 클릭 | 날짜 범위 변경 |
| 자동 배정 | 자동배정 버튼 | 알고리즘 기반 최적 배정 |

**Drop 유효성 검증:**
```typescript
const isValidDrop = (item: ScheduleItem, targetRow: string, targetDate: Date): boolean => {
  // 1. 담당자 가용성 확인
  const isAvailable = checkAvailability(targetRow, targetDate);

  // 2. 기술 요구사항 확인
  const hasRequiredSkills = checkSkills(item.requiredSkills, rows.find(r => r.id === targetRow)?.skills);

  // 3. 용량 확인
  const hasCapacity = checkCapacity(targetRow, targetDate);

  return isAvailable && hasRequiredSkills && hasCapacity;
};

// 드롭 시 피드백
const handleDrop = async (item: ScheduleItem, rowId: string, date: Date) => {
  if (!isValidDrop(item, rowId, date)) {
    showToast({ type: 'error', message: '해당 시간대에 배정할 수 없습니다.' });
    return;
  }
  // Optimistic update + API call
};
```

### 2.12 AdminTreePage 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                     AdminTreePage Flow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [진입] ──→ [트리 데이터 로딩] ──→ [트리 렌더링]                │
│                                        │                        │
│                                        ▼                        │
│    ┌───────────────────────────────────┴────────────────────┐   │
│    │                                                        │   │
│ [노드 선택]                                        [노드 드래그]│
│    │                                                        │   │
│    ▼                                                        ▼   │
│ DetailPanel 표시                                  재정렬 시작   │
│    │                                                        │   │
│    ▼                                                        ▼   │
│ ┌──┴──┐                                           ┌────────┴───┐
│ │     │                                           │            │
│[기본정보][권한]                              [다른 위치 드롭]    │
│ 탭     탭                                         │            │
│ │     │                                           ▼            │
│ ▼     ▼                                    유효성 검증         │
│ 폼 편집 권한 매트릭스                             │            │
│    │        │                              ┌──────┴──────┐     │
│    │        │                              │             │     │
│    │        ▼                         [허용]        [불허]     │
│    │   Role × Permission                   │             │     │
│    │   체크박스 토글                        ▼             ▼     │
│    │        │                         트리 재정렬    원위치    │
│    │        │                         + API 호출     복귀     │
│    │        │                              │                   │
│    └────────┴──────────────────────────────┘                   │
│                          │                                      │
│                          ▼                                      │
│                    [저장 버튼]                                  │
│                          │                                      │
│                          ▼                                      │
│                    변경사항 일괄 저장                           │
│                    + 성공 토스트                                │
│                                                                 │
│  [전체 펼치기/접기]                                             │
│         │                                                       │
│         ▼                                                       │
│    모든 노드 expand/collapse                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 인터랙션:**

| 액션 | 트리거 | 결과 |
|------|--------|------|
| 노드 선택 | 트리 노드 클릭 | 상세 패널 표시 |
| 노드 펼침/접힘 | 화살표 클릭 | 하위 노드 표시/숨김 |
| 노드 이동 | 드래그 앤 드롭 | 트리 구조 변경 |
| 노드 추가 | 추가 버튼 | 하위 노드 생성 모달 |
| 노드 삭제 | 삭제 버튼 | 확인 후 삭제 (하위 포함) |
| 권한 토글 | 체크박스 클릭 | 권한 매트릭스 업데이트 |
| 일괄 권한 설정 | 행/열 헤더 클릭 | 전체 토글 |

**권한 매트릭스 관리:**
```typescript
// 권한 매트릭스 상태
const [permissionMatrix, setPermissionMatrix] = useState<PermissionMatrix>({});

// 단일 권한 토글
const togglePermission = (roleId: string, nodeId: string, permission: string) => {
  setPermissionMatrix(prev => ({
    ...prev,
    [roleId]: {
      ...prev[roleId],
      [nodeId]: {
        ...prev[roleId]?.[nodeId],
        [permission]: !prev[roleId]?.[nodeId]?.[permission]
      }
    }
  }));
};

// 전체 역할에 대한 권한 토글
const toggleRolePermission = (roleId: string, permission: string) => {
  const allNodes = flattenTree(tree);
  const allEnabled = allNodes.every(n => permissionMatrix[roleId]?.[n.id]?.[permission]);

  setPermissionMatrix(prev => {
    const updated = { ...prev };
    allNodes.forEach(node => {
      updated[roleId] = updated[roleId] || {};
      updated[roleId][node.id] = updated[roleId][node.id] || {};
      updated[roleId][node.id][permission] = !allEnabled;
    });
    return updated;
  });
};
```

### 2.13 PortalPage 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                       PortalPage Flow                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [진입] ──→ [인증 상태 확인]                                    │
│                   │                                             │
│         ┌─────────┴─────────┐                                   │
│         │                   │                                   │
│    [미인증]            [인증됨]                                 │
│         │                   │                                   │
│         ▼                   ▼                                   │
│    LoginForm 표시      PortalDashboard 표시                     │
│         │                   │                                   │
│         ▼                   ▼                                   │
│    ┌────┴────┐         ┌────┴────┐                             │
│    │         │         │         │                             │
│ [로그인]  [회원가입]  [KPI 클릭] [퀵 액션]                     │
│    │         │         │         │                             │
│    ▼         ▼         ▼         ▼                             │
│ 인증 API  회원가입   드릴다운    관련 페이지                   │
│ 호출      페이지      패널 열기   이동                         │
│    │         │         │                                       │
│    ▼         │         ▼                                       │
│ ┌──┴──┐      │    상세 데이터 로딩                             │
│ │     │      │         │                                       │
│[성공] [실패]  │         ▼                                       │
│ │     │      │    ┌────┴────┐                                  │
│ ▼     ▼      │    │         │                                  │
│토큰  에러    │ [닫기]    [상세 이동]                           │
│저장  표시    │    │         │                                  │
│ │           │    ▼         ▼                                  │
│ ▼           │ 패널 닫기  상세 페이지                          │
│Dashboard    │                이동                              │
│이동         │                                                  │
│             │                                                  │
│             │    [로그아웃]                                    │
│             │         │                                        │
│             │         ▼                                        │
│             │    토큰 삭제                                     │
│             │         │                                        │
│             └─────────┘                                        │
│                   │                                             │
│                   ▼                                             │
│              LoginForm으로 복귀                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**핵심 인터랙션:**

| 액션 | 트리거 | 결과 |
|------|--------|------|
| 로그인 | 로그인 버튼 | 인증 → 대시보드 이동 |
| 회원가입 | 회원가입 링크 | 회원가입 페이지 |
| 비밀번호 찾기 | 링크 클릭 | 비밀번호 재설정 페이지 |
| KPI 클릭 | 카드 클릭 | 드릴다운 패널/필터링 이동 |
| 퀵 액션 | 버튼 클릭 | 관련 기능 페이지 이동 |
| 로그아웃 | 로그아웃 버튼 | 세션 종료 → 로그인 |

**인증 상태 관리:**
```typescript
// 포털 인증 컨텍스트
const PortalAuthContext = createContext<PortalAuthState | null>(null);

const PortalAuthProvider: React.FC = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = localStorage.getItem('portal_token');
    return { isAuthenticated: !!token, token, user: null };
  });

  // 토큰 검증 및 사용자 정보 로드
  useEffect(() => {
    if (auth.token) {
      validateToken(auth.token)
        .then(user => setAuth(prev => ({ ...prev, user, isAuthenticated: true })))
        .catch(() => {
          localStorage.removeItem('portal_token');
          setAuth({ isAuthenticated: false, token: null, user: null });
        });
    }
  }, [auth.token]);

  const login = async (credentials: Credentials) => {
    const { token, user } = await authApi.login(credentials);
    localStorage.setItem('portal_token', token);
    setAuth({ isAuthenticated: true, token, user });
  };

  const logout = () => {
    localStorage.removeItem('portal_token');
    setAuth({ isAuthenticated: false, token: null, user: null });
  };

  return (
    <PortalAuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </PortalAuthContext.Provider>
  );
};
```

---

## 3. 액션 설계 원칙

### 3.1 액션 우선순위

```
┌─────────────────────────────────────────────────────────────┐
│                    Action Priority                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Primary (주요 액션)                                        │
│  ├── 항상 눈에 띄는 위치                                    │
│  ├── 강조 색상 (Primary Color)                              │
│  └── 예: "저장", "등록", "제출"                             │
│                                                             │
│  Secondary (보조 액션)                                      │
│  ├── Primary 옆에 위치                                      │
│  ├── 중립 색상 (Outline 또는 Ghost)                         │
│  └── 예: "취소", "임시저장", "미리보기"                     │
│                                                             │
│  Tertiary (기타 액션)                                       │
│  ├── 드롭다운 또는 더보기 메뉴                              │
│  ├── 아이콘 버튼 또는 텍스트 링크                           │
│  └── 예: "복사", "내보내기", "인쇄"                         │
│                                                             │
│  Destructive (파괴적 액션)                                  │
│  ├── 시각적 경고 (Red/Danger Color)                         │
│  ├── 확인 모달 필수                                         │
│  └── 예: "삭제", "취소", "철회"                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 액션 배치 규칙

**헤더 영역 (페이지 레벨):**
```
┌─────────────────────────────────────────────────────────────┐
│  [Breadcrumb]                                               │
│  페이지 제목                    [Secondary] [Primary ▶]     │
└─────────────────────────────────────────────────────────────┘
```

**테이블 행 (로우 레벨):**
```
┌───────────┬───────────┬───────────┬─────────────────────────┐
│ 컬럼 1    │ 컬럼 2    │ 컬럼 3    │ [수정] [삭제] [더보기▼] │
└───────────┴───────────┴───────────┴─────────────────────────┘
```

**폼 하단:**
```
┌─────────────────────────────────────────────────────────────┐
│                        [취소]  [임시저장]  [저장 ▶]         │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 상태 기반 액션 제어

```typescript
// Action Registry 패턴
const actionRegistry: ActionConfig[] = [
  {
    id: 'approve',
    label: '승인',
    icon: CheckIcon,
    variant: 'primary',
    // 상태 조건
    visibleWhen: (item) => item.status === 'PENDING',
    // 권한 조건
    allowedRoles: ['MANAGER', 'ADMIN'],
    // 실행 함수
    handler: async (item) => await approveItem(item.id)
  },
  {
    id: 'delete',
    label: '삭제',
    icon: TrashIcon,
    variant: 'danger',
    visibleWhen: (item) => item.status === 'DRAFT',
    allowedRoles: ['ADMIN'],
    confirmMessage: '정말 삭제하시겠습니까?',
    handler: async (item) => await deleteItem(item.id)
  }
];

// 사용
const availableActions = getAvailableActions(item, currentUser);
```

### 3.4 일괄 작업 (Bulk Actions)

```
선택된 항목이 있을 때만 표시
┌─────────────────────────────────────────────────────────────┐
│  ☑ 3개 선택됨  [상태 변경 ▼] [담당자 변경] [삭제] [선택해제]│
└─────────────────────────────────────────────────────────────┘
```

**규칙:**
- 선택 시 Floating 또는 Sticky 영역에 표시
- 선택 개수 명시
- 일괄 적용 불가 항목 처리 (부분 성공 안내)

---

## 4. 피드백 원칙

### 4.1 로딩 상태

| 상황 | 로딩 표시 | 설명 |
|------|----------|------|
| 페이지 초기 로딩 | Skeleton UI | 레이아웃 유지, 콘텐츠 영역 스켈레톤 |
| 데이터 refetch | 인라인 스피너 | 기존 콘텐츠 유지, 비활성화 처리 |
| 버튼 액션 | 버튼 내 스피너 | 버튼 비활성화 + 스피너 |
| 전체 화면 작업 | Overlay 스피너 | 모달 또는 전체 화면 오버레이 |

```typescript
// Skeleton 예시
{isLoading ? (
  <TableSkeleton rows={10} columns={5} />
) : (
  <DataTable data={data} />
)}

// 버튼 로딩 예시
<Button disabled={isSubmitting}>
  {isSubmitting ? <Spinner size="sm" /> : null}
  {isSubmitting ? '저장 중...' : '저장'}
</Button>
```

### 4.2 성공 피드백

```
원칙: 성공은 비차단적으로, 다음 단계로 자연스럽게 유도
```

| 액션 유형 | 피드백 방식 | 예시 |
|-----------|------------|------|
| 저장/등록 | Toast + 페이지 이동 | "등록되었습니다" → 목록으로 이동 |
| 상태 변경 | Toast + 인라인 업데이트 | "승인되었습니다" → 상태 뱃지 변경 |
| 삭제 | Toast + 목록 업데이트 | "삭제되었습니다" → 행 제거 애니메이션 |
| 일괄 작업 | Toast + 결과 요약 | "3건 처리됨 (1건 실패)" |

```typescript
// Toast 패턴
const { showToast } = useToast();

const handleSave = async () => {
  try {
    await saveData(formData);
    showToast({
      type: 'success',
      message: '저장되었습니다.',
      duration: 3000
    });
    navigate('/list');
  } catch (error) {
    showToast({
      type: 'error',
      message: error.message,
      duration: 5000
    });
  }
};
```

### 4.3 에러 피드백

```
원칙: 에러는 구체적으로, 해결 방법과 함께 제시
```

| 에러 유형 | 표시 방식 | 내용 |
|-----------|----------|------|
| 필드 검증 오류 | 인라인 에러 | 필드 하단에 빨간 텍스트 |
| API 오류 (4xx) | Toast + 상세 | 사용자 조치 가능한 메시지 |
| API 오류 (5xx) | Toast + 재시도 | "일시적 오류. 다시 시도해주세요." |
| 네트워크 오류 | 전체 화면 | 오프라인 상태 안내 + 재시도 버튼 |
| 권한 오류 | 페이지 레벨 | 403 페이지 또는 제한 안내 |

```typescript
// 에러 메시지 패턴
const errorMessages: Record<string, string> = {
  DUPLICATE_EMAIL: '이미 등록된 이메일입니다.',
  INVALID_STATUS_TRANSITION: '현재 상태에서는 이 작업을 수행할 수 없습니다.',
  INSUFFICIENT_PERMISSION: '이 작업을 수행할 권한이 없습니다.',
  // ...
};

// 인라인 에러 표시
<FormField>
  <Label>이메일</Label>
  <Input {...register('email')} error={!!errors.email} />
  {errors.email && (
    <ErrorMessage>{errors.email.message}</ErrorMessage>
  )}
</FormField>
```

### 4.4 확인 모달 사용 기준

```
원칙: 되돌릴 수 없거나 중요한 결과를 초래하는 액션에만 사용
```

| 필요 | 불필요 |
|------|--------|
| 삭제 (복구 불가) | 저장 (덮어쓰기 가능) |
| 상태 변경 (승인/반려) | 필터 적용 |
| 대량 작업 | 정렬 변경 |
| 외부 전송 | 탭 이동 |
| 권한 변경 | 검색 |

```typescript
// 확인 모달 컴포넌트
<ConfirmModal
  open={isConfirmOpen}
  title="삭제 확인"
  message="이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
  confirmLabel="삭제"
  confirmVariant="danger"
  onConfirm={handleDelete}
  onCancel={() => setIsConfirmOpen(false)}
/>
```

---

## 5. 키보드 접근성

### 5.1 필수 키보드 지원

| 키 | 동작 | 적용 영역 |
|----|------|----------|
| `Tab` | 다음 포커스 요소 | 전역 |
| `Shift + Tab` | 이전 포커스 요소 | 전역 |
| `Enter` | 액션 실행 / 폼 제출 | 버튼, 링크, 폼 |
| `Escape` | 모달/드롭다운 닫기 | 오버레이 |
| `Space` | 체크박스 토글 | 선택 요소 |
| `Arrow Up/Down` | 목록 탐색 | 드롭다운, 테이블 |
| `Arrow Left/Right` | 탭 전환 | 탭 그룹 |

### 5.2 포커스 관리

```typescript
// 모달 열림 시 포커스 트랩
useEffect(() => {
  if (isOpen) {
    const firstFocusable = modalRef.current?.querySelector('button, input');
    firstFocusable?.focus();
  }
}, [isOpen]);

// 모달 닫힘 시 트리거로 포커스 복귀
const handleClose = () => {
  setIsOpen(false);
  triggerRef.current?.focus();
};
```

### 5.3 Skip Links

```html
<!-- 페이지 최상단 -->
<a href="#main-content" class="skip-link">
  본문으로 바로가기
</a>
<a href="#main-navigation" class="skip-link">
  주 메뉴로 바로가기
</a>
```

---

## 6. 반응형 흐름 조정

### 6.1 브레이크포인트별 레이아웃 변경

| 패턴 | Desktop (≥1024) | Tablet (768-1023) | Mobile (<768) |
|------|-----------------|-------------------|---------------|
| ListPage | 전체 테이블 | 축소 컬럼 | 카드 리스트 |
| DetailPage | 2컬럼 (정보+탭) | 1컬럼 | 1컬럼 (탭 축소) |
| FormPage | 2컬럼 그리드 | 1컬럼 | 1컬럼 |
| Dashboard | 4컬럼 KPI | 2컬럼 KPI | 1컬럼 KPI |
| BoardPage | 3패널 | 2패널 (토글) | 1패널 (탭) |

### 6.2 모바일 터치 최적화

```css
/* 터치 타겟 최소 크기 */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* 스와이프 액션 영역 */
.swipe-action {
  touch-action: pan-x;
}
```

### 6.3 모바일 네비게이션

```
Desktop: 사이드바 LNB (항상 표시)
Tablet:  접힌 사이드바 (아이콘 + 호버 확장)
Mobile:  하단 탭바 + 햄버거 메뉴
```

---

## 7. 성능 최적화 원칙

### 7.1 지연 로딩 전략

| 대상 | 전략 | 구현 |
|------|------|------|
| 라우트 | Code Splitting | `React.lazy()` |
| 탭 콘텐츠 | Lazy Load | 탭 활성화 시 로드 |
| 이미지 | Lazy Load | `loading="lazy"` |
| 무한 스크롤 | Intersection Observer | 뷰포트 진입 시 로드 |
| 모달 | Portal + Lazy | 열림 시 렌더링 |

### 7.2 데이터 페칭 최적화

```typescript
// React Query 캐싱 전략
const { data } = useQuery({
  queryKey: ['users', filters],
  queryFn: () => fetchUsers(filters),
  staleTime: 5 * 60 * 1000, // 5분
  cacheTime: 30 * 60 * 1000, // 30분
  keepPreviousData: true // 필터 변경 시 이전 데이터 유지
});

// Prefetching
const prefetchNextPage = () => {
  queryClient.prefetchQuery({
    queryKey: ['users', { ...filters, page: currentPage + 1 }],
    queryFn: () => fetchUsers({ ...filters, page: currentPage + 1 })
  });
};
```

### 7.3 Optimistic Updates

```typescript
// 낙관적 업데이트 패턴
const mutation = useMutation({
  mutationFn: updateStatus,
  onMutate: async (newStatus) => {
    // 이전 데이터 백업
    const previousData = queryClient.getQueryData(['item', id]);

    // 낙관적 업데이트
    queryClient.setQueryData(['item', id], {
      ...previousData,
      status: newStatus
    });

    return { previousData };
  },
  onError: (err, newStatus, context) => {
    // 롤백
    queryClient.setQueryData(['item', id], context.previousData);
    showToast({ type: 'error', message: '상태 변경에 실패했습니다.' });
  },
  onSettled: () => {
    // 서버 데이터로 동기화
    queryClient.invalidateQueries(['item', id]);
  }
});
```

---

## 8. 접근성 체크리스트

### 8.1 WCAG 2.1 AA 준수 항목

| 원칙 | 항목 | 검증 방법 |
|------|------|----------|
| 인식 | 이미지 대체 텍스트 | alt 속성 확인 |
| 인식 | 색상 대비 4.5:1 | 대비 검사 도구 |
| 인식 | 폼 레이블 연결 | htmlFor/id 매칭 |
| 운용 | 키보드 접근성 | Tab 순서 테스트 |
| 운용 | 포커스 표시 | outline 스타일 확인 |
| 이해 | 에러 메시지 명확성 | 문구 검토 |
| 견고 | 시맨틱 마크업 | HTML 유효성 검사 |

### 8.2 ARIA 사용 가이드

```html
<!-- 동적 콘텐츠 알림 -->
<div role="status" aria-live="polite">
  3개 항목이 로드되었습니다.
</div>

<!-- 에러 연결 -->
<input
  id="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  이메일 형식이 올바르지 않습니다.
</span>

<!-- 모달 -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">확인</h2>
</div>

<!-- 로딩 상태 -->
<button disabled aria-busy="true">
  저장 중...
</button>
```

---

## 9. 체크리스트 요약

### 9.1 개발 시 확인 사항

- [ ] URL이 현재 화면 상태를 반영하는가?
- [ ] 브라우저 뒤로가기가 올바르게 동작하는가?
- [ ] 로딩/에러/빈 상태가 모두 정의되었는가?
- [ ] 파괴적 액션에 확인 모달이 있는가?
- [ ] 키보드만으로 모든 기능을 사용할 수 있는가?
- [ ] 모바일에서 터치 타겟이 충분한가?
- [ ] 에러 메시지가 구체적이고 해결 방법을 제시하는가?

### 9.2 QA 검증 항목

- [ ] 필터/검색 후 URL 공유 시 동일 결과가 표시되는가?
- [ ] 네트워크 지연 시 적절한 로딩 표시가 있는가?
- [ ] API 오류 시 사용자에게 명확한 안내가 표시되는가?
- [ ] 스크린 리더로 주요 흐름을 완료할 수 있는가?
- [ ] 반응형 브레이크포인트에서 레이아웃이 깨지지 않는가?

---

## 참고 자료

- [PAGE_PATTERNS.md](./PAGE_PATTERNS.md) - UI 페이지 패턴 정의
- [UI_STANDARD.md](./UI_STANDARD.md) - 컴포넌트 표준
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Query Documentation](https://tanstack.com/query/latest)
