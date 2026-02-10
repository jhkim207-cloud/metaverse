# HKGNTech AI Agents - 2개 기능 추가 구현 계획

## Context

HKGNTech AI Agents 헤더 버튼에 2개 AI 기능을 추가한다:
1. **출고(매출) 분석 - Gemini**: 자연어 질문으로 출고(delivery) 데이터를 Gemini AI가 분석하여 SSE 스트리밍 응답
2. **자연어 SQL (NL2SQL)**: 자연어를 SQL로 변환하여 실행, Fallback: Gemini 실패 시 GPT-4O 자동 전환

biz_platform 프로젝트의 `SalesAnalysisAIController.java`와 `NL2SQLController.java`를 참조하여 동일한 아키텍처로 구축하되, HKGN 프로젝트의 도메인(delivery_header, delivery_detail)에 맞게 적용한다.

---

## 구현 파일 목록

### 신규 파일 (11개)

| # | 파일 | 설명 |
|---|------|------|
| 1 | `backend/src/main/resources/delivery-ai-tables.yml` | 출고 분석 쿼리 템플릿 설정 |
| 2 | `backend/src/main/java/com/biz/management/ai/config/DeliveryAITableConfig.java` | YAML 설정 로더 |
| 3 | `backend/src/main/java/com/biz/management/ai/controller/DeliveryAnalysisAIController.java` | 출고 분석 컨트롤러 |
| 4 | `backend/src/main/java/com/biz/management/ai/controller/NL2SQLController.java` | NL2SQL 컨트롤러 |
| 5 | `frontend/src/types/ai.types.ts` | AI 기능 타입 정의 |
| 6 | `frontend/src/services/aiApi.ts` | AI API 서비스 (SSE 헬퍼 포함) |
| 7 | `frontend/src/hooks/useDeliveryAnalysis.ts` | 출고 분석 상태 관리 훅 |
| 8 | `frontend/src/hooks/useNL2SQL.ts` | NL2SQL 상태 관리 훅 |
| 9 | `frontend/src/pages/ai/DeliveryAnalysisPage.tsx` | 출고 분석 페이지 |
| 10 | `frontend/src/pages/ai/NL2SQLPage.tsx` | NL2SQL 페이지 |

### 수정 파일 (2개)

| # | 파일 | 변경 내용 |
|---|------|----------|
| 11 | `backend/pom.xml` | `google-genai` 의존성 추가 |
| 12 | `frontend/src/App.tsx` | AI Agents 드롭다운 메뉴 + 모달 추가 |

---

## Step 1: Backend 의존성 추가

**파일**: `backend/pom.xml`

```xml
<!-- Gemini AI SDK -->
<dependency>
    <groupId>com.google.genai</groupId>
    <artifactId>google-genai</artifactId>
    <version>1.0.0</version>
</dependency>
```

기존 application.yml에 이미 설정된 값 재활용:
- `app.gemini.api-key` → Gemini API 키
- `app.gemini.model` → gemini-2.5-flash
- `spring.ai.openai.api-key` → OpenAI API 키 (NL2SQL fallback용)
- `spring.ai.openai.chat.model` → gpt-4o

---

## Step 2: delivery-ai-tables.yml 생성

**파일**: `backend/src/main/resources/delivery-ai-tables.yml`

biz_platform의 `sales-ai-tables.yml` 패턴을 따라 delivery_header + delivery_detail 기반 쿼리 템플릿 정의:

- **delivery_by_customer**: 거래처별 출고 요약 (delivery_header JOIN business_partner)
- **delivery_by_site**: 현장별 출고 요약 (delivery_header JOIN sales_order_header → site_nm)
- **delivery_by_material**: 자재별 출고 요약 (delivery_detail 기준)
- **delivery_monthly_trend**: 월별 출고 추이
- **delivery_recent**: 최근 출고 내역 (header + detail JOIN)
- **delivery_by_material_search**: 자재명 검색 (searchable=true)
- **delivery_material_summary_search**: 자재별 출고 요약 검색 (searchable=true)

**delivery_by_site 조인 경로**: `delivery_header.order_no → sales_order_header.order_no → site_nm`

모든 쿼리는 `hkgn.delivery_header`, `hkgn.delivery_detail`, `hkgn.business_partner`, `hkgn.sales_order_header` 테이블 사용. 날짜 필터 컬럼은 `delivery_date`.

---

## Step 3: DeliveryAITableConfig.java 생성

**파일**: `backend/src/main/java/com/biz/management/ai/config/DeliveryAITableConfig.java`

biz_platform의 `SalesAITableConfig.java`와 동일한 구조:
- `@Component`, `@PostConstruct`로 초기화
- `delivery-ai-tables.yml` 로드
- `TableDefinition`, `FieldDefinition` 내부 클래스
- `getEnabledTables()`, `loadConfig()` 메서드

참조 파일: `c:\project\biz-platform\backend\src\main\java\com\tnt\sales\sales\config\SalesAITableConfig.java`

---

## Step 4: DeliveryAnalysisAIController.java 생성

**파일**: `backend/src/main/java/com/biz/management/ai/controller/DeliveryAnalysisAIController.java`

biz_platform의 `SalesAnalysisAIController.java` 패턴을 그대로 따름:

### 엔드포인트:
| Method | Path | Type | 설명 |
|--------|------|------|------|
| GET | `/api/v1/delivery-analysis-ai/analyze/stream` | SSE | 스트리밍 출고 분석 |
| POST | `/api/v1/delivery-analysis-ai/analyze` | JSON | 동기 출고 분석 |
| GET | `/api/v1/delivery-analysis-ai/tables` | JSON | 설정 테이블 목록 |
| POST | `/api/v1/delivery-analysis-ai/reload-config` | JSON | 설정 리로드 |

### 핵심 로직 흐름 (SSE):
1. **질문 파싱** (`parseQuestionWithAI`): Gemini REST API로 질문에서 날짜범위/키워드 추출
   - temperature=0.1, maxOutputTokens=100
   - Fallback: 이번 달 기본 날짜
2. **데이터 조회** (`fetchDeliveryDataFromConfig`): YAML 설정 기반 동적 JdbcTemplate 쿼리
3. **AI 분석** (`analyzeWithGemini`): Gemini SDK로 스트리밍 응답 (generateContentStream)
   - temperature=0.7, maxOutputTokens=4096

### SSE 이벤트:
- `status`: "질문 분석 중...", "데이터 조회 중...", "AI 분석 중..."
- `content`: Gemini 스트리밍 응답 청크
- `done`: "[DONE]"
- `error`: 에러 메시지

### 주요 차이점 (vs biz_platform):
- 프롬프트를 "출고 분석 전문가"로 변경
- delivery_header/detail 테이블 기반 데이터 조회
- assigneeId 대신 customer_cd 필터링 가능
- hkgn 스키마 참조

참조 파일: `c:\project\biz-platform\backend\src\main\java\com\tnt\sales\sales\api\SalesAnalysisAIController.java`

---

## Step 5: NL2SQLController.java 생성

**파일**: `backend/src/main/java/com/biz/management/ai/controller/NL2SQLController.java`

biz_platform의 `NL2SQLController.java` 패턴을 따르되, Fallback을 Gemini → GPT-4O로 변경:

### 엔드포인트:
| Method | Path | Type | 설명 |
|--------|------|------|------|
| GET | `/api/v1/nl2sql/schema` | JSON | DB 스키마 조회 |
| POST | `/api/v1/nl2sql/query` | JSON | NL→SQL 실행 |
| GET | `/api/v1/nl2sql/query/stream` | SSE | 스트리밍 NL→SQL |

### 핵심 로직:
1. **스키마 추출** (`buildSchemaContext`): information_schema에서 테이블/컬럼/FK 정보 수집
2. **SQL 생성**: Gemini 우선 (`convertToSQL`), 실패 시 GPT-4O fallback (`convertToSQLWithOpenAI`)
3. **보안 검증**: SELECT만 허용, 1000행 제한
4. **쿼리 실행**: JdbcTemplate으로 실행, 결과 JSON 반환

### Fallback 구현 (핵심 차이):
```java
// Gemini 실패 시 GPT-4O로 자동 전환
String sql;
try {
    sql = convertToSQL(question, schemaInfo);  // Gemini
} catch (Exception e) {
    log.warn("Gemini failed, falling back to GPT-4O: {}", e.getMessage());
    sql = convertToSQLWithOpenAI(question, schemaInfo);  // GPT-4O fallback
}
```

### GPT-4O 호출 (`convertToSQLWithOpenAI`):
- URL: `https://api.openai.com/v1/chat/completions`
- Header: `Authorization: Bearer {apiKey}`
- Body: `{ model: "gpt-4o", messages: [...], temperature: 0.1, max_tokens: 2048 }`
- API 키: `spring.ai.openai.api-key` 값 사용 (`@Value("${spring.ai.openai.api-key:}")`)

### SQL 정리:
```java
// LLM 응답에서 마크다운 코드블록 제거
sqlText.replaceAll("```sql\\s*", "").replaceAll("```\\s*", "").trim()
```

참조 파일: `c:\project\biz-platform\backend\src\main\java\com\tnt\sales\nl2sql\api\NL2SQLController.java`

---

## Step 6: Frontend 타입 정의

**파일**: `frontend/src/types/ai.types.ts`

```typescript
// 출고 분석 관련
export interface DeliveryAnalysisRequest {
  question: string;
}

// NL2SQL 관련
export interface NL2SQLRequest {
  question: string;
}

export interface NL2SQLResult {
  question: string;
  sql: string;
  results: Record<string, unknown>[];
  rowCount: number;
}
```

---

## Step 7: Frontend API 서비스

**파일**: `frontend/src/services/aiApi.ts`

SSE EventSource 연결 헬퍼와 POST API:

```typescript
// 출고 분석 SSE 스트림
export function streamDeliveryAnalysis(question: string, callbacks: SSECallbacks): EventSource

// NL2SQL POST
export async function executeNL2SQL(question: string): Promise<ApiResponse<NL2SQLResult>>

// NL2SQL SSE 스트림
export function streamNL2SQL(question: string, callbacks: SSECallbacks): EventSource
```

SSECallbacks 인터페이스:
- `onStatus(message: string)`: 상태 업데이트
- `onContent(text: string)`: 콘텐츠 스트리밍 (출고 분석)
- `onSQL(sql: string)`: 생성된 SQL (NL2SQL)
- `onResult(data: string)`: 쿼리 결과 (NL2SQL)
- `onDone()`: 완료
- `onError(message: string)`: 에러

---

## Step 8: Frontend 커스텀 훅

**파일**: `frontend/src/hooks/useDeliveryAnalysis.ts`
- `question`, `analysis` (마크다운), `status`, `isLoading`, `error` 상태 관리
- `analyze(question)` 함수: EventSource로 SSE 연결, 콘텐츠 누적

**파일**: `frontend/src/hooks/useNL2SQL.ts`
- `question`, `sql`, `results`, `status`, `isLoading`, `error` 상태 관리
- `executeQuery(question)` 함수: EventSource로 SSE 연결
- `results`를 테이블로 렌더링할 수 있도록 구조화

---

## Step 9: Frontend 페이지 컴포넌트

### DeliveryAnalysisPage.tsx
- 질문 입력창 + 전송 버튼
- 상태 표시 (분석 중...)
- 마크다운 렌더링 결과 영역 (스트리밍)
- 예시 질문 버튼들: "이번 달 출고 현황", "거래처별 출고 요약", "자재별 출고 분석"

### NL2SQLPage.tsx
- 질문 입력창 + 실행 버튼
- 상태 표시 (스키마 분석 중..., SQL 생성 중..., 쿼리 실행 중...)
- 생성된 SQL 코드 표시 영역
- 결과 테이블 (동적 컬럼)
- 행 수 표시
- 예시 질문 버튼들: "출고 완료된 건 목록", "거래처별 총 출고금액", "이번 달 자재별 출고량"

---

## Step 10: App.tsx 수정

### UI 동작 방식: 드롭다운 → 모달 창
1. "HKGNTech AI Agents" 버튼 클릭 → **드롭다운 메뉴** 표시
2. 메뉴 항목 클릭 → **모달(팝업) 창**이 화면 중앙에 열림
3. 모달 안에서 AI 기능 사용 (현재 화면 유지, 뒤에 반투명 오버레이)
4. 모달 닫기: X 버튼 또는 오버레이 클릭

### 변경 내용:
1. **드롭다운 메뉴 추가**:
   - "HKGNTech AI Agents" 버튼에 `onClick` → `aiMenuOpen` 토글
   - 메뉴 항목: "출고(매출) 분석 - Gemini" (Bot 아이콘), "자연어 SQL (NL2SQL)" (Database 아이콘)
   - 바깥 클릭 시 드롭다운 닫힘

2. **모달 렌더링**:
   - 상태: `aiModalType: 'delivery' | 'nl2sql' | null`
   - 드롭다운 항목 클릭 시 `aiModalType` 설정 → 모달 열림
   - 모달 크기: `width: 90vw, maxWidth: 1200px, height: 80vh`
   - 오버레이: `position: fixed, background: rgba(0,0,0,0.5), zIndex: 1000`
   - 모달 본체: `background: var(--panel-1), borderRadius: 12, overflow: hidden`
   - 모달 헤더: 제목 + X 닫기 버튼
   - 모달 콘텐츠: `aiModalType === 'delivery'` → `<DeliveryAnalysisPage />`, `aiModalType === 'nl2sql'` → `<NL2SQLPage />`

3. **상태 추가**:
   - `aiMenuOpen: boolean` (드롭다운 열림/닫힘)
   - `aiModalType: 'delivery' | 'nl2sql' | null` (모달 타입)

4. **import 추가**: DeliveryAnalysisPage, NL2SQLPage, Bot/Database/X 아이콘

---

## 구현 순서 (의존성 기반)

```
1. pom.xml (의존성)
2. delivery-ai-tables.yml (설정)
3. DeliveryAITableConfig.java (설정 로더)
4. DeliveryAnalysisAIController.java (Feature 1 백엔드)
5. NL2SQLController.java (Feature 2 백엔드)
6. ai.types.ts (프론트 타입)
7. aiApi.ts (API 서비스)
8. useDeliveryAnalysis.ts + useNL2SQL.ts (훅)
9. DeliveryAnalysisPage.tsx + NL2SQLPage.tsx (모달 내부 콘텐츠)
10. App.tsx (드롭다운 + 모달)
```

---

## 사전 작업: GreetingBanner 사용자 이름 동적 표시

현재 `GreetingBanner.tsx`에 `관리자`가 하드코딩되어 있으므로 로그인한 사용자 이름으로 변경한다.

### 수정 파일 3개:

1. **`frontend/src/pages/home/GreetingBanner.tsx`**
   - props로 `userName: string` 받기
   - line 4: `const userName = '관리자'` 제거 → props 사용
   - line 29: 우측 배지도 `userName`으로 변경

2. **`frontend/src/pages/home/HomePage.tsx`**
   - `HomePageProps`에 `userName: string` 추가
   - `<GreetingBanner userName={userName} />` 으로 전달

3. **`frontend/src/App.tsx`**
   - `<HomePage>` 호출 시 `userName={currentUser.name}` 추가 (line 735~739 부근)

---

## 검증 방법

1. **Backend 빌드**: `cd backend && mvn compile` - 컴파일 성공 확인
2. **Feature 1 테스트**:
   - `GET /api/v1/delivery-analysis-ai/tables` → 테이블 목록 반환 확인
   - `GET /api/v1/delivery-analysis-ai/analyze/stream?question=이번 달 출고 현황` → SSE 스트리밍 확인
3. **Feature 2 테스트**:
   - `GET /api/v1/nl2sql/schema` → DB 스키마 반환 확인
   - `POST /api/v1/nl2sql/query` with `{"question": "출고 완료된 건 목록"}` → SQL 생성 + 결과 반환 확인
4. **Frontend**:
   - AI Agents 버튼 클릭 → 드롭다운 메뉴 2개 항목 표시 확인
   - 드롭다운 항목 클릭 → 모달 창 열림 확인 (현재 화면 유지)
   - 모달 안에서 질문 입력 → SSE 스트리밍 동작 확인
   - 모달 X 버튼 / 오버레이 클릭 → 모달 닫힘 확인
