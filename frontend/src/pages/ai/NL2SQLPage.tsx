import { useState, useRef, useEffect } from 'react';
import { Play, Loader2, XCircle } from 'lucide-react';
import { useNL2SQL } from '../../hooks/useNL2SQL';

const EXAMPLE_QUESTIONS = [
  '출고 완료된 건 목록',
  '거래처별 총 출고금액',
  '이번 달 자재별 출고량',
  '최근 10건 출고 내역',
  '수주번호별 출고 현황',
];

export function NL2SQLPage() {
  const [input, setInput] = useState('');
  const { sql, results, rowCount, status, isLoading, error, executeQuery, cancel } = useNL2SQL();
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tableRef.current && results.length > 0) {
      tableRef.current.scrollTop = 0;
    }
  }, [results]);

  const handleSubmit = () => {
    const q = input.trim();
    if (!q || isLoading) return;
    executeQuery(q);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const columns = results.length > 0 ? Object.keys(results[0]) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16, padding: 20 }}>
      {/* 예시 질문 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {EXAMPLE_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => { setInput(q); executeQuery(q); }}
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

      {/* 상태/에러 */}
      {status && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--on-accent, #60a5fa)', fontSize: 13 }}>
          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          <span>{status}</span>
        </div>
      )}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--danger, #ef4444)', fontSize: 13 }}>
          <XCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* 결과 테이블 */}
      <div
        ref={tableRef}
        style={{
          flex: 1,
          overflow: 'auto',
          background: 'var(--panel-2-solid)',
          borderRadius: 12,
          border: '1px solid var(--border)',
        }}
      >
        {results.length > 0 ? (
          <>
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid var(--border)',
              fontSize: 12,
              color: 'var(--text-secondary)',
              fontWeight: 600,
              position: 'sticky',
              top: 0,
              background: 'var(--panel-2-solid)',
              zIndex: 1,
            }}>
              조회 결과: {rowCount}건
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 13,
              }}>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col} style={{
                        padding: '10px 14px',
                        textAlign: 'left',
                        borderBottom: '2px solid var(--border)',
                        fontWeight: 600,
                        color: 'var(--text)',
                        whiteSpace: 'nowrap',
                        position: 'sticky',
                        top: 38,
                        background: 'var(--panel-2-solid)',
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      {columns.map((col) => (
                        <td key={col} style={{
                          padding: '8px 14px',
                          color: row[col] != null ? 'var(--text)' : '#ef4444',
                          whiteSpace: 'nowrap',
                          fontStyle: row[col] != null ? 'normal' : 'italic',
                        }}>
                          {row[col] != null ? String(row[col]) : 'NULL'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div style={{ padding: 20, color: 'var(--text-secondary)', fontSize: 14 }}>
            {!sql && !status && !error && '자연어로 질문하면 SQL을 생성하여 실행합니다.'}
          </div>
        )}
      </div>

      {/* 입력 영역 */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="자연어로 데이터를 조회하세요..."
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
            <Play size={16} />
            실행
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
