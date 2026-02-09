/**
 * 프로젝트(현장) 생성 팝업 모달
 *
 * site_master 테이블 기반 현장 등록 폼
 */

import { useState, useCallback, CSSProperties } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { siteApi } from '../../services/siteApi';
import type { SiteMasterCreateRequest } from '../../types/site.types';

interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const INITIAL_FORM: SiteMasterCreateRequest = {
  siteCd: '',
  siteNm: '',
  constructorNm: '',
  bpCd: '',
  address: '',
  remark: '',
};

interface FormErrors {
  siteCd?: string;
  siteNm?: string;
  constructorNm?: string;
  bpCd?: string;
  address?: string;
  remark?: string;
}

export function ProjectCreateModal({ isOpen, onClose, onSuccess }: ProjectCreateModalProps) {
  const [form, setForm] = useState<SiteMasterCreateRequest>({ ...INITIAL_FORM });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = useCallback((field: keyof SiteMasterCreateRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError(null);
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.siteCd.trim()) {
      newErrors.siteCd = '현장코드는 필수입니다';
    } else if (form.siteCd.length > 30) {
      newErrors.siteCd = '30자 이하로 입력하세요';
    }

    if (!form.siteNm.trim()) {
      newErrors.siteNm = '현장명은 필수입니다';
    } else if (form.siteNm.length > 200) {
      newErrors.siteNm = '200자 이하로 입력하세요';
    }

    if (form.constructorNm.length > 100) {
      newErrors.constructorNm = '100자 이하로 입력하세요';
    }

    if (form.bpCd.length > 30) {
      newErrors.bpCd = '30자 이하로 입력하세요';
    }

    if (form.address.length > 300) {
      newErrors.address = '300자 이하로 입력하세요';
    }

    if (form.remark.length > 500) {
      newErrors.remark = '500자 이하로 입력하세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setLoading(true);
    setServerError(null);

    try {
      const response = await siteApi.create(form);
      if (response.success) {
        setForm({ ...INITIAL_FORM });
        setErrors({});
        onSuccess();
        onClose();
      } else {
        setServerError(response.message || '등록에 실패했습니다.');
      }
    } catch {
      setServerError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [form, validate, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (!loading) {
      setForm({ ...INITIAL_FORM });
      setErrors({});
      setServerError(null);
      onClose();
    }
  }, [loading, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="프로젝트(현장) 등록"
      size="md"
      closeOnBackdrop={!loading}
      closeOnEscape={!loading}
      footer={
        <>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            등록
          </Button>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            취소
          </Button>
        </>
      }
    >
      <div style={formContainerStyle}>
        {/* 서버 에러 */}
        {serverError && (
          <div style={serverErrorStyle}>
            {serverError}
          </div>
        )}

        {/* 현장코드 */}
        <FormRow
          label="현장코드"
          required
          error={errors.siteCd}
        >
          <input
            className={`input ${errors.siteCd ? 'border-[var(--error)]' : ''}`}
            style={inputStyle}
            placeholder="예: SITE011"
            value={form.siteCd}
            onChange={(e) => handleChange('siteCd', e.target.value)}
            maxLength={30}
            disabled={loading}
            autoFocus
          />
        </FormRow>

        {/* 현장명 */}
        <FormRow
          label="현장명"
          required
          error={errors.siteNm}
        >
          <input
            className={`input ${errors.siteNm ? 'border-[var(--error)]' : ''}`}
            style={inputStyle}
            placeholder="예: 강남 테헤란 오피스텔"
            value={form.siteNm}
            onChange={(e) => handleChange('siteNm', e.target.value)}
            maxLength={200}
            disabled={loading}
          />
        </FormRow>

        {/* 건설사 + 거래처코드 (한 행) */}
        <div style={rowGroupStyle}>
          <FormRow
            label="건설사"
            error={errors.constructorNm}
            style={{ flex: 1 }}
          >
            <input
              className={`input ${errors.constructorNm ? 'border-[var(--error)]' : ''}`}
              style={inputStyle}
              placeholder="예: 현대건설"
              value={form.constructorNm}
              onChange={(e) => handleChange('constructorNm', e.target.value)}
              maxLength={100}
              disabled={loading}
            />
          </FormRow>
          <FormRow
            label="거래처코드"
            error={errors.bpCd}
            style={{ flex: 1 }}
          >
            <input
              className={`input ${errors.bpCd ? 'border-[var(--error)]' : ''}`}
              style={inputStyle}
              placeholder="예: S001"
              value={form.bpCd}
              onChange={(e) => handleChange('bpCd', e.target.value)}
              maxLength={30}
              disabled={loading}
            />
          </FormRow>
        </div>

        {/* 주소 */}
        <FormRow
          label="주소"
          error={errors.address}
        >
          <input
            className={`input ${errors.address ? 'border-[var(--error)]' : ''}`}
            style={inputStyle}
            placeholder="예: 서울시 강남구 테헤란로 789"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            maxLength={300}
            disabled={loading}
          />
        </FormRow>

        {/* 비고 */}
        <FormRow
          label="비고"
          error={errors.remark}
        >
          <textarea
            className={`input ${errors.remark ? 'border-[var(--error)]' : ''}`}
            style={textareaStyle}
            placeholder="프로젝트에 대한 추가 설명"
            value={form.remark}
            onChange={(e) => handleChange('remark', e.target.value)}
            maxLength={500}
            rows={3}
            disabled={loading}
          />
        </FormRow>
      </div>
    </Modal>
  );
}

/* ─── FormRow 서브 컴포넌트 ─── */

interface FormRowProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  style?: CSSProperties;
}

function FormRow({ label, required, error, children, style }: FormRowProps) {
  return (
    <div style={{ ...fieldStyle, ...style }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={requiredStyle}>*</span>}
      </label>
      {children}
      {error && <span style={errorTextStyle}>{error}</span>}
    </div>
  );
}

/* ─── Styles ─── */

const formContainerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
};

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const labelStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--text-secondary)',
};

const requiredStyle: CSSProperties = {
  marginLeft: 4,
  color: 'var(--error)',
};

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontSize: 14,
  color: 'var(--text)',
  background: 'var(--input-bg)',
  border: '1px solid var(--border-input)',
  borderRadius: 10,
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 80,
  fontFamily: 'inherit',
};

const rowGroupStyle: CSSProperties = {
  display: 'flex',
  gap: 12,
};

const errorTextStyle: CSSProperties = {
  fontSize: 12,
  color: 'var(--error)',
};

const serverErrorStyle: CSSProperties = {
  padding: '10px 14px',
  borderRadius: 10,
  background: 'color-mix(in srgb, var(--error) 10%, transparent)',
  border: '1px solid color-mix(in srgb, var(--error) 20%, transparent)',
  color: 'var(--error)',
  fontSize: 13,
};

export default ProjectCreateModal;
