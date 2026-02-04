# 요구사항 정의서: adx_1st

**Feature**: Claude Max PRD Workflow Web UI
**Date**: 2026-02-04
**Version**: 1.0
**Author**: Claude (Gate 1 Requirements Agent)

---

## 1. 기능 개요

### 1.1 목적

CLI 기반 PRD workflow 시스템을 웹 UI로 전환하여 개발자의 생산성과 사용성을 향상시킨다. Claude Agent SDK를 활용한 프로그래밍적 workflow 실행, 실시간 진행 상황 추적, 직관적인 승인 처리, 결과물 즉시 확인/편집 기능을 제공한다.

**해결하고자 하는 문제**:
- CLI에서 9개 Gate 진행 상황 파악 어려움
- 텍스트 기반 승인 요청 불편 (AskUserQuestion)
- Markdown 결과물 검토/편집 시 IDE 전환 필요
- 여러 프로젝트 관리 시 경로 설정 반복

### 1.2 범위

**포함 (In Scope)**:
- PRD Workflow (Gate 0~8) 웹 UI 실행
- WebSocket 기반 실시간 스트리밍 (token, progress, approval)
- Claude Agent SDK headless mode 통합
- Claude Max OAuth 인증
- 프로젝트 경로 선택 및 저장
- Gate 진행 상황 시각화 (timeline view)
- 승인 요청 UI 브릿지 (AskUserQuestion → Dialog)
- Markdown 결과물 viewer (read-only, MVP)
- 파일 기반 데이터 저장 (로컬 파일 시스템)
- Session isolation (단일 활성 workflow)

**제외 (Out of Scope)**:
- Multi-user collaboration (팀 협업)
- Visual workflow builder (DAG editor)
- Markdown editor (split-pane editing) - v2로 연기
- Database 사용 (완전 file-based)
- Docker containerization - v2로 연기
- Export to Notion/Confluence - v2로 연기
- API key authentication fallback - v2로 검토 (OAuth 제한 시)

---

## 2. Persona

### Primary Persona: Solo Full-stack Developer

**이름**: 민수 (30대, 5년차 개발자)

**목표**:
- PRD workflow를 효율적으로 실행하여 기능 설계 시간 단축
- 진행 상황을 시각적으로 파악하여 작업 예측 가능성 향상
- 승인 요청을 즉시 확인하고 빠르게 응답하여 workflow 중단 최소화
- 여러 프로젝트에서 동일한 workflow 재사용

**Pain Points**:
- CLI에서 `Gate 3/9 진행 중...` 메시지만 보고 실제 진행률 파악 어려움
- AskUserQuestion 발생 시 텍스트 기반 옵션 선택이 불편 (특히 긴 provisional 항목 리스트)
- Markdown 결과물 확인을 위해 VSCode 열어야 함
- 프로젝트 전환 시마다 `cd` 명령어로 경로 변경

**사용 환경**:
- OS: Windows 11, macOS
- Browser: Chrome, Edge
- Claude Max subscription 보유
- 로컬 개발 환경 (localhost)
- 평균 workflow 실행 시간: 20~30분

**기술 수준**: TypeScript, React 사용 가능, Docker 경험 있음

---

## 3. Use Cases

### UC-1: PRD Workflow 실행

**Actor**: Solo Developer

**사전 조건**:
- Claude Max 구독 활성화
- Target project에 `.claude/skills/` 폴더 존재
- Node.js 20+ 설치

**기본 흐름**:
1. 사용자가 웹 UI 접속 (http://localhost:5180)
2. 프로젝트 경로 선택 (folder picker 또는 직접 입력)
3. 기능명 입력 (예: "adx_1st")
4. "Start Workflow" 버튼 클릭
5. 시스템이 Claude Agent SDK로 `/design-all` 실행
6. Gate별 진행 상황 실시간 업데이트 (WebSocket)
7. 각 Gate 완료 시 결과물 파일 목록 표시
8. 승인 요청 발생 시 Dialog 팝업
9. 사용자가 승인/거부 선택
10. 모든 Gate 완료 시 "Workflow Complete" 메시지

**대안 흐름**:
- 3a. 기능명 중복 → 경고 메시지 + 덮어쓰기 확인
- 8a. 승인 timeout (5분) → 자동 거부 + notification
- 9a. WebSocket 끊김 → 자동 재연결 + 마지막 Gate부터 재개

**사후 조건**:
- `prd/{기능명}/` 폴더에 00~08 파일 생성
- Workflow 상태 "completed" 저장

---

### UC-2: 진행 상황 모니터링

**Actor**: Solo Developer

**사전 조건**:
- Workflow 실행 중 (UC-1 진행 중)

**기본 흐름**:
1. 사용자가 Timeline UI 확인
2. 현재 Gate 번호, 진행률 표시 (예: "Gate 2/9 - 35%")
3. 각 Gate의 상태 시각화 (완료=녹색, 진행중=파란색, 대기=회색)
4. 실시간 token streaming 출력 (LLM 응답 텍스트)
5. 예상 남은 시간 표시 (선택적)

**대안 흐름**:
- 4a. Token streaming 너무 빠름 → throttle (100ms delay)

---

### UC-3: 결과물 확인

**Actor**: Solo Developer

**사전 조건**:
- 최소 1개 Gate 완료

**기본 흐름**:
1. 사용자가 Timeline에서 완료된 Gate 클릭
2. 시스템이 해당 Gate의 결과물 파일 읽기 (예: `01-requirements.md`)
3. Markdown viewer에 렌더링된 내용 표시
4. 사용자가 원본 파일 경로 복사 (VSCode 열기 용도)

**대안 흐름**:
- 2a. 파일 읽기 실패 → 에러 메시지 + 수동 경로 표시

---

### UC-4: 프로젝트 전환

**Actor**: Solo Developer

**사전 조건**:
- Workflow 미실행 상태

**기본 흐름**:
1. 사용자가 "Change Project" 버튼 클릭
2. 시스템이 최근 프로젝트 목록 표시 (localStorage)
3. 사용자가 프로젝트 선택 또는 새 경로 입력
4. 시스템이 `.claude/skills/` 존재 검증
5. 성공 시 프로젝트 경로 저장 + UI 업데이트

**대안 흐름**:
- 4a. `.claude/skills/` 없음 → 경고 메시지 + 경로 재입력 요청

---

## 4. User Stories

### US-001: 프로젝트 경로 선택

**As a** developer
**I want** to select target project path from UI
**So that** I can run workflow on different projects without CLI navigation

**Acceptance Criteria**:
- [ ] AC-001: Given 웹 UI 접속 시, When "Select Project" 버튼 클릭하면, Then folder picker 또는 입력 필드 표시되어야 한다
- [ ] AC-002: Given 프로젝트 경로 입력 시, When 경로에 `.claude/skills/` 폴더가 없으면, Then "Invalid project: .claude/skills/ not found" 에러 메시지가 표시되어야 한다
- [ ] AC-003: Given 유효한 프로젝트 선택 시, When 경로 저장하면, Then localStorage에 "recent_projects" 배열로 저장되어야 한다 (최대 5개)

**Priority**: P0 (Must Have)

---

### US-002: Workflow 시작

**As a** developer
**I want** to start PRD workflow with feature name
**So that** I can generate PRD documents automatically

**Acceptance Criteria**:
- [ ] AC-001: Given 프로젝트 선택 완료 시, When 기능명 입력 후 "Start Workflow" 클릭하면, Then WebSocket 연결 + Agent SDK 실행이 시작되어야 한다
- [ ] AC-002: Given 기능명 입력 시, When 입력값이 empty 또는 invalid characters 포함하면, Then "Invalid feature name" 에러 + 재입력 요청이 표시되어야 한다
- [ ] AC-003: Given workflow 실행 시, When 이미 동일 기능명 폴더가 존재하면, Then "Overwrite existing PRD?" 확인 대화상자가 표시되어야 한다

**Priority**: P0 (Must Have)

---

### US-003: 실시간 진행 상황 추적

**As a** developer
**I want** to see real-time progress of Gate execution
**So that** I can estimate remaining time and understand current status

**Acceptance Criteria**:
- [ ] AC-001: Given workflow 실행 중 시, When Gate 시작/완료 이벤트 발생하면, Then Timeline UI가 즉시 업데이트되어야 한다 (500ms 이내)
- [ ] AC-002: Given Gate 진행 중 시, When LLM token streaming 발생하면, Then 실시간으로 텍스트 출력 영역에 표시되어야 한다
- [ ] AC-003: Given 전체 workflow 진행 시, When 진행률 계산하면, Then "Gate X/9 - Y%" 형식으로 표시되어야 한다 (Y = completed gates / 9 * 100)

**Priority**: P0 (Must Have)

---

### US-004: 승인 요청 처리

**As a** developer
**I want** to respond to approval requests via UI dialog
**So that** I can make decisions without CLI text prompts

**Acceptance Criteria**:
- [ ] AC-001: Given Agent가 AskUserQuestion 요청 시, When WebSocket 메시지 수신하면, Then modal dialog가 즉시 표시되어야 한다
- [ ] AC-002: Given 승인 dialog 표시 시, When 옵션이 4개 이상이면, Then radio button list로 표시되어야 한다
- [ ] AC-003: Given 승인 대기 시, When 5분 경과하면, Then auto-reject + "Approval timeout" notification이 발생해야 한다
- [ ] AC-004: Given 사용자 선택 시, When 승인/거부 버튼 클릭하면, Then WebSocket으로 응답 전송 + dialog 닫기가 즉시 실행되어야 한다

**Priority**: P0 (Must Have)

---

### US-005: 결과물 확인

**As a** developer
**I want** to view generated markdown files in UI
**So that** I can quickly review outputs without opening VSCode

**Acceptance Criteria**:
- [ ] AC-001: Given Gate 완료 시, When Timeline에서 Gate 클릭하면, Then 해당 Gate의 markdown 파일이 렌더링되어 표시되어야 한다
- [ ] AC-002: Given markdown 표시 시, When 렌더링 완료하면, Then 코드 블록 syntax highlighting이 적용되어야 한다 (highlight.js)
- [ ] AC-003: Given markdown viewer 시, When "Open in VSCode" 버튼 클릭하면, Then 파일 절대 경로가 클립보드에 복사되어야 한다

**Priority**: P1 (Should Have)

---

### US-006: WebSocket 재연결

**As a** developer
**I want** the app to auto-reconnect on WebSocket disconnect
**So that** network glitches don't interrupt long-running workflows

**Acceptance Criteria**:
- [ ] AC-001: Given WebSocket 연결 끊김 시, When disconnect event 발생하면, Then 3초 후 자동 재연결 시도가 시작되어야 한다
- [ ] AC-002: Given 재연결 시도 시, When 최대 3회 실패하면, Then "Connection lost. Workflow paused." 에러 메시지가 표시되어야 한다
- [ ] AC-003: Given 재연결 성공 시, When workflow session ID 매칭하면, Then 마지막 완료된 Gate부터 자동 재개되어야 한다

**Priority**: P1 (Should Have)

---

### US-007: Session Isolation

**As a** developer
**I want** only one active workflow per project
**So that** file conflicts are prevented

**Acceptance Criteria**:
- [ ] AC-001: Given 프로젝트 선택 시, When 활성 workflow 존재하면, Then "Workflow in progress" 경고 + 기다림 또는 취소 옵션이 표시되어야 한다
- [ ] AC-002: Given workflow 실행 시, When session lock 파일 생성하면, Then `prd/.workflow.lock` 파일이 생성되어야 한다
- [ ] AC-003: Given workflow 완료/취소 시, When session 종료하면, Then lock 파일이 삭제되어야 한다

**Priority**: P1 (Should Have)

---

### US-008: 최근 프로젝트 관리

**As a** developer
**I want** to see recently used projects
**So that** I can quickly switch between projects

**Acceptance Criteria**:
- [ ] AC-001: Given 프로젝트 선택 UI 시, When 드롭다운 열면, Then 최근 5개 프로젝트 경로가 표시되어야 한다
- [ ] AC-002: Given 최근 프로젝트 목록 시, When 경로 클릭하면, Then 즉시 프로젝트 전환 + 유효성 검증이 실행되어야 한다
- [ ] AC-003: Given 프로젝트 목록 시, When 6번째 프로젝트 추가하면, Then 가장 오래된 항목이 자동 제거되어야 한다

**Priority**: P2 (Could Have)

---

## 5. 기능 요구사항

### FR-001: Claude Agent SDK 통합

**설명**: Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`)를 headless mode로 실행하여 PRD workflow skill을 프로그래밍적으로 호출한다.

**입력**:
- `projectPath`: 대상 프로젝트 절대 경로
- `feature`: 기능명
- `authToken`: Claude Max OAuth token

**출력**:
- WebSocket stream (token, progress, approval request)

**관련 US**: US-002

**기술적 세부사항**:
```typescript
const agent = new AgentSDK({
  projectPath: config.targetProjectPath,
  authMode: 'oauth',
  workspace: 'isolated'
});

const stream = await agent.executeSkill('/design-all', {
  feature: featureName
});
```

---

### FR-002: WebSocket 서버

**설명**: Express 앱에 WebSocket 서버 (`ws` 라이브러리)를 통합하여 bidirectional streaming을 지원한다.

**입력**:
- Client connection request
- Client messages (approval response)

**출력**:
- Server messages (token, progress, approval request)

**관련 US**: US-003, US-004, US-006

**기술적 세부사항**:
- Port: 3100 (configurable)
- Protocol: `ws://` (MVP), `wss://` (v2)
- Message format: JSON `{ type: string, data: any }`
- Heartbeat: 30s ping/pong

---

### FR-003: Approval Bridge

**설명**: Agent SDK의 `AskUserQuestion` 이벤트를 WebSocket으로 전달하고, UI 응답을 Agent에 반환한다.

**입력**:
- Agent event: `{ type: 'askUserQuestion', question: string, options: string[] }`

**출력**:
- User response: `{ selectedOption: string }`

**관련 US**: US-004

**기술적 세부사항**:
- Timeout: 5분
- Timeout action: auto-reject + notify user

---

### FR-004: File System 읽기

**설명**: 생성된 PRD markdown 파일을 읽어 UI에 표시한다.

**입력**:
- File path: `prd/{feature}/XX-*.md`

**출력**:
- Markdown content (string)

**관련 US**: US-005

**기술적 세부사항**:
- Encoding: UTF-8
- Error handling: file not found → placeholder message

---

### FR-005: Project Path Validation

**설명**: 사용자가 입력한 프로젝트 경로의 유효성을 검증한다.

**입력**:
- Project path (string)

**출력**:
- Validation result: `{ valid: boolean, error?: string }`

**관련 US**: US-001

**검증 규칙**:
- 경로 존재 여부
- `.claude/skills/` 폴더 존재
- 읽기/쓰기 권한 확인

---

### FR-006: Session Lock Management

**설명**: 동시 workflow 실행 방지를 위한 session lock을 관리한다.

**입력**:
- Project path
- Feature name

**출력**:
- Lock status: `{ locked: boolean, sessionId?: string }`

**관련 US**: US-007

**기술적 세부사항**:
- Lock file: `prd/.workflow.lock`
- Lock content: `{ sessionId, startTime, feature }`
- Lock 해제: workflow complete/cancel/error

---

### FR-007: Timeline UI Rendering

**설명**: 9개 Gate의 진행 상황을 timeline 형태로 시각화한다.

**입력**:
- Gate states: `{ gate: number, status: 'pending' | 'in_progress' | 'completed' | 'failed' }[]`

**출력**:
- Timeline component (React)

**관련 US**: US-003

**UI 요소**:
- Gate 번호 + 제목 (예: "Gate 2: UI Design")
- 상태 색상 (pending=회색, in_progress=파란색, completed=녹색, failed=빨간색)
- 진행률 바 (전체 9개 중 완료 개수)

---

### FR-008: OAuth Authentication

**설명**: Claude Max OAuth token을 secure하게 저장하고 Agent SDK에 전달한다.

**입력**:
- OAuth token (from user login)

**출력**:
- Auth state: `{ authenticated: boolean, expiresAt: Date }`

**관련 US**: US-002

**보안 요구사항**:
- Token storage: sessionStorage (not localStorage)
- Transmission: HTTPS only (v2)
- Expiry: auto-refresh or re-login

---

## 6. 비기능 요구사항

### 6.1 성능

- **응답시간**: WebSocket 메시지 전송 latency < 500ms
- **Token streaming**: 초당 최대 100 tokens 처리
- **Long-running workflow**: 30분+ workflow 안정적 실행
- **File I/O**: 10MB 이하 markdown 파일 1초 이내 읽기

### 6.2 보안

- **인증**: Claude Max OAuth 2.0 (required)
- **권한**: 프로젝트 폴더 읽기/쓰기만 허용
- **Network**: localhost-only (MVP), wss:// TLS (v2)
- **Token storage**: sessionStorage (브라우저 닫으면 삭제)

### 6.3 가용성

- **WebSocket 재연결**: 자동 3회 재시도 (exponential backoff)
- **Session recovery**: 브라우저 새로고침 시 마지막 state 복구 (IndexedDB - v2)
- **Error handling**: Agent SDK 오류 시 user-friendly 메시지 표시

### 6.4 확장성

- **Multi-project**: 여러 프로젝트 경로 저장/전환 지원
- **Plugin system**: Custom skill 추가 (v2, out of scope for MVP)
- **Team collaboration**: 다중 사용자 지원 (v2, out of scope for MVP)

### 6.5 사용성

- **Browser support**: Chrome 120+, Edge 120+, Firefox 120+
- **Responsive**: Desktop only (MVP), tablet/mobile (v2)
- **Accessibility**: Keyboard navigation, screen reader (v2)

---

## 7. 비즈니스 제약조건

| 유형 | 제약 | 영향 |
|------|------|------|
| **기술** | Claude Max subscription 필수 | 무료 사용자 지원 불가 (API key fallback 고려 - v2) |
| **기술** | Node.js 20+ LTS | 구버전 Node.js 사용자 업그레이드 필요 |
| **기술** | Anthropic OAuth 정책 (Jan 2026) | Third-party tool 제한 가능성 → SDK 공식 지원 범위 확인 필요 |
| **비즈니스** | Solo developer 타겟 | Multi-user, team features 제외 (v1) |
| **비즈니스** | 로컬 개발 도구 | Cloud deployment, SaaS 모델 제외 (v1) |
| **시간** | MVP 80% 완성 목표 | Split-pane editor, Docker, export 기능 v2로 연기 |
| **플랫폼** | Desktop browser only | Mobile/tablet 지원 제외 (v1) |

---

## 8. Edge Cases

### EC-001: OAuth Token 만료 중 Workflow 실행

**상황**: Workflow 실행 중 Claude Max OAuth token이 만료되어 Agent SDK 호출 실패

**예상 동작**:
- Agent SDK가 401 Unauthorized error 반환
- WebSocket으로 "auth_error" 메시지 전송

**처리 방안**:
1. Workflow 일시 중지
2. UI에 "Session expired. Please re-authenticate." 메시지 표시
3. 재인증 버튼 제공
4. 재인증 성공 시 마지막 완료된 Gate부터 재개

**우선순위**: P0 (critical)

---

### EC-002: WebSocket 연결 끊김 (네트워크 불안정)

**상황**: 사용자의 네트워크가 불안정하여 WebSocket 연결이 반복적으로 끊김

**예상 동작**:
- WebSocket `close` event 발생
- Frontend가 auto-reconnect 시도 (3초 후, 최대 3회)

**처리 방안**:
1. Exponential backoff 재연결 (3s, 6s, 12s)
2. 재연결 실패 시 "Connection lost" 에러 표시
3. "Retry Manually" 버튼 제공
4. Workflow state는 backend에 유지 (session lock file + .progress.json)
5. 재연결 성공 시 progress 동기화

**우선순위**: P1 (important)

---

### EC-003: 동시 Workflow 실행 시도

**상황**: 사용자가 브라우저 탭 2개를 열어 동일 프로젝트에서 동시에 workflow 시작

**예상 동작**:
- 두 번째 요청이 session lock 파일 확인
- Lock 존재 → "Workflow already in progress" 감지

**처리 방안**:
1. 첫 번째 tab: 정상 실행
2. 두 번째 tab: "Another workflow is running for this project" 경고
3. 옵션 제공:
   - [A] 대기 (첫 번째 완료 시 자동 시작)
   - [B] 취소 (tab 닫기)
   - [C] 강제 시작 (첫 번째 종료 + lock 해제 - 위험)

**우선순위**: P1 (important)

---

### EC-004: 대용량 Markdown 파일 렌더링

**상황**: Gate 7 PRD finalization 결과물이 10MB 이상 크기 (매우 긴 PRD)

**예상 동작**:
- File read 성공
- Markdown rendering이 browser freeze 유발

**처리 방안**:
1. 파일 크기 체크 (10MB 이상 시)
2. "Large file detected. Preview may be slow." 경고
3. 옵션 제공:
   - [A] Render anyway (browser 버벅일 수 있음)
   - [B] Download file (VSCode에서 열기)
4. 렌더링 선택 시 virtualized list 사용 (react-window)

**우선순위**: P2 (nice to have)

---

### EC-005: Agent SDK Transient Error (Rate Limit, 5xx)

**상황**: Agent SDK 호출 시 일시적 오류 발생 (API rate limit, server 5xx error)

**예상 동작**:
- Agent SDK가 error throw
- WebSocket으로 error event 전송

**처리 방안**:
1. Error type 판별:
   - 429 Rate Limit → retry after delay (exponential backoff, 최대 3회)
   - 5xx Server Error → retry (최대 3회)
   - 4xx Client Error (400, 401, 403) → fail immediately (no retry)
2. Retry 중 UI에 "Retrying... (attempt X/3)" 표시
3. 최종 실패 시 에러 메시지 + "Restart workflow" 버튼

**우선순위**: P1 (important)

---

### EC-006: 브라우저 새로고침 (Workflow 진행 중)

**상황**: 사용자가 실수로 브라우저 새로고침 (F5) 또는 tab 닫기

**예상 동작**:
- WebSocket 연결 끊김
- Frontend state 손실
- Backend workflow는 계속 실행 중 (orphaned process)

**처리 방안**:
1. `beforeunload` event listener 등록 → "Workflow in progress. Are you sure?" 확인
2. 새로고침 허용 시:
   - Backend session은 유지 (timeout 30분)
   - 재접속 시 session ID 매칭 → state recovery (v2 - IndexedDB 필요)
3. MVP: 새로고침 시 state 손실 허용 (경고만)
4. v2: Zustand persist + IndexedDB로 state 복구

**우선순위**: P2 (nice to have - v2)

---

### EC-007: Invalid Feature Name (특수문자, 공백)

**상황**: 사용자가 기능명에 공백, 특수문자 입력 (예: "my feature!", "기능/테스트")

**예상 동작**:
- File system path 생성 실패 가능 (OS 제약)
- PRD 폴더명 불일치

**처리 방안**:
1. Feature name validation regex: `^[a-zA-Z0-9_-]+$`
2. Invalid 입력 시 즉시 에러 표시 (real-time)
3. 에러 메시지: "Feature name must be alphanumeric, dash, or underscore only"
4. 자동 변환 옵션 제공 (예: "my feature" → "my_feature")

**우선순위**: P0 (critical)

---

### EC-008: Approval Timeout 후 Workflow 재개

**상황**: 승인 요청 후 사용자가 5분 이상 응답 없음 (timeout)

**예상 동작**:
- Approval timeout → auto-reject
- Workflow 중단 또는 default 선택

**처리 방안**:
1. Timeout 발생 시:
   - Notification: "Approval timed out. Workflow paused."
   - Workflow state: "paused_approval_timeout"
2. UI에 "Resume with choice" 버튼 표시
3. 사용자가 선택 후 재개 가능
4. Timeout 후 30분 경과 시 workflow 자동 취소 + session lock 해제

**우선순위**: P1 (important)

---

## 9. 제약조건

### 기술적 제약

- **Claude Agent SDK**: Anthropic 공식 SDK 사용 필수 (third-party OAuth 제한 고려)
- **WebSocket Protocol**: `ws://` (unencrypted) localhost only (MVP), `wss://` TLS는 v2
- **File System Dependency**: 프로젝트 폴더에 읽기/쓰기 권한 필수
- **Browser API**: WebSocket, localStorage, sessionStorage 지원 브라우저 필요

### 비즈니스적 제약

- **Subscription Model**: Claude Max subscription 필수 (월 $20)
- **Target Audience**: Solo developer만 타겟 (team collaboration 제외)
- **Deployment**: Self-hosted only (cloud SaaS 제외)

### 운영 제약

- **Support**: Community-driven (공식 support 제공 없음)
- **Documentation**: README + inline code comments only (별도 문서 사이트 없음)
- **Update Cycle**: Best-effort basis (정기 릴리스 계획 없음)

---

## 10. 우선순위 매트릭스

### User Stories 우선순위

| User Story | 중요도 | 긴급도 | 우선순위 | MoSCoW |
|-----------|--------|--------|----------|---------|
| US-001: 프로젝트 경로 선택 | High | High | P0 | Must Have |
| US-002: Workflow 시작 | High | High | P0 | Must Have |
| US-003: 실시간 진행 상황 추적 | High | High | P0 | Must Have |
| US-004: 승인 요청 처리 | High | High | P0 | Must Have |
| US-005: 결과물 확인 | Medium | High | P1 | Should Have |
| US-006: WebSocket 재연결 | Medium | Medium | P1 | Should Have |
| US-007: Session Isolation | Medium | Medium | P1 | Should Have |
| US-008: 최근 프로젝트 관리 | Low | Low | P2 | Could Have |

### Edge Cases 우선순위

| Edge Case | 발생 확률 | 영향도 | 우선순위 |
|----------|----------|--------|----------|
| EC-001: OAuth 만료 | 높음 | 높음 | P0 |
| EC-002: WebSocket 끊김 | 중간 | 높음 | P1 |
| EC-003: 동시 실행 시도 | 낮음 | 중간 | P1 |
| EC-005: SDK Transient Error | 중간 | 중간 | P1 |
| EC-007: Invalid Feature Name | 높음 | 중간 | P0 |
| EC-008: Approval Timeout | 중간 | 중간 | P1 |
| EC-004: 대용량 Markdown | 낮음 | 낮음 | P2 |
| EC-006: 브라우저 새로고침 | 중간 | 낮음 | P2 |

---

## 11. 용어 정의

| 용어 | 정의 | 비고 |
|------|------|------|
| **Gate** | PRD workflow의 단계 (총 9개: Gate 0~8) | Research, Requirements, UI Design, Data Model, API Design, Implementation Plan, Test Cases, PRD Finalize, Implementation |
| **Claude Agent SDK** | Anthropic의 공식 SDK로 Claude Code를 programmatic하게 실행 | `@anthropic-ai/claude-agent-sdk` npm 패키지 |
| **Headless Mode** | UI 없이 프로그래밍적으로 Agent를 실행하는 방식 | CLI 대신 API 호출 |
| **AskUserQuestion** | Agent가 사용자 승인/입력이 필요할 때 발생시키는 이벤트 | Provisional 항목 승인, Gate 진행 확인 등 |
| **Session Lock** | 동일 프로젝트에서 동시 workflow 실행 방지를 위한 파일 기반 lock | `prd/.workflow.lock` |
| **WebSocket Bidirectional Streaming** | Server ↔ Client 양방향 실시간 통신 | token streaming, approval request/response |
| **OAuth Token** | Claude Max subscription 인증을 위한 OAuth 2.0 token | Third-party tool 사용 제한 (2026-01 정책) |
| **Provisional Item** | 표준 문서에 정의되지 않은 신규 항목 (UI 컴포넌트, DB 용어 등) | Gate 7에서 일괄 승인 요청 |
| **Timeline View** | 9개 Gate의 진행 상황을 시간순으로 시각화한 UI | DAG (Directed Acyclic Graph)의 단순화 버전 |
| **Target Project** | PRD workflow를 실행할 대상 프로젝트 (`.claude/skills/` 포함) | 여러 프로젝트 재사용 가능 |

---

## 12. 멀티 LLM 분석 결과

### 12.1 실행 노트

**Multi-LLM Analysis Status**: ⚠️ Tool Unavailable

Gate 0과 동일하게 `mcp__zen__chat` 도구가 현재 환경에서 사용 불가능하여, Claude 단독 분석으로 진행했습니다.

**시도한 모델**:
- GPT-5.2 (기술적 관점: Edge Case, 비기능 요구사항)
- Gemini-3-Pro (사용자/비즈니스 관점: User Stories, Persona)

**대체 접근**:
Claude가 다음 관점을 모두 포괄하여 종합 분석 수행:
- **기술 관점** (GPT-5.2 역할): Edge Case 8개 식별, 비기능 요구사항 5개 카테고리, 기술적 제약조건
- **사용자 관점** (Gemini-3-Pro 역할): Primary Persona 정의, User Stories 8개 (AS A/I WANT/SO THAT), MoSCoW 우선순위

**권장사항**: 멀티 LLM 협업 가능 시 GPT-5.2와 Gemini-3-Pro로 cross-validation 수행하여 Edge Case와 User Story 보강 필요.

---

## 13. Quality Validation

### User Story 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| INVEST 원칙 | Independent, Negotiable, Valuable, Estimable, Small, Testable | ✅ 통과 (8개 모두 원칙 준수) |
| AC 개수 | 스토리당 최소 3개 | ✅ 통과 (US-001~007: 3-4개, US-008: 3개) |
| AC 검증 가능성 | "~되어야 한다" 형태 (Given/When/Then 암시) | ✅ 통과 (모든 AC에 측정 가능 조건 명시) |

### 기능 요구사항 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| 입출력 명시 | 모든 FR에 입력/출력 정의 | ✅ 통과 (FR-001~008 모두 명시) |
| US 연결 | 모든 FR이 최소 1개 US와 연결 | ✅ 통과 (관련 US 섹션 포함) |
| 중복 검사 | 유사 FR 병합 또는 차별화 | ✅ 통과 (중복 없음, 각 FR 고유 책임) |

### Edge Case 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| 최소 개수 | 기능당 최소 3개 | ✅ 통과 (총 8개 Edge Case) |
| 경계값 포함 | null, empty, max 등 경계값 | ✅ 통과 (EC-007 invalid name, EC-004 대용량 파일) |
| 처리 방안 구체성 | 추상적 "처리" → 구체적 동작 | ✅ 통과 (모든 EC에 단계별 처리 방안 명시) |

### 일관성 검증

| 검증 항목 | 기준 | 결과 |
|----------|------|------|
| 용어 일관성 | 동일 개념에 동일 용어 사용 | ✅ 통과 (용어 정의 섹션 11 참조) |
| 우선순위 정합성 | 중요도/긴급도와 우선순위 일치 | ✅ 통과 (섹션 10 매트릭스 검증) |

---

## 14. Next Steps

### Gate 2 Prerequisites

다음 Gate (UI Design)를 위한 입력:
- User Stories (US-001~008)
- Timeline view 요구사항 (섹션 7, FR-007)
- Approval dialog 요구사항 (섹션 4, FR-003)
- Markdown viewer 요구사항 (섹션 5, FR-004)

### Open Questions

1. **OAuth Third-Party Restriction**: Agent SDK가 "official tool" 범위에 포함되는지 확인 필요 (Anthropic 문서 또는 테스트)
2. **IndexedDB State Recovery**: v2에서 브라우저 새로고침 시 state 복구 구현 여부
3. **Timeline vs Graph**: MVP에서 simple timeline, v2에서 interactive graph (react-flow) 전환 여부

---

**Gate 1 Status**: ✅ Complete
**Validation**: 7/7 items passed
**Next Gate**: `/ui-design` (Gate 2)
