/**
 * SiteInfoForm - 현장정보 탭 콘텐츠
 *
 * 3가지 모드: view(조회) / edit(수정) / create(신규)
 * View-by-default 패턴, on-blur 검증, soft-delete 확인 모달
 */

import { useState, useEffect, useCallback, useRef, CSSProperties } from 'react';
import {
  Building2, MapPin, FileText, Hash, HardHat,
  Plus, Pencil, Trash2, Save, X, AlertTriangle,
} from 'lucide-react';
import { siteApi } from '../../services/siteApi';
import type { SiteMaster, SiteMasterCreateRequest } from '../../types/site.types';

type FormMode = 'view' | 'edit' | 'create';

interface SiteInfoFormProps {
  selectedSite: SiteMaster | null;
  onSaved: (updated: SiteMaster) => void;
  onDeleted: (id: number) => void;
  onCreated: () => void;
}

const EMPTY_FORM: SiteMasterCreateRequest = {
  siteCd: '',
  siteNm: '',
  constructorNm: '',
  bpCd: '',
  address: '',
  remark: '',
};

interface FieldErrors {
  siteCd?: string;
  siteNm?: string;
}

export function SiteInfoForm({ selectedSite, onSaved, onDeleted, onCreated }: SiteInfoFormProps) {
  const [mode, setMode] = useState<FormMode>('view');
  const [form, setForm] = useState<SiteMasterCreateRequest>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const skipNextEffectRef = useRef(false);

  // selectedSite 변경 시 폼 초기화 (저장 직후에는 스킵)
  useEffect(() => {
    if (skipNextEffectRef.current) {
      skipNextEffectRef.current = false;
      return;
    }
    if (mode === 'create') return;
    if (selectedSite) {
      setForm({
        siteCd: selectedSite.siteCd,
        siteNm: selectedSite.siteNm,
        constructorNm: selectedSite.constructorNm ?? '',
        bpCd: selectedSite.bpCd ?? '',
        address: selectedSite.address ?? '',
        remark: selectedSite.remark ?? '',
      });
      setMode('view');
    }
    setErrors({});
    setSaveMessage(null);
  }, [selectedSite]);

  // 메시지 자동 숨김
  useEffect(() => {
    if (saveMessage) {
      timerRef.current = setTimeout(() => setSaveMessage(null), 3000);
      return () => clearTimeout(timerRef.current);
    }
  }, [saveMessage]);

  const handleChange = useCallback((field: keyof SiteMasterCreateRequest, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FieldErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateField = useCallback((field: keyof FieldErrors): string | undefined => {
    if (field === 'siteCd' && !form.siteCd.trim()) return '현장코드는 필수입니다';
    if (field === 'siteNm' && !form.siteNm.trim()) return '현장명은 필수입니다';
    return undefined;
  }, [form]);

  const handleBlur = useCallback((field: keyof FieldErrors) => {
    const error = validateField(field);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, [validateField]);

  const validateAll = useCallback((): boolean => {
    const newErrors: FieldErrors = {
      siteCd: validateField('siteCd'),
      siteNm: validateField('siteNm'),
    };
    setErrors(newErrors);
    return !newErrors.siteCd && !newErrors.siteNm;
  }, [validateField]);

  const handleCreate = useCallback(() => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSaveMessage(null);
    setMode('create');
  }, []);

  const handleEdit = useCallback(() => {
    setErrors({});
    setSaveMessage(null);
    setMode('edit');
  }, []);

  const handleCancel = useCallback(() => {
    if (selectedSite) {
      setForm({
        siteCd: selectedSite.siteCd,
        siteNm: selectedSite.siteNm,
        constructorNm: selectedSite.constructorNm ?? '',
        bpCd: selectedSite.bpCd ?? '',
        address: selectedSite.address ?? '',
        remark: selectedSite.remark ?? '',
      });
    }
    setErrors({});
    setSaveMessage(null);
    setMode('view');
  }, [selectedSite]);

  const handleSave = useCallback(async () => {
    if (!validateAll()) return;
    setSaving(true);
    setSaveMessage(null);

    // API 호출 결과를 저장 (콜백은 try 밖에서 실행)
    let savedSite: SiteMaster | null = null;
    let created = false;

    try {
      if (mode === 'create') {
        const res = await siteApi.create(form);
        if (res.success) {
          setSaveMessage({ type: 'success', text: '현장이 등록되었습니다.' });
          setMode('view');
          created = true;
        } else {
          setSaveMessage({ type: 'error', text: res.message ?? '등록에 실패했습니다.' });
        }
      } else if (mode === 'edit' && selectedSite) {
        const res = await siteApi.update(selectedSite.id, form);
        if (res.success && !res.data) {
          // PUT 성공: data는 null이어야 함 (data가 있으면 GET으로 잘못 라우팅된 것)
          savedSite = {
            ...selectedSite,
            siteCd: form.siteCd,
            siteNm: form.siteNm,
            constructorNm: form.constructorNm || null,
            bpCd: form.bpCd || null,
            address: form.address || null,
            remark: form.remark || null,
          };
          setSaveMessage({ type: 'success', text: '현장이 수정되었습니다.' });
          setMode('view');
        } else if (res.success && res.data) {
          // GET 응답이 온 경우 (PUT 핸들러 미등록 - 백엔드 재시작 필요)
          setSaveMessage({ type: 'error', text: '수정 API가 아직 등록되지 않았습니다. 백엔드를 재시작해주세요.' });
        } else {
          setSaveMessage({ type: 'error', text: res.message ?? '수정에 실패했습니다.' });
        }
      }
    } catch {
      setSaveMessage({ type: 'error', text: '서버 오류가 발생했습니다.' });
    } finally {
      setSaving(false);
    }

    // 콜백은 try/catch 밖에서 실행 (flashCells 에러가 API 에러와 섞이지 않도록)
    if (savedSite) {
      skipNextEffectRef.current = true;
      onSaved(savedSite);
    }
    if (created) {
      onCreated();
    }
  }, [mode, form, selectedSite, validateAll, onCreated, onSaved]);

  const handleDelete = useCallback(async () => {
    if (!selectedSite) return;
    setDeleting(true);
    try {
      const res = await siteApi.delete(selectedSite.id);
      if (res.success) {
        setDeleteConfirmOpen(false);
        setMode('view');
        onDeleted(selectedSite.id);
      } else {
        setSaveMessage({ type: 'error', text: res.message ?? '삭제에 실패했습니다.' });
        setDeleteConfirmOpen(false);
      }
    } catch {
      setSaveMessage({ type: 'error', text: '서버 오류가 발생했습니다.' });
      setDeleteConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  }, [selectedSite, onDeleted]);

  const isEditing = mode === 'edit' || mode === 'create';

  // 빈 상태 (미선택 + 뷰모드)
  if (!selectedSite && mode !== 'create') {
    return (
      <div style={emptyContainerStyle}>
        <Building2 size={36} style={{ color: 'var(--text-tertiary)', opacity: 0.4 }} />
        <p style={emptyTextStyle}>현장을 선택하면 상세 정보가 표시됩니다</p>
        <button type="button" style={emptyCreateBtnStyle} onClick={handleCreate}>
          <Plus size={14} />
          신규 등록
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* 툴바 */}
      <div style={formToolbarStyle}>
        <div style={formToolbarLeftStyle}>
          <Building2 size={14} style={{ color: 'var(--accent)' }} />
          <span style={formToolbarTitleStyle}>
            {mode === 'create' ? '신규 등록' : '현장 기본정보'}
          </span>
          {mode === 'view' && selectedSite && (
            <span style={statusBadgeStyle}>
              {selectedSite.isActive ? '활성' : '비활성'}
            </span>
          )}
        </div>
        <div style={formToolbarRightStyle}>
          {saveMessage && (
            <span style={{
              fontSize: 12,
              fontWeight: 500,
              color: saveMessage.type === 'success' ? 'var(--success, #34c759)' : 'var(--error, #ff453a)',
              marginRight: 8,
            }}>
              {saveMessage.text}
            </span>
          )}
          {isEditing ? (
            <>
              <button type="button" style={cancelBtnStyle} onClick={handleCancel} disabled={saving}>
                <X size={13} />
                취소
              </button>
              <button type="button" style={saveBtnStyle} onClick={handleSave} disabled={saving}>
                <Save size={13} />
                {saving ? '저장 중...' : '저장'}
              </button>
            </>
          ) : (
            <>
              <button type="button" style={toolBtnStyle} onClick={handleCreate}>
                <Plus size={13} />
                신규
              </button>
              <button type="button" style={toolBtnStyle} onClick={handleEdit} disabled={!selectedSite}>
                <Pencil size={13} />
                수정
              </button>
              <button
                type="button"
                style={deleteBtnStyle}
                onClick={() => setDeleteConfirmOpen(true)}
                disabled={!selectedSite}
              >
                <Trash2 size={13} />
                삭제
              </button>
            </>
          )}
        </div>
      </div>

      {/* 폼 그리드 */}
      <div style={formGridStyle}>
        {/* 1행 */}
        <Field
          icon={<Hash size={13} />}
          label="현장코드"
          required
          value={form.siteCd}
          editing={isEditing}
          readonlyInEdit={mode === 'edit'}
          error={errors.siteCd}
          maxLength={30}
          onChange={(v) => handleChange('siteCd', v)}
          onBlur={() => handleBlur('siteCd')}
        />
        <Field
          icon={<Building2 size={13} />}
          label="현장명"
          required
          value={form.siteNm}
          editing={isEditing}
          error={errors.siteNm}
          maxLength={200}
          wide
          onChange={(v) => handleChange('siteNm', v)}
          onBlur={() => handleBlur('siteNm')}
        />
        <Field
          icon={<HardHat size={13} />}
          label="건설사"
          value={form.constructorNm}
          editing={isEditing}
          maxLength={100}
          onChange={(v) => handleChange('constructorNm', v)}
        />

        {/* 2행 */}
        <Field
          icon={<FileText size={13} />}
          label="거래처코드"
          value={form.bpCd}
          editing={isEditing}
          maxLength={30}
          onChange={(v) => handleChange('bpCd', v)}
        />
        <Field
          icon={<MapPin size={13} />}
          label="주소"
          value={form.address}
          editing={isEditing}
          maxLength={300}
          wide3
          onChange={(v) => handleChange('address', v)}
        />

        {/* 3행 */}
        <Field
          icon={<FileText size={13} />}
          label="비고"
          value={form.remark}
          editing={isEditing}
          maxLength={500}
          wide4
          textarea
          onChange={(v) => handleChange('remark', v)}
        />
      </div>

      {/* 삭제 확인 모달 */}
      {deleteConfirmOpen && (
        <div style={overlayStyle} onClick={() => !deleting && setDeleteConfirmOpen(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalIconWrapStyle}>
              <AlertTriangle size={24} style={{ color: 'var(--error, #ff453a)' }} />
            </div>
            <h3 style={modalTitleStyle}>현장 삭제</h3>
            <p style={modalDescStyle}>
              <strong>"{selectedSite?.siteNm}"</strong>을(를) 삭제하시겠습니까?
            </p>
            <p style={modalWarnStyle}>이 작업은 되돌릴 수 없습니다.</p>
            <div style={modalActionsStyle}>
              <button
                type="button"
                style={modalCancelBtnStyle}
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={deleting}
              >
                취소
              </button>
              <button
                type="button"
                style={modalDeleteBtnStyle}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Field 컴포넌트 ─── */

interface FieldProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
  required?: boolean;
  editing?: boolean;
  readonlyInEdit?: boolean;
  error?: string;
  maxLength?: number;
  wide?: boolean;
  wide3?: boolean;
  wide4?: boolean;
  textarea?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

function Field({
  icon, label, value, required, editing, readonlyInEdit, error,
  maxLength, wide, wide3, wide4, textarea, onChange, onBlur,
}: FieldProps) {
  const span = wide4 ? 4 : wide3 ? 3 : wide ? 2 : 1;

  return (
    <div style={{ ...fieldContainerStyle, gridColumn: `span ${span}` }}>
      <label style={fieldLabelStyle}>
        {icon && <span style={{ color: 'var(--text-tertiary)', display: 'flex' }}>{icon}</span>}
        {label}
        {required && <span style={{ color: 'var(--error, #ff453a)', marginLeft: 2 }}>*</span>}
      </label>
      {editing && !readonlyInEdit ? (
        <>
          {textarea ? (
            <textarea
              style={{
                ...inputStyle,
                minHeight: 56,
                resize: 'vertical',
                ...(error ? errorInputStyle : {}),
              }}
              value={value}
              maxLength={maxLength}
              onChange={(e) => onChange?.(e.target.value)}
              onBlur={onBlur}
            />
          ) : (
            <input
              type="text"
              style={{
                ...inputStyle,
                ...(error ? errorInputStyle : {}),
              }}
              value={value}
              maxLength={maxLength}
              onChange={(e) => onChange?.(e.target.value)}
              onBlur={onBlur}
            />
          )}
          {error && (
            <span style={errorTextStyle}>
              <AlertTriangle size={12} />
              {error}
            </span>
          )}
        </>
      ) : (
        <div style={{
          ...readonlyValueStyle,
          ...(readonlyInEdit ? readonlyDisabledStyle : {}),
        }}>
          {value || '-'}
        </div>
      )}
    </div>
  );
}

/* ─── Styles ─── */

const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

const emptyContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  padding: '36px 20px',
  height: '100%',
};

const emptyTextStyle: CSSProperties = {
  fontSize: 13,
  color: 'var(--text-tertiary)',
  margin: 0,
};

const emptyCreateBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  padding: '6px 16px',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--accent)',
  background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
  border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
  borderRadius: 8,
  cursor: 'pointer',
  marginTop: 4,
};

const formToolbarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
  borderBottom: '1px solid var(--border)',
  background: 'var(--panel-2)',
  flexShrink: 0,
};

const formToolbarLeftStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const formToolbarTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--text)',
};

const statusBadgeStyle: CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  padding: '1px 8px',
  borderRadius: 10,
  background: 'color-mix(in srgb, var(--success, #34c759) 12%, transparent)',
  color: 'var(--success, #34c759)',
};

const formToolbarRightStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
};

const toolBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 12px',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  background: 'var(--panel)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  cursor: 'pointer',
  transition: 'all 0.15s',
};

const deleteBtnStyle: CSSProperties = {
  ...toolBtnStyle,
  color: 'var(--error, #ff453a)',
  borderColor: 'color-mix(in srgb, var(--error, #ff453a) 30%, transparent)',
};

const saveBtnStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 14px',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--on-accent)',
  background: 'var(--accent)',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

const cancelBtnStyle: CSSProperties = {
  ...toolBtnStyle,
};

const formGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '4px 12px',
  padding: '12px 16px',
  flex: 1,
  overflowY: 'auto',
  alignContent: 'start',
};

const fieldContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  padding: '4px 0',
};

const fieldLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--text-tertiary)',
};

const readonlyValueStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text)',
  padding: '5px 8px',
  borderRadius: 6,
  background: 'var(--panel-2)',
  minHeight: 30,
  display: 'flex',
  alignItems: 'center',
};

const readonlyDisabledStyle: CSSProperties = {
  opacity: 0.6,
  background: 'color-mix(in srgb, var(--panel-2) 60%, transparent)',
};

const inputStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--text)',
  padding: '5px 10px',
  borderRadius: 6,
  border: '1px solid var(--border-input, var(--border))',
  background: 'var(--input-bg, var(--panel))',
  minHeight: 30,
  outline: 'none',
  transition: 'border-color 0.15s',
  fontFamily: 'inherit',
};

const errorInputStyle: CSSProperties = {
  borderColor: 'var(--error, #ff453a)',
  background: 'color-mix(in srgb, var(--error, #ff453a) 4%, var(--input-bg, var(--panel)))',
};

const errorTextStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 11,
  color: 'var(--error, #ff453a)',
  marginTop: 1,
};

/* ─── 삭제 확인 모달 ─── */

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.35)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle: CSSProperties = {
  background: 'var(--panel-solid, #fff)',
  borderRadius: 16,
  padding: '28px 32px 24px',
  maxWidth: 360,
  width: '90%',
  textAlign: 'center',
  boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
};

const modalIconWrapStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: 12,
  background: 'color-mix(in srgb, var(--error, #ff453a) 10%, transparent)',
  marginBottom: 12,
};

const modalTitleStyle: CSSProperties = {
  fontSize: 17,
  fontWeight: 700,
  color: 'var(--text)',
  margin: '0 0 8px',
};

const modalDescStyle: CSSProperties = {
  fontSize: 14,
  color: 'var(--text-secondary)',
  margin: '0 0 4px',
  lineHeight: 1.5,
};

const modalWarnStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--text-tertiary)',
  margin: '0 0 20px',
};

const modalActionsStyle: CSSProperties = {
  display: 'flex',
  gap: 10,
  justifyContent: 'center',
};

const modalCancelBtnStyle: CSSProperties = {
  flex: 1,
  padding: '8px 16px',
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--text-secondary)',
  background: 'var(--panel-2)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  cursor: 'pointer',
};

const modalDeleteBtnStyle: CSSProperties = {
  flex: 1,
  padding: '8px 16px',
  fontSize: 14,
  fontWeight: 600,
  color: '#fff',
  background: 'var(--error, #ff453a)',
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
};

export default SiteInfoForm;
