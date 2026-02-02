# PAGE_PATTERNS.md - 페이지 패턴 표준

## 개요

BizPlatform 코드베이스 분석 및 2025-2026 엔터프라이즈 UI 트렌드를 반영하여 정의된 표준 페이지 패턴입니다.

> **Multi-LLM 협업 분석 결과**
> - GPT-5.2: 기술/패턴 관점 분석
> - Gemini-3-Pro: UX/사용자 동선 관점 분석

---

## 1. ListPage 패턴

### 1.1 구조

```
┌─────────────────────────────────────────────────────┐
│ PageHeader                                          │
│ [Title] [Icon]                    [Toolbar Actions] │
├─────────────────────────────────────────────────────┤
│ StatusSummaryCards                                  │
│ [전체:N] [상태1:N] [상태2:N] [상태3:N] ...          │
├─────────────────────────────────────────────────────┤
│ FilterBar                                           │
│ [Search] [Filter1] [Filter2] [DateRange] [검색][초기화]│
├─────────────────────────────────────────────────────┤
│ TableToolbar                                        │
│ 총 N건          [PageSize▼] [새로고침] [신규등록]   │
├─────────────────────────────────────────────────────┤
│ DataTable                                           │
│ ┌────┬────────┬────────┬────────┬────────┐         │
│ │ No │ Column1│ Column2│ Status │ Actions│         │
│ ├────┼────────┼────────┼────────┼────────┤         │
│ │ 1  │  ...   │  ...   │ Badge  │ [E][D] │         │
│ │ 2  │  ...   │  ...   │ Badge  │ [E][D] │         │
│ └────┴────────┴────────┴────────┴────────┘         │
├─────────────────────────────────────────────────────┤
│ Pagination                                          │
│        [<] Page X / Y (총 N건) [>]                  │
└─────────────────────────────────────────────────────┘
```

### 1.2 필수 컴포넌트

| 컴포넌트 | 필수 여부 | 설명 |
|---------|---------|------|
| PageHeader | 필수 | 제목, 아이콘, 액션 버튼 |
| StatusSummaryCards | 권장 | 상태별 카운트, 클릭 시 필터링 |
| FilterBar | 필수 | 검색/필터 조건 |
| TableToolbar | 필수 | 건수, 페이지 크기, 새로고침, 등록 버튼 |
| DataTable | 필수 | 데이터 목록 |
| Pagination | 필수 | 페이지 네비게이션 |

### 1.3 상태 관리

```typescript
interface ListPageState {
  // Query State (URL 동기화 필수)
  filters: {
    keyword: string;
    status: string[];
    dateRange: { from: string; to: string };
    [key: string]: any;
  };
  sort: { field: string; order: 'asc' | 'desc' };
  pagination: { page: number; size: number };

  // Server State
  data: T[];
  total: number;
  loading: boolean;
  error: Error | null;

  // UI State
  selectedIds: string[];
  statusSummary: Record<string, number>;
}
```

### 1.4 사용 시나리오

- 사용자/공급자/품질이슈/프로젝트 관리 목록
- 마스터 데이터 조회 및 관리

---

## 2. Dashboard 패턴

### 2.1 구조

```
┌─────────────────────────────────────────────────────┐
│ PageHeader                                          │
│ [Icon] [Title]                        [새로고침]   │
├─────────────────────────────────────────────────────┤
│ KPI Cards (Grid: 4열)                               │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │[Icon]    │ │[Icon]    │ │[Icon]    │ │[Icon]    │ │
│ │  N       │ │  N       │ │  N       │ │  N       │ │
│ │ Label    │ │ Label    │ │ Label    │ │ Label    │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
├─────────────────────────────────────────────────────┤
│ Chart Panels (Grid: 2열)                            │
│ ┌────────────────────┐ ┌────────────────────┐       │
│ │ Chart Title        │ │ Chart Title        │       │
│ │                    │ │                    │       │
│ │    [Chart]         │ │    [Chart]         │       │
│ │                    │ │                    │       │
│ └────────────────────┘ └────────────────────┘       │
├─────────────────────────────────────────────────────┤
│ Quick Actions (Grid: 3열)                           │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│ │[Icon]    │ │[Icon]    │ │[Icon]    │              │
│ │ Action1  │ │ Action2  │ │ Action3  │              │
│ └──────────┘ └──────────┘ └──────────┘              │
└─────────────────────────────────────────────────────┘
```

### 2.2 필수 컴포넌트

| 컴포넌트 | 필수 여부 | 설명 |
|---------|---------|------|
| PageHeader | 필수 | 제목, 새로고침 |
| KpiCards | 필수 | 핵심 지표 (클릭 시 드릴다운) |
| ChartPanels | 권장 | 데이터 시각화 |
| QuickActions | 권장 | 빠른 실행 버튼 |

### 2.3 드릴다운 규칙

```typescript
// KPI 카드 클릭 시 ListPage로 이동하며 필터 전달
interface DrilldownConfig {
  targetRoute: string;
  filterMapping: Record<string, any>;
}

// 예시
const kpiDrilldown = {
  targetRoute: '/incidents',
  filterMapping: { status: 'IN_PROGRESS' }
};
```

### 2.4 사용 시나리오

- CAPA 대시보드, LIMS 대시보드
- 부서별/기능별 현황 모니터링

---

## 3. DetailPage 패턴

### 3.1 구조

```
┌─────────────────────────────────────────────────────┐
│ PageHeader (Sticky)                                 │
│ [← Back] [Title] [StatusBadge]    [Actions...]     │
├─────────────────────────────────────────────────────┤
│ InfoCard                                            │
│ ┌──────────────────────────────────────────────┐   │
│ │ Label1: Value1    │ Label2: Value2           │   │
│ │ Label3: Value3    │ Label4: Value4           │   │
│ └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│ Tabs                                                │
│ [Tab1] [Tab2] [Tab3] [Tab4]                        │
├─────────────────────────────────────────────────────┤
│ TabContent                                          │
│ ┌──────────────────────────────────────────────┐   │
│ │                                              │   │
│ │   (선택된 탭의 콘텐츠)                       │   │
│ │                                              │   │
│ └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 3.2 필수 컴포넌트

| 컴포넌트 | 필수 여부 | 설명 |
|---------|---------|------|
| PageHeader | 필수 | 뒤로가기, 제목, 상태 배지, 액션 버튼 |
| InfoCard | 필수 | 기본 정보 그리드 (2~4열) |
| Tabs | 권장 | 탭 네비게이션 (URL 동기화 권장) |
| TabContent | 필수 | 탭별 콘텐츠 영역 |

### 3.3 상태 기반 액션

```typescript
interface ActionConfig {
  id: string;
  label: string;
  icon: React.ComponentType;
  variant: 'primary' | 'secondary' | 'danger';
  allowedStates: string[];      // 허용된 상태 목록
  requiredRoles?: string[];     // 필요 권한
  confirm?: { title: string; message: string };
  action: (entity: T) => Promise<void>;
}

// Action Registry 예시
const detailActions: ActionConfig[] = [
  {
    id: 'approve',
    label: '승인',
    icon: CheckCircle,
    variant: 'primary',
    allowedStates: ['PENDING', 'REVIEW'],
    requiredRoles: ['ADMIN', 'MANAGER'],
    action: async (entity) => { /* ... */ }
  }
];
```

### 3.4 사용 시나리오

- CAPA 상세, BOM 상세, 고객 상세
- 단일 엔티티의 모든 정보 조회 및 관리

---

## 4. FormPage 패턴

### 4.1 구조

```
┌─────────────────────────────────────────────────────┐
│ PageHeader                                          │
│ [← Back] [Title: 등록/수정]                         │
├─────────────────────────────────────────────────────┤
│ FormSection: 기본 정보                              │
│ ┌──────────────────────────────────────────────┐   │
│ │ Field1*: [Input    ] │ Field2: [Select  ▼]  │   │
│ │ Field3*: [TextArea             ]            │   │
│ └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│ FormSection: 상세 정보                              │
│ ┌──────────────────────────────────────────────┐   │
│ │ ...                                          │   │
│ └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│ FormActions (Sticky)                                │
│                              [취소] [저장(Primary)] │
└─────────────────────────────────────────────────────┘
```

### 4.2 필수 컴포넌트

| 컴포넌트 | 필수 여부 | 설명 |
|---------|---------|------|
| PageHeader | 필수 | 뒤로가기, 제목 (등록/수정 구분) |
| FormSection | 필수 | 섹션별 필드 그룹핑 |
| FormField | 필수 | 라벨, 입력, 에러 메시지 |
| FormActions | 필수 | 취소, 저장 버튼 (Sticky 권장) |

### 4.3 폼 상태 관리

```typescript
interface FormPageState {
  mode: 'create' | 'edit';
  entity: Partial<T>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isDirty: boolean;
  isSubmitting: boolean;
}

// Dirty Form Guard 필수
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isDirty]);
```

### 4.4 사용 시나리오

- 사용자/공급자/CAPA/BOM 등록 및 수정
- 데이터 입력이 필요한 모든 화면

---

## 5. BoardPage 패턴 (Multi-Panel)

### 5.1 구조 (3-Panel)

```
┌────────────────────────────────────────────────────────────────┐
│ PageHeader                                                     │
│ [Icon] [Title]                    [날짜 네비게이션] [Actions]  │
├────────────────────────────────────────────────────────────────┤
│ KPI Strip                                                      │
│ [미배정 N] [금일 WO N] [평균응답 Nh] [SLA위험 N] [배정률 N%]   │
├─────────────────┬────────────────────────┬─────────────────────┤
│ Left Panel      │ Center Panel           │ Right Panel         │
│ (미배정 목록)   │ (스케줄 보드)          │ (지도/상세)         │
│ ┌─────────────┐ │ ┌──────────────────┐   │ ┌─────────────────┐ │
│ │ [DnD Card]  │ │ │ Schedule Grid    │   │ │ Map / Detail    │ │
│ │ [DnD Card]  │ │ │                  │   │ │                 │ │
│ │ [DnD Card]  │ │ │                  │   │ │                 │ │
│ └─────────────┘ │ └──────────────────┘   │ └─────────────────┘ │
│ [시뮬레이션]    │                        │ [동선 정보]         │
└─────────────────┴────────────────────────┴─────────────────────┘
```

### 5.2 패널 간 통신 규칙

```typescript
interface PanelContract {
  // 공유 상태
  selectedIds: string[];
  focusedId: string | null;
  dateContext: Date;

  // 이벤트
  onSelect: (ids: string[]) => void;
  onFocus: (id: string | null) => void;
  onDrop: (itemId: string, targetId: string, slot: number) => void;
}
```

### 5.3 사용 시나리오

- 서비스 배차 관리 (Dispatch Board)
- 칸반 보드, 일정 관리

---

## 6. MasterDetailPage 패턴

### 6.1 구조

```
┌─────────────────────────────────────────────────────────────┐
│ PageHeader                                                  │
│ [Icon] [Title]                              [새로고침]      │
├─────────────────────────────────────────────────────────────┤
│ KPI Cards                                                   │
│ [Card1] [Card2] [Card3] [Card4]                            │
├────────────────────────┬────────────────────────────────────┤
│ Master Panel           │ Detail Panel                       │
│ (목록/검색)            │ (탭 기반 상세)                     │
│ ┌────────────────────┐ │ ┌────────────────────────────────┐ │
│ │ [Search]           │ │ │ [Tab1] [Tab2] [Tab3] [Tab4]    │ │
│ │ ┌────────────────┐ │ │ ├────────────────────────────────┤ │
│ │ │ Item (selected)│ │ │ │                                │ │
│ │ │ Item           │ │ │ │   Tab Content                  │ │
│ │ │ Item           │ │ │ │                                │ │
│ │ └────────────────┘ │ │ └────────────────────────────────┘ │
│ └────────────────────┘ │                                    │
└────────────────────────┴────────────────────────────────────┘
```

### 6.2 키보드 네비게이션

```typescript
// 키보드 네비게이션 필수 지원
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
      selectPrevious();
      break;
    case 'ArrowDown':
      selectNext();
      break;
    case 'Enter':
      openDetail();
      break;
  }
};
```

### 6.3 사용 시나리오

- 스마트 서비스 센터
- 고객별 자산/이력 관리

---

## 7. TreePage 패턴

### 7.1 구조

```
┌─────────────────────────────────────────────────────────────┐
│ PageHeader                                                  │
│ [Icon] [Title: LOT 추적]                                    │
├─────────────────────────────────────────────────────────────┤
│ SearchBar                                                   │
│ [LOT번호 검색] [추적방향 ▼] [최대깊이 ▼] [추적]            │
├─────────────────────────────────────────────────────────────┤
│ EntityInfo (선택적)                                         │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ LOT번호: xxx  │ 유형: xxx │ 품목: xxx │ 상태: Badge     ││
│ └──────────────────────────────────────────────────────────┘│
├──────────────────────────┬──────────────────────────────────┤
│ Backward Tree            │ Forward Tree                     │
│ (역추적: 상위 LOT)       │ (정추적: 하위 LOT)               │
│ ┌──────────────────────┐ │ ┌──────────────────────────────┐ │
│ │ ▼ Node               │ │ │ ▼ Node                       │ │
│ │   ├── Child          │ │ │   ├── Child                  │ │
│ │   └── Child          │ │ │   └── Child                  │ │
│ └──────────────────────┘ │ └──────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Legend                                                      │
│ [ACTIVE] [HOLD] [CONSUMED] [RAW] [WIP] [FG]                │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 트리 어댑터 인터페이스

```typescript
interface TreeAdapter<T> {
  getRootNodes: (query: string) => Promise<T[]>;
  getChildren: (nodeId: string) => Promise<T[]>;
  search: (term: string) => Promise<T[]>;
  getTrace?: (nodeId: string, direction: 'forward' | 'backward') => Promise<T>;
}
```

### 7.3 사용 시나리오

- LOT 추적 (정추적/역추적)
- BOM 트리, 조직도

---

## 8. 공통 컴포넌트 명세

### 8.1 PageHeader

```typescript
interface PageHeaderProps {
  title: string;
  icon?: React.ComponentType;
  backUrl?: string;
  statusBadge?: { label: string; variant: string };
  actions?: ActionConfig[];
  breadcrumbs?: { label: string; href: string }[];
}
```

### 8.2 StatusSummaryCards

```typescript
interface StatusSummaryCardsProps {
  items: Array<{
    key: string;
    label: string;
    count: number;
    color: string;
    icon?: React.ComponentType;
  }>;
  activeKeys: string[];
  mode: 'single' | 'multi';
  onChange: (keys: string[]) => void;
}
```

### 8.3 DataTable

```typescript
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;

  // 선택
  selectable?: boolean;
  selectedIds?: string[];
  onSelect?: (ids: string[]) => void;

  // 정렬
  sortable?: boolean;
  sort?: { field: string; order: 'asc' | 'desc' };
  onSort?: (sort: { field: string; order: 'asc' | 'desc' }) => void;

  // Row 액션
  onRowClick?: (row: T) => void;
  onRowContextMenu?: (row: T, event: MouseEvent) => void;
  rowActions?: RowActionConfig<T>[];

  // 가상화 (대용량)
  virtualized?: boolean;
  estimatedRowHeight?: number;
}
```

---

## 9. 성능 최적화 가이드

### 9.1 ListPage

- 서버사이드 pagination/sort/filter 필수
- 테이블 row virtualization (200+ rows)
- 검색 입력 debounce (300ms)
- 상태 카운트 API 분리 (동일 쿼리 키 규칙)

### 9.2 Dashboard

- 패널 독립 fetch + stale-while-revalidate
- 차트 데이터 downsampling
- 드릴다운 클릭 시 prefetch

### 9.3 DetailPage

- 탭 lazy loading
- 부분 갱신 (전체 refetch 지양)

### 9.4 FormPage

- 필드별 subscription으로 리렌더 최소화
- Uncontrolled 컴포넌트 적극 활용

### 9.5 BoardPage

- DnD + 가상화 충돌 주의
- 패널 간 상태 업데이트 throttle
- 지도/스케줄 렌더 최적화

---

## 10. 접근성 체크리스트

- [ ] 키보드 네비게이션 지원 (Tab, Enter, Arrow)
- [ ] Focus 관리 (모달 열림/닫힘 시)
- [ ] 색상 외 시각적 구분 (아이콘, 텍스트)
- [ ] 충분한 색상 대비 (WCAG AA)
- [ ] 의미론적 HTML 사용
- [ ] aria-label 적용

---

## 8. WorkflowPage 패턴

### 8.1 구조

```
┌─────────────────────────────────────────────────────────────────┐
│ PageHeader                                                      │
│ [Icon] [Title: 워크플로우명]                    [취소] [임시저장]│
├─────────────────────────────────────────────────────────────────┤
│ WorkflowStepper                                                 │
│ ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐      │
│ │ (1) │───│ (2) │───│ (3) │───│ (4) │───│ (5) │───│ (6) │      │
│ │Done │   │Curr │   │     │   │     │   │     │   │     │      │
│ └─────┘   └─────┘   └─────┘   └─────┘   └─────┘   └─────┘      │
│ Step1     Step2     Step3     Step4     Step5     Summary       │
├──────────────────────────────────────────┬──────────────────────┤
│ StepContent                              │ SummarySidebar       │
│ ┌──────────────────────────────────────┐ │ ┌──────────────────┐ │
│ │                                      │ │ │ 입력 요약        │ │
│ │   (현재 스텝 콘텐츠)                 │ │ │ ─────────────    │ │
│ │   - Form Fields                      │ │ │ Step1: ✓        │ │
│ │   - Data Tables                      │ │ │ Step2: 진행중   │ │
│ │   - Selections                       │ │ │ Step3: 대기     │ │
│ │                                      │ │ │ ...             │ │
│ └──────────────────────────────────────┘ │ └──────────────────┘ │
├──────────────────────────────────────────┴──────────────────────┤
│ StepNavigation                                                  │
│               [← 이전]                      [다음 →] / [완료]   │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 필수 컴포넌트

| 컴포넌트 | 필수 여부 | 설명 |
|---------|---------|------|
| PageHeader | 필수 | 제목, 취소/임시저장 버튼 |
| WorkflowStepper | 필수 | 단계 표시 (완료/현재/대기/잠금 상태) |
| StepContent | 필수 | 현재 단계의 콘텐츠 영역 |
| SummarySidebar | 권장 | 이전 단계 입력 요약 |
| StepNavigation | 필수 | 이전/다음/완료 버튼 |

### 8.3 상태 관리

```typescript
interface WorkflowState<T> {
  // 워크플로우 메타
  workflowId: string;
  currentStep: number;
  totalSteps: number;

  // 스텝별 상태
  steps: Array<{
    id: string;
    label: string;
    status: 'completed' | 'current' | 'upcoming' | 'locked';
    data: Partial<T>;
    validation: { isValid: boolean; errors: string[] };
  }>;

  // 전체 데이터
  formData: T;
  isDirty: boolean;

  // 네비게이션 검증
  canProceedToStep: (stepIndex: number) => boolean;
}

// 워크플로우 Hook 패턴
function useWorkflow<T>(config: WorkflowConfig<T>) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  const goToStep = (index: number) => {
    if (state.canProceedToStep(index)) {
      dispatch({ type: 'GO_TO_STEP', payload: index });
    }
  };

  const nextStep = async () => {
    const validation = await validateCurrentStep();
    if (validation.isValid) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  return { state, goToStep, nextStep, prevStep, submit };
}
```

### 8.4 사용 시나리오

- 생산계획 워크플로우 (MasterPlanningWorkflow)
- 품질이슈 처리 워크플로우 (IncidentWorkflowPage)
- 신용회의 워크플로우 (CreditMeetingWorkflow)
- 신규 NPD 프로세스

### 8.5 BizPlatform 참조

- `features/mes/planning/MasterPlanningWorkflow.tsx` - 6단계 생산계획
- `features/qms/incident/IncidentWorkflowPage.tsx` - 10단계 품질이슈
- `features/crm/credit/CreditMeetingWorkflow.tsx` - 5단계 신용회의

---

## 9. StageGatePage 패턴

### 9.1 구조

```
┌─────────────────────────────────────────────────────────────────┐
│ PageHeader                                                      │
│ [Icon] [프로젝트/BMC명]                 [상태: 현재 Stage]      │
├─────────────────────────────────────────────────────────────────┤
│ GateStepper                                                     │
│ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐     │
│ │ G0   │  │ G1   │  │ G2   │  │ G3   │  │ G4   │  │ G5   │     │
│ │ ✓    │  │ ✓    │  │ ●    │  │ ○    │  │ ○    │  │ 🔒   │     │
│ │PASS  │  │PASS  │  │CURR  │  │      │  │      │  │LOCK  │     │
│ └──────┘  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘     │
│ Concept   Feasibility Design  Develop  Validate  Launch        │
├─────────────────────────────────────────────────────────────────┤
│ StageContent                                                    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Tabs: [요구사항] [산출물] [체크리스트] [승인이력]           │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │                                                             │ │
│ │   (현재 Stage 콘텐츠)                                       │ │
│ │   - 산출물 체크리스트                                       │ │
│ │   - 승인 조건                                               │ │
│ │   - 리뷰 코멘트                                             │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ GateApprovalActions                                             │
│    [반려 사유 입력]              [조건부 승인] [승인] [반려]    │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 필수 컴포넌트

| 컴포넌트 | 필수 여부 | 설명 |
|---------|---------|------|
| PageHeader | 필수 | 프로젝트명, 현재 Stage 상태 |
| GateStepper | 필수 | Gate 진행 상태 (PASS/FAIL/CONDITIONAL/PENDING) |
| StageContent | 필수 | 현재 Stage의 상세 정보 |
| GateApprovalActions | 필수 | 승인/반려/조건부승인 버튼 |

### 9.3 상태 관리

```typescript
interface StageGateState {
  projectId: string;
  currentGate: number;
  gates: Array<{
    id: string;
    name: string;
    status: 'passed' | 'failed' | 'conditional' | 'current' | 'upcoming' | 'locked';
    approvedAt?: Date;
    approvedBy?: string;
    conditions?: string[];
    deliverables: Array<{
      id: string;
      name: string;
      required: boolean;
      completed: boolean;
    }>;
  }>;

  // 승인 권한 체크
  canApprove: boolean;
  approvalHistory: ApprovalRecord[];
}

// Gate 승인 결과 타입
type GateDecision = 'PASS' | 'FAIL' | 'CONDITIONAL';

interface GateApprovalPayload {
  decision: GateDecision;
  comment: string;
  conditions?: string[];  // CONDITIONAL인 경우
}
```

### 9.4 사용 시나리오

- NPD Gate 관리 (G0~G5)
- BMC Stage 진행 (7단계)
- 투자 심사 프로세스
- 품질 인증 게이트

### 9.5 BizPlatform 참조

- `features/plm/npd/components/GateStepper.tsx` - NPD Gate 관리
- `features/plm/bmc/BmcEditorPage.tsx` - BMC 7-Stage 프로세스

---

## 10. TimelinePage 패턴

### 10.1 구조

```
┌─────────────────────────────────────────────────────────────────┐
│ PageHeader                                                      │
│ [Icon] [프로젝트 타임라인]                        [필터] [추가] │
├─────────────────────────────────────────────────────────────────┤
│ TimelineFilters                                                 │
│ [전체] [진행중] [완료] [지연] [Critical Path ○]                │
├─────────────────────────────────────────────────────────────────┤
│ TimelineView                                                    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ○──── 2025-01-15: 마일스톤 1 (완료)                        │ │
│ │ │     ├─ Task 1-1 ✓                                        │ │
│ │ │     └─ Task 1-2 ✓                                        │ │
│ │ │                                                          │ │
│ │ ●──── 2025-02-01: 마일스톤 2 (진행중) ⚠ Critical          │ │
│ │ │     ├─ Task 2-1 ✓        [Progress: ████░░ 70%]         │ │
│ │ │     ├─ Task 2-2 🔄                                       │ │
│ │ │     └─ Task 2-3 ○                                        │ │
│ │ │                                                          │ │
│ │ ○──── 2025-03-01: 마일스톤 3 (예정)                        │ │
│ │       ├─ Task 3-1 ○                                        │ │
│ │       └─ Task 3-2 ○                                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ TimelineLegend                                                  │
│ [✓ 완료] [🔄 진행] [○ 예정] [⚠ 지연] [★ Critical Path]         │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 필수 컴포넌트

| 컴포넌트 | 필수 여부 | 설명 |
|---------|---------|------|
| PageHeader | 필수 | 제목, 필터, 추가 버튼 |
| TimelineFilters | 권장 | 상태 필터, Critical Path 토글 |
| TimelineView | 필수 | 수직 타임라인 뷰 |
| TimelineLegend | 권장 | 상태 범례 |

### 10.3 상태 관리

```typescript
interface TimelineState {
  items: TimelineItem[];
  filter: {
    status: ('completed' | 'in_progress' | 'pending' | 'delayed')[];
    showCriticalPath: boolean;
    dateRange?: { from: Date; to: Date };
  };
  expandedItems: Set<string>;
}

interface TimelineItem {
  id: string;
  type: 'milestone' | 'task' | 'event';
  title: string;
  date: Date;
  status: 'completed' | 'in_progress' | 'pending' | 'delayed';
  progress?: number;  // 0-100
  isCriticalPath?: boolean;
  children?: TimelineItem[];
  metadata?: Record<string, any>;
}

// Timeline 액션
interface TimelineActions {
  onItemClick: (item: TimelineItem) => void;
  onAddItem: (parentId?: string) => void;
  onEditItem: (item: TimelineItem) => void;
  onDeleteItem: (itemId: string) => void;
  onProgressUpdate: (itemId: string, progress: number) => void;
}
```

### 10.4 사용 시나리오

- 프로젝트 마일스톤 관리
- 제품 개발 일정
- 릴리스 로드맵
- 이벤트 히스토리

### 10.5 BizPlatform 참조

- `features/pms/project/components/MilestoneTimeline.tsx`

---

## 11. CanvasPage 패턴

### 11.1 구조

```
┌─────────────────────────────────────────────────────────────────┐
│ PageHeader                                                      │
│ [Icon] [캔버스명]        [저장] [내보내기] [공유] [버전 히스토리]│
├──────────────────────────────────┬──────────────────────────────┤
│ CanvasSidebar                    │ CanvasGrid                   │
│ ┌──────────────────────────────┐ │ ┌──────────────────────────┐ │
│ │ 요소 팔레트                  │ │ │  Key      │ Key         │ │
│ │ ┌────┐ ┌────┐ ┌────┐        │ │ │ Partners  │ Activities  │ │
│ │ │ 📦 │ │ 👥 │ │ 💰 │        │ │ ├──────────┼─────────────┤ │
│ │ └────┘ └────┘ └────┘        │ │ │ Key       │ Value       │ │
│ │                              │ │ │ Resources │ Propositions│ │
│ │ 단계 진행                    │ │ ├──────────┼─────────────┤ │
│ │ ┌────────────────────────┐  │ │ │ Customer  │ Customer    │ │
│ │ │ [1]─[2]─[3]─[4]─[5]   │  │ │ │ Relations │ Segments    │ │
│ │ │ ●   ○   ○   ○   ○     │  │ │ ├──────────┴─────────────┤ │
│ │ └────────────────────────┘  │ │ │ Cost Structure │ Revenue │ │
│ │                              │ │ └────────────────┴─────────┘ │
│ │ 검증 상태                    │ │                              │
│ │ [가설: 5] [검증중: 2] [✓: 3]│ │ (드래그앤드롭으로 요소 추가) │
│ └──────────────────────────────┘ │ └──────────────────────────┘ │
├──────────────────────────────────┴──────────────────────────────┤
│ CanvasActions                                                   │
│ [확대] [축소] [맞춤] [그리드 토글]        [실행취소] [다시실행] │
└─────────────────────────────────────────────────────────────────┘
```

### 11.2 필수 컴포넌트

| 컴포넌트 | 필수 여부 | 설명 |
|---------|---------|------|
| PageHeader | 필수 | 캔버스명, 저장/내보내기/공유 액션 |
| CanvasSidebar | 권장 | 요소 팔레트, 단계 진행, 검증 상태 |
| CanvasGrid | 필수 | 그리드 기반 캔버스 영역 |
| CanvasActions | 권장 | 줌, 실행취소/다시실행 컨트롤 |

### 11.3 상태 관리

```typescript
interface CanvasState {
  id: string;
  name: string;
  template: 'bmc' | 'lean' | 'custom';

  // 그리드 구조
  grid: {
    rows: number;
    cols: number;
    cells: GridCell[];
  };

  // 요소
  elements: CanvasElement[];

  // 단계 관리
  currentStage: number;
  stages: Array<{
    id: number;
    name: string;
    status: 'completed' | 'current' | 'upcoming';
  }>;

  // 실행취소/다시실행
  history: CanvasState[];
  historyIndex: number;

  // 협업
  collaborators: Collaborator[];
  lastSavedAt: Date;
}

interface CanvasElement {
  id: string;
  cellId: string;
  type: 'hypothesis' | 'validated' | 'testing' | 'note';
  content: string;
  validationStatus: 'hypothesis' | 'testing' | 'validated' | 'invalidated';
  createdBy: string;
  createdAt: Date;
}

// 캔버스 액션
interface CanvasActions {
  addElement: (cellId: string, element: Omit<CanvasElement, 'id'>) => void;
  updateElement: (elementId: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (elementId: string) => void;
  moveElement: (elementId: string, targetCellId: string) => void;
  undo: () => void;
  redo: () => void;
  save: () => Promise<void>;
}
```

### 11.4 사용 시나리오

- Business Model Canvas 편집
- Lean Canvas
- 전략 맵
- 마인드맵

### 11.5 BizPlatform 참조

- `features/plm/bmc/BmcEditorPage.tsx` - BMC 9블록 편집기

---

## 12. GraphPage 패턴

### 12.1 구조

```
┌─────────────────────────────────────────────────────────────────┐
│ PageHeader                                                      │
│ [Icon] [네트워크 그래프]                    [필터] [내보내기]   │
├─────────────────────────────────────────────────────────────────┤
│ GraphFilters                                                    │
│ [노드 유형 ▼] [연결 강도 ▼] [레이어 ▼]          [검색...]     │
├────────────────────────────────────────┬────────────────────────┤
│ GraphCanvas                            │ GraphSidebar           │
│ ┌────────────────────────────────────┐ │ ┌────────────────────┐ │
│ │                                    │ │ │ 선택된 노드        │ │
│ │      ○───────○                     │ │ │ ────────────────   │ │
│ │     /│\     /│                     │ │ │ [고객사 A]         │ │
│ │    ○ ○ ○   ○ │                     │ │ │ 유형: 고객         │ │
│ │      │      \│                     │ │ │ 연결: 12개         │ │
│ │      ○───────●                     │ │ │                    │ │
│ │              │\                    │ │ │ 연결 목록          │ │
│ │              ○ ○                   │ │ │ - 담당자 3명       │ │
│ │                                    │ │ │ - 영업활동 5건     │ │
│ │                                    │ │ │ - 매출 4건         │ │
│ └────────────────────────────────────┘ │ └────────────────────┘ │
├────────────────────────────────────────┴────────────────────────┤
│ GraphLegend                                                     │
│ [● 고객] [● 담당자] [● 영업활동] [● 매출] [─ 연결]              │
├─────────────────────────────────────────────────────────────────┤
│ GraphControls                                                   │
│ [줌인] [줌아웃] [맞춤] [중앙정렬]           [레이아웃 ▼]        │
└─────────────────────────────────────────────────────────────────┘
```

### 12.2 필수 컴포넌트

| 컴포넌트 | 필수 여부 | 설명 |
|---------|---------|------|
| PageHeader | 필수 | 제목, 필터, 내보내기 |
| GraphFilters | 권장 | 노드/엣지 필터, 검색 |
| GraphCanvas | 필수 | Force-directed 그래프 렌더링 |
| GraphSidebar | 권장 | 선택된 노드/엣지 상세 정보 |
| GraphLegend | 권장 | 노드/엣지 유형 범례 |
| GraphControls | 필수 | 줌, 레이아웃 컨트롤 |

### 12.3 상태 관리

```typescript
interface GraphState {
  // 그래프 데이터
  nodes: GraphNode[];
  edges: GraphEdge[];

  // 필터
  filters: {
    nodeTypes: string[];
    edgeTypes: string[];
    minConnections: number;
  };

  // 선택 상태
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  highlightedNodes: Set<string>;  // 연결된 노드 하이라이트

  // 뷰 상태
  zoom: number;
  center: { x: number; y: number };
  layout: 'force' | 'radial' | 'hierarchical';
}

interface GraphNode {
  id: string;
  type: string;
  label: string;
  data: Record<string, any>;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
}

interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  weight?: number;
  label?: string;
}

// 그래프 인터랙션
interface GraphInteractions {
  onNodeClick: (node: GraphNode) => void;
  onNodeHover: (node: GraphNode | null) => void;
  onNodeDrilldown: (node: GraphNode) => void;  // 서브그래프 탐색
  onEdgeClick: (edge: GraphEdge) => void;
  onBackgroundClick: () => void;
}
```

### 12.4 사용 시나리오

- 고객 네트워크 분석
- 조직도 시각화
- 의존성 그래프
- 연관관계 분석

### 12.5 BizPlatform 참조

- `features/crm/network/CustomerNetworkPage.tsx` - Force-directed 2D 그래프
- 사용 라이브러리: `react-force-graph-2d`

---

## 13. ScheduleGridPage 패턴

### 13.1 구조

```
┌─────────────────────────────────────────────────────────────────┐
│ PageHeader                                                      │
│ [Icon] [스케줄 보드]              [← 이전주] 2월 1주 [다음주 →] │
├─────────────────────────────────────────────────────────────────┤
│ ScheduleFilters                                                 │
│ [담당자 ▼] [지역 ▼] [우선순위 ▼]                [자동배정]    │
├────────────────────┬────────────────────────────────────────────┤
│ UnassignedPool     │ ScheduleGrid                               │
│ ┌────────────────┐ │ ┌──────────────────────────────────────┐   │
│ │ 미배정 작업    │ │ │      │ 월  │ 화  │ 수  │ 목  │ 금  │   │
│ │ ─────────────  │ │ ├──────┼─────┼─────┼─────┼─────┼─────┤   │
│ │ [DnD Card]     │ │ │ 홍길동│ ■■  │ ■   │     │ ■■  │     │   │
│ │ [DnD Card]     │ │ │ 김철수│     │ ■   │ ■■  │     │ ■   │   │
│ │ [DnD Card]     │ │ │ 이영희│ ■   │     │ ■   │ ■   │ ■■  │   │
│ │ [DnD Card]     │ │ │ 박지민│ ■■  │ ■■  │     │ ■■  │     │   │
│ │                │ │ └──────────────────────────────────────┘   │
│ │ ─────────────  │ │                                            │
│ │ 🔴 긴급: 3     │ │ 범례: [🔴 긴급] [🟠 높음] [🟢 보통]       │
│ │ 🟠 높음: 5     │ │                                            │
│ │ 🟢 보통: 8     │ │                                            │
│ └────────────────┘ │                                            │
└────────────────────┴────────────────────────────────────────────┘
```

### 13.2 필수 컴포넌트

| 컴포넌트 | 필수 여부 | 설명 |
|---------|---------|------|
| PageHeader | 필수 | 제목, 주간 네비게이션 |
| ScheduleFilters | 권장 | 담당자/지역/우선순위 필터 |
| UnassignedPool | 필수 | 미배정 작업 목록 (DnD 소스) |
| ScheduleGrid | 필수 | Row×Column 스케줄 그리드 (DnD 타겟) |

### 13.3 상태 관리

```typescript
interface ScheduleGridState {
  // 날짜 범위
  dateRange: {
    start: Date;
    end: Date;
    unit: 'day' | 'week' | 'month';
  };

  // 행 (리소스)
  rows: Array<{
    id: string;
    name: string;
    type: 'technician' | 'room' | 'equipment';
    capacity: number;
  }>;

  // 배정된 작업
  assignments: ScheduleAssignment[];

  // 미배정 작업
  unassigned: ScheduleItem[];

  // DnD 상태
  draggingItem: ScheduleItem | null;
  dropTarget: { rowId: string; date: Date } | null;
}

interface ScheduleAssignment {
  id: string;
  itemId: string;
  rowId: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
}

// DnD 핸들러
interface ScheduleDnD {
  onDragStart: (item: ScheduleItem) => void;
  onDragOver: (rowId: string, date: Date) => void;
  onDrop: (item: ScheduleItem, rowId: string, date: Date) => void;
  onReorder: (itemId: string, newRowId: string, newDate: Date) => void;
  onUnassign: (assignmentId: string) => void;
}
```

### 13.4 사용 시나리오

- 기술자 일정 배정
- 회의실 예약
- 장비 스케줄링
- 생산 일정 관리

### 13.5 BizPlatform 참조

- `features/fsm/scheduling/ScheduleBoardPage.tsx` - 기술자 주간 스케줄
- 사용 라이브러리: `@hello-pangea/dnd` (또는 `react-beautiful-dnd`)

---

## 14. AdminTreePage 패턴

### 14.1 구조

```
┌─────────────────────────────────────────────────────────────────┐
│ PageHeader                                                      │
│ [Icon] [메뉴/조직 관리]                        [추가] [저장]    │
├──────────────────────────────┬──────────────────────────────────┤
│ TreePanel                    │ DetailPanel                      │
│ ┌──────────────────────────┐ │ ┌──────────────────────────────┐ │
│ │ [검색...]                │ │ │ Tabs: [기본정보] [권한]      │ │
│ │ ────────────────────────  │ │ ├──────────────────────────────┤ │
│ │ ▼ 시스템관리             │ │ │                              │ │
│ │   ├─ [DnD] 사용자관리    │ │ │ 메뉴명: 사용자관리           │ │
│ │   ├─ [DnD] 권한관리      │ │ │ URL: /admin/users            │ │
│ │   └─ [DnD] 메뉴관리 ●    │ │ │ 아이콘: Users                │ │
│ │ ▶ 영업관리               │ │ │ 정렬순서: 1                  │ │
│ │ ▶ 품질관리               │ │ │                              │ │
│ │ ▶ 생산관리               │ │ │ 권한 매트릭스:               │ │
│ │                          │ │ │ ┌────┬───┬───┬───┬───┐      │ │
│ │                          │ │ │ │역할│R  │C  │U  │D  │      │ │
│ │                          │ │ │ ├────┼───┼───┼───┼───┤      │ │
│ │                          │ │ │ │관리│✓  │✓  │✓  │✓  │      │ │
│ │                          │ │ │ │일반│✓  │   │   │   │      │ │
│ │ [전체 펼치기/접기]       │ │ │ └────┴───┴───┴───┴───┘      │ │
│ └──────────────────────────┘ │ └──────────────────────────────┘ │
└──────────────────────────────┴──────────────────────────────────┘
```

### 14.2 필수 컴포넌트

| 컴포넌트 | 필수 여부 | 설명 |
|---------|---------|------|
| PageHeader | 필수 | 제목, 추가/저장 버튼 |
| TreePanel | 필수 | 계층 트리 (DnD 재정렬 지원) |
| DetailPanel | 필수 | 선택된 노드 상세/권한 편집 |

### 14.3 상태 관리

```typescript
interface AdminTreeState {
  // 트리 데이터
  tree: TreeNode[];
  flatNodes: Map<string, TreeNode>;  // ID 기반 빠른 조회

  // 선택/확장 상태
  selectedNodeId: string | null;
  expandedNodeIds: Set<string>;

  // 편집 상태
  editingNode: TreeNode | null;
  isDirty: boolean;

  // 권한 매트릭스
  permissions: {
    roles: Role[];
    matrix: Record<string, Record<string, Permission>>;
  };
}

interface TreeNode {
  id: string;
  parentId: string | null;
  label: string;
  icon?: string;
  url?: string;
  sortOrder: number;
  children: TreeNode[];
  metadata?: Record<string, any>;
}

// 트리 조작 액션
interface TreeActions {
  addNode: (parentId: string | null) => void;
  updateNode: (nodeId: string, updates: Partial<TreeNode>) => void;
  deleteNode: (nodeId: string) => void;
  moveNode: (nodeId: string, newParentId: string | null, newIndex: number) => void;
  toggleExpand: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

// 권한 매트릭스 액션
interface PermissionActions {
  togglePermission: (roleId: string, nodeId: string, permission: 'read' | 'create' | 'update' | 'delete') => void;
  bulkSetPermission: (roleId: string, nodeIds: string[], permission: string, value: boolean) => void;
}
```

### 14.4 사용 시나리오

- 메뉴 관리
- 조직도 관리
- 카테고리 관리
- 권한 매트릭스 설정

### 14.5 BizPlatform 참조

- `features/admin/menu/MenuManagementPage.tsx` - 메뉴 트리 + 권한 매트릭스

---

## 15. PortalPage 패턴

### 15.1 구조

```
┌─────────────────────────────────────────────────────────────────┐
│ PortalHeader (브랜딩)                                           │
│ [Logo]                                    [언어 ▼] [문의하기]   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │        인증 상태에 따른 분기                              │  │
│  │                                                           │  │
│  │   ┌─────────────────┐    ┌─────────────────────────────┐  │  │
│  │   │  미인증 시       │    │  인증 시                   │  │  │
│  │   │  ─────────────   │    │  ─────────────────────────  │  │  │
│  │   │                 │    │                             │  │  │
│  │   │  LoginForm      │    │  PortalDashboard            │  │  │
│  │   │  - 이메일       │    │  - 환영 메시지              │  │  │
│  │   │  - 비밀번호     │    │  - KPI 카드                 │  │  │
│  │   │  - [로그인]     │    │  - 퀵 액션                  │  │  │
│  │   │                 │    │  - 최근 알림               │  │  │
│  │   │  [비밀번호 찾기] │    │                             │  │  │
│  │   │  [회원가입]     │    │  [+ 드릴다운 패널]          │  │  │
│  │   │                 │    │                             │  │  │
│  │   └─────────────────┘    └─────────────────────────────┘  │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ PortalFooter                                                    │
│ [이용약관] [개인정보처리방침] [고객센터]     © 2025 Company     │
└─────────────────────────────────────────────────────────────────┘
```

### 15.2 필수 컴포넌트

| 컴포넌트 | 필수 여부 | 설명 |
|---------|---------|------|
| PortalHeader | 필수 | 로고, 언어 선택, 문의 |
| AuthGate | 필수 | 인증 상태에 따른 분기 |
| LoginForm | 필수 | 로그인/회원가입 폼 |
| PortalDashboard | 필수 | 인증 후 대시보드 |
| PortalFooter | 권장 | 약관, 개인정보, 저작권 |

### 15.3 상태 관리

```typescript
interface PortalState {
  // 인증 상태
  auth: {
    isAuthenticated: boolean;
    user: PortalUser | null;
    token: string | null;
    expiresAt: Date | null;
  };

  // UI 상태
  showLogin: boolean;
  showSignup: boolean;
  showForgotPassword: boolean;

  // 드릴다운 패널
  drilldownPanel: {
    isOpen: boolean;
    type: string | null;
    data: any;
  };
}

interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'partner' | 'vendor';
  company: string;
  permissions: string[];
}

// 인증 게이트 컴포넌트
const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = usePortalAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
};

// 포털 라우팅
const PortalRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route element={<AuthGate><PortalLayout /></AuthGate>}>
      <Route path="/" element={<PortalDashboard />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/support" element={<SupportPage />} />
    </Route>
  </Routes>
);
```

### 15.4 사용 시나리오

- 고객 포털
- 파트너 포털
- 공급업체 포털
- 셀프서비스 포털

### 15.5 BizPlatform 참조

- `features/portal/customer/CustomerPortalPage.tsx`

---

## 16. 공통 컴포넌트 명세 (확장)

### 16.1 WorkflowStepper

```typescript
interface WorkflowStepperProps {
  steps: Array<{
    id: string;
    label: string;
    status: 'completed' | 'current' | 'upcoming' | 'locked' | 'error';
    optional?: boolean;
  }>;
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  onStepClick?: (stepIndex: number) => void;
  allowClickOnCompleted?: boolean;
}
```

### 16.2 GateStepper

```typescript
interface GateStepperProps {
  gates: Array<{
    id: string;
    name: string;
    status: 'passed' | 'failed' | 'conditional' | 'current' | 'upcoming' | 'locked';
    approvedAt?: Date;
  }>;
  currentGate: number;
  onGateClick?: (gateIndex: number) => void;
  onApprove?: (gateIndex: number) => void;
  canApprove?: boolean;
}
```

### 16.3 TimelineView

```typescript
interface TimelineViewProps {
  items: TimelineItem[];
  orientation?: 'vertical' | 'horizontal';
  showConnectors?: boolean;
  showProgress?: boolean;
  highlightCriticalPath?: boolean;
  onItemClick?: (item: TimelineItem) => void;
  renderItem?: (item: TimelineItem) => React.ReactNode;
}
```

### 16.4 ForceGraph

```typescript
interface ForceGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width?: number;
  height?: number;
  layout?: 'force' | 'radial' | 'hierarchical';
  onNodeClick?: (node: GraphNode) => void;
  onNodeHover?: (node: GraphNode | null) => void;
  highlightConnected?: boolean;
  nodeRenderer?: (node: GraphNode) => React.ReactNode;
}
```

### 16.5 DraggableTree

```typescript
interface DraggableTreeProps {
  nodes: TreeNode[];
  selectedId?: string;
  expandedIds: Set<string>;
  onSelect: (nodeId: string) => void;
  onExpand: (nodeId: string) => void;
  onMove: (nodeId: string, newParentId: string | null, newIndex: number) => void;
  renderNode?: (node: TreeNode) => React.ReactNode;
  allowDrag?: (node: TreeNode) => boolean;
  allowDrop?: (node: TreeNode, targetNode: TreeNode) => boolean;
}
```

---

## 17. 성능 최적화 가이드 (확장)

### 17.1 WorkflowPage

- 스텝 간 전환 시 이전 데이터 캐싱
- 대용량 폼의 경우 스텝별 validation lazy 로딩
- Summary sidebar의 debounced 업데이트

### 17.2 GraphPage

- 노드/엣지 수 1000개 이상 시 WebGL 렌더러 사용
- 줌/팬 시 LOD (Level of Detail) 적용
- 드릴다운 시 서브그래프만 로드

### 17.3 ScheduleGridPage

- 가상화된 그리드 셀 렌더링
- DnD 중 미리보기 최적화 (throttle)
- 날짜 범위 변경 시 점진적 로딩

### 17.4 CanvasPage

- 요소 수 100개 이상 시 가상화
- Undo/Redo 히스토리 크기 제한 (50개)
- 협업 시 OT (Operational Transform) 적용

### 17.5 AdminTreePage

- 대규모 트리 (1000+ 노드) 가상화
- 권한 매트릭스 lazy loading
- DnD 재정렬 시 낙관적 업데이트

---

## 18. 접근성 체크리스트 (확장)

### 18.1 WorkflowPage

- [ ] 스텝 간 Tab 키 네비게이션
- [ ] 현재 스텝 aria-current 표시
- [ ] 잠긴 스텝 aria-disabled 표시
- [ ] 진행 상태 aria-valuenow/aria-valuemax

### 18.2 GraphPage

- [ ] 노드/엣지 키보드 포커스
- [ ] 그래프 영역 role="application"
- [ ] 노드 정보 aria-label
- [ ] 스크린 리더용 텍스트 대안

### 18.3 TimelinePage

- [ ] 타임라인 아이템 키보드 네비게이션
- [ ] 날짜 정보 aria-label
- [ ] 상태 변화 aria-live

### 18.4 ScheduleGridPage

- [ ] 그리드 셀 arrow key 네비게이션
- [ ] DnD 키보드 대안 (Space로 선택, Enter로 드롭)
- [ ] 셀 위치 정보 aria-rowindex/aria-colindex

### 18.5 AdminTreePage

- [ ] 트리 노드 arrow key 네비게이션
- [ ] 확장/축소 aria-expanded
- [ ] 레벨 정보 aria-level
- [ ] 권한 체크박스 aria-checked

---

## 참조

### 분석 기반
- BizPlatform 코드베이스 (140+ Page 컴포넌트, 40+ 도메인 분석)
- GPT-5.2 기술/패턴 분석 (컴포넌트 구조, 상태 관리, 성능 최적화, 공통화 우선순위)
- Gemini-3-Pro UX/동선 분석 (사용자 흐름, 인지 부하, 피드백/가이드, 오류 복구, 접근성, 모바일 적응)

### 주요 참조 파일
- `features/mes/planning/MasterPlanningWorkflow.tsx` - 워크플로우 패턴
- `features/qms/incident/IncidentWorkflowPage.tsx` - 워크플로우 + 목록 결합
- `features/plm/npd/components/GateStepper.tsx` - Gate 승인 패턴
- `features/plm/bmc/BmcEditorPage.tsx` - 캔버스 + Stage 패턴
- `features/pms/project/components/MilestoneTimeline.tsx` - 타임라인 패턴
- `features/crm/network/CustomerNetworkPage.tsx` - 그래프 시각화 패턴
- `features/fsm/scheduling/ScheduleBoardPage.tsx` - 스케줄 그리드 패턴
- `features/admin/menu/MenuManagementPage.tsx` - Admin 트리 패턴
- `features/portal/customer/CustomerPortalPage.tsx` - 포털 패턴

### 외부 트렌드
- [Enterprise UI Guide for 2026](https://www.superblocks.com/blog/enterprise-ui)
- [Dashboard UI Design Principles 2026](https://www.designstudiouiux.com/blog/dashboard-ui-design-guide/)
- [Enterprise UX Design Patterns](https://www.onething.design/post/top-7-enterprise-ux-design-patterns)
