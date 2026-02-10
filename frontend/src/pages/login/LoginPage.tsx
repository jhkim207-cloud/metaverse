import { useState, useEffect, FormEvent, CSSProperties } from 'react';
import { Building2, LogIn, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { authApi } from '../../services/authApi';
import type { LoginResponse } from '../../types/auth.types';

interface LoginPageProps {
  onLogin: (loginData: LoginResponse) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorDetail, setErrorDetail] = useState('');
  const [copied, setCopied] = useState(false);

  // localStorage에서 저장된 사번 복원
  useEffect(() => {
    const saved = localStorage.getItem('hkgn_remember_id');
    if (saved) {
      setEmployeeId(saved);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setErrorDetail('');
    setCopied(false);

    if (!employeeId.trim()) {
      setError('사번을 입력해 주세요.');
      return;
    }
    if (!password.trim()) {
      setError('비밀번호를 입력해 주세요.');
      return;
    }

    setLoading(true);

    // ID 기억하기
    if (rememberMe) {
      localStorage.setItem('hkgn_remember_id', employeeId);
    } else {
      localStorage.removeItem('hkgn_remember_id');
    }

    try {
      const response = await authApi.login({ username: employeeId, password });
      if (response.success && response.data) {
        onLogin(response.data);
      } else {
        setError(response.message || '로그인에 실패했습니다.');
        if (response.detail) {
          setErrorDetail(response.detail);
        }
      }
    } catch {
      setError('서버와 연결할 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // ── Styles ──

  const containerStyle: CSSProperties = {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: 'var(--font-sans)',
  };

  const imageStyle: CSSProperties = {
    flex: '0 0 60%',
    position: 'relative',
    backgroundImage: `url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const overlayStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(30,58,95,0.75) 0%, rgba(10,132,255,0.45) 50%, rgba(30,58,95,0.85) 100%)',
  };

  const sloganContainerStyle: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '60px 48px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
  };

  const sloganTitleStyle: CSSProperties = {
    fontSize: 36,
    fontWeight: 800,
    color: '#fff',
    marginBottom: 12,
    lineHeight: 1.3,
    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
  };

  const sloganSubStyle: CSSProperties = {
    fontSize: 16,
    fontWeight: 400,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.7,
    textShadow: '0 1px 4px rgba(0,0,0,0.3)',
  };

  const formSideStyle: CSSProperties = {
    flex: '0 0 40%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 56px',
    background: 'var(--bg)',
    position: 'relative',
  };

  const formContainerStyle: CSSProperties = {
    width: '100%',
    maxWidth: 380,
  };

  const iconContainerStyle: CSSProperties = {
    width: 64,
    height: 64,
    borderRadius: 16,
    background: 'var(--accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 8px 24px rgba(30,58,95,0.3)',
  };

  const titleStyle: CSSProperties = {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text)',
    textAlign: 'center',
    marginBottom: 4,
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 13,
    color: 'var(--text-tertiary)',
    textAlign: 'center',
    marginBottom: 36,
  };

  const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: 6,
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    height: 44,
    padding: '0 14px',
    fontSize: 14,
    color: 'var(--text)',
    background: 'var(--input-bg)',
    border: '1px solid var(--border-input)',
    borderRadius: 10,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  };

  const passwordWrapperStyle: CSSProperties = {
    position: 'relative',
  };

  const eyeButtonStyle: CSSProperties = {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-tertiary)',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  };

  const checkboxRowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
  };

  const checkboxStyle: CSSProperties = {
    width: 18,
    height: 18,
    accentColor: 'var(--accent)',
    cursor: 'pointer',
  };

  const checkboxLabelStyle: CSSProperties = {
    fontSize: 13,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    userSelect: 'none',
  };

  const buttonStyle: CSSProperties = {
    width: '100%',
    height: 48,
    border: 'none',
    borderRadius: 12,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'opacity 0.2s, transform 0.1s',
    boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
  };

  const linkStyle: CSSProperties = {
    display: 'block',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
    color: 'var(--accent)',
    textDecoration: 'underline',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: 'inherit',
  };

  const errorStyle: CSSProperties = {
    background: 'rgba(255,69,58,0.08)',
    border: '1px solid rgba(255,69,58,0.2)',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 13,
    color: 'var(--error)',
    marginBottom: 16,
  };

  return (
    <div style={containerStyle}>
      {/* 좌측: 유리 가공 산업 이미지 */}
      <div style={imageStyle} className="login-image-side">
        <div style={overlayStyle} />

        {/* 슬로건 */}
        <div style={sloganContainerStyle}>
          <div style={sloganTitleStyle}>
            새로운 희망과 열정으로 시작하는 2026
          </div>
          <div style={sloganSubStyle}>
            우리는 평균적인 회사를 만들지 않는다.<br />
            높은 기준과 몰입으로, 남들이 못 만드는 가치를 만들어 함께 나눈다.
          </div>
        </div>
      </div>

      {/* 우측: 로그인 폼 */}
      <div style={formSideStyle}>
        <div style={formContainerStyle}>
          {/* 로고 아이콘 */}
          <div style={iconContainerStyle}>
            <Building2 size={32} color="#fff" strokeWidth={1.5} />
          </div>

          {/* 제목 */}
          <div style={titleStyle}>(주)에이치케이 지앤텍</div>
          <div style={subtitleStyle}>Enterprise Operation Portal</div>

          {/* 에러 메시지 */}
          {error && (
            <div style={errorStyle}>
              <div>{error}</div>
              {errorDetail && (
                <div style={{ marginTop: 8 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                  }}>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>상세 오류</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(errorDetail);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '2px 8px',
                        fontSize: 11,
                        color: copied ? '#34c759' : 'var(--text-tertiary)',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      {copied ? <><Check size={10} /> 복사됨</> : <><Copy size={10} /> 복사</>}
                    </button>
                  </div>
                  <pre style={{
                    margin: 0,
                    padding: '6px 8px',
                    fontSize: 11,
                    lineHeight: 1.5,
                    color: 'var(--text-secondary)',
                    background: 'rgba(0,0,0,0.15)',
                    borderRadius: 4,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    userSelect: 'text',
                  }}>{errorDetail}</pre>
                </div>
              )}
            </div>
          )}

          {/* 폼 */}
          <form onSubmit={handleSubmit}>
            {/* 사번 */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>사번</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="사번을 입력하세요"
                style={inputStyle}
                autoFocus
                autoComplete="username"
              />
            </div>

            {/* 비밀번호 */}
            <div style={{ marginBottom: 0 }}>
              <label style={labelStyle}>비밀번호</label>
              <div style={passwordWrapperStyle}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  style={inputStyle}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  style={eyeButtonStyle}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ID 기억하기 */}
            <div style={checkboxRowStyle}>
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={checkboxStyle}
              />
              <label htmlFor="remember-me" style={checkboxLabelStyle}>
                ID 기억하기
              </label>
            </div>

            {/* 로그인 버튼 */}
            <button type="submit" style={buttonStyle} disabled={loading}>
              <LogIn size={18} />
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 비밀번호 변경 링크 */}
          <button type="button" style={linkStyle}>
            비밀번호 변경
          </button>
        </div>
      </div>

      {/* 반응형 CSS */}
      <style>{`
        @media (max-width: 900px) {
          .login-image-side {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
