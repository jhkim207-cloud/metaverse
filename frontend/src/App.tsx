import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Settings,
  X,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  Bell,
  LogOut,
  Users,
  Shield,
  Menu as MenuIcon,
  Building2,
  History,
  User,
  UserCircle,
  Lock,
  Folder,
  Loader2,
  LayoutDashboard,
  GitBranch,
  Factory,
  Handshake,
  ClipboardList,
  ShoppingCart,
  Calendar,
  Wrench,
  BarChart3,
  Package,
  Truck,
  Receipt,
  HardHat,
  AlertTriangle,
  Warehouse,
  Bot,
  Database,
} from 'lucide-react';
import { DatePicker } from './components/common/DatePicker';
import { WorkflowPage } from './pages/production/WorkflowPage';
import { WorkflowStepper } from './components/workflow/WorkflowStepper';
import { StageDetailPanel } from './components/workflow/StageDetailPanel';
import { SiteDetailPanel } from './components/site/SiteDetailPanel';
import { useWorkflowCounts } from './hooks/useWorkflow';
import { HomePage } from './pages/home/HomePage';
import { DashboardDetail } from './pages/home/DashboardDetail';
import { TodaySitePanel } from './pages/home/TodaySitePanel';
import { LoginPage } from './pages/login/LoginPage';
import { DeliveryAnalysisPage } from './pages/ai/DeliveryAnalysisPage';
import { NL2SQLPage } from './pages/ai/NL2SQLPage';
import type { LoginResponse } from './types/auth.types';
import type { MenuDto } from './types/menu.types';
import type { WorkflowItem } from './types/workflow.types';
import type { SiteMaster } from './types/site.types';

/** SiteMaster인지 판별하는 타입 가드 */
function isSiteMaster(item: WorkflowItem | SiteMaster): item is SiteMaster {
  return 'siteCd' in item;
}

/** DB icon 필드 → Lucide 아이콘 매핑 */
const iconMap: Record<string, typeof Settings> = {
  settings: Settings,
  people: Users,
  security: Shield,
  menu: MenuIcon,
  business: Building2,
  history: History,
  person: User,
  account_circle: UserCircle,
  lock: Lock,
  layout_dashboard: LayoutDashboard,
  git_branch: GitBranch,
  factory: Factory,
  workflow: GitBranch,
  building: Building2,
  handshake: Handshake,
  clipboard_list: ClipboardList,
  shopping_cart: ShoppingCart,
  calendar: Calendar,
  wrench: Wrench,
  bar_chart: BarChart3,
  package: Package,
  truck: Truck,
  receipt: Receipt,
  hard_hat: HardHat,
  alert_triangle: AlertTriangle,
  warehouse: Warehouse,
};

function getIcon(iconName: string | null): typeof Settings {
  if (!iconName) return Folder;
  return iconMap[iconName] || Folder;
}

// 사용자 정보 타입
interface CurrentUser {
  name: string;
  date: string;
  avatar: string | null;
}

/** 2레벨 메뉴 렌더링 컴포넌트 */
function SideMenu({
  menus,
  loading,
  selectedMenuCode,
  expandedGroups,
  onGroupToggle,
  onMenuSelect,
}: {
  menus: MenuDto[];
  loading: boolean;
  selectedMenuCode: string | null;
  expandedGroups: Set<string>;
  onGroupToggle: (code: string) => void;
  onMenuSelect: (menu: MenuDto) => void;
}) {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
      </div>
    );
  }

  return (
    <nav className="menu" aria-label="메인 메뉴">
      <ul>
        {menus.map((group) => {
          const isExpanded = expandedGroups.has(group.code);
          const GroupIcon = getIcon(group.icon);
          const hasActiveChild = group.children.some((c) => c.code === selectedMenuCode);

          return (
            <li key={group.code} className="menu-group">
              <button
                type="button"
                className={`menu-group-btn ${hasActiveChild ? 'group-active' : ''}`}
                onClick={() => onGroupToggle(group.code)}
                aria-expanded={isExpanded}
              >
                <GroupIcon size={16} aria-hidden="true" />
                <span style={{ flex: 1 }}>{group.name}</span>
                <ChevronDown
                  size={14}
                  style={{
                    transition: 'transform 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    color: 'var(--text-secondary)',
                  }}
                  aria-hidden="true"
                />
              </button>
              {isExpanded && group.children.length > 0 && (
                <ul className="menu-children">
                  {group.children.map((child) => {
                    const ChildIcon = getIcon(child.icon);
                    const isActive = child.code === selectedMenuCode;
                    return (
                      <li key={child.code}>
                        <button
                          type="button"
                          className={isActive ? 'active' : ''}
                          onClick={() => onMenuSelect(child)}
                        >
                          <ChildIcon size={14} aria-hidden="true" />
                          <span>{child.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const AUTH_STORAGE_KEY = 'hkgn_auth';

function loadAuthFromStorage(): { user: CurrentUser; menus: MenuDto[] } | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.user?.name && Array.isArray(parsed?.menus)) {
      return { user: { ...parsed.user, date: new Date().toLocaleDateString('ko-KR') }, menus: parsed.menus };
    }
  } catch { /* corrupted data */ }
  localStorage.removeItem(AUTH_STORAGE_KEY);
  return null;
}

function App() {
  const saved = loadAuthFromStorage();
  const [isAuthenticated, setIsAuthenticated] = useState(!!saved);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(
    saved?.user ?? { name: '', date: new Date().toLocaleDateString('ko-KR'), avatar: null },
  );
  const [menus, setMenus] = useState<MenuDto[]>(saved?.menus ?? []);
  const [menuLoading] = useState(false);

  const handleLogin = useCallback((loginData: LoginResponse) => {
    const user: CurrentUser = {
      name: loginData.displayName || loginData.username,
      date: new Date().toLocaleDateString('ko-KR'),
      avatar: null,
    };
    setCurrentUser(user);
    setMenus(loginData.menus);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, menus: loginData.menus }));
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser({ name: '', date: '', avatar: null });
    setMenus([]);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);
  const [selectedMenuCode, setSelectedMenuCode] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('hkgn_theme');
    return saved === 'light' ? 'light' : 'dark';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 0, 31));
  const [selectedWorkflowItem, setSelectedWorkflowItem] = useState<WorkflowItem | SiteMaster | null>(null);
  const [selectedDashboardWidget, setSelectedDashboardWidget] = useState<string | null>(null);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [aiModalType, setAiModalType] = useState<'delivery' | 'nl2sql' | null>(null);
  const aiMenuRef = useRef<HTMLDivElement>(null);
  const { stageCounts } = useWorkflowCounts();

  const handleStepperClick = useCallback((stageCode: string) => {
    setSelectedMenuCode(stageCode);
    setSelectedWorkflowItem(null);
  }, []);

  // 메뉴 로드 완료 시 첫 번째 그룹 확장 (홈 화면 유지)
  useEffect(() => {
    if (menus.length > 0 && expandedGroups.size === 0) {
      setExpandedGroups(new Set([menus[0].code]));
    }
  }, [menus, expandedGroups.size]);

  const handleGroupToggle = useCallback((code: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  }, []);

  const handleMenuSelect = useCallback((menu: MenuDto) => {
    setSelectedMenuCode(menu.code);
    setSelectedDashboardWidget(null);
  }, []);

  const handleMenuSelectByCode = useCallback((menuCode: string) => {
    setSelectedMenuCode(menuCode);
    setSelectedDashboardWidget(null);
  }, []);

  const handleGoHome = useCallback(() => {
    setSelectedMenuCode(null);
    setSelectedWorkflowItem(null);
    setSelectedDashboardWidget(null);
  }, []);

  // Panel resize state
  const [leftWidth, setLeftWidth] = useState(220);
  const [rightWidth, setRightWidth] = useState(582);
  const [activeResizer, setActiveResizer] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((resizer: 'left' | 'right') => {
    setActiveResizer(resizer);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!activeResizer || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - containerRect.left;

      if (activeResizer === 'left') {
        const newLeftWidth = Math.max(180, Math.min(400, mouseX));
        setLeftWidth(newLeftWidth);
      } else if (activeResizer === 'right') {
        const newRightWidth = Math.max(200, Math.min(800, containerRect.width - mouseX));
        setRightWidth(newRightWidth);
      }
    },
    [activeResizer]
  );

  const handleMouseUp = useCallback(() => {
    setActiveResizer(null);
  }, []);

  useEffect(() => {
    if (activeResizer) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [activeResizer, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hkgn_theme', theme);
  }, [theme]);

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then(() => setBackendStatus('ok'))
      .catch(() => setBackendStatus('error'));
  }, []);

  // AI 메뉴 바깥 클릭 시 닫기
  useEffect(() => {
    if (!aiMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (aiMenuRef.current && !aiMenuRef.current.contains(e.target as Node)) {
        setAiMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [aiMenuOpen]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 미인증 시 로그인 페이지 표시
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-root">
      {/* Header - Dark Navy Style (이미지 기반) */}
      <header
        style={{
          height: 56,
          background: theme === 'dark' ? '#1a1f2e' : 'var(--header)',
          backdropFilter: 'var(--blur-md) var(--saturate)',
          WebkitBackdropFilter: 'var(--blur-md) var(--saturate)',
          borderBottom: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* 좌측: 로고 (클릭 시 홈) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            onClick={handleGoHome}
            style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', cursor: 'pointer' }}
          >
            (주)에이치케이 지앤텍
          </span>
        </div>

        {/* 중앙: 메뉴 검색 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
            borderRadius: 8,
            padding: '6px 12px',
            minWidth: 200,
          }}
        >
          <Search size={14} style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="메뉴 검색..."
            value={menuSearchQuery}
            onChange={(e) => setMenuSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: 13,
              color: 'var(--text)',
              width: 150,
            }}
          />
        </div>

        {/* 우측: Quick Action + 알림 + 테마 토글 + 사용자 정보 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* AI Agents 드롭다운 */}
          <div ref={aiMenuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setAiMenuOpen((prev) => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                background: 'var(--accent)',
                border: 'none',
                borderRadius: 8,
                color: 'var(--on-accent)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Bot size={16} />
              HKGNTech AI Agents
              <ChevronDown size={14} style={{ transform: aiMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
            {aiMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 6,
                background: 'var(--panel-solid)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
                zIndex: 100,
                minWidth: 220,
                overflow: 'hidden',
              }}>
                <button
                  type="button"
                  onClick={() => { setAiModalType('delivery'); setAiMenuOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '12px 16px',
                    background: 'transparent', border: 'none',
                    color: 'var(--text)', fontSize: 13, cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--panel-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Bot size={18} style={{ color: 'var(--accent)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>출고(매출) 분석</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Gemini AI</div>
                  </div>
                </button>
                <div style={{ height: 1, background: 'var(--border)' }} />
                <button
                  type="button"
                  onClick={() => { setAiModalType('nl2sql'); setAiMenuOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '12px 16px',
                    background: 'transparent', border: 'none',
                    color: 'var(--text)', fontSize: 13, cursor: 'pointer',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--panel-2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Database size={18} style={{ color: 'var(--accent)' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>자연어 SQL</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>NL2SQL (Gemini + GPT-4O)</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 알림 · 승인 */}
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <Bell size={16} />
            알림 · 승인
          </button>

          {/* Dark/Light 모드 토글 */}
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="테마 전환"
            style={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              color: 'var(--text)',
            }}
          >
            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* 사용자 정보 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* 아바타 */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {currentUser.name.charAt(0)}
            </div>
            {/* 이름 + 날짜 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                {currentUser.name}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                {currentUser.date}
              </span>
            </div>
          </div>

          {/* 로그아웃 */}
          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--text-secondary)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            <LogOut size={14} />
            로그아웃
          </button>

          {/* Backend 상태 (숨김 처리 또는 작게) */}
          {backendStatus !== 'ok' && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                padding: '4px 8px',
                borderRadius: 4,
                background:
                  backendStatus === 'error'
                    ? 'rgba(255, 69, 58, 0.15)'
                    : 'rgba(255, 159, 10, 0.15)',
                color:
                  backendStatus === 'error'
                    ? 'var(--error)'
                    : 'var(--warning)',
              }}
            >
              {backendStatus}
            </span>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <div
        ref={containerRef}
        className="resizable-container"
        style={{ height: 'calc(100vh - 56px)' }}
      >
        {/* Left Menu */}
        <div className="col left" style={{ width: leftWidth, minWidth: 180 }}>
          <SideMenu
            menus={menus}
            loading={menuLoading}
            selectedMenuCode={selectedMenuCode}
            expandedGroups={expandedGroups}
            onGroupToggle={handleGroupToggle}
            onMenuSelect={handleMenuSelect}
          />
        </div>

        {/* Left Resizer */}
        <div
          className={`resizer ${activeResizer === 'left' ? 'active' : ''}`}
          onMouseDown={() => handleMouseDown('left')}
        />

        {/* Center Content */}
        <div className="col center">
          <div className="pane center" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Filter Header - 고정 영역 (홈 화면에서는 숨김) */}
            {selectedMenuCode !== null && (() => {
              const isWf = selectedMenuCode?.startsWith('PROD_') || selectedMenuCode === 'MAIN_WORKFLOW';
              const activeStageForStepper = selectedMenuCode === 'MAIN_WORKFLOW'
                ? 'PROD_SALES_ORDER'
                : selectedMenuCode;

              return isWf ? (
                <div
                  style={{
                    flexShrink: 0,
                    background: 'var(--panel)',
                    backdropFilter: 'var(--blur-md) var(--saturate)',
                    WebkitBackdropFilter: 'var(--blur-md) var(--saturate)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <WorkflowStepper
                    activeStage={activeStageForStepper}
                    onStageClick={handleStepperClick}
                    stageCounts={stageCounts}
                  />
                </div>
              ) : (
                <div
                  style={{
                    flexShrink: 0,
                    background: 'var(--panel)',
                    backdropFilter: 'var(--blur-md) var(--saturate)',
                    WebkitBackdropFilter: 'var(--blur-md) var(--saturate)',
                    borderBottom: '1px solid var(--border)',
                    padding: '12px 20px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--text)',
                      margin: '0 0 12px 0',
                    }}
                  >
                    TM현황
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>조회기간:</span>
                      <select
                        aria-label="조회기간"
                        style={{
                          padding: '6px 12px',
                          fontSize: 13,
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-input)',
                          borderRadius: 6,
                          color: 'var(--text)',
                          cursor: 'pointer',
                        }}
                      >
                        <option>주간</option>
                        <option>월간</option>
                        <option>분기</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>구분:</span>
                      <select
                        aria-label="구분"
                        style={{
                          padding: '6px 12px',
                          fontSize: 13,
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-input)',
                          borderRadius: 6,
                          color: 'var(--text)',
                          cursor: 'pointer',
                        }}
                      >
                        <option>소유자</option>
                        <option>부서</option>
                        <option>팀</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>소유자:</span>
                      <select
                        aria-label="소유자"
                        style={{
                          padding: '6px 12px',
                          fontSize: 13,
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-input)',
                          borderRadius: 6,
                          color: 'var(--text)',
                          cursor: 'pointer',
                          minWidth: 120,
                        }}
                      >
                        <option>전체</option>
                      </select>
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>현재선택: 전체</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>기준일자:</span>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        placeholder="날짜 선택"
                      />
                    </div>
                    <button
                      type="button"
                      style={{
                        padding: '6px 20px',
                        fontSize: 13,
                        fontWeight: 500,
                        background: 'var(--accent)',
                        border: 'none',
                        borderRadius: 6,
                        color: 'var(--on-accent)',
                        cursor: 'pointer',
                      }}
                    >
                      조회
                    </button>
                    <div style={{ flex: 1 }} />
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        type="button"
                        aria-label="이전"
                        style={{
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--btn-bg)',
                          border: '1px solid var(--btn-border)',
                          borderRadius: 6,
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label="다음"
                        style={{
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--btn-bg)',
                          border: '1px solid var(--btn-border)',
                          borderRadius: 6,
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Main Content - 스크롤 영역 */}
            <div className="main-view" style={{ padding: selectedMenuCode === null ? 0 : 16, flex: 1, overflowY: 'auto' }}>
              {(() => {
                // 홈 화면 (selectedMenuCode === null)
                if (selectedMenuCode === null) {
                  return (
                    <HomePage
                      userName={currentUser.name}
                      onMenuSelect={handleMenuSelectByCode}
                      onWidgetSelect={setSelectedDashboardWidget}
                    />
                  );
                }

                // 생산관리 메뉴 또는 전체 Workflow인 경우 WorkflowPage 렌더링
                const isProductionMenu = selectedMenuCode.startsWith('PROD_') || selectedMenuCode === 'MAIN_WORKFLOW';
                if (isProductionMenu) {
                  return (
                    <WorkflowPage
                      menuCode={selectedMenuCode}
                      onItemSelect={setSelectedWorkflowItem}
                    />
                  );
                }

                // 선택된 메뉴 찾기
                const selectedItem = menus
                  .flatMap((g) => g.children)
                  .find((m) => m.code === selectedMenuCode);

                if (!selectedItem) {
                  return (
                    <div className="card" style={{ marginTop: 16 }}>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        메뉴를 선택해주세요.
                      </p>
                    </div>
                  );
                }

                return (
                  <div>
                    <div className="page-title">
                      <h2>{selectedItem.name}</h2>
                    </div>
                    <div className="card" style={{ marginTop: 16 }}>
                      <p style={{ color: 'var(--text-secondary)' }}>
                        {selectedItem.name} 페이지입니다. (경로: {selectedItem.path})
                      </p>
                    </div>
                  </div>
                );
              })()}
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
          <div className="pane" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {selectedMenuCode === null && selectedDashboardWidget ? (
              <DashboardDetail
                widgetKey={selectedDashboardWidget}
                onClose={() => setSelectedDashboardWidget(null)}
              />
            ) : (selectedMenuCode?.startsWith('PROD_') || selectedMenuCode === 'MAIN_WORKFLOW') && selectedWorkflowItem ? (
              isSiteMaster(selectedWorkflowItem) ? (
                <SiteDetailPanel
                  site={selectedWorkflowItem}
                  onClose={() => setSelectedWorkflowItem(null)}
                />
              ) : (
                <StageDetailPanel
                  item={selectedWorkflowItem}
                  onClose={() => setSelectedWorkflowItem(null)}
                />
              )
            ) : (
              <>
                {/* Filter Header - 고정 영역 */}
                <div
                  style={{
                    flexShrink: 0,
                    background: 'var(--panel)',
                    backdropFilter: 'var(--blur-md) var(--saturate)',
                    WebkitBackdropFilter: 'var(--blur-md) var(--saturate)',
                    borderBottom: '1px solid var(--border)',
                    padding: '12px 20px',
                  }}
                >
                  {/* Title Row */}
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--text)',
                      margin: '0 0 12px 0',
                    }}
                  >
                    상세 정보
                  </h3>
                  {/* Filter Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* 구분 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>구분:</span>
                      <select
                        aria-label="구분"
                        style={{
                          padding: '6px 12px',
                          fontSize: 13,
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-input)',
                          borderRadius: 6,
                          color: 'var(--text)',
                          cursor: 'pointer',
                        }}
                      >
                        <option>전체</option>
                        <option>진행중</option>
                        <option>완료</option>
                      </select>
                    </div>

                    {/* 정렬 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>정렬:</span>
                      <select
                        aria-label="정렬"
                        style={{
                          padding: '6px 12px',
                          fontSize: 13,
                          background: 'var(--input-bg)',
                          border: '1px solid var(--border-input)',
                          borderRadius: 6,
                          color: 'var(--text)',
                          cursor: 'pointer',
                        }}
                      >
                        <option>최신순</option>
                        <option>오래된순</option>
                        <option>이름순</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
                  <div className="card" style={{ padding: 16 }}>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {(selectedMenuCode?.startsWith('PROD_') || selectedMenuCode === 'MAIN_WORKFLOW')
                        ? '좌측 그리드 또는 칸반에서 항목을 선택하세요.'
                        : '선택된 항목의 상세 정보가 여기에 표시됩니다.'}
                    </p>
                  </div>
                  {selectedMenuCode === null && <TodaySitePanel />}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-drawer-panel">
            <div
              style={{
                padding: 16,
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>메뉴</h2>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="메뉴 닫기"
              >
                <X size={20} />
              </button>
            </div>
            <SideMenu
              menus={menus}
              loading={menuLoading}
              selectedMenuCode={selectedMenuCode}
              expandedGroups={expandedGroups}
              onGroupToggle={handleGroupToggle}
              onMenuSelect={(menu) => {
                handleMenuSelect(menu);
                setMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* AI Modal */}
      {aiModalType && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Overlay */}
          <div
            onClick={() => setAiModalType(null)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
            }}
          />
          {/* Modal */}
          <div style={{
            position: 'relative',
            width: '90vw',
            maxWidth: 1200,
            height: '80vh',
            background: 'var(--panel-solid)',
            borderRadius: 16,
            border: '1px solid var(--border)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: '1px solid var(--border)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {aiModalType === 'delivery' ? <Bot size={20} style={{ color: 'var(--accent)' }} /> : <Database size={20} style={{ color: 'var(--accent)' }} />}
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
                  {aiModalType === 'delivery' ? '출고(매출) 분석 - Gemini' : '자연어 SQL (NL2SQL)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAiModalType(null)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 8,
                  background: 'transparent', border: 'none',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--panel-2)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <X size={18} />
              </button>
            </div>
            {/* Modal Content */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              {aiModalType === 'delivery' ? <DeliveryAnalysisPage /> : <NL2SQLPage />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
