# UI 표준 (2025)

> 이 문서는 프로젝트 UI의 기준을 정의합니다.  
> 현재 구현된 스타일(`frontend/src/styles/index.css`)을 기준으로 최신 디자인 흐름을 반영합니다.

---

## 1. 디자인 방향 (2025 기준)

### 1.1 핵심 컨셉: Liquid Glass / Translucent Material

- 투명한 유리 같은 소재, 레이어드 깊이, 동적 반응을 기본 방향으로 채택
- Light/Dark 모드 모두에서 적응형 색/재질을 사용
- 과도한 투명도는 가독성 문제를 유발할 수 있으므로 대비 우선

### 1.2 Material 기반 표면 사용 규칙

- **Acrylic/Glass 표면은 “단기/전환형 UI”에 집중** (메뉴, 팝오버, 드로어)
- **큰 배경 전체에 투명 소재를 과도하게 사용하지 않음**
- **투명 표면을 여러 장 나란히 배치하지 않음** (시각적 이음선/노이즈)

### 1.3 보조 컨셉: Expressive Emphasis

- 핵심 액션(Primary)만 더 강한 색/형태/모션으로 강조
- 강조는 제한적으로 사용 (주의 분산 방지)

### 1.4 Spatial Depth (visionOS 스타일)

- **다단계 그림자**로 공간감 표현 (`--shadow-sm` → `--shadow-lg`)
- 요소 간 **레이어 분리**를 통한 깊이감 연출
- hover 시 `translateY(-1px)` + 그림자 강화로 "떠오르는" 효과
- Glass 표면에 `inset 0 1px 0 var(--glass-highlight)`로 상단 하이라이트

### 1.5 Aurora Mesh Gradient

- 배경에 **유기적인 그라데이션 메쉬** 적용
- 색상 토큰: `--aurora-1`, `--aurora-2`, `--aurora-3`
- 미세한 애니메이션으로 생동감 부여 (`auroraShift` 20s)
- 과도한 색상 사용 금지 (투명도 10~15% 유지)

```css
/* Aurora Mesh 예시 */
background:
  radial-gradient(ellipse 80% 50% at 20% 40%, var(--aurora-1), transparent),
  radial-gradient(ellipse 60% 40% at 80% 60%, var(--aurora-2), transparent),
  radial-gradient(ellipse 50% 30% at 50% 20%, var(--aurora-3), transparent);
```

---

## 2. 시각 표준

### 2.1 색상/토큰

- 컬러/재질/그림자는 CSS 변수로 통일 관리
- `--panel`, `--header`, `--border`, `--blur-*`, `--shadow-*` 등 토큰 사용
- 신규 컬러 추가 시 토큰 정의 후 사용

### 2.2 CSS 변수 정의

#### Light Mode

```css
:root {
  /* 배경 */
  --bg: #f0f2f5;
  --panel: rgba(255, 255, 255, 0.72);
  --panel-2: rgba(241, 245, 249, 0.8);

  /* 텍스트 */
  --text: #1d1d1f;
  --text-secondary: #6e6e73;
  --muted: #8e8e93;

  /* 강조색 - Apple Blue */
  --accent: #0071e3;
  --primary: #0071e3;
  --on-accent: #ffffff;

  /* 상태 */
  --success: #30d158;
  --warning: #ff9f0a;
  --error: #ff453a;
  --info: #0a84ff;

  /* Glass 효과 */
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-highlight: rgba(255, 255, 255, 0.5);
  --blur-sm: blur(12px);
  --blur-md: blur(24px);

  /* Aurora */
  --aurora-1: rgba(120, 119, 198, 0.12);
  --aurora-2: rgba(255, 119, 198, 0.08);
  --aurora-3: rgba(64, 156, 255, 0.1);

  /* 입력 필드 */
  --input-bg: rgba(255, 255, 255, 0.9);
  --disabled-bg: rgba(240, 240, 245, 0.9);

  /* Resizer */
  --resizer: rgba(0, 0, 0, 0.1);
}
```

#### Dark Mode

```css
[data-theme="dark"] {
  --bg: #0a0a0c;
  --panel: rgba(30, 30, 35, 0.72);
  --text: #f5f5f7;
  --text-secondary: #a1a1a6;
  --accent: #0a84ff;
  --glass-highlight: rgba(255, 255, 255, 0.12);

  /* 입력 필드 */
  --input-bg: rgba(30, 30, 35, 0.9);
  --disabled-bg: rgba(50, 50, 55, 0.9);

  /* Resizer */
  --resizer: rgba(255, 255, 255, 0.1);
}

### 2.3 타이포그래피

- 기본 폰트: `Inter` + 시스템 폰트 폴백
- 제목은 굵기 600~700, 본문은 400~500 유지
- 강조는 크기/굵기/색 대비로 해결, 과도한 장식 금지

### 2.4 모서리/그림자/블러

- 모서리: 12~16px 라운드 기본
- 그림자: `--shadow-sm` → `--shadow-lg` 단계 사용
- 블러: `--blur-sm`/`--blur-md` 범위 내 사용 (과도한 blur 금지)

---

## 3. 레이아웃 규칙

- 좌측 네비게이션 + 중앙 콘텐츠 + 헤더 구조 기본
- 모바일에서는 좌측 네비게이션을 드로어로 전환
- 컨텐츠 가로폭이 넓은 경우 카드/패널로 구획화

---

## 4. 컴포넌트 표준

### 4.1 버튼

버튼 컴포넌트는 CSS 변수 기반으로 다크/라이트 모드 자동 적응

**Variant**:
| Variant | 용도 | CSS 클래스 |
|---------|------|-----------|
| `primary` | 주요 액션 (저장, 확인) | `btn-primary` |
| `secondary` | 보조 액션 (취소) | `btn-secondary` |
| `danger` | 위험 액션 (삭제) | `btn-danger` |
| `ghost` | 텍스트 버튼 | `btn-ghost` |

**CSS 변수**:
```css
/* Light Mode */
--primary: #0071e3;               /* Apple Blue */
--primary-hover: #0062cc;
--btn-bg: rgba(240, 240, 245, 0.9);
--btn-text: #374151;              /* 진한 회색 */
--btn-border: var(--border);
--btn-danger-bg: rgba(220, 38, 38, 0.1);
--btn-danger-text: #dc2626;       /* 선명한 빨강 */
--btn-danger-border: rgba(220, 38, 38, 0.2);
--btn-ghost-bg: transparent;
--btn-ghost-text: #4b5563;        /* 중간 회색 */

/* Dark Mode */
--primary: #2563eb;               /* 어두운 파랑 (눈 편함) */
--primary-hover: #1d4ed8;
--btn-bg: rgba(255, 255, 255, 0.08);
--btn-text: #f5f5f7;              /* 밝은 회색 */
--btn-border: var(--border);
--btn-danger-bg: rgba(255, 105, 97, 0.1);
--btn-danger-text: #ff6961;       /* 밝은 빨강 */
--btn-danger-border: rgba(255, 105, 97, 0.2);
--btn-ghost-bg: transparent;
--btn-ghost-text: #f5f5f7;        /* 밝은 회색 */
```

**사용법**:
```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary">저장</Button>
<Button variant="secondary">취소</Button>
<Button variant="danger">삭제</Button>
<Button variant="ghost">더보기</Button>
```

**크기**: `sm` | `md` | `lg` (기본 높이 40px, 모서리 12px)
**상태**: `hover/active/disabled/loading` 시 컬러 대비 자동 유지

**Variant별 스타일 상세**:
- `primary`: 군청색 배경 (#1e3a5f Light/Dark), 흰색 글씨
- `secondary`: 연한 회색 배경, 진한 텍스트 (#374151 Light / #f5f5f7 Dark)
- `danger`: 연한 빨강 배경, 선명한 빨강 텍스트 (#dc2626 Light / #ff6961 Dark)
- `ghost`: 투명 배경, 중간 회색 텍스트 (#4b5563 Light / #f5f5f7 Dark)

### 4.2 카드/패널

- 배경: `--panel` 또는 `--panel-2`
- 테두리: `--border`
- Glass 강조 필요 시 `--glass-highlight` 활용
- 패널 중첩은 2단계까지만 허용 (가독성/노이즈 방지)

```tsx
import { Card } from '@/components/ui/Card';

// 기본 카드
<Card>내용</Card>

// 강조 카드 (왼쪽 accent 테두리)
<Card variant="accent">강조 내용</Card>

// 제목 포함
<Card title="카드 제목">내용</Card>
```

**Props**:
- `variant`: `'default'` | `'accent'` (기본: default)
- `title`: 카드 상단 제목 (선택)
- `as`: `'div'` | `'section'` | `'article'` (기본: div)

**Variant별 스타일**:
- `default`: 기본 카드 (`.card` 클래스)
- `accent`: 왼쪽 4px accent 테두리 (`border-left: 4px solid var(--accent)`)

### 4.3 입력 폼

- `input` 클래스 기본 사용
- 포커스 시 대비 강화, 읽기성 우선
- 에러 상태는 `--error` 기준 색상 사용

```tsx
import { Input } from '@/components/ui/Input';

<Input label="이름" placeholder="이름 입력" />
<Input label="비밀번호" type="password" />
<Input label="에러" error="필수 입력 항목입니다" />
<Input label="비활성화" disabled value="비활성화됨" />
```

**CSS 스타일**:
```css
.input {
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--input-bg);
}

.input:disabled {
  background: var(--disabled-bg);
  color: var(--text-tertiary);
  cursor: not-allowed;
  opacity: 0.7;
}
```

**CSS 변수**:
- `--input-bg`: 입력 가능 필드 배경 (Light: `rgba(255, 255, 255, 0.9)`, Dark: `rgba(30, 30, 35, 0.9)`)
- `--disabled-bg`: 비활성화 필드 배경 (Light: `rgba(240, 240, 245, 0.9)`, Dark: `rgba(50, 50, 55, 0.9)`)

### 4.4 DatePicker (날짜 선택)

날짜 선택을 위한 커스텀 DatePicker 컴포넌트. `react-datepicker` 기반으로 프로젝트 디자인 시스템에 맞게 스타일링.

**사용 라이브러리**:
- `react-datepicker` (UI 컴포넌트)
- `date-fns` (날짜 유틸리티, react-datepicker 내장)

**기본 사용법**:
```tsx
import { DatePicker } from '@/components/common/DatePicker';

const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

<DatePicker
  selected={selectedDate}
  onChange={(date) => setSelectedDate(date)}
  placeholder="날짜 선택"
/>
```

**Props**:
| Prop | Type | Default | 설명 |
|------|------|---------|------|
| `selected` | `Date \| null` | - | 선택된 날짜 |
| `onChange` | `(date: Date \| null) => void` | - | 날짜 변경 핸들러 |
| `dateFormat` | `string` | `'yyyy-MM-dd'` | 날짜 표시 형식 |
| `placeholder` | `string` | `'날짜 선택'` | 플레이스홀더 텍스트 |
| `disabled` | `boolean` | `false` | 비활성화 여부 |
| `minDate` | `Date` | - | 선택 가능 최소 날짜 |
| `maxDate` | `Date` | - | 선택 가능 최대 날짜 |
| `isClearable` | `boolean` | `true` | 삭제 버튼 표시 여부 |
| `showMonthDropdown` | `boolean` | `true` | 월 드롭다운 표시 |
| `showYearDropdown` | `boolean` | `true` | 년 드롭다운 표시 |

**기능**:
- 한글 로케일 (요일, 월 한글 표시)
- 다크/라이트 모드 자동 대응
- 월/년 드롭다운 선택
- "오늘" 버튼
- 삭제 버튼 (X)
- 일요일 빨간색, 토요일 파란색 표시

**CSS 클래스**:
```css
/* Input 스타일 */
.custom-datepicker-input {
  padding: 6px 12px;
  font-size: 13px;
  background: var(--input-bg);
  border: 1px solid var(--border-input);
  border-radius: 6px;
  color: var(--text);
  width: 140px;
}

/* 캘린더 팝업 */
.custom-datepicker-calendar {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
}

/* 선택된 날짜 */
.react-datepicker__day--selected {
  background: var(--accent);
  color: var(--on-accent);
}

/* 오늘 날짜 */
.react-datepicker__day--today {
  border: 1px solid var(--accent);
}
```

**주의사항**:
- 브라우저 기본 `<input type="date">` 대신 사용 권장 (일관된 UI 제공)
- 날짜 범위 선택이 필요한 경우 `startDate`, `endDate` props 활용 가능

### 4.5 테이블

- `table` 클래스 사용
- 헤더는 `--table-header` 배경, 본문은 `--panel` 계열
- hover는 `--hover-bg`로 일관 유지

```tsx
<div className="table-container">
  <table className="table">
    <thead>
      <tr>
        <th>이름</th>
        <th>이메일</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>홍길동</td>
        <td>hong@example.com</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 4.5 네비게이션

- 좌측 메뉴는 `menu` 스타일 사용
- 활성 상태는 `--accent`와 `--on-accent` 조합
- 아이콘+텍스트 간격 8~12px 유지

### 4.6 Badge (뱃지)

상태 표시를 위한 뱃지 컴포넌트

```tsx
<span className="badge badge-success">완료</span>
<span className="badge badge-warning">진행중</span>
<span className="badge badge-error">실패</span>
<span className="badge badge-info">정보</span>
```

**Variant**:
| Variant | 용도 | 색상 |
|---------|------|------|
| `success` | 완료, 성공 | `--success` |
| `warning` | 진행중, 주의 | `--warning` |
| `error` | 실패, 에러 | `--error` |
| `info` | 정보 | `--info` |

### 4.7 Bento Grid (대시보드 레이아웃)

모듈형 그리드 레이아웃으로 대시보드, 통계, 카드 모음에 사용

```tsx
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid';

<BentoGrid cols={3}>
  <BentoCard title="매출" description="이번 달 총 매출">
    <span className="text-2xl font-bold">₩12,500,000</span>
  </BentoCard>
  <BentoCard colSpan={2} title="차트" header={<ChartComponent />} />
  <BentoCard rowSpan={2} title="알림 목록">...</BentoCard>
</BentoGrid>
```

**속성**:
- `cols`: 1~12 (반응형 자동 조절)
- `colSpan`: 1~4 (가로 병합)
- `rowSpan`: 1~4 (세로 병합)
- `header`: 상단 비주얼 영역 (차트, 이미지 등)

### 4.7 Command Menu (Cmd+K)

키보드 중심의 빠른 네비게이션/검색 UI

```tsx
import { CommandMenu } from '@/components/ui/CommandMenu';

const groups = [
  {
    heading: '페이지 이동',
    actions: [
      { id: 'home', label: '홈으로', shortcut: ['Ctrl', 'H'], onClick: () => navigate('/') },
      { id: 'settings', label: '설정', icon: <Settings size={16} />, onClick: () => navigate('/settings') },
    ],
  },
];

<CommandMenu groups={groups} />
```

**기능**:
- `Ctrl+K` / `Cmd+K`: 열기/닫기
- `↑` `↓`: 항목 탐색
- `Enter`: 선택 실행
- `ESC`: 닫기
- 실시간 검색 필터링

**스타일**:
- Glass 배경 (`backdrop-blur-xl`)
- 선택 항목: `--accent` 배경
- 단축키 뱃지 표시

### 4.8 Modal / ConfirmModal (팝업)

모달 다이얼로그 및 확인 팝업

```tsx
import { Modal, ConfirmModal } from '@/components/ui/Modal';

// 일반 Modal
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="설정"
  size="md"  // 'sm' | 'md' | 'lg' | 'xl'
  footer={
    <>
      <Button variant="secondary" onClick={onClose}>취소</Button>
      <Button variant="primary" onClick={onSave}>저장</Button>
    </>
  }
>
  {/* 모달 내용 */}
</Modal>

// 확인 팝업 (ConfirmModal)
<ConfirmModal
  isOpen={isDeleteOpen}
  onClose={() => setIsDeleteOpen(false)}
  onConfirm={handleDelete}
  title="삭제 확인"
  message="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
  confirmText="삭제"
  cancelText="취소"
  variant="danger"  // 'primary' | 'danger'
  loading={isDeleting}
/>
```

**Modal 속성**:
| 속성 | 타입 | 설명 |
|------|------|------|
| `isOpen` | boolean | 열림 상태 |
| `onClose` | function | 닫기 핸들러 |
| `title` | string | 제목 |
| `size` | 'sm' \| 'md' \| 'lg' \| 'xl' | 크기 |
| `footer` | ReactNode | 하단 버튼 영역 |
| `closeOnBackdrop` | boolean | 배경 클릭 시 닫기 (기본: true) |
| `closeOnEscape` | boolean | ESC 키로 닫기 (기본: true) |

**ConfirmModal 속성**:
| 속성 | 타입 | 설명 |
|------|------|------|
| `onConfirm` | function | 확인 버튼 핸들러 |
| `confirmText` | string | 확인 버튼 텍스트 |
| `cancelText` | string | 취소 버튼 텍스트 |
| `variant` | 'primary' \| 'danger' | 확인 버튼 스타일 |
| `loading` | boolean | 로딩 상태 |

**크기별 너비**:
```typescript
const sizeWidths: Record<string, string> = {
  sm: '600px',
  md: '760px',
  lg: '920px',
  xl: '1080px',
};
```

**기능**:
- ESC 키로 닫기
- 배경 클릭으로 닫기
- 포커스 트랩 (모달 내부에서만 포커스 이동)
- 열릴 때 body 스크롤 잠금
- 접근성: `role="dialog"`, `aria-modal`, `aria-labelledby`

**스타일 상세** (Liquid Glass):
- 위치: 화면 상단 10vh에서 시작
- 테두리: `border-radius: 20px`
- 배경: Glass 효과 (`backdrop-filter: blur(24px) saturate(150%)`)
- X 닫기 버튼: 우측 상단
- 헤더 padding: `20px 24px`
- 콘텐츠 영역: `padding: 20px 24px`, `maxHeight: 72vh`
- Footer: 우측 정렬 (`justifyContent: 'flex-end'`)
- 버튼 순서: **확인 → 취소** (주요 액션 먼저)
- 부드러운 scale 애니메이션

### 4.9 Toast (알림 메시지)

사용자 피드백을 위한 일시적 알림 UI

```tsx
// 1. App.tsx에서 Provider 설정
import { ToastProvider } from '@/components/ui/Toast';

function App() {
  return (
    <ToastProvider position="top-right">
      {/* 앱 내용 */}
    </ToastProvider>
  );
}

// 2. 컴포넌트에서 사용
import { useToast } from '@/components/ui/Toast';

function MyComponent() {
  const { success, error, warning, info } = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      success('저장되었습니다.');
    } catch (e) {
      error('저장에 실패했습니다.');
    }
  };

  // 옵션과 함께 사용
  success('저장되었습니다.', {
    title: '성공',
    duration: 3000,
    action: { label: '실행취소', onClick: handleUndo },
  });
}
```

**타입**:
| 타입 | 용도 | 아이콘 |
|------|------|--------|
| `success` | 성공 메시지 | `CheckCircle` |
| `error` | 에러 메시지 | `AlertCircle` |
| `warning` | 경고 메시지 | `AlertTriangle` |
| `info` | 정보 메시지 | `Info` |

**위치 옵션**: `top-right`, `top-left`, `bottom-right`, `bottom-left`, `top-center`, `bottom-center`

**기능**:
- 자동 닫힘 (기본 5초, 프로그레스 바 표시)
- hover 시 타이머 일시정지
- 액션 버튼 지원
- 닫기 버튼
- 접근성: `role="alert"`, `aria-live="polite"`

**스타일**:
- Glass 배경 (`backdrop-blur-xl`)
- 타입별 테두리 색상 (`--success`, `--error`, `--warning`, `--info`)

### 4.10 Tooltip (툴팁)

마우스 오버 또는 포커스 시 도움말 표시

```tsx
import { Tooltip, IconTooltip } from '@/components/ui/Tooltip';

// 기본 사용
<Tooltip content="이것은 툴팁입니다" position="top">
  <button>Hover me</button>
</Tooltip>

// 아이콘 버튼용 (접근성 자동 적용)
<IconTooltip label="설정" position="bottom">
  <button><Settings size={20} /></button>
</IconTooltip>
```

**속성**:
- `position`: `top` | `bottom` | `left` | `right`
- `align`: `start` | `center` | `end`
- `delay`: 표시 지연 시간 (기본 200ms)
- `glass`: Glass 효과 (기본 true)

### 4.11 Tabs (탭)

탭 네비게이션 컴포넌트 (Liquid Glass 스타일)

```tsx
import { Tabs, TabPanel } from '@/components/ui/Tabs';

const [activeTab, setActiveTab] = useState('info');

<Tabs
  tabs={[
    { id: 'info', label: '정보', icon: <Info size={16} /> },
    { id: 'settings', label: '설정', badge: 3 },
    { id: 'history', label: '히스토리', disabled: true },
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
  variant="default"  // 'default' | 'pills'
  size="md"          // 'sm' | 'md' | 'lg'
  fullWidth={false}
/>

<TabPanel id="info" activeTab={activeTab}>
  정보 내용
</TabPanel>
<TabPanel id="settings" activeTab={activeTab}>
  설정 내용
</TabPanel>
```

**속성**:
| 속성 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `tabs` | TabItem[] | - | 탭 목록 (id, label, icon?, badge?, disabled?) |
| `activeTab` | string | - | 현재 선택된 탭 ID |
| `onChange` | function | - | 탭 변경 핸들러 |
| `variant` | 'default' \| 'pills' | 'default' | 스타일 변형 |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | 크기 |
| `fullWidth` | boolean | false | 전체 너비 사용 |

**Variant 스타일**:
- `default`: Glass 배경에 활성 탭은 흰색 배경 + 미세 그림자
- `pills`: 활성 탭이 accent 색상의 pill 형태로 표시

**스타일 구현** (인라인 CSSProperties):
- 컨테이너: Glass 배경 (`backdrop-filter: blur(20px) saturate(180%)`)
- 활성 탭: 흰색 배경 + `boxShadow`로 부드러운 Elevation
- 비활성 탭: 투명 배경, hover 시 미세 배경색 변화
- 전환 애니메이션: `cubic-bezier(0.32, 0.72, 0, 1)` 0.2s

**접근성**: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`

### 4.12 Switch (토글 스위치)

iOS/macOS 스타일 pill 형태 토글 스위치

```tsx
import { Switch } from '@/components/ui/Switch';

<Switch
  checked={isEnabled}
  onChange={setIsEnabled}
  label="알림 받기"
  disabled={false}
/>
```

**스타일 특징**:
- 52x32px 트랙, 26x26px 원형 thumb
- ON: accent 배경, thumb 우측으로 이동
- OFF: `rgba(120, 120, 128, 0.32)` 배경 (iOS 스타일, 다크/라이트 모두 가시성 확보)
- Thumb: 흰색 그라데이션 (`linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%)`)
- `cubic-bezier(0.32, 0.72, 0, 1)` Apple 스타일 애니메이션
- `backdrop-filter: blur(8px)` 글래스 효과

**접근성**: `role="switch"`, `aria-checked`

### 4.13 Skeleton (로딩 스켈레톤)

콘텐츠 로딩 시 표시되는 플레이스홀더

```tsx
import { Skeleton, SkeletonText, SkeletonCard } from '@/components/ui/Skeleton';

// 기본 스켈레톤
<Skeleton width={200} height={40} variant="rounded" />

// 텍스트 스켈레톤
<SkeletonText lines={3} />

// 카드 스켈레톤
<SkeletonCard />
```

**Props**:
- `width`: `number | string` - 너비
- `height`: `number | string` - 높이
- `variant`: `'rectangular'` | `'circular'` | `'rounded'` | `'text'`
- `animation`: `'shimmer'` | `'pulse'` | `'none'`
- `glass`: Glass 효과 옵션

**Modal 스타일 컨테이너와 함께 사용**:
```tsx
<div style={{
  maxWidth: '600px',
  background: 'var(--panel)',
  backdropFilter: 'blur(24px) saturate(150%)',
  border: '1px solid var(--border)',
  borderRadius: '20px',
  boxShadow: 'var(--shadow-lg), inset 0 1px 0 var(--glass-highlight)',
  overflow: 'hidden',
}}>
  {/* Content */}
  <div style={{ padding: '20px 24px' }}>
    {isLoading ? (
      <div className="space-y-4">
        <Skeleton width={200} height={24} />
        <SkeletonText lines={3} />
      </div>
    ) : (
      <>{/* 실제 콘텐츠 */}</>
    )}
  </div>
  {/* Footer */}
  <div style={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '16px 24px',
    borderTop: '1px solid var(--border)',
  }}>
    {isLoading ? (
      <>
        <Skeleton width={80} height={40} variant="rounded" />
        <Skeleton width={80} height={40} variant="rounded" />
      </>
    ) : (
      <>
        <Button variant="primary">확인</Button>
        <Button variant="secondary">취소</Button>
      </>
    )}
  </div>
</div>
```

**스타일 특징**:
- Modal과 동일한 컨테이너 스타일 사용 시 일관된 로딩 UX
- Footer 영역도 Skeleton으로 표시 (버튼 위치 유지)
- `animate-shimmer` CSS 클래스로 shimmer 효과

### 4.14 EmptyState (빈 상태)

데이터가 없을 때 표시하는 상태 UI

```tsx
import { EmptyState } from '@/components/ui/EmptyState';

<EmptyState
  variant="search"  // 'default' | 'search' | 'error' | 'folder'
  title="검색 결과가 없습니다"
  message="다른 검색어로 다시 시도해 보세요."
  action={{ label: '초기화', onClick: resetSearch }}
/>
```

### 4.15 Pagination (페이지네이션)

페이지 탐색 컴포넌트

```tsx
import { Pagination } from '@/components/ui/Pagination';

<Pagination
  currentPage={page}
  totalPages={20}
  onPageChange={setPage}
  siblingCount={1}
  showFirstLast={true}
/>
```

**접근성**: `aria-label`, `aria-current="page"`

### 4.16 Radio (라디오 버튼)

원형 라디오 버튼 + 내부 dot 애니메이션, 그룹 orientation 지원 (Liquid Glass 스타일)

```tsx
import { Radio } from '@/components/ui/Radio';

<Radio
  name="gender"
  value={selected}
  onChange={setSelected}
  options={[
    { value: 'male', label: '남성' },
    { value: 'female', label: '여성' },
    { value: 'other', label: '기타', disabled: true },
  ]}
  orientation="vertical"  // 'horizontal' | 'vertical'
/>
```

**속성**:
- `name`: 라디오 그룹 이름
- `options`: 선택 옵션 배열
- `orientation`: 정렬 방향

**스타일 특징**:
- 22x22px 원형 버튼, `border-radius: 50%`
- 선택 시: accent 테두리 + 내부 10px dot
- `backdrop-filter: blur(8px)` 글래스 효과
- `cubic-bezier(0.32, 0.72, 0, 1)` 애니메이션
- 선택 시 외곽 글로우: `box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.15)`

**접근성**: `role="radiogroup"`, `role="radio"`, `aria-checked`

### 4.17 Select (드롭다운)

드롭다운 선택 컴포넌트

```tsx
import { Select } from '@/components/ui/Select';

<Select
  value={selected}
  onChange={setSelected}
  options={[
    { value: 'kr', label: '한국' },
    { value: 'us', label: '미국' },
    { value: 'jp', label: '일본', disabled: true },
  ]}
  placeholder="국가 선택"
  label="국가"
  error={errors.country}
/>
```

**속성**:
- `placeholder`: 플레이스홀더 텍스트
- `label`: 라벨 텍스트
- `error`: 에러 메시지

**스타일 특징** (Liquid Glass):
- 컨테이너: `display: 'inline-flex'`, `minWidth: '200px'`
- Native select 화살표 제거:
  ```typescript
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  ```
- 커스텀 화살표: lucide-react `ChevronDown` 아이콘 (우측 12px)
- padding: `10px 40px 10px 12px` (우측에 아이콘 공간 확보)
- 에러 시 테두리: `var(--error)` 색상

**접근성**: `aria-invalid`, `aria-describedby` (에러 연결)

### 4.18 Checkbox (체크박스)

라운드 코너 체크박스 + Check 아이콘 (Liquid Glass 스타일)

```tsx
import { Checkbox } from '@/components/ui/Checkbox';

<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
  label="이용약관에 동의합니다"
  disabled={false}
  indeterminate={false}  // 중간 상태 (전체 선택 UI용)
/>
```

**속성**:
- `indeterminate`: 부분 선택 상태 표시 (예: 전체 선택 체크박스)

**스타일 특징**:
- 22x22px, `border-radius: 6px`
- 체크 시: accent 배경 + 흰색 Check 아이콘 (lucide-react)
- `indeterminate`: 가로 막대 표시 (부분 선택)
- `backdrop-filter: blur(8px)` 글래스 효과
- 선택 시 외곽 글로우: `box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.15)`

**접근성**: `role="checkbox"`, `aria-checked` (true/false/'mixed')

### 4.19 SearchInput (검색 입력)

검색 전용 입력 필드

```tsx
import { SearchInput } from '@/components/ui/SearchInput';

<SearchInput
  value={query}
  onChange={setQuery}
  onSearch={handleSearch}  // Enter 키 또는 검색 실행
  placeholder="검색어를 입력하세요"
/>
```

**기능**:
- 왼쪽 검색 아이콘
- 입력값 있을 때 X 버튼으로 클리어
- Enter 키로 검색 실행
- `onSearch` 콜백 지원

### 4.20 DataTable (데이터 테이블)

정렬, 클릭 이벤트를 지원하는 데이터 테이블

```tsx
import { DataTable, Column, SortState } from '@/components/ui/DataTable';

const columns: Column<User>[] = [
  { key: 'name', header: '이름', sortable: true },
  { key: 'email', header: '이메일', width: '200px' },
  {
    key: 'status',
    header: '상태',
    render: (value) => <Badge variant={value}>{value}</Badge>
  },
];

<DataTable
  columns={columns}
  data={users}
  keyExtractor={(row) => row.id}
  sortState={sort}
  onSort={handleSort}
  onRowClick={handleRowClick}
  loading={isLoading}
  emptyMessage="사용자가 없습니다."
/>
```

**속성**:
| 속성 | 타입 | 설명 |
|------|------|------|
| `columns` | Column[] | 컬럼 정의 |
| `keyExtractor` | function | 행 고유 키 추출 |
| `sortable` | boolean | 컬럼별 정렬 가능 여부 |
| `onSort` | function | 정렬 변경 핸들러 |
| `onRowClick` | function | 행 클릭 핸들러 |
| `loading` | boolean | 로딩 상태 |

**접근성**: `aria-sort`, 키보드 행 선택

### 4.21 AG Grid (데이터 그리드) - 표준

대량 데이터 표시 및 편집을 위한 표준 그리드 컴포넌트. **AG Grid Community** 사용.

> **중요**: 프로젝트의 모든 데이터 그리드는 AG Grid를 표준으로 사용합니다.

**설치**:
```bash
npm install ag-grid-react ag-grid-community
```

**기본 사용법**:
```tsx
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridReadyEvent, CellValueChangedEvent, RowSelectionOptions } from 'ag-grid-community';
import { themeQuartz, colorSchemeDark } from 'ag-grid-community';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const [rowData, setRowData] = useState<Product[]>([
  { id: 1, name: '노트북', price: 1500000, stock: 50 },
  { id: 2, name: '모니터', price: 350000, stock: 120 },
]);

const columnDefs: ColDef<Product>[] = [
  { field: 'id', headerName: 'ID', width: 70, sortable: true, filter: true },
  { field: 'name', headerName: '상품명', width: 150, sortable: true, filter: true, editable: true },
  { field: 'stock', headerName: '재고', width: 100, sortable: true, editable: true },
  {
    field: 'price',
    headerName: '가격',
    width: 130,
    sortable: true,
    editable: true,
    valueFormatter: (params) => params.value ? `₩${params.value.toLocaleString()}` : '',
  },
];

// 다크모드 테마 설정
const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
const agGridTheme = isDarkMode ? themeQuartz.withPart(colorSchemeDark) : themeQuartz;

<div className="border border-[var(--border)] rounded-lg overflow-hidden" style={{ height: 400 }}>
  <AgGridReact<Product>
    rowData={rowData}
    columnDefs={columnDefs}
    theme={agGridTheme}
    animateRows={true}
    pagination={true}
    paginationPageSize={10}
    rowSelection={{ mode: 'multiRow', checkboxes: true }}
    onCellValueChanged={handleCellValueChanged}
    onGridReady={handleGridReady}
  />
</div>
```

**주요 Props**:
| Props | 타입 | 설명 |
|-------|------|------|
| `rowData` | T[] | 그리드 데이터 |
| `columnDefs` | ColDef[] | 컬럼 정의 |
| `theme` | Theme | AG Grid 테마 (themeQuartz 기본) |
| `pagination` | boolean | 페이지네이션 사용 |
| `paginationPageSize` | number | 페이지당 행 수 |
| `rowSelection` | RowSelectionOptions | 행 선택 옵션 |
| `animateRows` | boolean | 행 애니메이션 |
| `onCellValueChanged` | function | 셀 값 변경 핸들러 |
| `onGridReady` | function | 그리드 초기화 완료 핸들러 |

**ColDef 주요 속성**:
| 속성 | 타입 | 설명 |
|------|------|------|
| `field` | string | 데이터 필드명 |
| `headerName` | string | 헤더 표시명 |
| `width` | number | 컬럼 너비 |
| `sortable` | boolean | 정렬 가능 여부 |
| `filter` | boolean | 필터 사용 여부 |
| `editable` | boolean | 편집 가능 여부 |
| `valueFormatter` | function | 값 포맷터 |
| `cellRenderer` | function | 커스텀 셀 렌더러 |
| `rowSpan` | function | 셀 병합 (Row Spanning) |

**다크모드 테마 적용**:
```tsx
import { themeQuartz, colorSchemeDark } from 'ag-grid-community';
import { useMemo } from 'react';

// useMemo로 테마 캐싱 (성능 최적화)
const agGridTheme = useMemo(() => {
  return isDarkMode ? themeQuartz.withPart(colorSchemeDark) : themeQuartz;
}, [isDarkMode]);
```

**행 선택 (체크박스)**:
```tsx
const rowSelection: RowSelectionOptions = {
  mode: 'multiRow',      // 'singleRow' | 'multiRow'
  checkboxes: true,      // 체크박스 표시
  headerCheckbox: true,  // 헤더 전체 선택 체크박스
};

<AgGridReact
  rowSelection={rowSelection}
  onSelectionChanged={(e) => {
    const selectedRows = e.api.getSelectedRows();
    console.log('선택된 행:', selectedRows);
  }}
/>
```

**셀 편집**:
```tsx
const handleCellValueChanged = (event: CellValueChangedEvent<Product>) => {
  console.log('변경된 데이터:', event.data);
  console.log('변경된 필드:', event.colDef.field);
  console.log('이전 값:', event.oldValue);
  console.log('새 값:', event.newValue);

  // 서버 저장 로직
  saveToServer(event.data);
};
```

**Row Spanning (셀 병합)**:
```tsx
// 같은 카테고리의 셀을 세로로 병합
const columnDefs: ColDef[] = [
  {
    field: 'category',
    headerName: '카테고리',
    rowSpan: (params) => {
      const category = params.data.category;
      // 같은 카테고리가 연속으로 몇 개인지 계산
      return getCategoryRowSpan(params.data, params.node.rowIndex);
    },
    cellStyle: (params) => {
      // 병합된 셀만 배경색 적용
      if (params.node.rowIndex === getFirstRowOfCategory(params.data)) {
        return { backgroundColor: 'var(--panel-2)' };
      }
      return null;
    },
  },
  // ... 다른 컬럼들
];

// Row Spanning 사용 시 필수 설정
<AgGridReact
  suppressRowTransform={true}  // 필수!
  // ...
/>
```

**커스텀 셀 렌더러**:
```tsx
const columnDefs: ColDef[] = [
  {
    field: 'status',
    headerName: '상태',
    cellRenderer: (params) => {
      const status = params.value;
      const colorClass = status === '판매중'
        ? 'bg-emerald-500/12 text-emerald-600'
        : 'bg-red-500/12 text-red-600';
      return (
        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${colorClass}`}>
          {status}
        </span>
      );
    },
  },
];
```

**키보드 네비게이션** (기본 지원):
| 키 | 동작 |
|----|------|
| `Arrow Keys` | 셀 간 이동 |
| `Enter` | 편집 모드 진입/종료 |
| `Tab` | 다음 셀로 이동 |
| `Escape` | 편집 취소 |
| `Ctrl+C` | 선택 영역 복사 |
| `Ctrl+V` | 붙여넣기 |
| `Space` | 행 선택 토글 |

**스타일 규칙**:
- 컨테이너: `border border-[var(--border)] rounded-lg overflow-hidden`
- 높이: `style={{ height: 400 }}` 또는 고정 높이 지정 필수
- 다크/라이트 테마: `themeQuartz` + `colorSchemeDark` 조합

**주의사항**:
- Row Spanning 사용 시 `suppressRowTransform={true}` 필수
- 컨테이너에 높이 지정 필수 (height 또는 flex)
- 대량 데이터(1000행+)는 가상화 자동 적용됨

### 4.22 LoadingSpinner / LoadingOverlay (로딩)

로딩 인디케이터 컴포넌트

```tsx
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/LoadingSpinner';

// 인라인 로딩 스피너
<LoadingSpinner size="md" label="로딩 중..." />

// 전체 화면 오버레이
<LoadingOverlay
  visible={isLoading}
  label="저장 중..."
  blur={true}
/>
```

**LoadingSpinner 속성**:
- `size`: `'sm'` | `'md'` | `'lg'` | `'xl'`
- `label`: 로딩 메시지 (선택)

**LoadingOverlay 속성**:
- `visible`: 표시 여부
- `label`: 로딩 메시지
- `blur`: 배경 블러 효과 (기본: true)

**크기별 아이콘**:
| 크기 | 아이콘 크기 |
|------|------------|
| sm | 16px |
| md | 24px |
| lg | 32px |
| xl | 48px |

**접근성**: `role="status"`, `aria-label`, `aria-busy`

### 4.22 SegmentedControl (세그먼트 컨트롤)

세그먼트 선택 컨트롤 - 탭/필터 전환에 사용 (인라인 CSSProperties 사용)

```tsx
import { SegmentedControl } from '@/components/ui/SegmentedControl';

<SegmentedControl
  options={[
    { value: 'all', label: 'ALL' },
    { value: 'tnt', label: 'TNT' },
    { value: 'dys', label: 'DYS' },
  ]}
  value={selected}
  onChange={setSelected}
  size="md"
  disabled={false}
/>
```

**Props**:
- `options`: `SegmentOption[]` - 선택 옵션 배열 (`{ value, label, disabled? }`)
- `value`: 현재 선택된 값
- `onChange`: 값 변경 콜백
- `size`: `'sm'` | `'md'` | `'lg'` (기본: `'md'`)
- `disabled`: 전체 비활성화

**사이즈별 스타일**:
```typescript
const sizeStyles = {
  sm: { padding: '4px 12px', fontSize: '12px', height: '28px' },
  md: { padding: '6px 16px', fontSize: '13px', height: '32px' },
  lg: { padding: '8px 20px', fontSize: '14px', height: '40px' },
};
```

**스타일 특징**:
- 컨테이너 배경: `rgba(120, 120, 128, 0.12)` (다크/라이트 공통)
- 컨테이너 테두리: `1px solid var(--border)`
- 활성 인디케이터: `var(--accent)` 배경, 슬라이드 애니메이션
- 애니메이션: `cubic-bezier(0.32, 0.72, 0, 1)` Apple 스타일
- 둥근 모서리: 컨테이너 10px, 버튼 8px
- 활성 텍스트: `var(--on-accent)`, 비활성 텍스트: `var(--text-secondary)`

---

## 5. 모션/인터랙션

- hover: 미세 이동(1~2px) + 음영 변화
- transition: 0.2~0.3s 기본, 과도한 애니메이션 금지
- Glass 계열 표면은 움직임에 반응하는 "정적/미세 동적"만 허용

### 5.1 기본 애니메이션

```css
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 6. 접근성/가독성

- 투명도는 읽기성 유지 범위 내에서만 사용
- 텍스트 대비가 낮아지는 경우 불투명 레이어 추가
- 핵심 정보는 **불투명 패널**에서 제공

### 6.1 필수 접근성 속성

```tsx
// 버튼
<button aria-label="문서 저장">저장</button>

// 로딩 상태
<div aria-busy="true">로딩 중...</div>

// 에러 메시지
<div role="alert">오류 메시지</div>

// 모달
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
```

### 6.2 포커스 관리

```css
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### 6.3 상태 표시 패턴

```tsx
// 로딩
<div className="spinner" aria-busy="true" />

// 빈 상태
<div className="empty-state">
  <p>데이터가 없습니다.</p>
  <Button>새로 만들기</Button>
</div>

// 에러 상태
<div className="error-state" role="alert">
  <p>오류가 발생했습니다.</p>
  <Button onClick={retry}>다시 시도</Button>
</div>
```

---

## 7. 적용 체크리스트 (개발 시)

- [ ] CSS 변수 사용 (하드코딩 색상 금지)
- [ ] 공통 컴포넌트 재사용
- [ ] aria-* 속성 적용
- [ ] 다크 모드 테스트
- [ ] 반응형 테스트
- [ ] Lucide 아이콘 사용 (일관성 유지)
- [ ] 신규 색상/그림자/블러 사용 시 토큰으로 정의했는가?
- [ ] 유리/투명 재질은 전환성 UI에만 사용했는가?
- [ ] 텍스트 대비가 충분한가?
- [ ] Light/Dark 모드 모두 검증했는가?

---

## 8. 아이콘 표준

### 8.1 아이콘 라이브러리

- **Lucide React** 사용 (v0.469.0+)
- 일관된 스타일과 접근성을 위해 단일 라이브러리 사용

### 8.2 사용법

```tsx
import { Search, X, ChevronDown, Loader2 } from 'lucide-react';

// 기본 사용
<Search size={20} />

// 색상 적용 (CSS 변수 사용)
<X size={18} className="text-[var(--text-secondary)]" />

// 로딩 애니메이션
<Loader2 size={20} className="animate-spin text-[var(--accent)]" />
```

### 8.3 크기 규칙

| 용도 | 크기 | 예시 |
|------|------|------|
| 버튼 내 아이콘 | 16-18px | 닫기, 추가 버튼 |
| 인라인 아이콘 | 14-16px | 정렬 화살표, 상태 표시 |
| 독립 아이콘 버튼 | 20-24px | 툴바, 헤더 액션 |
| 빈 상태/강조 | 32-48px | EmptyState, 에러 화면 |

### 8.4 접근성

```tsx
// 아이콘만 있는 버튼은 반드시 aria-label 추가
<button aria-label="닫기">
  <X size={18} />
</button>

// 장식용 아이콘은 aria-hidden
<Search size={16} aria-hidden="true" />
```

### 8.5 자주 사용하는 아이콘

| 용도 | 아이콘 |
|------|--------|
| 검색 | `Search` |
| 닫기/삭제 | `X` |
| 메뉴 | `Menu` |
| 로딩 | `Loader2` |
| 정렬 | `ChevronUp`, `ChevronDown` |
| 성공 | `Check`, `CheckCircle` |
| 경고 | `AlertTriangle` |
| 에러 | `AlertCircle`, `XCircle` |
| 정보 | `Info` |
| 추가 | `Plus` |
| 편집 | `Pencil`, `Edit` |
| 설정 | `Settings` |

---

## 9. 상태 관리 패턴 (React)

### 9.1 TanStack Query (React Query)

서버 상태 관리를 위한 표준 라이브러리

```tsx
import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query';

// 기본 조회
const { data, isLoading, error } = useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 10000,  // 10초간 fresh
});

// 무한 스크롤
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['notifications', 'list', { filter }],
  queryFn: ({ pageParam }) => fetchNotifications({ cursor: pageParam }),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

**쿼리 키 설계 규칙**:
```ts
const queryKeys = {
  all: ['entity'] as const,
  lists: () => [...queryKeys.all, 'list'] as const,
  list: (params: Params) => [...queryKeys.lists(), params] as const,
  details: () => [...queryKeys.all, 'detail'] as const,
  detail: (id: string) => [...queryKeys.details(), id] as const,
};
```

**캐시 전략**:
| 상황 | 전략 |
|------|------|
| 읽음 처리 | `setQueryData`로 직접 패치 (invalidate 최소화) |
| SSE 신규 항목 | `setQueryData`로 prepend |
| 대규모 변경 | `invalidateQueries` |
| 필터 변경 | 쿼리 키 변경으로 자동 refetch |

### 9.2 Optimistic UI 패턴

서버 응답 전 UI를 먼저 업데이트하여 체감 속도 향상

```tsx
const mutation = useMutation({
  mutationFn: markAsRead,
  onMutate: async (id) => {
    // 1. 진행 중인 쿼리 취소
    await queryClient.cancelQueries({ queryKey: ['notifications'] });

    // 2. 이전 상태 스냅샷
    const previousData = queryClient.getQueryData(['notifications']);

    // 3. 낙관적 업데이트
    queryClient.setQueryData(['notifications'], (old) => ({
      ...old,
      items: old.items.map(item =>
        item.id === id ? { ...item, readAt: new Date() } : item
      ),
    }));

    return { previousData };
  },
  onError: (err, id, context) => {
    // 4. 실패 시 롤백
    queryClient.setQueryData(['notifications'], context.previousData);
    toast.error('처리에 실패했습니다. 다시 시도해주세요.');
  },
  onSettled: () => {
    // 5. 성공/실패 후 재검증 (선택)
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  },
});
```

**Optimistic UI 적용 대상**:
| 액션 | 적용 | 이유 |
|------|------|------|
| 읽음 처리 | ✓ | 빈번, 실패 드묾 |
| 좋아요/북마크 | ✓ | 빈번, 토글 가능 |
| 삭제 | ✓ | 즉각 피드백 필요 |
| 생성/수정 | △ | 복잡한 경우 서버 응답 대기 |

### 9.3 가상화 (Virtualization)

대량 목록 렌더링 최적화

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,  // 예상 아이템 높이
    overscan: 5,  // 뷰포트 밖 미리 렌더링
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualItem.start}px)`,
              height: `${virtualItem.size}px`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**적용 기준**:
| 항목 수 | 권장 |
|--------|------|
| < 100 | 일반 렌더링 |
| 100~500 | 가상화 권장 |
| > 500 | 가상화 필수 |

---

## 10. 실시간 UI 패턴

### 10.1 SSE (Server-Sent Events) 연결 관리

```tsx
function useSSE(url: string) {
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    let eventSource: EventSource;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      eventSource = new EventSource(url, { withCredentials: true });

      eventSource.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleEvent(data);
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        eventSource.close();

        // 지수 백오프 재연결
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
          reconnectTimeout = setTimeout(connect, delay);
          reconnectAttempts.current++;
        }
      };
    };

    connect();

    return () => {
      eventSource?.close();
      clearTimeout(reconnectTimeout);
    };
  }, [url]);

  return { isConnected };
}
```

**이벤트 중복 제거**:
```tsx
const processedIds = useRef(new Set<string>());
const MAX_PROCESSED_IDS = 1000;

function handleEvent(event: NotificationEvent) {
  // 중복 체크
  if (processedIds.current.has(event.id)) return;

  // LRU 방식 관리
  processedIds.current.add(event.id);
  if (processedIds.current.size > MAX_PROCESSED_IDS) {
    const firstId = processedIds.current.values().next().value;
    processedIds.current.delete(firstId);
  }

  // 캐시 업데이트
  queryClient.setQueryData(['notifications'], (old) => ...);
}
```

### 10.2 새 항목 알림 패턴

실시간으로 새 항목이 들어올 때 UX 처리

**패턴 A: 배너 알림 (권장)**
```tsx
// 스크롤 점프 방지, 사용자 제어권 제공
const [newItemsCount, setNewItemsCount] = useState(0);

// SSE로 새 항목 수신 시
setNewItemsCount(prev => prev + 1);

// UI
{newItemsCount > 0 && (
  <button
    onClick={() => {
      refetch();
      setNewItemsCount(0);
      scrollToTop();
    }}
    className="new-items-banner"
  >
    {newItemsCount}개의 새 알림
  </button>
)}
```

**패턴 B: 즉시 삽입**
```tsx
// 스크롤 위치 보정 필요
// 목록 상단에 있을 때만 사용 권장
```

| 상황 | 권장 패턴 |
|------|----------|
| 사용자가 스크롤 중 | 배너 (A) |
| 사용자가 목록 상단 | 즉시 삽입 (B) |
| 알림/채팅 | 배너 + 뱃지 카운트 |

---

## 11. 모바일 인터랙션 패턴

### 11.1 Bottom Sheet

모바일에서 드롭다운 대신 사용

```tsx
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/Sheet';

// 데스크톱: Popover, 모바일: Bottom Sheet
const isMobile = useMediaQuery('(max-width: 768px)');

{isMobile ? (
  <Sheet>
    <SheetTrigger asChild>
      <Button><Bell /></Button>
    </SheetTrigger>
    <SheetContent side="bottom" className="h-[80vh]">
      <NotificationList />
    </SheetContent>
  </Sheet>
) : (
  <Popover>
    <PopoverTrigger asChild>
      <Button><Bell /></Button>
    </PopoverTrigger>
    <PopoverContent>
      <NotificationList />
    </PopoverContent>
  </Popover>
)}
```

**Bottom Sheet 속성**:
| 속성 | 값 | 설명 |
|------|-----|------|
| `side` | `bottom` | 하단에서 올라옴 |
| `className` | `h-[80vh]` | 최대 높이 제한 |
| Drag handle | 상단 바 | 드래그로 닫기 |

### 11.2 Swipe 제스처

목록 아이템에 스와이프 액션 추가

```tsx
import { useSwipeable } from 'react-swipeable';

function SwipeableItem({ onDelete, onArchive, children }) {
  const [offset, setOffset] = useState(0);

  const handlers = useSwipeable({
    onSwiping: (e) => setOffset(e.deltaX),
    onSwipedLeft: () => {
      if (offset < -100) onDelete();
      setOffset(0);
    },
    onSwipedRight: () => {
      if (offset > 100) onArchive();
      setOffset(0);
    },
    trackMouse: false,  // 모바일만
  });

  return (
    <div {...handlers} style={{ transform: `translateX(${offset}px)` }}>
      {children}
    </div>
  );
}
```

**스와이프 액션 매핑**:
| 방향 | 액션 | 배경색 |
|------|------|--------|
| ← 왼쪽 | 삭제 | `--error` (빨강) |
| → 오른쪽 | 읽음/보관 | `--success` (초록) |

### 11.3 Pull to Refresh

당겨서 새로고침

```tsx
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

function NotificationList() {
  const { isRefreshing, pullProgress, handlers } = usePullToRefresh({
    onRefresh: async () => {
      await refetch();
    },
    threshold: 80,
  });

  return (
    <div {...handlers}>
      {pullProgress > 0 && (
        <div style={{ height: pullProgress }}>
          <Loader2 className={isRefreshing ? 'animate-spin' : ''} />
        </div>
      )}
      {/* 목록 */}
    </div>
  );
}
```

---

## 12. 마이크로 애니메이션

### 12.1 Badge 카운트 애니메이션

```css
@keyframes badgePop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.badge-animate {
  animation: badgePop 0.3s ease-out;
}
```

```tsx
// 카운트 변경 시 애니메이션 트리거
const [animate, setAnimate] = useState(false);

useEffect(() => {
  if (count > prevCount) {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  }
}, [count]);

<Badge className={animate ? 'badge-animate' : ''}>{count}</Badge>
```

### 12.2 리스트 아이템 진입 애니메이션

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-item-enter {
  animation: slideIn 0.2s ease-out;
}
```

### 12.3 Skeleton Shimmer

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

## 13. 레이아웃 패턴

### 13.1 Resizable Panel Layout

3패널 레이아웃 (좌측 메뉴, 센터, 우측 패널) + 리사이즈 핸들

```tsx
// App.tsx 구조
<div ref={containerRef} className="resizable-container">
  {/* Left Menu */}
  <div className="col left" style={{ width: leftWidth, minWidth: 180 }}>
    {/* 메뉴 콘텐츠 */}
  </div>

  {/* Left Resizer */}
  <div
    className={`resizer ${activeResizer === 'left' ? 'active' : ''}`}
    onMouseDown={() => handleMouseDown('left')}
  />

  {/* Center Content */}
  <div className="col center">
    <div className="pane center">
      {/* Filter Header */}
      <div style={{
        background: 'var(--panel)',
        backdropFilter: 'var(--blur-md) var(--saturate)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 20px',
      }}>
        {/* Title + Filter Row */}
      </div>
      {/* Main Content */}
      <div className="main-view" style={{ padding: 16 }}>
        {/* 콘텐츠 */}
      </div>
    </div>
  </div>

  {/* Right Resizer */}
  <div
    className={`resizer ${activeResizer === 'right' ? 'active' : ''}`}
    onMouseDown={() => handleMouseDown('right')}
  />

  {/* Right Panel */}
  <div className="col right" style={{ width: rightWidth }}>
    {/* 우측 패널 콘텐츠 */}
  </div>
</div>
```

**패널 크기 설정**:
- 좌측 메뉴: 초기 220px, 범위 180px ~ 400px
- 센터: flex (나머지 공간)
- 우측 패널: 초기 582px, 범위 200px ~ 800px

**CSS 스타일**:
```css
.resizable-container {
  position: relative;
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.resizable-container .col {
  height: 100%;
  overflow: auto;
}

.resizable-container .left {
  background: var(--panel);
  backdrop-filter: var(--blur-md) var(--saturate);
  border-right: 1px solid var(--border);
  box-shadow: inset -1px 0 0 var(--glass-highlight);
}

.resizable-container .center {
  background: var(--panel-2);
  backdrop-filter: var(--blur-sm);
  flex: 1 1 auto;
  min-width: 100px;
}

.resizable-container .right {
  background: var(--panel);
  backdrop-filter: var(--blur-md) var(--saturate);
  border-left: 1px solid var(--border);
  box-shadow: inset 1px 0 0 var(--glass-highlight);
  min-width: 200px;
  flex-shrink: 0;
}
```

### 13.2 Resizer Handle

패널 간 드래그 리사이즈 핸들

```css
.resizer {
  width: 8px;
  background: transparent;
  cursor: col-resize;
  position: relative;
  flex-shrink: 0;
  z-index: 10;
  transition: background 0.15s ease;
}

.resizer::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 48px;
  background: var(--resizer);
  border-radius: 2px;
  opacity: 1;
  transition: opacity 0.15s ease, background 0.15s ease;
}

.resizer:hover::before,
.resizer.active::before {
  background: var(--text-secondary);
}

.resizer.active::before {
  background: var(--accent);
}
```

**CSS 변수**:
- `--resizer`: 기본 핸들 색상 (`rgba(0, 0, 0, 0.1)` Light / `rgba(255, 255, 255, 0.1)` Dark)

**스타일 특징**:
- 핸들 너비: 8px (드래그 영역)
- 중앙 마크: 4px × 48px 둥근 막대
- 항상 표시 (opacity: 1)
- 호버 시 `var(--text-secondary)` 색상
- 드래그 중 `var(--accent)` 색상

### 13.3 Filter Header

패널 상단 필터 영역 구조

```tsx
<div style={{
  background: 'var(--panel)',
  backdropFilter: 'var(--blur-md) var(--saturate)',
  WebkitBackdropFilter: 'var(--blur-md) var(--saturate)',
  borderBottom: '1px solid var(--border)',
  padding: '12px 20px',
}}>
  {/* Title Row */}
  <h3 style={{
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--text)',
    margin: '0 0 12px 0',
  }}>
    제목
  </h3>
  {/* Filter Row */}
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  }}>
    {/* 필터 컴포넌트들 */}
  </div>
</div>
```

### 13.4 Scrollbar (Liquid Glass)

Liquid Glass 스타일의 스크롤바 (다크/라이트 모두 동일)

```css
/* Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(120, 120, 128, 0.1);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 128, 0.5);
  border-radius: 5px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(120, 120, 128, 0.7);
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(120, 120, 128, 0.5) rgba(120, 120, 128, 0.1);
}
```

**스타일 특징**:
- 너비/높이: 10px (가시성 확보)
- 트랙: 반투명 회색 배경 (`rgba(120, 120, 128, 0.1)`)
- Thumb: 반투명 회색 (`rgba(120, 120, 128, 0.5)`)
- Hover: 더 진하게 (`rgba(120, 120, 128, 0.7)`)
- 둥근 모서리: `border-radius: 5px`
- 패딩 효과: `border: 2px solid transparent` + `background-clip: padding-box`

---

## 14. 반응형 브레이크포인트

```css
/* Mobile */
@media (max-width: 640px) { }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

---

## 15. UI 표준 검증

프론트엔드 코드 작성/수정 시 아래 패턴을 자동 탐지하여 검증합니다.

### 15.1 자동 탐지 패턴

```typescript
// 하드코딩 색상 (위반)
const hardcodedColors = /#[0-9a-fA-F]{3,6}|rgb\(|rgba\(/g;

// CSS 변수 사용 (정상)
const cssVariables = /var\(--[\w-]+\)/g;

// 접근성 속성
const ariaAttributes = /aria-[\w]+=/g;
```

### 15.2 검증 항목

| # | 카테고리 | 검증 내용 |
|---|----------|----------|
| 1 | 색상/토큰 | CSS 변수 사용, 하드코딩 색상 금지 |
| 2 | 컴포넌트 | 표준 컴포넌트 패턴 준수 |
| 3 | 접근성 | aria-* 속성, role 속성 |
| 4 | 레이아웃 | Glass 재질, 라운드, 그림자 토큰 |
| 5 | 반응형/테마 | 다크모드, 모바일 대응 |

### 15.3 검증 리포트 형식

```markdown
## UI 표준 검증 결과

### ❌ 위반 사항
1. **하드코딩 색상** (line 24)
   - 발견: `color: #3b82f6`
   - 수정: `color: var(--primary)`

### ✅ 준수 사항
- CSS 변수 사용률: 85%
- 접근성 속성 적용됨
```

### 15.4 수동 검증 요청

```
"UI 검증해줘"
"이 컴포넌트 UI 표준 체크해줘"
"스타일 검증"
```

---

## 16. 참고

- 구현 토큰: `frontend/src/styles/index.css`
- 컴포넌트 예시: `frontend/src/components/ui/`
- 아이콘 검색: https://lucide.dev/icons
- TanStack Query: https://tanstack.com/query
- TanStack Virtual: https://tanstack.com/virtual
