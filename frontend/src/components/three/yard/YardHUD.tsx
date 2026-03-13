/**
 * YardHUD - 야적장 관제 UI 오버레이
 *
 * 탭 구조: 물건 | CCTV | 용량
 */

import { useState } from 'react';
import type { YardItemType, YardCCTV, YardSpace } from '../../../types/yard.types';

type TabKey = 'items' | 'cctv' | 'capacity';

interface YardHUDProps {
  cctvs: YardCCTV[];
  spaces: YardSpace[];
  nightMode: boolean;
  onAddItem: (type: YardItemType, width: number, length: number) => void;
  onToggleCCTVAlarm: (cctvId: string) => void;
  onToggleNightMode: () => void;
  onRotateSelected: () => void;
  selectedItemId: string | null;
  onSimulate: (width: number, length: number) => void;
  onClearSimulation: () => void;
  isSimulating: boolean;
}

const panelStyle: React.CSSProperties = {
  position: 'absolute',
  top: 12,
  right: 12,
  background: 'var(--card-bg, rgba(255,255,255,0.95))',
  borderRadius: 8,
  padding: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  fontSize: 12,
  color: 'var(--text-primary, #333)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  minWidth: 220,
  maxWidth: 260,
  zIndex: 10,
  border: '1px solid var(--border, #e0e0e0)',
};

const inputStyle: React.CSSProperties = {
  padding: '4px 8px',
  borderRadius: 4,
  border: '1px solid var(--border, #ccc)',
  fontSize: 12,
  width: '100%',
  background: 'var(--input-bg, #fff)',
  color: 'var(--text-primary, #333)',
};

const btnStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 4,
  border: 'none',
  cursor: 'pointer',
  fontSize: 12,
  fontWeight: 600,
};

const labelStyle: React.CSSProperties = { fontWeight: 600, marginBottom: 2 };

export function YardHUD({
  cctvs,
  spaces,
  nightMode,
  onAddItem,
  onToggleCCTVAlarm,
  onToggleNightMode,
  onRotateSelected,
  selectedItemId,
  onSimulate,
  onClearSimulation,
  isSimulating,
}: YardHUDProps) {
  const [tab, setTab] = useState<TabKey>('items');

  return (
    <div style={panelStyle}>
      {/* 헤더 + 야간 토글 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border, #e0e0e0)', paddingBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>야적장 관제</span>
        <button
          onClick={onToggleNightMode}
          style={{ ...btnStyle, padding: '3px 8px', fontSize: 11, background: nightMode ? '#F59E0B' : '#1E293B', color: '#fff' }}
        >
          {nightMode ? 'DAY' : 'NIGHT'}
        </button>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: 4 }}>
        {([['items', '적치'], ['cctv', 'CCTV'], ['capacity', '용량']] as [TabKey, string][]).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                ...btnStyle,
                flex: 1,
                background: tab === key ? 'var(--accent, #3B82F6)' : 'var(--input-bg, #f0f0f0)',
                color: tab === key ? '#fff' : 'var(--text-primary, #666)',
              }}
            >
              {label}
            </button>
          ),
        )}
      </div>

      {/* 탭 컨텐츠 */}
      {tab === 'items' && (
        <ItemsTab
          selectedItemId={selectedItemId}
          onAddItem={onAddItem}
          onRotateSelected={onRotateSelected}
        />
      )}
      {tab === 'cctv' && (
        <CctvTab cctvs={cctvs} onToggleCCTVAlarm={onToggleCCTVAlarm} />
      )}
      {tab === 'capacity' && (
        <CapacityTab
          spaces={spaces}
          onSimulate={onSimulate}
          onClearSimulation={onClearSimulation}
          isSimulating={isSimulating}
        />
      )}

      {/* 조작 안내 */}
      <div style={{ fontSize: 10, color: 'var(--text-tertiary, #999)', lineHeight: 1.4 }}>
        Shift+마우스: 카메라 | 드래그: 이동 | R: 회전 | Del: 삭제
      </div>
    </div>
  );
}

/* ── 적치 탭 ── */
function ItemsTab({
  selectedItemId,
  onAddItem,
  onRotateSelected,
}: {
  selectedItemId: string | null;
  onAddItem: (type: YardItemType, w: number, l: number) => void;
  onRotateSelected: () => void;
}) {
  const [itemType, setItemType] = useState<YardItemType>('BOX');
  const [width, setWidth] = useState(40);
  const [length, setLength] = useState(40);

  return (
    <>
      <div>
        <div style={labelStyle}>물건 생성</div>
        <select value={itemType} onChange={(e) => setItemType(e.target.value as YardItemType)} style={{ ...inputStyle, marginBottom: 6 }}>
          <option value="BOX">사각형</option>
          <option value="HEXAGON">육각형</option>
          <option value="CIRCLE">원형</option>
        </select>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11 }}>가로</label>
            <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={10} max={100} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11 }}>세로</label>
            <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} min={10} max={100} style={inputStyle} />
          </div>
        </div>
        <button onClick={() => onAddItem(itemType, width, length)} style={{ ...btnStyle, background: 'var(--accent, #3B82F6)', color: '#fff', width: '100%' }}>
          물건 추가
        </button>
      </div>
      {selectedItemId && (
        <button onClick={onRotateSelected} style={{ ...btnStyle, background: '#F59E0B', color: '#fff', width: '100%' }}>
          90도 회전 (R)
        </button>
      )}
    </>
  );
}

/* ── CCTV 탭 ── */
function CctvTab({
  cctvs,
  onToggleCCTVAlarm,
}: {
  cctvs: YardCCTV[];
  onToggleCCTVAlarm: (id: string) => void;
}) {
  const [selectedCctv, setSelectedCctv] = useState(cctvs[0]?.id ?? '');
  const activeCctv = cctvs.find((c) => c.id === selectedCctv);
  const alarmCount = cctvs.filter((c) => c.alarmActive).length;

  return (
    <div>
      <div style={labelStyle}>CCTV 관제 ({alarmCount}/{cctvs.length} 경고)</div>
      <div style={{ display: 'flex', gap: 6 }}>
        <select value={selectedCctv} onChange={(e) => setSelectedCctv(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
          {cctvs.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.alarmActive ? '(!)' : ''}
            </option>
          ))}
        </select>
        <button
          onClick={() => onToggleCCTVAlarm(selectedCctv)}
          style={{ ...btnStyle, background: activeCctv?.alarmActive ? '#EF4444' : '#10B981', color: '#fff' }}
        >
          {activeCctv?.alarmActive ? '해제' : '경고'}
        </button>
      </div>
    </div>
  );
}

/* ── 용량 탭 ── */
function CapacityTab({
  spaces,
  onSimulate,
  onClearSimulation,
  isSimulating,
}: {
  spaces: YardSpace[];
  onSimulate: (w: number, l: number) => void;
  onClearSimulation: () => void;
  isSimulating: boolean;
}) {
  const [simWidth, setSimWidth] = useState(40);
  const [simLength, setSimLength] = useState(40);

  // 전체 이용률
  const totalArea = spaces.reduce((s, sp) => s + sp.size.width * sp.size.length, 0);
  const usedArea = spaces.reduce((s, sp) => s + sp.occupiedArea, 0);
  const totalPct = totalArea > 0 ? Math.round((usedArea / totalArea) * 100) : 0;
  const occupiedCount = spaces.filter((s) => s.occupiedBy.length > 0).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* 전체 이용률 */}
      <div>
        <div style={labelStyle}>야적장 이용률</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
          <span>사용: {occupiedCount}/{spaces.length}칸</span>
          <span style={{ fontWeight: 700, color: totalPct > 70 ? '#EF4444' : totalPct > 30 ? '#F59E0B' : '#10B981' }}>
            {totalPct}%
          </span>
        </div>
        <div style={{ background: '#e5e7eb', borderRadius: 4, height: 8, marginTop: 4 }}>
          <div
            style={{
              background: totalPct > 70 ? '#EF4444' : totalPct > 30 ? '#F59E0B' : '#10B981',
              borderRadius: 4,
              height: '100%',
              width: `${Math.min(totalPct, 100)}%`,
              transition: 'width 0.3s',
            }}
          />
        </div>
      </div>

      {/* 시뮬레이션 */}
      <div>
        <div style={labelStyle}>배치 시뮬레이션</div>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>치수를 입력하면 최적 위치를 추천합니다</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11 }}>가로</label>
            <input type="number" value={simWidth} onChange={(e) => setSimWidth(Number(e.target.value))} min={10} max={100} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 11 }}>세로</label>
            <input type="number" value={simLength} onChange={(e) => setSimLength(Number(e.target.value))} min={10} max={100} style={inputStyle} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onSimulate(simWidth, simLength)}
            disabled={isSimulating}
            style={{ ...btnStyle, flex: 1, background: '#10B981', color: '#fff' }}
          >
            {isSimulating ? '계산중...' : '추천 위치 찾기'}
          </button>
          <button
            onClick={onClearSimulation}
            style={{ ...btnStyle, background: '#6B7280', color: '#fff' }}
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
