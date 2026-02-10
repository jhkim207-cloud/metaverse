import { useState, useCallback, useRef } from 'react';
import { streamNL2SQL } from '../services/aiApi';

export function useNL2SQL() {
  const [question, setQuestion] = useState('');
  const [sql, setSQL] = useState('');
  const [results, setResults] = useState<Record<string, unknown>[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const hasResultRef = useRef(false);

  const executeQuery = useCallback((q: string) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setQuestion(q);
    setSQL('');
    setResults([]);
    setRowCount(0);
    setStatus('');
    setError(null);
    setIsLoading(true);
    hasResultRef.current = false;

    const es = streamNL2SQL(q, {
      onStatus: (msg) => setStatus(msg),
      onSQL: (generatedSql) => setSQL(generatedSql),
      onResult: (data) => {
        try {
          const parsed = JSON.parse(data);
          setResults(parsed.results || []);
          setRowCount(parsed.rowCount || 0);
          hasResultRef.current = true;
        } catch {
          setError('결과 파싱 실패');
        }
      },
      onDone: () => {
        setIsLoading(false);
        setStatus('');
      },
      onError: (msg) => {
        if (!hasResultRef.current) {
          setError(msg);
        }
        setIsLoading(false);
        setStatus('');
      },
    });

    eventSourceRef.current = es;
  }, []);

  const cancel = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsLoading(false);
    setStatus('');
  }, []);

  return { question, sql, results, rowCount, status, isLoading, error, executeQuery, cancel };
}
