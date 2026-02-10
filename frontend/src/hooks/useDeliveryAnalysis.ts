import { useState, useCallback, useRef } from 'react';
import { streamDeliveryAnalysis } from '../services/aiApi';

export function useDeliveryAnalysis() {
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const analyze = useCallback((q: string) => {
    // 이전 연결 종료
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setQuestion(q);
    setAnalysis('');
    setStatus('');
    setError(null);
    setIsLoading(true);

    const es = streamDeliveryAnalysis(q, {
      onStatus: (msg) => setStatus(msg),
      onContent: (text) => setAnalysis((prev) => prev + text),
      onDone: () => {
        setIsLoading(false);
        setStatus('');
      },
      onError: (msg) => {
        setError(msg);
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

  return { question, analysis, status, isLoading, error, analyze, cancel };
}
