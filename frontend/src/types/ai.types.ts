/** 출고(매출) 분석 요청 */
export interface DeliveryAnalysisRequest {
  question: string;
}

/** NL2SQL 요청 */
export interface NL2SQLRequest {
  question: string;
}

/** NL2SQL 결과 */
export interface NL2SQLResult {
  question: string;
  sql: string;
  results: Record<string, unknown>[];
  rowCount: number;
}

/** SSE 콜백 인터페이스 */
export interface SSECallbacks {
  onStatus?: (message: string) => void;
  onContent?: (text: string) => void;
  onSQL?: (sql: string) => void;
  onResult?: (data: string) => void;
  onDone?: () => void;
  onError?: (message: string) => void;
}
