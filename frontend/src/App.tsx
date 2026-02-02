import { useState, useEffect, useCallback, useRef, ComponentType } from 'react';
import {
  LayoutDashboard,
  Settings,
  X,
  Sun,
  Moon,
  Palette,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Bell,
  LogOut,
} from 'lucide-react';
import { UIShowcase } from './pages/UIShowcase';
import { DatePicker } from './components/common/DatePicker';

type MenuItem = {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: ComponentType<any>;
  children?: MenuItem[];
};

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'ui-showcase', label: 'UI 컴포넌트', icon: Palette },
  { key: 'settings', label: '설정', icon: Settings },
];

// 현재 사용자 정보 (추후 인증 Context에서 가져옴)
const currentUser = {
  name: '장은결',
  date: '2025/01/801',
  avatar: null,
};

function App() {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 0, 31));

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
  }, [theme]);

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => res.json())
      .then(() => setBackendStatus('ok'))
      .catch(() => setBackendStatus('error'));
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

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
        {/* 좌측: 로고 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
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
          {/* Quick Action 버튼 */}
          <button
            type="button"
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
            <Plus size={16} />
            Quick Action
          </button>

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
          <div className="menu">
            <ul>
              {menuItems.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    className={selectedMenu === item.key ? 'active' : ''}
                    onClick={() => setSelectedMenu(item.key)}
                  >
                    {item.icon && <item.icon size={16} />}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Left Resizer */}
        <div
          className={`resizer ${activeResizer === 'left' ? 'active' : ''}`}
          onMouseDown={() => handleMouseDown('left')}
        />

        {/* Center Content */}
        <div className="col center">
          <div className="pane center" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                TM현황
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
                {/* 조회기간 */}
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
                    <option>소유자</option>
                    <option>부서</option>
                    <option>팀</option>
                  </select>
                </div>

                {/* 소유자 */}
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

                {/* 현재선택 */}
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>현재선택: 전체</span>

                {/* 기준일자 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>기준일자:</span>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    placeholder="날짜 선택"
                  />
                </div>

                {/* 조회 버튼 */}
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

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Navigation Buttons */}
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

            {/* Main Content - 스크롤 영역 */}
            <div className="main-view" style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
              {selectedMenu === 'dashboard' && (
                <div>
                  <div className="page-title">
                    <h2>Dashboard</h2>
                  </div>
                  <div className="card" style={{ marginTop: 16 }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      BizManagement 프로젝트가 성공적으로 생성되었습니다.
                    </p>
                    <ul style={{ marginTop: 12, paddingLeft: 20, color: 'var(--text-secondary)' }}>
                      <li>Backend: Spring Boot 3.5 + Java 21</li>
                      <li>Frontend: React 18 + Vite + TypeScript</li>
                      <li>Database: PostgreSQL + Flyway</li>
                      <li>ORM: MyBatis + JPA</li>
                    </ul>
                  </div>
                </div>
              )}
              {selectedMenu === 'settings' && (
                <div>
                  <div className="page-title">
                    <h2>설정</h2>
                  </div>
                  <div className="card" style={{ marginTop: 16 }}>
                    <p style={{ color: 'var(--text-secondary)' }}>설정 페이지</p>
                  </div>
                </div>
              )}
              {selectedMenu === 'ui-showcase' && <UIShowcase />}
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
                  선택된 항목의 상세 정보가 여기에 표시됩니다.
                </p>
              </div>
            </div>
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
            <div className="menu">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      className={selectedMenu === item.key ? 'active' : ''}
                      onClick={() => {
                        setSelectedMenu(item.key);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {item.icon && <item.icon size={16} />}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
