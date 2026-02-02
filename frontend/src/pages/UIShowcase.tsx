/**
 * UI 컴포넌트 쇼케이스 페이지
 * 모든 표준 UI 컴포넌트를 한 화면에서 확인할 수 있습니다.
 */

import { useState } from 'react';
import {
  Search,
  Settings,
  Bell,
  User,
  Plus,
  Edit,
  Trash2,
  Check,
  AlertTriangle,
  Info,
  ChevronDown,
  Mail,
  Phone,
} from 'lucide-react';

// UI Components
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { Tabs, TabPanel } from '../components/ui/Tabs';
import { Switch } from '../components/ui/Switch';
import { Tooltip } from '../components/ui/Tooltip';
import { Skeleton, SkeletonText } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { Radio } from '../components/ui/Radio';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { SearchInput } from '../components/ui/SearchInput';
import { DataTable, Column } from '../components/ui/DataTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { BentoGrid, BentoCard } from '../components/ui/BentoGrid';
import { ToastProvider, useToast } from '../components/ui/Toast';
import { SegmentedControl } from '../components/ui/SegmentedControl';

// 샘플 데이터
interface SampleUser {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: string;
}

const sampleUsers: SampleUser[] = [
  { id: 1, name: '홍길동', email: 'hong@example.com', status: 'active', role: '관리자' },
  { id: 2, name: '김철수', email: 'kim@example.com', status: 'inactive', role: '사용자' },
  { id: 3, name: '이영희', email: 'lee@example.com', status: 'pending', role: '사용자' },
  { id: 4, name: '박지민', email: 'park@example.com', status: 'active', role: '편집자' },
];

// Toast 데모 컴포넌트
function ToastDemo() {
  const { success, error, warning, info } = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="primary" size="sm" onClick={() => success('저장되었습니다.')}>
        Success
      </Button>
      <Button variant="danger" size="sm" onClick={() => error('오류가 발생했습니다.')}>
        Error
      </Button>
      <Button variant="secondary" size="sm" onClick={() => warning('주의가 필요합니다.')}>
        Warning
      </Button>
      <Button variant="ghost" size="sm" onClick={() => info('참고 정보입니다.')}>
        Info
      </Button>
    </div>
  );
}

// 섹션 컴포넌트
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function UIShowcase() {
  // States
  const [activeTab, setActiveTab] = useState('buttons');
  const [switchOn, setSwitchOn] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [radioValue, setRadioValue] = useState('option1');
  const [selectValue, setSelectValue] = useState('');
  const [segmentValue1, setSegmentValue1] = useState('all');
  const [segmentValue2, setSegmentValue2] = useState('week');
  const [segmentValue3, setSegmentValue3] = useState('list');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const columns: Column<SampleUser>[] = [
    { key: 'name', header: '이름', sortable: true },
    { key: 'email', header: '이메일', sortable: true },
    {
      key: 'status',
      header: '상태',
      render: (value) => (
        <Badge
          variant={
            value === 'active' ? 'success' : value === 'inactive' ? 'error' : 'warning'
          }
        >
          {value === 'active' ? '활성' : value === 'inactive' ? '비활성' : '대기'}
        </Badge>
      ),
    },
    { key: 'role', header: '역할' },
  ];

  const tabs = [
    { id: 'buttons', label: 'Buttons', icon: <Plus size={16} /> },
    { id: 'inputs', label: 'Inputs', icon: <Edit size={16} /> },
    { id: 'data', label: 'Data Display', icon: <Info size={16} /> },
    { id: 'feedback', label: 'Feedback', icon: <Bell size={16} /> },
    { id: 'layout', label: 'Layout', icon: <Settings size={16} /> },
  ];

  return (
    <ToastProvider position="top-right">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text)] mb-2">UI 컴포넌트 쇼케이스</h1>
          <p className="text-[var(--text-secondary)]">
            프로젝트에서 사용 가능한 모든 표준 UI 컴포넌트입니다.
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

        {/* Buttons Tab */}
        <TabPanel id="buttons" activeTab={activeTab}>
          <Section title="Button Variants">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Error</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="primary" loading>
                Loading
              </Button>
            </div>
          </Section>

          <Section title="Button Sizes">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
          </Section>

          <Section title="Button with Icons">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">
                <Plus size={16} /> 추가
              </Button>
              <Button variant="secondary">
                <Edit size={16} /> 편집
              </Button>
              <Button variant="danger">
                <Trash2 size={16} /> 삭제
              </Button>
              <Button variant="ghost">
                <Settings size={16} /> 설정
              </Button>
            </div>
          </Section>
        </TabPanel>

        {/* Inputs Tab */}
        <TabPanel id="inputs" activeTab={activeTab}>
          <Section title="Input">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Input
                label="기본 입력"
                placeholder="텍스트를 입력하세요"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                label="비밀번호"
                type="password"
                placeholder="비밀번호 입력"
              />
              <Input
                label="에러 상태"
                error="필수 입력 항목입니다"
                placeholder="에러 예시"
              />
              <Input label="비활성화" disabled placeholder="비활성화됨" />
            </div>
          </Section>

          <Section title="SearchInput">
            <div className="max-w-md">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={(v) => alert(`검색: ${v}`)}
                placeholder="검색어를 입력하세요"
              />
            </div>
          </Section>

          <Section title="Select">
            <div className="max-w-md">
              <Select
                label="국가 선택"
                value={selectValue}
                onChange={setSelectValue}
                options={[
                  { value: 'kr', label: '한국' },
                  { value: 'us', label: '미국' },
                  { value: 'jp', label: '일본' },
                  { value: 'cn', label: '중국', disabled: true },
                ]}
                placeholder="국가를 선택하세요"
              />
            </div>
          </Section>

          <Section title="Radio">
            <Radio
              name="demo-radio"
              value={radioValue}
              onChange={setRadioValue}
              options={[
                { value: 'option1', label: '옵션 1' },
                { value: 'option2', label: '옵션 2' },
                { value: 'option3', label: '옵션 3', disabled: true },
              ]}
              orientation="horizontal"
            />
          </Section>

          <Section title="Checkbox">
            <div className="flex flex-col gap-3">
              <Checkbox
                checked={checkboxChecked}
                onChange={setCheckboxChecked}
                label="이용약관에 동의합니다"
              />
              <Checkbox checked={true} onChange={() => {}} label="선택됨" />
              <Checkbox checked={false} onChange={() => {}} label="비활성화" disabled />
              <Checkbox
                checked={false}
                onChange={() => {}}
                indeterminate={true}
                label="부분 선택 (Indeterminate)"
              />
            </div>
          </Section>

          <Section title="Switch">
            <div className="flex flex-col gap-3">
              <Switch checked={switchOn} onChange={setSwitchOn} label="알림 받기" />
              <Switch checked={true} onChange={() => {}} label="활성화됨" />
              <Switch checked={false} onChange={() => {}} label="비활성화" disabled />
            </div>
          </Section>

          <Section title="SegmentedControl">
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              세그먼트 선택 컨트롤 - 탭/필터 전환에 사용
            </p>
            <div className="flex flex-col gap-4">
              <div>
                <span className="text-xs text-[var(--text-tertiary)] mb-2 block">기본 (md)</span>
                <SegmentedControl
                  options={[
                    { value: 'all', label: 'ALL' },
                    { value: 'tnt', label: 'TNT' },
                    { value: 'dys', label: 'DYS' },
                  ]}
                  value={segmentValue1}
                  onChange={setSegmentValue1}
                />
              </div>
              <div>
                <span className="text-xs text-[var(--text-tertiary)] mb-2 block">소형 (sm)</span>
                <SegmentedControl
                  size="sm"
                  options={[
                    { value: 'day', label: '일간' },
                    { value: 'week', label: '주간' },
                    { value: 'month', label: '월간' },
                  ]}
                  value={segmentValue2}
                  onChange={setSegmentValue2}
                />
              </div>
              <div>
                <span className="text-xs text-[var(--text-tertiary)] mb-2 block">대형 (lg)</span>
                <SegmentedControl
                  size="lg"
                  options={[
                    { value: 'list', label: '목록' },
                    { value: 'grid', label: '그리드' },
                    { value: 'calendar', label: '캘린더' },
                  ]}
                  value={segmentValue3}
                  onChange={setSegmentValue3}
                />
              </div>
              <div>
                <span className="text-xs text-[var(--text-tertiary)] mb-2 block">비활성화</span>
                <SegmentedControl
                  options={[
                    { value: 'a', label: '옵션 A' },
                    { value: 'b', label: '옵션 B' },
                  ]}
                  value="a"
                  onChange={() => {}}
                  disabled
                />
              </div>
            </div>
          </Section>
        </TabPanel>

        {/* Data Display Tab */}
        <TabPanel id="data" activeTab={activeTab}>
          <Section title="Badge">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </Section>

          <Section title="Card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <h4 className="font-semibold text-[var(--text)] mb-2">기본 카드</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  카드 컴포넌트 예시입니다.
                </p>
              </Card>
              <Card variant="accent">
                <h4 className="font-semibold text-[var(--text)] mb-2">강조 카드</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  왼쪽 테두리로 강조된 카드입니다.
                </p>
              </Card>
              <Card>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text)]">사용자 카드</h4>
                    <p className="text-xs text-[var(--text-secondary)]">아이콘 포함</p>
                  </div>
                </div>
              </Card>
            </div>
          </Section>

          <Section title="DataTable">
            <DataTable
              columns={columns}
              data={showEmpty ? [] : sampleUsers}
              keyExtractor={(row) => row.id}
              onRowClick={(row) => alert(`선택: ${row.name}`)}
              emptyMessage="사용자가 없습니다."
            />
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmpty(!showEmpty)}
              >
                {showEmpty ? '데이터 표시' : '빈 상태 보기'}
              </Button>
            </div>
          </Section>

          <Section title="Pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
          </Section>

          <Section title="Tooltip">
            <div className="flex flex-wrap gap-4">
              <Tooltip content="위쪽 툴팁" position="top">
                <Button variant="secondary">Top</Button>
              </Tooltip>
              <Tooltip content="아래쪽 툴팁" position="bottom">
                <Button variant="secondary">Bottom</Button>
              </Tooltip>
              <Tooltip content="왼쪽 툴팁" position="left">
                <Button variant="secondary">Left</Button>
              </Tooltip>
              <Tooltip content="오른쪽 툴팁" position="right">
                <Button variant="secondary">Right</Button>
              </Tooltip>
            </div>
          </Section>
        </TabPanel>

        {/* Feedback Tab */}
        <TabPanel id="feedback" activeTab={activeTab}>
          <Section title="Toast Messages">
            <ToastDemo />
          </Section>

          <Section title="Modal">
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                일반 모달 열기
              </Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                확인 모달 열기
              </Button>
            </div>

            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="모달 제목"
              footer={
                <>
                  <Button variant="primary" onClick={() => setModalOpen(false)}>
                    확인
                  </Button>
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>
                    취소
                  </Button>
                </>
              }
            >
              <p className="text-[var(--text-secondary)]">
                모달 컨텐츠입니다. 여기에 다양한 내용을 넣을 수 있습니다.
              </p>
              <div className="mt-4">
                <Input label="이름" placeholder="이름을 입력하세요" />
              </div>
            </Modal>

            <ConfirmModal
              isOpen={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              onConfirm={() => {
                alert('확인됨!');
                setConfirmOpen(false);
              }}
              title="삭제 확인"
              message="정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
              variant="danger"
              confirmText="삭제"
              cancelText="취소"
            />
          </Section>

          <Section title="Loading States">
            <div className="flex flex-wrap items-center gap-6">
              <LoadingSpinner size="sm" />
              <LoadingSpinner size="md" />
              <LoadingSpinner size="lg" />
              <LoadingSpinner size="lg" label="로딩 중..." />
            </div>
          </Section>

          <Section title="Skeleton">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSkeleton(!showSkeleton)}
              className="mb-4"
            >
              {showSkeleton ? '콘텐츠 보기' : '스켈레톤 보기'}
            </Button>
            <div
              style={{
                maxWidth: '600px',
                background: 'var(--panel)',
                backdropFilter: 'blur(24px) saturate(150%)',
                WebkitBackdropFilter: 'blur(24px) saturate(150%)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                boxShadow: 'var(--shadow-lg), inset 0 1px 0 var(--glass-highlight)',
                overflow: 'hidden',
              }}
            >
              {/* Content */}
              <div style={{ padding: '20px 24px' }}>
                {showSkeleton ? (
                  <div className="space-y-4">
                    <Skeleton width={200} height={24} />
                    <SkeletonText lines={3} />
                  </div>
                ) : (
                  <>
                    <h4 className="font-semibold text-[var(--text)] mb-2">실제 콘텐츠</h4>
                    <p className="text-sm text-[var(--text-secondary)]">
                      스켈레톤 대신 표시되는 실제 콘텐츠입니다.
                      로딩이 완료되면 이 내용이 나타납니다.
                    </p>
                  </>
                )}
              </div>
              {/* Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  padding: '16px 24px',
                  borderTop: '1px solid var(--border)',
                }}
              >
                {showSkeleton ? (
                  <>
                    <Skeleton width={80} height={40} variant="rounded" />
                    <Skeleton width={80} height={40} variant="rounded" />
                  </>
                ) : (
                  <>
                    <Button variant="primary" size="sm">
                      확인
                    </Button>
                    <Button variant="secondary" size="sm">
                      취소
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Section>

          <Section title="EmptyState">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <EmptyState
                  variant="default"
                  title="데이터 없음"
                  message="표시할 항목이 없습니다."
                  action={{ label: '새로 만들기', onClick: () => alert('새로 만들기') }}
                />
              </Card>
              <Card>
                <EmptyState
                  variant="search"
                  title="검색 결과 없음"
                  message="다른 검색어로 시도해보세요."
                />
              </Card>
            </div>
          </Section>
        </TabPanel>

        {/* Layout Tab */}
        <TabPanel id="layout" activeTab={activeTab}>
          <Section title="Bento Grid">
            <BentoGrid cols={3}>
              <BentoCard title="매출 현황" description="이번 달 총 매출">
                <span className="text-2xl font-bold text-[var(--accent)]">₩12,500,000</span>
              </BentoCard>
              <BentoCard title="신규 고객" description="이번 주">
                <span className="text-2xl font-bold text-[var(--success)]">+128</span>
              </BentoCard>
              <BentoCard title="처리율" description="금일 기준">
                <span className="text-2xl font-bold text-[var(--warning)]">94.2%</span>
              </BentoCard>
              <BentoCard colSpan={2} title="주간 트렌드">
                <div className="h-24 flex items-center justify-center text-[var(--text-secondary)]">
                  차트 영역 (colSpan: 2)
                </div>
              </BentoCard>
              <BentoCard title="알림" rowSpan={2}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Bell size={14} className="text-[var(--accent)]" />
                    <span>새 메시지 3건</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check size={14} className="text-[var(--success)]" />
                    <span>작업 완료</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle size={14} className="text-[var(--warning)]" />
                    <span>검토 필요</span>
                  </div>
                </div>
              </BentoCard>
              <BentoCard colSpan={2} title="최근 활동">
                <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <div className="flex justify-between">
                    <span>홍길동님이 문서를 업로드했습니다</span>
                    <span>5분 전</span>
                  </div>
                  <div className="flex justify-between">
                    <span>김철수님이 댓글을 남겼습니다</span>
                    <span>12분 전</span>
                  </div>
                </div>
              </BentoCard>
            </BentoGrid>
          </Section>

          <Section title="Scrollbar">
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Liquid Glass 스타일의 스크롤바 (10px, 반투명)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <h4 className="font-semibold text-[var(--text)] mb-2">세로 스크롤</h4>
                <div
                  style={{
                    height: '150px',
                    overflowY: 'scroll',
                    padding: '8px',
                    background: 'var(--panel-2)',
                    borderRadius: '8px',
                  }}
                >
                  {Array.from({ length: 20 }, (_, i) => (
                    <p key={i} className="text-sm text-[var(--text-secondary)] py-1">
                      스크롤 테스트 항목 {i + 1}
                    </p>
                  ))}
                </div>
              </Card>
              <Card>
                <h4 className="font-semibold text-[var(--text)] mb-2">가로 스크롤</h4>
                <div
                  style={{
                    overflowX: 'scroll',
                    padding: '8px',
                    background: 'var(--panel-2)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ width: '1600px', display: 'flex', gap: '12px' }}>
                    {Array.from({ length: 20 }, (_, i) => (
                      <div
                        key={i}
                        style={{
                          minWidth: '100px',
                          height: '80px',
                          background: 'var(--panel)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <span className="text-sm text-[var(--text-secondary)]">
                          아이템 {i + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </Section>

          <Section title="Icons (Lucide)">
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Search, label: 'Search' },
                { icon: Settings, label: 'Settings' },
                { icon: Bell, label: 'Bell' },
                { icon: User, label: 'User' },
                { icon: Plus, label: 'Plus' },
                { icon: Edit, label: 'Edit' },
                { icon: Trash2, label: 'Trash' },
                { icon: Check, label: 'Check' },
                { icon: AlertTriangle, label: 'Alert' },
                { icon: Info, label: 'Info' },
                { icon: ChevronDown, label: 'Chevron' },
                { icon: Mail, label: 'Mail' },
                { icon: Phone, label: 'Phone' },
              ].map(({ icon: Icon, label }) => (
                <Tooltip key={label} content={label}>
                  <div className="p-3 rounded-lg bg-[var(--panel-2)] hover:bg-[var(--hover-bg)] transition-colors cursor-pointer">
                    <Icon size={24} className="text-[var(--text-secondary)]" />
                  </div>
                </Tooltip>
              ))}
            </div>
          </Section>
        </TabPanel>
      </div>
    </ToastProvider>
  );
}

export default UIShowcase;
