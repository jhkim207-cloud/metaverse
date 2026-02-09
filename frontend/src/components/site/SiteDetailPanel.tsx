/**
 * SiteDetailPanel - 우측 패널 현장 상세
 */

import { CSSProperties } from 'react';
import { X, Building2, MapPin, FileText, Hash } from 'lucide-react';
import type { SiteMaster } from '../../types/site.types';

interface SiteDetailPanelProps {
  site: SiteMaster;
  onClose: () => void;
}

export function SiteDetailPanel({ site, onClose }: SiteDetailPanelProps) {
  return (
    <div style={panelStyle}>
      {/* 헤더 */}
      <div style={headerStyle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={titleStyle}>{site.siteNm}</h3>
          <div style={tagRowStyle}>
            <span style={codeBadgeStyle}>
              <Hash size={10} />
              {site.siteCd}
            </span>
            <span style={activeBadgeStyle}>
              {site.isActive ? '활성' : '비활성'}
            </span>
          </div>
        </div>
        <button type="button" onClick={onClose} style={closeButtonStyle} aria-label="닫기">
          <X size={16} />
        </button>
      </div>

      {/* 기본정보 */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>기본정보</div>
        <div style={fieldGridStyle}>
          {site.constructorNm && (
            <div style={fieldStyle}>
              <Building2 size={12} style={{ color: 'var(--text-tertiary)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={fieldLabelStyle}>건설사</div>
                <div style={fieldValueStyle}>{site.constructorNm}</div>
              </div>
            </div>
          )}
          {site.bpCd && (
            <div style={fieldStyle}>
              <Hash size={12} style={{ color: 'var(--text-tertiary)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={fieldLabelStyle}>거래처코드</div>
                <div style={fieldValueStyle}>{site.bpCd}</div>
              </div>
            </div>
          )}
          {site.address && (
            <div style={fieldStyle}>
              <MapPin size={12} style={{ color: 'var(--text-tertiary)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={fieldLabelStyle}>주소</div>
                <div style={fieldValueStyle}>{site.address}</div>
              </div>
            </div>
          )}
          {site.remark && (
            <div style={fieldStyle}>
              <FileText size={12} style={{ color: 'var(--text-tertiary)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={fieldLabelStyle}>비고</div>
                <div style={fieldValueStyle}>{site.remark}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ─── */
const panelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  height: '100%',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: '16px 20px',
  borderBottom: '1px solid var(--border)',
};

const titleStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--text)',
  margin: 0,
  lineHeight: 1.3,
};

const tagRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginTop: 8,
  flexWrap: 'wrap',
};

const codeBadgeStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 3,
  padding: '3px 10px',
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 100,
  background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
  color: 'var(--accent)',
};

const activeBadgeStyle: CSSProperties = {
  padding: '3px 10px',
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 100,
  background: 'color-mix(in srgb, var(--success) 15%, transparent)',
  color: 'var(--success)',
};

const closeButtonStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--panel-2)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  flexShrink: 0,
};

const sectionStyle: CSSProperties = {
  padding: '16px 20px',
  flex: 1,
  overflowY: 'auto',
};

const sectionHeaderStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginBottom: 12,
};

const fieldGridStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

const fieldStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
};

const fieldLabelStyle: CSSProperties = {
  fontSize: 11,
  color: 'var(--text-tertiary)',
  marginBottom: 2,
};

const fieldValueStyle: CSSProperties = {
  fontSize: 13,
  color: 'var(--text)',
  fontWeight: 500,
};

export default SiteDetailPanel;
