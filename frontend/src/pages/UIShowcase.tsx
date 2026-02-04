/**
 * UI 컴포넌트 쇼케이스 페이지
 * 모든 표준 UI 컴포넌트를 한 화면에서 확인할 수 있습니다.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
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
  Grid3X3,
  Copy,
  Clipboard,
  MoreHorizontal,
} from 'lucide-react';

// AG Grid
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridReadyEvent, CellValueChangedEvent, RowSelectionOptions } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, themeQuartz, colorSchemeDark } from 'ag-grid-community';

// AG Grid 모듈 등록
ModuleRegistry.registerModules([AllCommunityModule]);

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
import { EditableGrid, EditableColumn, ContextMenuItem } from '../components/ui/EditableGrid';

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

// EditableGrid 샘플 데이터
interface OrderLine {
  [key: string]: unknown;
  id: number;
  productCode: string;
  width: number;
  height: number;
  quantity: number;
  unitPrice: number;
}

// AG Grid 샘플 데이터
interface AGGridRow {
  id: number;
  make: string;
  model: string;
  price: number;
  year: number;
  color: string;
}

const agGridSampleData: AGGridRow[] = [
  { id: 1, make: 'Toyota', model: 'Camry', price: 35000, year: 2023, color: 'White' },
  { id: 2, make: 'Honda', model: 'Accord', price: 32000, year: 2022, color: 'Black' },
  { id: 3, make: 'BMW', model: '3 Series', price: 45000, year: 2023, color: 'Blue' },
  { id: 4, make: 'Mercedes', model: 'C-Class', price: 48000, year: 2023, color: 'Silver' },
  { id: 5, make: 'Audi', model: 'A4', price: 42000, year: 2022, color: 'Red' },
  { id: 6, make: 'Tesla', model: 'Model 3', price: 40000, year: 2023, color: 'White' },
  { id: 7, make: 'Hyundai', model: 'Sonata', price: 28000, year: 2023, color: 'Gray' },
  { id: 8, make: 'Kia', model: 'K5', price: 27000, year: 2022, color: 'Black' },
];

// AG Grid Row Spanning 샘플 데이터
interface AGGridSpanRow {
  id: number;
  category: string;
  product: string;
  price: number;
  stock: number;
}

const agGridSpanData: AGGridSpanRow[] = [
  { id: 1, category: '전자기기', product: '노트북', price: 1500000, stock: 50 },
  { id: 2, category: '전자기기', product: '태블릿', price: 800000, stock: 120 },
  { id: 3, category: '전자기기', product: '스마트폰', price: 1200000, stock: 200 },
  { id: 4, category: '주변기기', product: '키보드', price: 85000, stock: 300 },
  { id: 5, category: '주변기기', product: '마우스', price: 45000, stock: 400 },
  { id: 6, category: '음향기기', product: '스피커', price: 180000, stock: 80 },
  { id: 7, category: '음향기기', product: '헤드셋', price: 250000, stock: 150 },
  { id: 8, category: '음향기기', product: '마이크', price: 120000, stock: 100 },
];

// EditableGrid 고급 기능 샘플 데이터
interface ProductRow {
  [key: string]: unknown;
  id: number;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
}

const productSampleData: ProductRow[] = [
  { id: 1, code: 'P001', name: '노트북', category: '전자기기', price: 1500000, stock: 50, status: '판매중' },
  { id: 2, code: 'P002', name: '모니터', category: '전자기기', price: 350000, stock: 120, status: '판매중' },
  { id: 3, code: 'P003', name: '키보드', category: '주변기기', price: 85000, stock: 200, status: '판매중' },
  { id: 4, code: 'P004', name: '마우스', category: '주변기기', price: 45000, stock: 300, status: '판매중' },
  { id: 5, code: 'P005', name: '웹캠', category: '주변기기', price: 120000, stock: 0, status: '품절' },
  { id: 6, code: 'P006', name: '스피커', category: '음향기기', price: 180000, stock: 80, status: '판매중' },
  { id: 7, code: 'P007', name: '헤드셋', category: '음향기기', price: 250000, stock: 45, status: '판매중' },
  { id: 8, code: 'P008', name: 'USB 허브', category: '주변기기', price: 35000, stock: 150, status: '판매중' },
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

  // 다크모드 감지
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 초기 다크모드 상태 확인
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();

    // MutationObserver로 클래스 변경 감지
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // AG Grid 다크모드 테마
  const agGridTheme = useMemo(() => {
    return isDarkMode ? themeQuartz.withPart(colorSchemeDark) : themeQuartz;
  }, [isDarkMode]);

  // EditableGrid 상태
  const [orderLines, setOrderLines] = useState<OrderLine[]>([
    { id: 1, productCode: 'PRD-001', width: 500, height: 300, quantity: 10, unitPrice: 15000 },
    { id: 2, productCode: 'PRD-002', width: 800, height: 600, quantity: 5, unitPrice: 25000 },
    { id: 3, productCode: 'PRD-003', width: 1200, height: 900, quantity: 3, unitPrice: 45000 },
  ]);

  // AG Grid 상태
  const [agGridData, setAgGridData] = useState<AGGridRow[]>(agGridSampleData);
  const [agGridSpanDataState] = useState<AGGridSpanRow[]>(agGridSpanData);

  const agGridColDefs: ColDef<AGGridRow>[] = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 70, sortable: true, filter: true },
    { field: 'make', headerName: '제조사', width: 120, sortable: true, filter: true, editable: true },
    { field: 'model', headerName: '모델', width: 120, sortable: true, filter: true, editable: true },
    { field: 'year', headerName: '연식', width: 100, sortable: true, filter: true },
    { field: 'color', headerName: '색상', width: 100, sortable: true, filter: true, editable: true },
    {
      field: 'price',
      headerName: '가격',
      width: 130,
      sortable: true,
      filter: true,
      editable: true,
      valueFormatter: (params) => params.value ? `₩${params.value.toLocaleString()}` : '',
    },
  ], []);

  const agGridRowSelection = useMemo<RowSelectionOptions>(() => ({
    mode: 'multiRow',
    checkboxes: true,
    headerCheckbox: true,
  }), []);

  // AG Grid Row Spanning 컬럼 정의
  const agGridSpanColDefs: ColDef<AGGridSpanRow>[] = useMemo(() => [
    {
      field: 'category',
      headerName: '카테고리',
      width: 120,
      rowSpan: (params) => {
        const category = params.data?.category;
        if (!category) return 1;
        // 같은 카테고리가 연속으로 몇 개인지 계산
        const data = agGridSpanDataState;
        const currentIndex = data.findIndex((row) => row.id === params.data?.id);
        if (currentIndex === -1) return 1;
        // 이전 행과 같은 카테고리면 span 하지 않음
        if (currentIndex > 0 && data[currentIndex - 1].category === category) {
          return 1;
        }
        // 연속되는 같은 카테고리 개수 계산
        let span = 1;
        for (let i = currentIndex + 1; i < data.length; i++) {
          if (data[i].category === category) {
            span++;
          } else {
            break;
          }
        }
        return span;
      },
      cellClassRules: {
        'ag-cell-span-first': (params) => {
          const data = agGridSpanDataState;
          const currentIndex = data.findIndex((row) => row.id === params.data?.id);
          if (currentIndex === 0) return true;
          return currentIndex > 0 && data[currentIndex - 1].category !== params.data?.category;
        },
      },
      cellStyle: (params): Record<string, string> => {
        const data = agGridSpanDataState;
        const currentIndex = data.findIndex((row) => row.id === params.data?.id);
        // 첫 번째 셀이거나 이전 셀과 카테고리가 다르면 보이게
        if (currentIndex === 0 || (currentIndex > 0 && data[currentIndex - 1].category !== params.data?.category)) {
          return {
            backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          };
        }
        // 연속된 같은 카테고리 셀은 내용 숨김
        return { visibility: 'hidden' };
      },
    },
    { field: 'product', headerName: '상품명', width: 120, sortable: true, filter: true },
    {
      field: 'price',
      headerName: '가격',
      width: 130,
      sortable: true,
      filter: true,
      valueFormatter: (params) => params.value ? `₩${params.value.toLocaleString()}` : '',
    },
    { field: 'stock', headerName: '재고', width: 100, sortable: true, filter: true },
  ], [agGridSpanDataState, isDarkMode]);

  const onAgGridCellValueChanged = useCallback((event: CellValueChangedEvent<AGGridRow>) => {
    console.log('AG Grid 셀 변경:', event.data);
    setAgGridData((prev) =>
      prev.map((row) => (row.id === event.data?.id ? { ...row, ...event.data } : row))
    );
  }, []);

  const onAgGridReady = useCallback((_event: GridReadyEvent) => {
    console.log('AG Grid ready');
  }, []);

  // EditableGrid 고급 기능 상태
  const [productData, setProductData] = useState<ProductRow[]>(productSampleData);
  const [selectedProducts, setSelectedProducts] = useState<ProductRow[]>([]);

  const advancedProductColumns: EditableColumn<ProductRow>[] = useMemo(() => [
    { key: 'code', header: '상품코드', width: 100, editable: false, sortable: true },
    { key: 'name', header: '상품명', width: 120, editable: true, sortable: true },
    { key: 'category', header: '카테고리', width: 100, editable: false, sortable: true },
    { key: 'price', header: '가격', width: 120, editable: true, type: 'number', sortable: true,
      render: (value) => (
        <div className="w-full h-full flex items-center justify-end py-1">
          ₩{(value as number).toLocaleString()}
        </div>
      ),
    },
    { key: 'stock', header: '재고', width: 80, editable: true, type: 'number', sortable: true,
      render: (value) => (
        <div className="w-full h-full flex items-center justify-end py-1 tabular-nums">
          {(value as number).toLocaleString()}
        </div>
      ),
    },
    { key: 'status', header: '상태', width: 80, editable: false, sortable: true,
      render: (value) => (
        <div className={`w-full h-full flex items-center justify-center rounded-md px-2 text-xs font-semibold ${
          value === '판매중'
            ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
            : 'bg-red-500/12 text-red-600 dark:text-red-400'
        }`}>
          {value as string}
        </div>
      ),
    },
  ], []);

  const handleProductChange = useCallback((rowIndex: number, key: keyof ProductRow, value: unknown) => {
    setProductData((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, [key]: value } : row))
    );
  }, []);

  const handleProductRowSelect = useCallback((selectedRows: ProductRow[]) => {
    setSelectedProducts(selectedRows);
  }, []);

  const getProductContextMenu = useCallback((row: ProductRow, _rowIndex: number): ContextMenuItem[] => [
    { label: '복사', icon: <Copy size={14} />, onClick: () => console.log('복사:', row.name) },
    { label: '붙여넣기', icon: <Clipboard size={14} />, onClick: () => console.log('붙여넣기') },
    { divider: true, label: '', onClick: () => {} },
    { label: '상세보기', icon: <MoreHorizontal size={14} />, onClick: () => console.log('상세보기:', row) },
    { label: '삭제', icon: <Trash2 size={14} />, onClick: () => console.log('삭제:', row.id), disabled: row.status === '품절' },
  ], []);

  const editableColumns: EditableColumn<OrderLine>[] = [
    { key: 'productCode', header: '품목코드', width: 120, editable: true, sortable: true },
    { key: 'width', header: '가로(mm)', width: 100, editable: true, type: 'number', sortable: true },
    { key: 'height', header: '세로(mm)', width: 100, editable: true, type: 'number', sortable: true },
    { key: 'quantity', header: '수량', width: 80, editable: true, type: 'number', sortable: true },
    {
      key: 'unitPrice',
      header: '단가',
      width: 120,
      editable: false,
      sortable: true,
      type: 'number',
      render: (value) => (
        <div className="w-full h-full flex items-center justify-end py-1">
          ₩{(value as number).toLocaleString()}
        </div>
      ),
    },
  ];

  const handleOrderLineChange = (rowIndex: number, key: keyof OrderLine, value: unknown) => {
    setOrderLines((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, [key]: value } : row))
    );
  };

  const handleAddOrderLine = () => {
    const newId = Math.max(...orderLines.map((r) => r.id), 0) + 1;
    setOrderLines((prev) => [
      ...prev,
      { id: newId, productCode: '', width: 0, height: 0, quantity: 0, unitPrice: 0 },
    ]);
  };

  const handleDeleteOrderLine = (rowIndex: number) => {
    setOrderLines((prev) => prev.filter((_, i) => i !== rowIndex));
  };

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

  // 수요관리 그리드 상태
  interface DemandRow {
    [key: string]: unknown;
    id: number;
    category: string; // 중분류
    salesUnit: string; // 영업관리단위
    rowType: '목표' | '전년'; // 구분
    total: number; // 합계
    month01: number;
    month02: number;
    month03: number;
    month04: number;
    month05: number;
    month06: number;
    month07: number;
    month08: number;
    month09: number;
    month10: number;
    month11: number;
    month12: number;
  }

  const [demandData, setDemandData] = useState<DemandRow[]>([
    // 품습제 - 목표
    { id: 1, category: '품습제', salesUnit: '철물자재산업', rowType: '목표', total: 1200, month01: 100, month02: 100, month03: 100, month04: 100, month05: 100, month06: 100, month07: 100, month08: 100, month09: 100, month10: 100, month11: 100, month12: 100 },
    // 품습제 - 전년
    { id: 2, category: '품습제', salesUnit: '철물자재산업', rowType: '전년', total: 1100, month01: 90, month02: 95, month03: 92, month04: 88, month05: 93, month06: 91, month07: 94, month08: 92, month09: 90, month10: 93, month11: 91, month12: 91 },
    // 유리산업 기타 - 목표
    { id: 3, category: '품습제', salesUnit: '유리산업 기타', rowType: '목표', total: 600, month01: 50, month02: 50, month03: 50, month04: 50, month05: 50, month06: 50, month07: 50, month08: 50, month09: 50, month10: 50, month11: 50, month12: 50 },
    // 유리산업 기타 - 전년
    { id: 4, category: '품습제', salesUnit: '유리산업 기타', rowType: '전년', total: 550, month01: 45, month02: 46, month03: 45, month04: 46, month05: 45, month06: 46, month07: 46, month08: 46, month09: 45, month10: 46, month11: 47, month12: 47 },
    // 2차실란트 - 목표
    { id: 5, category: '2차실란트', salesUnit: 'AL각봉', rowType: '목표', total: 2400, month01: 200, month02: 200, month03: 200, month04: 200, month05: 200, month06: 200, month07: 200, month08: 200, month09: 200, month10: 200, month11: 200, month12: 200 },
    // 2차실란트 - 전년
    { id: 6, category: '2차실란트', salesUnit: 'AL각봉', rowType: '전년', total: 2200, month01: 180, month02: 185, month03: 182, month04: 183, month05: 184, month06: 185, month07: 183, month08: 184, month09: 185, month10: 183, month11: 184, month12: 182 },
    // WE각봉(일반) - 목표
    { id: 7, category: '2차실란트', salesUnit: 'WE각봉(일반)', rowType: '목표', total: 1800, month01: 150, month02: 150, month03: 150, month04: 150, month05: 150, month06: 150, month07: 150, month08: 150, month09: 150, month10: 150, month11: 150, month12: 150 },
    // WE각봉(일반) - 전년
    { id: 8, category: '2차실란트', salesUnit: 'WE각봉(일반)', rowType: '전년', total: 1700, month01: 140, month02: 142, month03: 141, month04: 142, month05: 143, month06: 141, month07: 142, month08: 141, month09: 143, month10: 142, month11: 141, month12: 142 },
  ]);

  const [demandNotes, setDemandNotes] = useState('');

  // EditableGrid용 수요관리 컬럼 정의
  const demandColumns: EditableColumn<DemandRow>[] = [
    {
      key: 'category',
      header: '중분류',
      width: 90,
      editable: false,
      render: (value: unknown) => (
        <div className="w-full h-full flex items-center justify-center font-medium">
          {value as string}
        </div>
      ),
    },
    {
      key: 'salesUnit',
      header: '영업관리단위',
      width: 130,
      editable: false,
      render: (value: unknown) => (
        <div className="w-full h-full flex items-center">
          {value as string}
        </div>
      ),
    },
    {
      key: 'rowType',
      header: '구분',
      width: 60,
      editable: false,
      render: (value: unknown, row: DemandRow) => (
        <div className={`w-full h-full flex items-center justify-center ${
          row.rowType === '목표' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500'
        }`}>
          {value as string}
        </div>
      ),
    },
    {
      key: 'total',
      header: '합계',
      width: 80,
      editable: false,
      type: 'number',
      render: (value: unknown, row: DemandRow) => (
        <div className={`w-full h-full flex items-center justify-end font-medium ${
          row.rowType === '목표' ? 'text-blue-700 dark:text-blue-300' : ''
        }`}>
          {(value as number).toLocaleString()}
        </div>
      ),
    },
    { key: 'month01', header: '01월', width: 70, editable: true, type: 'number', sortable: false },
    { key: 'month02', header: '02월', width: 70, editable: true, type: 'number', sortable: false },
    { key: 'month03', header: '03월', width: 70, editable: true, type: 'number', sortable: false },
    { key: 'month04', header: '04월', width: 70, editable: true, type: 'number', sortable: false },
    { key: 'month05', header: '05월', width: 70, editable: true, type: 'number', sortable: false },
    { key: 'month06', header: '06월', width: 70, editable: true, type: 'number', sortable: false },
    { key: 'month07', header: '07월', width: 70, editable: true, type: 'number', sortable: false },
    { key: 'month08', header: '08월', width: 70, editable: true, type: 'number', sortable: false },
    { key: 'month09', header: '09월', width: 70, editable: true, type: 'number', sortable: false },
    { key: 'month10', header: '10월', width: 70, editable: true, type: 'number', sortable: false },
    { key: 'month11', header: '11월', width: 70, editable: true, type: 'number', sortable: false },
    { key: 'month12', header: '12월', width: 70, editable: true, type: 'number', sortable: false },
  ];

  const handleDemandChange = (rowIndex: number, key: keyof DemandRow, value: unknown) => {
    setDemandData((prev: DemandRow[]) => {
      const updated = prev.map((row: DemandRow, i: number) => {
        if (i !== rowIndex) return row;
        const newRow = { ...row, [key]: value };
        // 월별 합계 자동 계산
        if (typeof key === 'string' && key.startsWith('month')) {
          newRow.total =
            newRow.month01 + newRow.month02 + newRow.month03 + newRow.month04 +
            newRow.month05 + newRow.month06 + newRow.month07 + newRow.month08 +
            newRow.month09 + newRow.month10 + newRow.month11 + newRow.month12;
        }
        return newRow;
      });
      return updated;
    });
  };

  const tabs = [
    { id: 'buttons', label: 'Buttons', icon: <Plus size={16} /> },
    { id: 'inputs', label: 'Inputs', icon: <Edit size={16} /> },
    { id: 'data', label: 'Data Display', icon: <Info size={16} /> },
    { id: 'feedback', label: 'Feedback', icon: <Bell size={16} /> },
    { id: 'layout', label: 'Layout', icon: <Settings size={16} /> },
    { id: 'grids', label: 'Grids', icon: <Grid3X3 size={16} /> },
    { id: 'demand', label: '수요관리', icon: <Settings size={16} /> },
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

          <Section title="EditableGrid">
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Excel-like 대량 데이터 입력을 위한 편집 가능 그리드. Tab/Enter/Arrow 키 네비게이션, 셀 편집, 행 추가/삭제 지원.
            </p>
            <EditableGrid
              columns={editableColumns}
              data={orderLines}
              onChange={handleOrderLineChange}
              keyExtractor={(row) => row.id}
              showRowNumbers={true}
              allowAddRow={true}
              allowDeleteRow={true}
              onAddRow={handleAddOrderLine}
              onDeleteRow={handleDeleteOrderLine}
            />
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

        {/* Grids Tab - AG Grid & EditableGrid Advanced */}
        <TabPanel id="grids" activeTab={activeTab}>
          <Section title="AG Grid">
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              AG Grid Community - 정렬, 필터, 편집, 행 선택 지원
            </p>
            <div className="border border-[var(--border)] rounded-lg overflow-hidden" style={{ height: 350 }}>
              <AgGridReact<AGGridRow>
                rowData={agGridData}
                columnDefs={agGridColDefs}
                rowSelection={agGridRowSelection}
                onGridReady={onAgGridReady}
                onCellValueChanged={onAgGridCellValueChanged}
                animateRows={true}
                pagination={true}
                paginationPageSize={5}
                theme={agGridTheme}
              />
            </div>
            <div className="mt-2 text-xs text-[var(--text-tertiary)]">
              * 제조사, 모델, 색상, 가격 컬럼은 더블클릭으로 편집 가능
            </div>
          </Section>

          <Section title="AG Grid - Row Spanning (셀 병합)">
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              같은 카테고리의 셀을 세로로 병합하여 표시합니다. (Row Spanning)
            </p>
            <div className="border border-[var(--border)] rounded-lg overflow-hidden" style={{ height: 320 }}>
              <AgGridReact<AGGridSpanRow>
                rowData={agGridSpanDataState}
                columnDefs={agGridSpanColDefs}
                animateRows={true}
                theme={agGridTheme}
                suppressRowTransform={true}
              />
            </div>
            <div className="mt-3 p-3 bg-[var(--panel-2)] border border-[var(--border)] rounded-lg">
              <h4 className="text-sm font-medium text-[var(--text)] mb-2">Row Spanning 구현 방법</h4>
              <pre className="text-xs text-[var(--text-secondary)] overflow-x-auto">
{`{
  field: 'category',
  rowSpan: (params) => {
    // 같은 카테고리가 연속으로 몇 개인지 계산
    return calculateSpan(params.data);
  },
  cellStyle: (params) => {
    // 첫 번째 셀만 보이게, 나머지는 숨김
    if (isFirstInGroup(params)) {
      return { fontWeight: 'bold' };
    }
    return { visibility: 'hidden' };
  }
}`}
              </pre>
              <p className="mt-2 text-xs text-[var(--text-tertiary)]">
                * Row Spanning 사용 시 <code className="bg-[var(--panel)] px-1 rounded">suppressRowTransform=true</code> 필수
              </p>
            </div>
          </Section>

          <Section title="EditableGrid 고급 기능">
            <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3">
              <p className="text-sm text-[var(--text-secondary)]">
                행 선택 체크박스, 컨텍스트 메뉴, Delete 키 셀 값 삭제
              </p>
            </div>

            {/* 선택된 행 정보 */}
            {selectedProducts.length > 0 && (
              <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  선택된 상품: {selectedProducts.length}개
                  ({selectedProducts.map(p => p.name).join(', ')})
                </span>
              </div>
            )}

            <div
              className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-2"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <EditableGrid
                columns={advancedProductColumns}
                data={productData}
                onChange={handleProductChange}
                keyExtractor={(row) => row.id}
                showRowNumbers={true}
                showRowSelection={true}
                allowAddRow={false}
                allowDeleteRow={false}
                onRowSelect={handleProductRowSelect}
                contextMenuItems={getProductContextMenu}
                rowHeight={42}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <Card className="p-3">
                <h4 className="font-medium text-[var(--text)] mb-2">사용법</h4>
                <ul className="space-y-1 text-[var(--text-secondary)]">
                  <li>• 체크박스로 행 선택 (다중 선택 가능)</li>
                  <li>• 행 우클릭으로 컨텍스트 메뉴</li>
                  <li>• Delete/Backspace로 셀 값 삭제 (행 삭제 X)</li>
                </ul>
              </Card>
              <Card className="p-3">
                <h4 className="font-medium text-[var(--text)] mb-2">새 Props</h4>
                <ul className="space-y-1 text-[var(--text-secondary)] font-mono text-xs">
                  <li>showRowSelection: boolean</li>
                  <li>onRowSelect: (rows) =&gt; void</li>
                  <li>contextMenuItems: (row, idx) =&gt; MenuItem[]</li>
                </ul>
              </Card>
            </div>
          </Section>
        </TabPanel>

        {/* Demand Management Tab */}
        <TabPanel id="demand" activeTab={activeTab}>
          <Section title="수요관리 그리드 (EditableGrid)">
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              EditableGrid 컴포넌트 기반 - 멀티셀 선택, 키보드 네비게이션, Excel 붙여넣기 지원
            </p>

            {/* EditableGrid 기반 수요관리 그리드 */}
            <EditableGrid
              columns={demandColumns}
              data={demandData}
              onChange={handleDemandChange}
              keyExtractor={(row) => row.id}
              showRowNumbers={true}
              allowAddRow={false}
              allowDeleteRow={false}
              rowHeight={36}
            />

            {/* 합계 행 표시 */}
            <div className="mt-2 p-3 bg-[var(--panel-2)] border border-[var(--border)] rounded-lg">
              <div className="flex items-center gap-4 text-sm">
                <span className="font-medium text-[var(--text)]">목표 합계:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {demandData.filter((r: DemandRow) => r.rowType === '목표').reduce((sum: number, r: DemandRow) => sum + r.total, 0).toLocaleString()}
                </span>
                <span className="text-[var(--text-secondary)]">|</span>
                {(['month01', 'month02', 'month03', 'month04', 'month05', 'month06'] as const).map((monthKey, idx) => (
                  <span key={monthKey} className="text-[var(--text-secondary)]">
                    {idx + 1}월: {demandData.filter((r: DemandRow) => r.rowType === '목표').reduce((sum: number, r: DemandRow) => sum + r[monthKey], 0).toLocaleString()}
                  </span>
                ))}
                <span className="text-[var(--text-tertiary)]">...</span>
              </div>
            </div>

            {/* 비고 영역 */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[var(--text)] mb-2">비고</label>
              <textarea
                value={demandNotes}
                onChange={(e) => setDemandNotes(e.target.value)}
                className="w-full h-24 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--panel)] text-sm resize-none"
                placeholder="비고 내용을 입력하세요..."
              />
            </div>

            {/* 액션 버튼 */}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary">취소</Button>
              <Button variant="primary">저장</Button>
            </div>
          </Section>
        </TabPanel>
      </div>
    </ToastProvider>
  );
}

export default UIShowcase;
