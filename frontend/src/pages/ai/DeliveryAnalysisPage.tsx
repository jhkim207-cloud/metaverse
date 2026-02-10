import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, XCircle } from 'lucide-react';
import { useDeliveryAnalysis } from '../../hooks/useDeliveryAnalysis';

const EXAMPLE_QUESTIONS = [
  '이번 달 출고 현황',
  '거래처별 출고 요약',
  '자재별 출고 분석',
  '최근 3개월 월별 출고 추이',
  '현장별 출고 현황',
];

export function DeliveryAnalysisPage() {
  const [input, setInput] = useState('');
  const { analysis, status, isLoading, error, analyze, cancel } = useDeliveryAnalysis();
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [analysis]);

  const handleSubmit = () => {
    const q = input.trim();
    if (!q || isLoading) return;
    analyze(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16, padding: 20 }}>
      {/* 예시 질문 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {EXAMPLE_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => { setInput(q); analyze(q); }}
            disabled={isLoading}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid var(--border)',
              background: 'var(--panel-2-solid)',
              color: 'var(--text-secondary)',
              fontSize: 12,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* 결과 영역 */}
      <div
        ref={resultRef}
        style={{
          flex: 1,
          overflow: 'auto',
          background: 'var(--panel-2-solid)',
          borderRadius: 12,
          padding: 20,
          border: '1px solid var(--border)',
          fontSize: 14,
          lineHeight: 1.7,
          color: 'var(--text)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {status && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--on-accent, #60a5fa)', marginBottom: 12 }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            <span>{status}</span>
          </div>
        )}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger, #ef4444)', marginBottom: 12 }}>
            <XCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {analysis || (!status && !error && (
          <span style={{ color: 'var(--text-secondary)' }}>
            질문을 입력하면 Gemini AI가 출고 데이터를 분석합니다.
          </span>
        ))}
      </div>

      {/* 입력 영역 */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="출고 데이터에 대해 질문하세요..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--panel-solid)',
            color: 'var(--text)',
            fontSize: 14,
            outline: 'none',
          }}
        />
        {isLoading ? (
          <button
            type="button"
            onClick={cancel}
            style={{
              padding: '12px 20px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--danger, #ef4444)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <XCircle size={16} />
            중단
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!input.trim()}
            style={{
              padding: '12px 20px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--accent)',
              color: 'var(--on-accent)',
              fontSize: 14,
              fontWeight: 600,
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              opacity: input.trim() ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Send size={16} />
            분석
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
